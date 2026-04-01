#!/usr/bin/env python3
"""
NeoProxy Data Cleaner Daemon
Inspired by Rucio space management system

This daemon manages storage space by enforcing replica policies
and cleaning up unnecessary replicas based on access patterns.
"""

import json
import time
import logging
from pathlib import Path
from typing import Dict, List, Optional
import argparse
import shutil
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kernel.memory import memory_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('NeoProxy-Cleaner')

class NeoProxyCleaner:
    """NeoProxy Data Space Management Daemon"""

    def __init__(self, catalog_path: str = "./kernel/catalog.json",
                 endpoints_config: str = "./kernel/endpoints.json",
                 policies_config: str = "./kernel/policies.json"):
        self.catalog_path = Path(catalog_path)
        self.endpoints_config = Path(endpoints_config)
        self.policies_config = Path(policies_config)

        # Default endpoints
        self.endpoints = {
            "local_storage": {
                "path": "./watch",
                "type": "local",
                "capacity_gb": 50,
                "priority": 1
            },
            "nas_storage": {
                "path": "./storage/nas",
                "type": "network",
                "capacity_gb": 500,
                "priority": 2
            },
            "cloud_archive": {
                "path": "./storage/cloud",
                "type": "cloud",
                "capacity_gb": 1000,
                "priority": 3
            }
        }

        # Default policies
        self.policies = {
            "retention_days": {
                "temporary": 7,
                "agent": 365,
                "fabrication": 730,
                "configuration": 365
            },
            "min_replicas": {
                "critical": 3,
                "important": 2,
                "standard": 1
            },
            "space_threshold": 0.85,  # 85% usage triggers cleanup
            "access_grace_period": 30  # days without access before considering deletion
        }

        # Load configurations
        self.load_endpoints_config()
        self.load_policies_config()

        logger.info("NeoProxy Cleaner initialized")

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

    def load_policies_config(self):
        """Load policies configuration"""
        if self.policies_config.exists():
            try:
                with open(self.policies_config, 'r') as f:
                    loaded_policies = json.load(f)
                    self.policies.update(loaded_policies)
                logger.info("Policies configuration loaded")
            except Exception as e:
                logger.error(f"Error loading policies config: {e}")

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

    def get_endpoint_usage(self, endpoint_name: str) -> Dict:
        """Get storage usage for an endpoint"""
        endpoint = self.endpoints.get(endpoint_name)
        if not endpoint or endpoint["type"] == "cloud":
            return {"used_gb": 0, "free_gb": endpoint.get("capacity_gb", 0), "usage_percent": 0}

        path = Path(endpoint["path"])
        if not path.exists():
            return {"used_gb": 0, "free_gb": endpoint.get("capacity_gb", 0), "usage_percent": 0}

        # Calculate used space (simplified - in real implementation use shutil.disk_usage)
        total_size = 0
        for file_path in path.rglob('*'):
            if file_path.is_file():
                total_size += file_path.stat().st_size

        used_gb = total_size / (1024**3)
        capacity_gb = endpoint.get("capacity_gb", 0)
        free_gb = max(0, capacity_gb - used_gb)
        usage_percent = (used_gb / capacity_gb) if capacity_gb > 0 else 0

        return {
            "used_gb": round(used_gb, 2),
            "free_gb": round(free_gb, 2),
            "usage_percent": round(usage_percent, 3)
        }

    def should_retain_replica(self, entry: Dict, location: Dict, current_time: float) -> bool:
        """Determine if a replica should be retained"""
        # Always keep at least one replica
        if entry.get("replicas", 0) <= 1:
            return True

        # Check retention policy
        category = entry.get("category", "standard")
        retention_days = self.policies["retention_days"].get(category, 365)
        retention_seconds = retention_days * 24 * 3600

        if current_time - entry.get("created", 0) > retention_seconds:
            # File is old, check access patterns
            last_access = location.get("last_access", location.get("last_check", 0))
            grace_period = self.policies["access_grace_period"] * 24 * 3600

            if current_time - last_access > grace_period:
                return False

        # Check endpoint priority - prefer keeping on higher priority endpoints
        endpoint_priority = self.endpoints.get(location["endpoint"], {}).get("priority", 999)

        # Keep replicas on high-priority endpoints
        if endpoint_priority <= 2:
            return True

        return False

    def cleanup_excess_replicas(self, catalog: List[Dict]) -> int:
        """Remove excess replicas based on policies"""
        current_time = time.time()
        cleaned_count = 0

        for entry in catalog:
            locations = entry.get("locations", [])
            required_replicas = self.get_min_replicas(entry)

            if len(locations) <= required_replicas:
                continue

            # Sort locations by priority (keep lowest priority numbers)
            locations.sort(key=lambda l: self.endpoints.get(l["endpoint"], {}).get("priority", 999))

            # Remove excess replicas starting from lowest priority
            excess_locations = locations[required_replicas:]

            for location in excess_locations:
                if not self.should_retain_replica(entry, location, current_time):
                    if self.remove_replica(entry, location):
                        cleaned_count += 1
                        entry["locations"].remove(location)
                        entry["replicas"] = len(entry["locations"])

        return cleaned_count

    def remove_replica(self, entry: Dict, location: Dict) -> bool:
        """Remove a replica from storage"""
        endpoint = self.endpoints.get(location["endpoint"])
        if not endpoint or endpoint["type"] == "cloud":
            # Simulate cloud deletion
            logger.info(f"Simulating cloud deletion of {entry['file_name']} from {location['endpoint']}")
            return True

        file_path = Path(location["path"])
        if file_path.exists():
            try:
                file_path.unlink()
                logger.info(f"Removed replica: {file_path}")
                memory_db.log("cleaner", "remove_replica", {"file_path": str(file_path)})
                return True
            except Exception as e:
                logger.error(f"Failed to remove replica {file_path}: {e}")
                return False
        else:
            logger.warning(f"Replica file not found: {file_path}")
            return True  # File already gone, consider it cleaned

    def get_min_replicas(self, entry: Dict) -> int:
        """Get minimum required replicas for an entry"""
        # Determine importance level
        if entry.get("category") == "fabrication" and entry.get("type") == "3d_model":
            importance = "critical"
        elif entry.get("category") == "agent":
            importance = "important"
        elif entry.get("type") == "configuration":
            importance = "important"
        else:
            importance = "standard"

        return self.policies["min_replicas"].get(importance, 1)

    def cleanup_by_space_threshold(self, catalog: List[Dict]) -> int:
        """Clean up files when storage space is low"""
        cleaned_count = 0

        for endpoint_name, endpoint in self.endpoints.items():
            if endpoint["type"] == "cloud":
                continue

            usage = self.get_endpoint_usage(endpoint_name)
            if usage["usage_percent"] < self.policies["space_threshold"]:
                continue

            logger.warning(f"Storage {endpoint_name} at {usage['usage_percent']*100:.1f}% capacity")

            # Find candidates for deletion (old, rarely accessed files)
            candidates = []
            current_time = time.time()

            for entry in catalog:
                for location in entry.get("locations", []):
                    if location["endpoint"] != endpoint_name:
                        continue

                    # Calculate "deletion score" based on age and access
                    age_days = (current_time - entry.get("created", 0)) / (24 * 3600)
                    last_access = location.get("last_access", location.get("last_check", 0))
                    access_days = (current_time - last_access) / (24 * 3600)

                    # Higher score = more likely to delete
                    score = age_days * 0.3 + access_days * 0.7

                    # Don't delete if it's the only replica
                    if entry.get("replicas", 0) > 1:
                        candidates.append((score, entry, location))

            # Sort by score (highest first) and delete until space is freed
            candidates.sort(key=lambda x: x[0], reverse=True)

            target_free_gb = endpoint["capacity_gb"] * (1 - self.policies["space_threshold"] + 0.05)  # Target 5% below threshold

            for score, entry, location in candidates:
                if usage["free_gb"] >= target_free_gb:
                    break

                if self.remove_replica(entry, location):
                    cleaned_count += 1
                    entry["locations"].remove(location)
                    entry["replicas"] = len(entry["locations"])

                    # Update usage estimate
                    file_size_gb = entry.get("size_bytes", 0) / (1024**3)
                    usage["used_gb"] -= file_size_gb
                    usage["free_gb"] += file_size_gb

        return cleaned_count

    def update_access_times(self, catalog: List[Dict]):
        """Update last access times for recently accessed files"""
        # In a real implementation, this would monitor actual file access
        # For now, we'll simulate by updating timestamps periodically
        current_time = time.time()

        for entry in catalog:
            # Simulate occasional access
            if current_time % 86400 < 3600:  # Random access simulation
                for location in entry.get("locations", []):
                    location["last_access"] = current_time

    def run_cleanup_cycle(self) -> Dict[str, int]:
        """Run one complete cleanup cycle"""
        logger.info("Starting cleanup cycle")

        catalog = self.load_catalog()

        # Update access times
        self.update_access_times(catalog)

        # Clean up excess replicas
        excess_cleaned = self.cleanup_excess_replicas(catalog)

        # Clean up for space management
        space_cleaned = self.cleanup_by_space_threshold(catalog)

        # Save updated catalog
        self.save_catalog(catalog)

        results = {
            "excess_replicas_removed": excess_cleaned,
            "space_management_cleaned": space_cleaned,
            "total_cleaned": excess_cleaned + space_cleaned
        }

        logger.info(f"Cleanup cycle complete: {results}")
        return results

    def watch_mode(self, interval: int = 3600):
        """Run in watch mode, cleaning periodically"""
        logger.info(f"Starting cleanup daemon with {interval}s interval")

        try:
            while True:
                self.run_cleanup_cycle()
                time.sleep(interval)
        except KeyboardInterrupt:
            logger.info("Cleanup daemon stopped by user")
        except Exception as e:
            logger.error(f"Error in cleanup daemon: {e}")

def main():
    parser = argparse.ArgumentParser(description='NeoProxy Data Cleaner Daemon')
    parser.add_argument('--catalog', default='./kernel/catalog.json',
                       help='Path to catalog file')
    parser.add_argument('--endpoints', default='./kernel/endpoints.json',
                       help='Path to endpoints configuration')
    parser.add_argument('--policies', default='./kernel/policies.json',
                       help='Path to policies configuration')
    parser.add_argument('--once', action='store_true',
                       help='Run one cleanup cycle and exit (default: daemon mode)')
    parser.add_argument('--interval', type=int, default=3600,
                       help='Cleanup interval in seconds (default: 1 hour)')

    args = parser.parse_args()

    # Create cleaner
    cleaner = NeoProxyCleaner(args.catalog, args.endpoints, args.policies)

    if args.once:
        # Run one cycle
        results = cleaner.run_cleanup_cycle()
        print(f"Cleanup results: {results}")
    else:
        # Daemon mode
        cleaner.watch_mode(args.interval)

if __name__ == "__main__":
    main()