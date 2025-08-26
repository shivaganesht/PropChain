# Start PropChain Backend Server
Write-Host "Starting PropChain Backend Server..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "Error: Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Navigate to backend directory
$backendPath = "c:\Users\shiva\OneDrive\Documents\Avalanche Hackathon\PropChain\backend"
Set-Location $backendPath

# Check if package.json exists
if (-not (Test-Path "package.json")) {
    Write-Host "Error: package.json not found in backend directory" -ForegroundColor Red
    Write-Host "Please ensure you're in the correct directory" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Install dependencies if node_modules doesn't exist
if (-not (Test-Path "node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    npm install
}

# Create minimal .env file if it doesn't exist
if (-not (Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    @"
PORT=5000
USE_DEMO_MODE=true
NODE_ENV=development
"@ | Out-File -FilePath ".env" -Encoding UTF8
}

Write-Host ""
Write-Host "Starting server on port 5000..." -ForegroundColor Green
Write-Host "Backend API will be available at: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Admin API endpoints will be available at: http://localhost:5000/api/admin" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
try {
    npm start
} catch {
    Write-Host "Error starting server. Please check the logs above." -ForegroundColor Red
    Read-Host "Press Enter to exit"
}
