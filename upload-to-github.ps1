# PropChain GitHub Upload Script
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "PropChain GitHub Upload Script" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Authenticate with GitHub
Write-Host "Step 1: Authenticating with GitHub..." -ForegroundColor Yellow
Write-Host "A browser window will open. Please log in to GitHub." -ForegroundColor Green
& "C:\Program Files\GitHub CLI\gh.exe" auth login --web

# Step 2: Create the repository
Write-Host ""
Write-Host "Step 2: Creating GitHub repository..." -ForegroundColor Yellow
& "C:\Program Files\GitHub CLI\gh.exe" repo create PropChain --public --description "Decentralized Real Estate Platform - Fractional ownership on Avalanche blockchain with Chainlink integration" --source=. --remote=origin --push

# Step 3: Set repository topics
Write-Host ""
Write-Host "Step 3: Adding repository topics..." -ForegroundColor Yellow
& "C:\Program Files\GitHub CLI\gh.exe" repo edit shivaganesht/PropChain --add-topic blockchain,avalanche,chainlink,real-estate,web3,defi,smart-contracts,hackathon

# Step 4: Open repository in browser
Write-Host ""
Write-Host "Step 4: Opening repository in browser..." -ForegroundColor Yellow
& "C:\Program Files\GitHub CLI\gh.exe" repo view --web

Write-Host ""
Write-Host "=========================================" -ForegroundColor Green
Write-Host "Upload Complete!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Your repository is now live at:" -ForegroundColor Cyan
Write-Host "https://github.com/shivaganesht/PropChain" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Add a LICENSE file (MIT recommended)"
Write-Host "2. Create a release for hackathon submission"
Write-Host "3. Deploy contracts to Avalanche Fuji"
Write-Host "4. Record a demo video"
Write-Host ""
Write-Host "Good luck with your hackathon! 🎉" -ForegroundColor Cyan
