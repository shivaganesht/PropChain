@echo off
echo Starting PropChain Backend Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

REM Navigate to backend directory
cd /d "c:\Users\shiva\OneDrive\Documents\Avalanche Hackathon\PropChain\backend"

REM Check if package.json exists
if not exist package.json (
    echo Error: package.json not found in backend directory
    echo Please ensure you're in the correct directory
    pause
    exit /b 1
)

REM Install dependencies if node_modules doesn't exist
if not exist node_modules (
    echo Installing backend dependencies...
    npm install
)

REM Create minimal .env file if it doesn't exist
if not exist .env (
    echo Creating .env file...
    echo PORT=5000 > .env
    echo USE_DEMO_MODE=true >> .env
    echo NODE_ENV=development >> .env
)

echo.
echo Starting server on port 5000...
echo Backend API will be available at: http://localhost:5000
echo Admin API endpoints will be available at: http://localhost:5000/api/admin
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the server
npm start
pause
