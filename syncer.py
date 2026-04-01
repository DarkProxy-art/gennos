#!/usr/bin/env python3
"""
NeoProxy Data Syncer Daemon
Inspired by Rucio replication system

This daemon synchronizes files between storage endpoints
based on replication rules and policies.
"""

import json
import shutil
import time
import logging
from pathlib import Path
from typing import Dict, List, Optional
import argparse
import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from kernel.memory import memory_db

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('NeoProxy-Syncer')

class NeoProxySyncer:
    """NeoProxy Data Synchronization Daemon"""

    def __init__(self, catalog_path: str = "./kernel/catalog.json",
                 endpoints_config: str = "./kernel/endpoints.json"):
        self.catalog_path = Path(catalog_path)
        self.endpoints_config = Path(endpoints_config)

        # Default endpoints configuration
        self.endpoints = {
            "local_storage": {
                "path": "./watch",
                "type": "local",
                "priority": 1
            },
            "nas_storage": {
                "path": "./storage/nas",
                "type": "network",
                "priority": 2
            },
            "cloud_archive": {
                "path": "./storage/cloud",
                "type": "cloud",
                "priority": 3
            }
        }

        # Load endpoints config if exists
        self.load_endpoints_config()

        # Create storage directories
        for endpoint_name, endpoint_config in self.endpoints.items():
            if endpoint_config["type"] != "cloud":
                Path(endpoint_config["path"]).mkdir(parents=True, exist_ok=True)

        logger.info("NeoProxy Syncer initialized")
        logger.info(f"Available endpoints: {list(self.endpoints.keys())}")

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

    def get_replication_policy(self, entry: Dict) -> int:
        """Determine replication policy for a file"""
        # NeoProxy replication rules
        if entry.get("category") == "fabrication" and entry.get("type") == "3d_model":
            return 3  # Critical models: 3 replicas
        elif entry.get("category") == "agent":
            return 2  # Agent files: 2 replicas
        elif entry.get("type") == "configuration":
            return 2  # Config files: 2 replicas
        else:
            return 1  # Default: 1 replica

    def sync_file_to_endpoint(self, source_path: Path, endpoint_name: str, entry: Dict) -> bool:
        """Sync a file to a specific endpoint"""
        endpoint = self.endpoints.get(endpoint_name)
        if not endpoint:
            logger.error(f"Unknown endpoint: {endpoint_name}")
            return False

        if endpoint["type"] == "cloud":
            # Simulate cloud upload (would integrate with actual cloud provider)
            logger.info(f"Simulating cloud upload of {source_path.name} to {endpoint_name}")
            return True

        # Local/network copy
        dest_path = Path(endpoint["path"]) / source_path.name

        try:
            shutil.copy2(source_path, dest_path)
            logger.info(f"Synced {source_path.name} to {endpoint_name}")
            memory_db.log("syncer", "sync_file", {"file": source_path.name, "endpoint": endpoint_name})
            return True
        except Exception as e:
            logger.error(f"Failed to sync {source_path.name} to {endpoint_name}: {e}")
            return False

    def update_catalog_location(self, catalog: List[Dict], did: str, endpoint_name: str, status: str):
        """Update catalog with new location"""
        for entry in catalog:
            if entry["did"] == did:
                # Check if location already exists
                location_exists = False
                for location in entry["locations"]:
                    if location["endpoint"] == endpoint_name:
                        location["status"] = status
                        location["last_check"] = time.time()
                        location_exists = True
                        break

                if not location_exists:
                    entry["locations"].append({
                        "endpoint": endpoint_name,
                        "path": f"{self.endpoints[endpoint_name]['path']}/{entry['file_name']}",
                        "status": status,
                        "last_check": time.time()
                    })

                entry["replicas"] = len([l for l in entry["locations"] if l["status"] == "available"])
                break

    def sync_catalog_entry(self, entry: Dict, catalog: List[Dict]) -> bool:
        """Sync a single catalog entry to required endpoints"""
        did = entry["did"]
        file_name = entry["file_name"]

        # Find source location (prefer local_storage)
        source_location = None
        for location in entry["locations"]:
            if location["endpoint"] == "local_storage" and location["status"] == "available":
                source_location = location
                break

        if not source_location:
            logger.warning(f"No available source location for {did}")
            return False

        source_path = Path(source_location["path"])
        if not source_path.exists():
            logger.error(f"Source file not found: {source_path}")
            return False

        # Determine required replicas
        required_replicas = self.get_replication_policy(entry)
        current_replicas = entry.get("replicas", 0)

        if current_replicas >= required_replicas:
            logger.debug(f"{did} already has sufficient replicas ({current_replicas}/{required_replicas})")
            return True

        # Sync to additional endpoints
        synced_count = 0
        for endpoint_name, endpoint_config in self.endpoints.items():
            # Skip if already has replica at this endpoint
            has_replica = any(l["endpoint"] == endpoint_name and l["status"] == "available"
                            for l in entry["locations"])

            if has_replica:
                continue

            # Sync based on priority (lower number = higher priority)
            if endpoint_config["priority"] <= required_replicas:
                if self.sync_file_to_endpoint(source_path, endpoint_name, entry):
                    self.update_catalog_location(catalog, did, endpoint_name, "available")
                    synced_count += 1

                    if synced_count + current_replicas >= required_replicas:
                        break

        logger.info(f"Synced {synced_count} additional replicas for {did}")
        return synced_count > 0

    def run_sync_cycle(self) -> int:
        """Run one complete synchronization cycle"""
        logger.info("Starting sync cycle")

        catalog = self.load_catalog()
        synced_count = 0

        for entry in catalog:
            if self.sync_catalog_entry(entry, catalog):
                synced_count += 1

        self.save_catalog(catalog)

        logger.info(f"Sync cycle complete. Processed {synced_count}/{len(catalog)} entries")
        return synced_count

    def watch_mode(self, interval: int = 300):
        """Run in watch mode, syncing periodically"""
        logger.info(f"Starting sync daemon with {interval}s interval")

        try:
            while True:
                self.run_sync_cycle()
                time.sleep(interval)
        except KeyboardInterrupt:
            logger.info("Sync daemon stopped by user")
        except Exception as e:
            logger.error(f"Error in sync daemon: {e}")

def main():
    parser = argparse.ArgumentParser(description='NeoProxy Data Syncer Daemon')
    parser.add_argument('--catalog', default='./kernel/catalog.json',
                       help='Path to catalog file')
    parser.add_argument('--endpoints', default='./kernel/endpoints.json',
                       help='Path to endpoints configuration')
    parser.add_argument('--once', action='store_true',
                       help='Run one sync cycle and exit (default: daemon mode)')
    parser.add_argument('--interval', type=int, default=300,
                       help='Sync interval in seconds (default: 5 minutes)')

    args = parser.parse_args()

    # Create syncer
    syncer = NeoProxySyncer(args.catalog, args.endpoints)

    if args.once:
        # Run one cycle
        count = syncer.run_sync_cycle()
        print(f"Synced {count} entries")
    else:
        # Daemon mode
        syncer.watch_mode(args.interval)

if __name__ == "__main__":
    main()