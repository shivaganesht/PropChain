#!/bin/bash

echo "========================================="
echo "PropChain Deployment Script"
echo "========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -f "../smart-contracts/hardhat.config.js" ]; then
    echo -e "${RED}Error: Please run this script from the scripts directory${NC}"
    exit 1
fi

echo -e "${YELLOW}Step 1: Installing smart contract dependencies...${NC}"
cd ../smart-contracts
npm install

echo -e "${YELLOW}Step 2: Compiling contracts...${NC}"
npx hardhat compile

echo -e "${YELLOW}Step 3: Deploying to Avalanche Fuji...${NC}"
echo -e "${GREEN}Make sure you have:${NC}"
echo "  1. Added your private key to .env"
echo "  2. Funded your wallet with Fuji AVAX"
echo "  3. Created a Chainlink VRF subscription"
echo ""
read -p "Press enter to continue with deployment..."

npx hardhat run scripts/deploy.js --network fuji

echo -e "${YELLOW}Step 4: Starting backend server...${NC}"
cd ../backend
npm install
echo -e "${GREEN}Backend dependencies installed${NC}"

echo -e "${YELLOW}Step 5: Starting frontend...${NC}"
cd ../frontend
npm install
echo -e "${GREEN}Frontend dependencies installed${NC}"

echo ""
echo "========================================="
echo -e "${GREEN}Deployment Complete!${NC}"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Update CONTRACT_ADDRESS in backend/.env"
echo "2. Update NEXT_PUBLIC_CONTRACT_ADDRESS in frontend/.env.local"
echo "3. Start MongoDB: mongod"
echo "4. Start backend: cd backend && npm run dev"
echo "5. Start frontend: cd frontend && npm run dev"
echo ""
echo "Access your dApp at: http://localhost:3000"
