Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "PropChain - Starting Application" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if backend dependencies are installed
if (-not (Test-Path "backend/node_modules")) {
    Write-Host "Installing backend dependencies..." -ForegroundColor Yellow
    Set-Location backend
    npm install
    Set-Location ..
}

# Check if frontend dependencies are installed
if (-not (Test-Path "frontend/node_modules")) {
    Write-Host "Installing frontend dependencies..." -ForegroundColor Yellow
    Set-Location frontend
    npm install
    Set-Location ..
}

Write-Host ""
Write-Host "Starting PropChain..." -ForegroundColor Green
Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
Write-Host "Frontend will run on: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop all services" -ForegroundColor Yellow
Write-Host ""

# Start backend in a new window
Write-Host "Starting Backend Server..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; Write-Host 'PropChain Backend Server' -ForegroundColor Green; npm run dev"

# Wait a moment for backend to start
Start-Sleep -Seconds 3

# Start frontend in a new window
Write-Host "Starting Frontend Application..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; Write-Host 'PropChain Frontend Application' -ForegroundColor Green; npm run dev"

# Wait for services to initialize
Start-Sleep -Seconds 5

# Open browser
Write-Host ""
Write-Host "Opening PropChain in your browser..." -ForegroundColor Green
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "PropChain is running!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Application URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "  Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "  API Health: http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "To stop the application, close the terminal windows" -ForegroundColor Yellow
