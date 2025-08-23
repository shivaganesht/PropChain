# PropChain - Decentralized Real Estate Platform

**Team Name:** Web 4.0  
**Blockchain:** Avalanche Fuji Testnet  
**Integrations:** Chainlink Price Feeds, VRF, and Automation

## 🚀 Overview

PropChain is a decentralized real estate platform that enables fractional ownership of land through tokenization. Sellers can mint ERC1155 tokens representing portions of their land, and buyers can purchase as many tokens as they can afford.

## 🏗️ Architecture

```
PropChain/
├── frontend/        # React + TailwindCSS UI
├── backend/         # Node.js + Express + MongoDB API
├── smart-contracts/ # Solidity contracts with Hardhat
├── scripts/         # Deployment and interaction scripts
└── README.md        # Documentation
```

## ✨ Features

- **Fractional Land Ownership**: Land tokenized as ERC1155 tokens
- **Chainlink Price Feeds**: Real-time AVAX/USD conversion
- **Chainlink VRF**: Fair token allocation for competing buyers
- **Chainlink Automation**: Automated rent distribution to token holders
- **IPFS Integration**: Decentralized document storage via Pinata
- **Multi-Wallet Support**: MetaMask & Avalanche Core Wallet
- **Seller Dashboard**: Upload land details, mint tokens
- **Buyer Dashboard**: Browse lands, purchase tokens
- **Ownership Visualization**: Interactive ownership distribution charts

## 🛠️ Tech Stack

- **Smart Contracts**: Solidity 0.8.20, OpenZeppelin, Chainlink
- **Blockchain**: Avalanche Fuji Testnet
- **Backend**: Node.js, Express, MongoDB, JWT Auth
- **Frontend**: React/Next.js, TailwindCSS, ethers.js
- **Storage**: IPFS/Pinata for documents
- **Development**: Hardhat, TypeScript

## 📋 Prerequisites

- Node.js v16+ and npm
- MongoDB (local or cloud)
- MetaMask or Avalanche wallet
- Avalanche Fuji testnet AVAX (get from [faucet](https://faucet.avax.network/))

## 🔧 Installation

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/PropChain.git
cd PropChain
```

### 2. Smart Contracts Setup

```bash
cd smart-contracts
npm install
cp .env.example .env
# Edit .env with your private key and API keys
```

### 3. Deploy Contracts

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network fuji
```

### 4. Backend Setup

```bash
cd ../backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

### 5. Frontend Setup

```bash
cd ../frontend
npm install
cp .env.example .env
# Edit .env with contract address and API endpoints
npm run dev
```

## 🔑 Environment Variables

### Smart Contracts (.env)
```
PRIVATE_KEY=your_wallet_private_key
AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
SNOWTRACE_API_KEY=your_snowtrace_api_key
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/propchain
JWT_SECRET=your_jwt_secret
CONTRACT_ADDRESS=deployed_contract_address
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_API_KEY=your_pinata_secret_key
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_CONTRACT_ADDRESS=deployed_contract_address
REACT_APP_CHAIN_ID=43113
```

## 📝 Smart Contract Functions

### LandToken.sol

- `tokenizeLand()`: Mint new land tokens
- `purchaseTokens()`: Buy fractional tokens with AVAX
- `getAvaxPrice()`: Get current AVAX/USD price from Chainlink
- `distributeRent()`: Distribute rent to token holders
- `getOwnershipDistribution()`: View token ownership percentages

## 🔗 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/connect-wallet` - Connect wallet

### Lands
- `GET /api/lands` - Get all lands
- `GET /api/lands/:id` - Get specific land
- `POST /api/lands` - Create land listing (protected)
- `POST /api/lands/:id/tokenize` - Tokenize land (protected)

### IPFS
- `POST /api/ipfs/upload` - Upload documents to IPFS
- `POST /api/ipfs/upload-json` - Upload metadata to IPFS

### Blockchain
- `GET /api/blockchain/price/avax-usd` - Get AVAX price
- `GET /api/blockchain/land/:landId` - Get on-chain land data
- `GET /api/blockchain/transaction/:hash` - Get transaction status

## 🎮 Demo Flow

1. **Seller Registration**
   - Connect wallet
   - Register as seller
   - Navigate to seller dashboard

2. **Land Tokenization**
   - Upload land documents
   - Set token quantity and price
   - Mint tokens on Avalanche

3. **Buyer Purchase**
   - Browse available lands
   - View AVAX/USD price
   - Purchase fractional tokens

4. **Ownership Management**
   - View ownership distribution
   - Receive automated rent distributions
   - Track transaction history

## 🔍 Chainlink Integration Details

### Price Feeds (AVAX/USD)
- Address: `0x5498BB86BC934c8D34FDA08E81D444153d0D06aD`
- Network: Avalanche Fuji
- Decimals: 8

### VRF (Randomness)
- Coordinator: `0x2eD832Ba664535e5886b75D64C46EB9a228C2610`
- Key Hash: `0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61`

### Automation (Keepers)
- Automated rent distribution every 30 days
- Fair allocation of competitive purchases

## 🧪 Testing

### Smart Contracts
```bash
cd smart-contracts
npx hardhat test
```

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 📊 Contract Verification

```bash
npx hardhat verify --network fuji CONTRACT_ADDRESS "constructor_arg1" "constructor_arg2"
```

## 🚢 Deployment Checklist

- [ ] Set up MongoDB database
- [ ] Configure Pinata API keys
- [ ] Deploy smart contracts to Fuji
- [ ] Update .env files with contract address
- [ ] Start backend server
- [ ] Build and deploy frontend
- [ ] Test end-to-end flow
- [ ] Verify contracts on Snowtrace

## 📱 Frontend Pages

1. **Landing Page** - Platform introduction
2. **Seller Dashboard** - Manage land listings
3. **Buyer Dashboard** - Browse and purchase tokens
4. **Land Details** - View specific land information
5. **My Portfolio** - Track owned tokens
6. **Transactions** - Transaction history

## 🔐 Security Considerations

- Smart contracts use ReentrancyGuard
- JWT authentication for API
- Input validation on all endpoints
- Secure wallet integration
- HTTPS in production

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License

## 👥 Team Web 4.0

Built for Avalanche Hackathon

## 🆘 Support

For issues or questions, please open an issue on GitHub or contact the team.

## 🔮 Future Enhancements

- [ ] Multi-chain support
- [ ] Advanced governance features
- [ ] Property management tools
- [ ] Legal document integration
- [ ] Mobile application
- [ ] Real estate NFT marketplace

---

**Note**: This is a hackathon project. Ensure proper auditing before mainnet deployment.
