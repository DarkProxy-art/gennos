#!/usr/bin/env python3
"""
NeoProxy Data Validator Daemon
Inspired by Rucio integrity checking system

This daemon validates file integrity by checking checksums
and detects corruption or tampering.
"""

import json
import hashlib
import time
import logging
from pathlib import Path
from typing import Dict, List, Optional, Tuple
import argparse

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('NeoProxy-Validator')

class NeoProxyValidator:
    """NeoProxy Data Integrity Validator Daemon"""

    def __init__(self, catalog_path: str = "./kernel/catalog.json",
                 endpoints_config: str = "./kernel/endpoints.json",
                 quarantine_path: str = "./kernel/quarantine"):
        self.catalog_path = Path(catalog_path)
        self.endpoints_config = Path(endpoints_config)
        self.quarantine_path = Path(quarantine_path)

        # Default endpoints
        self.endpoints = {
            "local_storage": {
                "path": "./watch",
                "type": "local"
            },
            "nas_storage": {
                "path": "./storage/nas",
                "type": "network"
            },
            "cloud_archive": {
                "path": "./storage/cloud",
                "type": "cloud"
            }
        }

        # Load endpoints config
        self.load_endpoints_config()

        # Create quarantine directory
        self.quarantine_path.mkdir(parents=True, exist_ok=True)

        logger.info("NeoProxy Validator initialized")

    def load_endpoints_config(self):
        """Load endpoints configuration"""
        if self.endpoints_config.exists():
            try:
                with open(self.endpoints_config, 'r') as f:
                    loaded_endpoints = json.load(f)
                    self.endpoints.update(loaded_endpoints)
                logger.info("Endpoints configuration loaded")
            except Exception as e:
                logger.error(f"Error loading endpoints config: {e}")

    def load_catalog(self) -> List[Dict]:
        """Load data catalog"""
        if self.catalog_path.exists():
            try:
                with open(self.catalog_path, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading catalog: {e}")
                return []
        return []

    def save_catalog(self, catalog: List[Dict]):
        """Save updated catalog"""
        try:
            with open(self.catalog_path, 'w') as f:
                json.dump(catalog, f, indent=2, default=str)
            logger.info("Catalog updated")
        except Exception as e:
            logger.error(f"Error saving catalog: {e}")

    def calculate_checksum(self, file_path: Path, algorithm: str = "sha256") -> Optional[str]:
        """Calculate file checksum"""
        if not file_path.exists():
            return None

        hash_func = getattr(hashlib, algorithm)()

        try:
            with open(file_path, 'rb') as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_func.update(chunk)
            return hash_func.hexdigest()
        except Exception as e:
            logger.error(f"Error calculating checksum for {file_path}: {e}")
            return None

    def validate_file_integrity(self, file_path: Path, expected_checksum: str,
                              algorithm: str = "sha256") -> Tuple[bool, Optional[str]]:
        """Validate a single file's integrity"""
        calculated_checksum = self.calculate_checksum(file_path, algorithm)

        if calculated_checksum is None:
            return False, None

        is_valid = calculated_checksum == expected_checksum
        return is_valid, calculated_checksum

    def quarantine_corrupted_file(self, file_path: Path, entry: Dict, location: Dict) -> bool:
        """Move corrupted file to quarantine"""
        try:
            # Create quarantine subdirectory with timestamp
            timestamp = int(time.time())
            quarantine_dir = self.quarantine_path / f"corrupted_{timestamp}"
            quarantine_dir.mkdir(exist_ok=True)

            # Move file to quarantine
            quarantine_file = quarantine_dir / file_path.name
            file_path.rename(quarantine_file)

            # Create metadata file
            metadata = {
                "original_path": str(file_path),
                "quarantine_path": str(quarantine_file),
                "entry_did": entry["did"],
                "endpoint": location["endpoint"],
                "quarantine_time": timestamp,
                "reason": "checksum_mismatch"
            }

            metadata_file = quarantine_dir / f"{file_path.stem}_metadata.json"
            with open(metadata_file, 'w') as f:
                json.dump(metadata, f, indent=2)

            logger.warning(f"File quarantined: {file_path} -> {quarantine_file}")
            return True

        except Exception as e:
            logger.error(f"Failed to quarantine {file_path}: {e}")
            return False

    def validate_replica(self, entry: Dict, location: Dict) -> Dict:
        """Validate a single replica"""
        result = {
            "did": entry["did"],
            "endpoint": location["endpoint"],
            "file_path": location["path"],
            "status": "unknown",
            "details": {}
        }

        file_path = Path(location["path"])
        expected_checksum = entry.get("checksum")

        if not expected_checksum:
            result["status"] = "no_checksum"
            result["details"]["error"] = "No checksum available in catalog"
            return result

        if not file_path.exists():
            result["status"] = "missing"
            result["details"]["error"] = "File not found"
            return result

        # Validate integrity
        is_valid, calculated_checksum = self.validate_file_integrity(
            file_path, expected_checksum
        )

        if is_valid:
            result["status"] = "valid"
            result["details"]["checksum"] = calculated_checksum
        else:
            result["status"] = "corrupted"
            result["details"]["expected_checksum"] = expected_checksum
            result["details"]["calculated_checksum"] = calculated_checksum

            # Quarantine corrupted file
            if self.quarantine_corrupted_file(file_path, entry, location):
                result["details"]["quarantined"] = True
            else:
                result["details"]["quarantine_failed"] = True

        # Update location status
        location["status"] = result["status"]
        location["last_validation"] = time.time()
        location["checksum_validated"] = calculated_checksum

        return result

    def validate_catalog_entry(self, entry: Dict) -> List[Dict]:
        """Validate all replicas of a catalog entry"""
        results = []

        for location in entry.get("locations", []):
            result = self.validate_replica(entry, location)
            results.append(result)

        return results

    def generate_validation_report(self, all_results: List[Dict]) -> Dict:
        """Generate a summary report of validation results"""
        report = {
            "timestamp": time.time(),
            "total_files": len(all_results),
            "valid_files": 0,
            "corrupted_files": 0,
            "missing_files": 0,
            "no_checksum_files": 0,
            "quarantined_files": 0,
            "endpoint_summary": {},
            "corrupted_details": []
        }

        for result in all_results:
            status = result["status"]
            endpoint = result["endpoint"]

            if status == "valid":
                report["valid_files"] += 1
            elif status == "corrupted":
                report["corrupted_files"] += 1
                report["corrupted_details"].append({
                    "did": result["did"],
                    "endpoint": endpoint,
                    "file_path": result["file_path"]
                })
                if result["details"].get("quarantined"):
                    report["quarantined_files"] += 1
            elif status == "missing":
                report["missing_files"] += 1
            elif status == "no_checksum":
                report["no_checksum_files"] += 1

            # Endpoint summary
            if endpoint not in report["endpoint_summary"]:
                report["endpoint_summary"][endpoint] = {
                    "total": 0, "valid": 0, "corrupted": 0, "missing": 0
                }

            report["endpoint_summary"][endpoint]["total"] += 1
            report["endpoint_summary"][endpoint][status] += 1

        return report

    def save_validation_report(self, report: Dict, report_path: Optional[str] = None):
        """Save validation report to file"""
        if not report_path:
            timestamp = int(report["timestamp"])
            report_path = f"./kernel/validation_report_{timestamp}.json"

        try:
            with open(report_path, 'w') as f:
                json.dump(report, f, indent=2, default=str)
            logger.info(f"Validation report saved: {report_path}")
        except Exception as e:
            logger.error(f"Failed to save validation report: {e}")

    def run_validation_cycle(self, save_report: bool = True) -> Dict:
        """Run one complete validation cycle"""
        logger.info("Starting validation cycle")

        catalog = self.load_catalog()
        all_results = []

        for entry in catalog:
            results = self.validate_catalog_entry(entry)
            all_results.extend(results)

        # Save updated catalog with validation results
        self.save_catalog(catalog)

        # Generate and save report
        report = self.generate_validation_report(all_results)

        if save_report:
            self.save_validation_report(report)

        # Log summary
        logger.info(f"Validation complete: {report['valid_files']} valid, "
                   f"{report['corrupted_files']} corrupted, "
                   f"{report['missing_files']} missing")

        if report['corrupted_files'] > 0:
            logger.warning(f"Corrupted files quarantined: {report['quarantined_files']}")

        return report

    def watch_mode(self, interval: int = 86400):
        """Run in watch mode, validating periodically"""
        logger.info(f"Starting validation daemon with {interval}s interval")

        try:
            while True:
                self.run_validation_cycle()
                time.sleep(interval)
        except KeyboardInterrupt:
            logger.info("Validation daemon stopped by user")
        except Exception as e:
            logger.error(f"Error in validation daemon: {e}")

def main():
    parser = argparse.ArgumentParser(description='NeoProxy Data Validator Daemon')
    parser.add_argument('--catalog', default='./kernel/catalog.json',
                       help='Path to catalog file')
    parser.add_argument('--endpoints', default='./kernel/endpoints.json',
                       help='Path to endpoints configuration')
    parser.add_argument('--quarantine', default='./kernel/quarantine',
                       help='Path to quarantine directory')
    parser.add_argument('--once', action='store_true',
                       help='Run one validation cycle and exit (default: daemon mode)')
    parser.add_argument('--interval', type=int, default=86400,
                       help='Validation interval in seconds (default: 24 hours)')
    parser.add_argument('--report-path', help='Path to save validation report')

    args = parser.parse_args()

    # Create validator
    validator = NeoProxyValidator(args.catalog, args.endpoints, args.quarantine)

    if args.once:
        # Run one cycle
        report = validator.run_validation_cycle(save_report=bool(args.report_path))
        if args.report_path:
            validator.save_validation_report(report, args.report_path)
        print(f"Validation results: {report['valid_files']} valid, "
              f"{report['corrupted_files']} corrupted, "
              f"{report['missing_files']} missing")
    else:
        # Daemon mode
        validator.watch_mode(args.interval)

if __name__ == "__main__":
    main()