# NeoProxy Data Kernel

A CERN Rucio-inspired distributed data management system for NeoProxy OS, featuring intelligent file cataloging, multi-endpoint synchronization, integrity validation, and automated space management.

## 🌀 Overview

The NeoProxy Data Kernel implements enterprise-grade data management capabilities inspired by CERN's Rucio system. It provides:

- **Distributed File Cataloging** with DID (Dataset Identifier) system
- **Multi-Endpoint Synchronization** across local, NAS, and cloud storage
- **Integrity Validation** with checksum verification and corruption detection
- **Automated Space Management** with configurable retention policies
- **Real-time Monitoring** via web dashboard and REST APIs

## 🏗️ Architecture

### Core Components

```
NeoProxy Data Kernel
├── registrar.py     - File registration and cataloging daemon
├── syncer.py        - Multi-endpoint file synchronization daemon
├── cleaner.py       - Space management and replica cleanup daemon
├── validator.py     - Data integrity validation daemon
├── master.py        - Master controller for all daemons
└── Dashboard        - Web interface for monitoring and management
```

### Data Flow

1. **Registration**: Files are discovered and registered with unique DIDs
2. **Synchronization**: Files are replicated across configured endpoints
3. **Validation**: File integrity is continuously monitored
4. **Cleanup**: Space is managed according to retention policies

## 🚀 Quick Start

### Prerequisites

- Python 3.7+
- Next.js 16+ (for dashboard)
- Access to local storage, NAS, and/or cloud storage

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd neoproxy-repo
```

2. Install dependencies:
```bash
npm install
```

3. Start the complete system:
```bash
./start_kernel.sh
```

This will:
- Create necessary directories
- Run initial file registration
- Synchronize files across endpoints
- Validate data integrity
- Start all daemons

### Manual Control

```bash
# Start all daemons
python3 master.py start

# Check status
python3 master.py status

# Stop all daemons
python3 master.py stop

# Restart all daemons
python3 master.py restart
```

## 📊 Dashboard

Access the web dashboard at `http://localhost:3000/dashboard`

### Features

- **Overview**: System statistics and data categories
- **Data Catalog**: Browse registered files with metadata
- **Validation**: Integrity reports and corruption alerts

### API Endpoints

- `GET /api/catalog` - Retrieve complete data catalog
- `GET /api/validation/latest` - Get latest integrity report

## ⚙️ Configuration

### Endpoints Configuration (`kernel/endpoints.json`)

```json
{
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
```

### Policies Configuration (`kernel/policies.json`)

```json
{
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
  "space_threshold": 0.85,
  "access_grace_period": 30
}
```

## 🔧 Daemons

### Registrar Daemon

Monitors directories for new files and registers them in the catalog.

```bash
python3 registrar.py --watch          # Run in daemon mode
python3 registrar.py --once           # Run single scan
python3 registrar.py --watch-dir /path/to/watch
```

### Syncer Daemon

Synchronizes files across configured endpoints based on replication policies.

```bash
python3 syncer.py                     # Run in daemon mode
python3 syncer.py --once              # Run single sync cycle
python3 syncer.py --interval 1800     # Custom sync interval (seconds)
```

### Cleaner Daemon

Manages storage space by enforcing retention policies and cleaning excess replicas.

```bash
python3 cleaner.py                    # Run in daemon mode
python3 cleaner.py --once             # Run single cleanup cycle
python3 cleaner.py --interval 7200    # Custom cleanup interval (seconds)
```

### Validator Daemon

Validates file integrity using checksums and quarantines corrupted files.

```bash
python3 validator.py                  # Run in daemon mode
python3 validator.py --once           # Run single validation cycle
python3 validator.py --interval 86400 # Custom validation interval (seconds)
```

## 📁 Data Catalog

Files are cataloged with the following metadata:

```json
{
  "did": "np:category:checksum_prefix",
  "file_name": "example.stl",
  "category": "fabrication",
  "type": "3d_model",
  "size_bytes": 1048576,
  "checksum": "sha256_hash",
  "created": 1640995200,
  "replicas": 3,
  "locations": [
    {
      "endpoint": "local_storage",
      "path": "./watch/example.stl",
      "status": "available",
      "last_check": 1640995200
    }
  ]
}
```

### DID (Dataset Identifier) Format

`np:<category>:<checksum_prefix>`

- `np`: NeoProxy namespace
- `<category>`: Data category (fabrication, agent, configuration, etc.)
- `<checksum_prefix>`: First 8 characters of SHA256 checksum

## 🔒 Security Features

- **Integrity Validation**: SHA256 checksum verification
- **Quarantine System**: Corrupted files are isolated automatically
- **Access Tracking**: File access patterns are monitored
- **Policy Enforcement**: Configurable retention and replication rules

## 📈 Monitoring

### Logs

All daemons log to stdout/stderr with structured logging:

```
2024-01-01 12:00:00 - NeoProxy-Syncer - INFO - Synced file.stl to nas_storage
2024-01-01 12:00:00 - NeoProxy-Validator - WARNING - File corrupted: file.stl
```

### Metrics

- Files registered, synced, validated
- Storage utilization per endpoint
- Replication status and failures
- Integrity violations and quarantined files

## 🛠️ Development

### Adding New Daemons

1. Create daemon script following the established pattern
2. Add configuration to `master.py`
3. Update documentation

### Extending the Dashboard

The dashboard is built with Next.js and can be extended with:

- Additional API endpoints
- New visualization components
- Real-time updates via WebSockets

### Custom Policies

Policies can be customized by modifying `kernel/policies.json`:

- **Retention Policies**: How long to keep different file types
- **Replication Rules**: How many copies to maintain
- **Space Management**: When to trigger cleanup operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is part of NeoProxy OS and follows its licensing terms.

## 🆘 Troubleshooting

### Common Issues

**Daemons won't start:**
- Check Python version (3.7+ required)
- Verify file permissions
- Check log output for specific errors

**Files not syncing:**
- Verify endpoint configurations
- Check network connectivity for remote endpoints
- Review replication policies

**Dashboard not loading:**
- Ensure Next.js is running (`npm run dev`)
- Check API endpoints are accessible
- Verify catalog files exist

### Log Files

Check the following for debugging:
- Daemon stdout/stderr output
- `kernel/catalog.json` for data catalog
- `kernel/validation_report_*.json` for integrity reports
- `kernel/quarantine/` for quarantined files

## 🔗 Related Projects

- [CERN Rucio](https://rucio.cern.ch/) - Original inspiration
- [NeoProxy OS](https://github.com/darkproxy/neoproxy) - Main operating system
- [Babylon.js](https://www.babylonjs.com/) - 3D visualization framework