# PropChain Quick Start Guide

## 🚀 Get Started in 5 Minutes

### Prerequisites
- Node.js 16+ installed
- MongoDB installed locally or MongoDB Atlas account
- MetaMask wallet with Fuji testnet AVAX

### Step 1: Clone & Install
```bash
git clone https://github.com/shivaganesht/PropChain.git
cd PropChain
```

### Step 2: Configure Environment

#### Smart Contracts (.env)
```bash
cd smart-contracts
cp .env.example .env
# Add your private key and API keys
```

#### Backend (.env)
```bash
cd ../backend
cp .env.example .env
# Configure MongoDB and other settings
```

#### Frontend (.env.local)
```bash
cd ../frontend
cp .env.local.example .env.local
# Add contract address after deployment
```

### Step 3: Deploy Contracts
```bash
cd smart-contracts
npm install
npx hardhat compile
npx hardhat run scripts/deploy.js --network fuji
```

### Step 4: Start Services

#### Terminal 1 - MongoDB:
```bash
mongod
```

#### Terminal 2 - Backend:
```bash
cd backend
npm install
npm run dev
```

#### Terminal 3 - Frontend:
```bash
cd frontend
npm install
npm run dev
```

### Step 5: Access Application
Open http://localhost:3000 in your browser

## 🧪 Testing the Application

### 1. Connect Wallet
- Click "Connect Wallet" button
- Select MetaMask
- Switch to Avalanche Fuji network

### 2. As a Seller
- Navigate to Dashboard
- Click "List New Property"
- Fill in property details
- Set token quantity and price
- Submit to blockchain

### 3. As a Buyer
- Browse Marketplace
- Select a property
- Enter number of tokens to purchase
- Confirm transaction in MetaMask

### 4. View Ownership
- Check "My Properties" page
- View ownership percentage
- Track rental income

## 📊 Demo Data

The application includes demo properties if backend is not connected:
- Downtown Commercial Building
- Suburban Family Home
- Agricultural Land

## 🔧 Troubleshooting

### Contract Deployment Failed
- Ensure you have Fuji AVAX in your wallet
- Check private key in .env file
- Verify network connection

### Frontend Not Loading
- Check if backend is running on port 5000
- Verify contract address in .env.local
- Clear browser cache

### Wallet Connection Issues
- Install MetaMask extension
- Add Avalanche Fuji network
- Refresh the page

## 📚 Key Features Demo

### Chainlink Price Feed
- Real-time AVAX/USD conversion
- Updates automatically every block

### Fractional Ownership
- Buy as little as 1 token
- Automatic ownership calculation
- Transparent distribution

### Smart Contract Security
- ReentrancyGuard protection
- Input validation
- Access control

## 🎯 Testing Checklist

- [ ] Wallet connects successfully
- [ ] Can list new property
- [ ] Property appears in marketplace
- [ ] Can purchase tokens
- [ ] Ownership updates correctly
- [ ] Price feed shows current AVAX rate
- [ ] Transaction history displays
- [ ] Rent distribution works (monthly)

## 📞 Support

For issues or questions:
1. Check README.md for detailed documentation
2. Review contract code in smart-contracts/
3. Open an issue on GitHub

## 🚢 Production Deployment

For mainnet deployment:
1. Audit smart contracts
2. Update to mainnet RPC URLs
3. Configure production MongoDB
4. Set up SSL certificates
5. Deploy frontend to Vercel/Netlify
6. Deploy backend to AWS/Heroku
