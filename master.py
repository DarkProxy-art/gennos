#!/usr/bin/env python3
"""
NeoProxy Data Kernel Master Controller
Orchestrates all data management daemons
"""

import subprocess
import signal
import time
import logging
import argparse
from pathlib import Path
import sys

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger('NeoProxy-Master')

class NeoProxyMaster:
    """Master controller for NeoProxy Data Kernel"""

    def __init__(self):
        self.processes = {}
        self.running = True

        # Daemon configurations
        self.daemons = {
            'registrar': {
                'script': './registrar.py',
                'args': ['--watch'],
                'description': 'File registration and cataloging'
            },
            'syncer': {
                'script': './syncer.py',
                'args': [],
                'description': 'File synchronization across endpoints'
            },
            'cleaner': {
                'script': './cleaner.py',
                'args': [],
                'description': 'Space management and replica cleanup'
            },
            'validator': {
                'script': './validator.py',
                'args': [],
                'description': 'Data integrity validation'
            }
        }

    def start_daemon(self, name: str) -> bool:
        """Start a specific daemon"""
        if name not in self.daemons:
            logger.error(f"Unknown daemon: {name}")
            return False

        if name in self.processes and self.processes[name].poll() is None:
            logger.info(f"Daemon {name} is already running")
            return True

        daemon_config = self.daemons[name]
        cmd = [sys.executable, daemon_config['script']] + daemon_config['args']

        try:
            logger.info(f"Starting daemon: {name} - {daemon_config['description']}")
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                cwd=Path.cwd()
            )
            self.processes[name] = process
            return True
        except Exception as e:
            logger.error(f"Failed to start daemon {name}: {e}")
            return False

    def stop_daemon(self, name: str) -> bool:
        """Stop a specific daemon"""
        if name not in self.processes:
            logger.info(f"Daemon {name} is not running")
            return True

        process = self.processes[name]
        if process.poll() is not None:
            logger.info(f"Daemon {name} already stopped")
            del self.processes[name]
            return True

        try:
            logger.info(f"Stopping daemon: {name}")
            process.terminate()

            # Wait for graceful shutdown
            try:
                process.wait(timeout=10)
            except subprocess.TimeoutExpired:
                logger.warning(f"Daemon {name} didn't terminate gracefully, killing...")
                process.kill()
                process.wait()

            del self.processes[name]
            return True
        except Exception as e:
            logger.error(f"Error stopping daemon {name}: {e}")
            return False

    def start_all_daemons(self) -> int:
        """Start all daemons"""
        started = 0
        for name in self.daemons:
            if self.start_daemon(name):
                started += 1
        return started

    def stop_all_daemons(self) -> int:
        """Stop all daemons"""
        stopped = 0
        for name in list(self.processes.keys()):
            if self.stop_daemon(name):
                stopped += 1
        return stopped

    def check_daemon_status(self, name: str) -> str:
        """Check status of a daemon"""
        if name not in self.processes:
            return "stopped"

        process = self.processes[name]
        if process.poll() is None:
            return "running"
        else:
            return f"exited ({process.returncode})"

    def get_status_report(self) -> dict:
        """Get status report of all daemons"""
        report = {
            'timestamp': time.time(),
            'daemons': {}
        }

        for name, config in self.daemons.items():
            status = self.check_daemon_status(name)
            report['daemons'][name] = {
                'status': status,
                'description': config['description'],
                'pid': self.processes.get(name, {}).pid if name in self.processes else None
            }

        return report

    def monitor_daemons(self):
        """Monitor daemon health and restart if necessary"""
        while self.running:
            for name in list(self.daemons.keys()):
                status = self.check_daemon_status(name)
                if status != "running":
                    logger.warning(f"Daemon {name} is {status}, attempting restart...")
                    self.start_daemon(name)

            time.sleep(30)  # Check every 30 seconds

    def run_command(self, command: str, daemon_name: str = None) -> bool:
        """Execute a control command"""
        if command == "start":
            if daemon_name:
                return self.start_daemon(daemon_name)
            else:
                count = self.start_all_daemons()
                logger.info(f"Started {count}/{len(self.daemons)} daemons")
                return count > 0

        elif command == "stop":
            if daemon_name:
                return self.stop_daemon(daemon_name)
            else:
                count = self.stop_all_daemons()
                logger.info(f"Stopped {count} daemons")
                return True

        elif command == "restart":
            if daemon_name:
                self.stop_daemon(daemon_name)
                time.sleep(2)
                return self.start_daemon(daemon_name)
            else:
                self.stop_all_daemons()
                time.sleep(2)
                count = self.start_all_daemons()
                logger.info(f"Restarted {count}/{len(self.daemons)} daemons")
                return count > 0

        elif command == "status":
            report = self.get_status_report()
            print("NeoProxy Data Kernel Status:")
            print("=" * 40)
            for name, info in report['daemons'].items():
                status_emoji = "🟢" if info['status'] == "running" else "🔴"
                pid_info = f" (PID: {info['pid']})" if info['pid'] else ""
                print(f"{status_emoji} {name}: {info['status']}{pid_info}")
                print(f"   {info['description']}")
            return True

        return False

    def signal_handler(self, signum, frame):
        """Handle shutdown signals"""
        logger.info("Received shutdown signal, stopping all daemons...")
        self.running = False
        self.stop_all_daemons()
        sys.exit(0)

def main():
    parser = argparse.ArgumentParser(description='NeoProxy Data Kernel Master Controller')
    parser.add_argument('command', choices=['start', 'stop', 'restart', 'status'],
                       help='Command to execute')
    parser.add_argument('--daemon', help='Specific daemon to control')
    parser.add_argument('--monitor', action='store_true',
                       help='Run in monitoring mode (keeps daemons running)')

    args = parser.parse_args()

    master = NeoProxyMaster()

    # Setup signal handlers
    signal.signal(signal.SIGINT, master.signal_handler)
    signal.signal(signal.SIGTERM, master.signal_handler)

    # Execute command
    if master.run_command(args.command, args.daemon):
        if args.monitor and args.command in ['start', 'restart']:
            logger.info("Entering monitoring mode...")
            master.monitor_daemons()
    else:
        logger.error("Command failed")
        sys.exit(1)

if __name__ == "__main__":
    main()