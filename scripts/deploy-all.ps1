Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "PropChain Deployment Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "../smart-contracts/hardhat.config.js")) {
    Write-Host "Error: Please run this script from the scripts directory" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Installing smart contract dependencies..." -ForegroundColor Yellow
Set-Location ../smart-contracts
npm install

Write-Host ""
Write-Host "Step 2: Compiling contracts..." -ForegroundColor Yellow
npx hardhat compile

Write-Host ""
Write-Host "Step 3: Ready to deploy to Avalanche Fuji" -ForegroundColor Yellow
Write-Host "Make sure you have:" -ForegroundColor Green
Write-Host "  1. Added your private key to .env"
Write-Host "  2. Funded your wallet with Fuji AVAX"
Write-Host "  3. Created a Chainlink VRF subscription"
Write-Host ""
Read-Host "Press Enter to continue with deployment"

npx hardhat run scripts/deploy.js --network fuji

Write-Host ""
Write-Host "Step 4: Installing backend dependencies..." -ForegroundColor Yellow
Set-Location ../backend
npm install
Write-Host "Backend dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "Step 5: Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location ../frontend
npm install
Write-Host "Frontend dependencies installed" -ForegroundColor Green

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Deployment Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update CONTRACT_ADDRESS in backend/.env"
Write-Host "2. Update NEXT_PUBLIC_CONTRACT_ADDRESS in frontend/.env.local"
Write-Host "3. Start MongoDB"
Write-Host "4. Start backend: cd backend && npm run dev"
Write-Host "5. Start frontend: cd frontend && npm run dev"
Write-Host ""
Write-Host "Access your dApp at: http://localhost:3000" -ForegroundColor Green

Set-Location ../scripts
