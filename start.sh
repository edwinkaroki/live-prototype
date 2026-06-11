#!/bin/bash
# Production deployment startup script for Ujima Loan Pride

echo "🦁 Ujima Loan Pride - Production Startup"
echo "========================================"

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo "[1/4] Checking dependencies..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

echo "✓ Dependencies verified"

echo ""
echo "[2/4] Setting up Python API server..."

# Navigate to ujima-loan-pride directory
cd "$SCRIPT_DIR/ujima-loan-pride"

# Check if virtual environment exists
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv .venv
fi

# Activate virtual environment
source .venv/bin/activate

# Install/update dependencies
echo "Installing Python dependencies..."
pip install -q -r requirements.txt

echo "✓ Python environment ready"

echo ""
echo "[3/4] Starting Python API server..."
python api.py &
API_PID=$!
echo "✓ API Server running (PID: $API_PID)"

echo ""
echo "[4/4] Starting React frontend..."

# Navigate to ujima-landing directory
cd "$SCRIPT_DIR/ujima-landing"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install -q
fi

# Start dev server
echo "✓ Starting Vite dev server..."
npm run dev

# Cleanup on exit
trap "kill $API_PID" EXIT
