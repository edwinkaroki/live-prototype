# Ujima Loan Pride - Production Startup Script (Windows)
# This script starts both the Python API and React frontend

Write-Host "Ujima Loan Pride - Production Startup" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# Step 1: Verify environment
Write-Host "[1/4] Verifying environment..." -ForegroundColor Cyan
$pythonCheck = python --version 2>&1 | Select-String "Python"
$nodeCheck = node --version 2>&1
$npmCheck = npm --version 2>&1

if (-not $pythonCheck) {
    Write-Host "Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

if (-not $nodeCheck) {
    Write-Host "Node.js is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

Write-Host "Python $($pythonCheck.Line.Trim())" -ForegroundColor Green
Write-Host "Node.js $($nodeCheck.Trim())" -ForegroundColor Green
Write-Host "npm $($npmCheck.Trim())" -ForegroundColor Green
Write-Host ""

# Step 2: Setup Python API
Write-Host "[2/4] Setting up Python API server..." -ForegroundColor Cyan
Push-Location "$scriptDir\ujima-loan-pride"

# Check virtual environment
if (-not (Test-Path ".venv")) {
    Write-Host "Creating virtual environment..." -ForegroundColor Yellow
    python -m venv .venv
}

# Activate virtual environment
& ".venv\Scripts\Activate.ps1"

# Install dependencies
Write-Host "Installing Python dependencies..." -ForegroundColor Yellow
pip install -q -r requirements.txt

Write-Host "Python API environment ready" -ForegroundColor Green
Write-Host ""

# Start Python API in background
Write-Host "[3/4] Starting Python API server on port 5000..." -ForegroundColor Cyan
Write-Host "  Running: python api.py" -ForegroundColor Gray

# Run API in a separate process
$apiProcess = Start-Process python -ArgumentList "api.py" -PassThru -NoNewWindow
Write-Host "API Server started (PID: $($apiProcess.Id))" -ForegroundColor Green

# Wait for API to start
Start-Sleep -Seconds 2

# Verify API is running
try {
    $healthCheck = Invoke-WebRequest -Uri "http://localhost:5000/health" -ErrorAction Stop
    Write-Host "API Health Check: OK" -ForegroundColor Green
} catch {
    Write-Host "API health check failed - API may not be running" -ForegroundColor Yellow
}

Write-Host ""

# Step 4: Start React Frontend
Write-Host "[4/4] Starting React frontend..." -ForegroundColor Cyan
Pop-Location
Push-Location "$scriptDir\ujima-landing"

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing npm dependencies..." -ForegroundColor Yellow
    npm install -q
}

Write-Host "Starting Vite development server..." -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Application Ready!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Frontend: http://localhost:5173" -ForegroundColor Cyan
Write-Host "API: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Demo Page: http://localhost:5173/demo" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the application" -ForegroundColor Yellow
Write-Host ""

# Start React dev server (this will block)
npm run dev

# Cleanup
Pop-Location
Stop-Process -Id $apiProcess.Id -Force
