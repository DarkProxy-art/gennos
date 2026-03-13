#!/usr/bin/env python3
"""
NeoProxy Data Registration Agent
Inspired by Rucio Data Management System

This agent monitors directories for new files and registers them
in the NeoProxy Data Kernel Catalog.
"""

import hashlib
import json
import os
import sys
import time
from pathlib import Path
from typing import Dict, List, Optional
import uuid
import argparse
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('NeoProxy-Registrar')

class NeoProxyRegistrar:
    """NeoProxy Data Registration Agent"""

    def __init__(self, watch_dir: str, catalog_path: str = "./kernel/catalog.json"):
        self.watch_dir = Path(watch_dir)
        self.catalog_path = Path(catalog_path)
        self.catalog_path.parent.mkdir(parents=True, exist_ok=True)

        # Ensure watch directory exists
        self.watch_dir.mkdir(parents=True, exist_ok=True)

        logger.info(f"NeoProxy Registrar initialized")
        logger.info(f"Watch directory: {self.watch_dir}")
        logger.info(f"Catalog path: {self.catalog_path}")

    def calculate_sha256(self, file_path: Path) -> str:
        """Calculate SHA256 checksum of a file"""
        sha256 = hashlib.sha256()
        try:
            with open(file_path, 'rb') as f:
                for chunk in iter(lambda: f.read(8192), b""):
                    sha256.update(chunk)
            return sha256.hexdigest()
        except Exception as e:
            logger.error(f"Error calculating checksum for {file_path}: {e}")
            return ""

    def get_file_metadata(self, file_path: Path) -> Dict:
        """Extract metadata from file"""
        stat = file_path.stat()
        metadata = {
            "size": stat.st_size,
            "created": stat.st_ctime,
            "modified": stat.st_mtime,
            "extension": file_path.suffix.lower()
        }

        # NeoProxy-specific metadata based on file type
        if file_path.suffix.lower() in ['.stl', '.obj', '.3mf']:
            metadata.update({
                "type": "3d_model",
                "category": "fabrication",
                "print_ready": True
            })
        elif file_path.suffix.lower() in ['.ply', '.pcd']:
            metadata.update({
                "type": "point_cloud",
                "category": "scanning",
                "processing_required": True
            })
        elif file_path.suffix.lower() in ['.json', '.yaml', '.yml']:
            metadata.update({
                "type": "configuration",
                "category": "system"
            })
        elif file_path.suffix.lower() in ['.py', '.js', '.ts']:
            metadata.update({
                "type": "code",
                "category": "agent"
            })
        else:
            metadata.update({
                "type": "data",
                "category": "general"
            })

        return metadata

    def generate_did(self, file_path: Path) -> str:
        """Generate a Dataset Identifier (DID) for NeoProxy"""
        # NeoProxy DID format: np:{type}:{uuid}
        file_type = self.get_file_metadata(file_path)["type"]
        unique_id = uuid.uuid4().hex[:8]
        return f"np:{file_type}:{unique_id}"

    def load_catalog(self) -> List[Dict]:
        """Load existing catalog"""
        if self.catalog_path.exists():
            try:
                with open(self.catalog_path, 'r') as f:
                    return json.load(f)
            except Exception as e:
                logger.error(f"Error loading catalog: {e}")
                return []
        return []

    def save_catalog(self, catalog: List[Dict]):
        """Save catalog to disk"""
        try:
            with open(self.catalog_path, 'w') as f:
                json.dump(catalog, f, indent=2, default=str)
            logger.info(f"Catalog saved with {len(catalog)} entries")
        except Exception as e:
            logger.error(f"Error saving catalog: {e}")

    def is_file_registered(self, file_path: Path, catalog: List[Dict]) -> bool:
        """Check if file is already registered"""
        file_name = file_path.name
        for entry in catalog:
            if entry.get("file_name") == file_name:
                # Check if checksum matches
                current_checksum = self.calculate_sha256(file_path)
                if entry.get("checksum") == current_checksum:
                    return True
        return False

    def register_file(self, file_path: Path) -> Dict:
        """Register a single file in the catalog"""
        logger.info(f"Registering file: {file_path}")

        # Calculate checksum
        checksum = self.calculate_sha256(file_path)
        if not checksum:
            logger.error(f"Failed to calculate checksum for {file_path}")
            return {}

        # Generate DID
        did = self.generate_did(file_path)

        # Get metadata
        metadata = self.get_file_metadata(file_path)

        # Create catalog entry
        entry = {
            "did": did,
            "file_name": file_path.name,
            "path": str(file_path),
            "checksum": checksum,
            "size": metadata["size"],
            "type": metadata["type"],
            "category": metadata["category"],
            "created": metadata["created"],
            "modified": metadata["modified"],
            "extension": metadata["extension"],
            "locations": [
                {
                    "endpoint": "local_storage",
                    "path": str(file_path),
                    "status": "available",
                    "last_check": time.time()
                }
            ],
            "replicas": 1,
            "tags": [],
            "attributes": metadata
        }

        # Load existing catalog
        catalog = self.load_catalog()

        # Check if file already exists
        if self.is_file_registered(file_path, catalog):
            logger.info(f"File {file_path.name} already registered")
            return {}

        # Add new entry
        catalog.append(entry)

        # Save catalog
        self.save_catalog(catalog)

        logger.info(f"Successfully registered {file_path.name} as {did}")
        return entry

    def scan_and_register(self) -> int:
        """Scan watch directory and register new files"""
        logger.info("Starting scan and registration process")

        registered_count = 0
        catalog = self.load_catalog()

        # Scan all files in watch directory
        for file_path in self.watch_dir.rglob("*"):
            if file_path.is_file():
                if not self.is_file_registered(file_path, catalog):
                    result = self.register_file(file_path)
                    if result:
                        registered_count += 1
                else:
                    logger.debug(f"File {file_path.name} already registered")

        logger.info(f"Scan complete. Registered {registered_count} new files")
        return registered_count

    def watch_mode(self, interval: int = 60):
        """Run in watch mode, scanning periodically"""
        logger.info(f"Starting watch mode with {interval}s interval")

        try:
            while True:
                self.scan_and_register()
                time.sleep(interval)
        except KeyboardInterrupt:
            logger.info("Watch mode stopped by user")
        except Exception as e:
            logger.error(f"Error in watch mode: {e}")

def main():
    parser = argparse.ArgumentParser(description='NeoProxy Data Registration Agent')
    parser.add_argument('--watch-dir', default='./watch',
                       help='Directory to watch for new files')
    parser.add_argument('--catalog', default='./kernel/catalog.json',
                       help='Path to catalog file')
    parser.add_argument('--once', action='store_true',
                       help='Run once and exit (default: watch mode)')
    parser.add_argument('--interval', type=int, default=60,
                       help='Watch interval in seconds')

    args = parser.parse_args()

    # Create registrar
    registrar = NeoProxyRegistrar(args.watch_dir, args.catalog)

    if args.once:
        # Run once
        count = registrar.scan_and_register()
        print(f"Registered {count} new files")
    else:
        # Watch mode
        registrar.watch_mode(args.interval)

if __name__ == "__main__":
    main()