#!/bin/bash
# NeoProxy Data Kernel Quick Start Script

echo "🌀 Starting NeoProxy Data Kernel..."
echo "=================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "master.py" ]; then
    print_error "master.py not found. Please run this script from the neoproxy-repo directory."
    exit 1
fi

# Check Python availability
if ! command -v python3 &> /dev/null; then
    print_error "Python 3 is not installed or not in PATH."
    exit 1
fi

print_status "Initializing NeoProxy Data Kernel..."

# Create necessary directories
print_status "Creating kernel directories..."
mkdir -p kernel storage/nas storage/cloud kernel/quarantine

# Run initial registration
print_status "Running initial file registration..."
python3 registrar.py --once

if [ $? -eq 0 ]; then
    print_success "File registration completed"
else
    print_warning "File registration encountered issues"
fi

# Run initial sync
print_status "Running initial synchronization..."
python3 syncer.py --once

if [ $? -eq 0 ]; then
    print_success "File synchronization completed"
else
    print_warning "File synchronization encountered issues"
fi

# Run initial validation
print_status "Running initial integrity validation..."
python3 validator.py --once

if [ $? -eq 0 ]; then
    print_success "Integrity validation completed"
else
    print_warning "Integrity validation encountered issues"
fi

# Start all daemons
print_status "Starting all daemons..."
python3 master.py start

if [ $? -eq 0 ]; then
    print_success "All daemons started successfully"
else
    print_error "Failed to start daemons"
    exit 1
fi

# Check status
sleep 2
print_status "Checking daemon status..."
python3 master.py status

echo ""
print_success "NeoProxy Data Kernel is now running!"
echo ""
echo "Available commands:"
echo "  python3 master.py status     - Check daemon status"
echo "  python3 master.py stop       - Stop all daemons"
echo "  python3 master.py restart    - Restart all daemons"
echo ""
echo "Web Dashboard: http://localhost:3000/dashboard"
echo "API Endpoints:"
echo "  GET /api/catalog             - View data catalog"
echo "  GET /api/validation/latest  - Latest validation report"
echo ""
print_status "Kernel ready for operation."