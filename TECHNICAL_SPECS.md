# PropChain Technical Specifications
## Detailed Technical Documentation

---

## 🏗️ System Architecture

### High-Level Architecture Flow

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │  Smart Contract │
│   (Next.js)     │    │   (Node.js)     │    │   (Solidity)    │
├─────────────────┤    ├─────────────────┤    ├─────────────────┤
│ • RainbowKit    │◄──►│ • Express API   │◄──►│ • LandToken.sol │
│ • Wagmi/ethers  │    │ • MongoDB       │    │ • Chainlink     │
│ • Chart.js      │    │ • JWT Auth      │    │ • ERC1155       │
│ • TailwindCSS   │    │ • IPFS/Pinata   │    │ • OpenZeppelin  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Chainlink     │
                    │   Oracles       │
                    ├─────────────────┤
                    │ • Price Feeds   │
                    │ • VRF           │
                    │ • Automation    │
                    └─────────────────┘
```

---

## 📡 API Documentation

### Base URL
```
Production: https://api.propchain.xyz
Development: http://localhost:5000/api
```

### Authentication
All protected endpoints require JWT token in header:
```
Authorization: Bearer <jwt_token>
```

### Endpoints

#### Authentication
```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword",
  "walletAddress": "0x...",
  "role": "buyer" | "seller"
}

Response: {
  "success": true,
  "token": "jwt_token",
  "user": { ... }
}
```

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securePassword"
}
```

#### Properties
```http
GET /properties
Response: {
  "success": true,
  "properties": [
    {
      "id": "64f7b8a9c123456789012345",
      "title": "Modern Office Complex",
      "description": "Prime location office space",
      "location": "New York, NY",
      "totalValue": 1000000,
      "totalTokens": 1000,
      "availableTokens": 250,
      "pricePerToken": 1000,
      "monthlyRent": 25000,
      "images": ["ipfs://..."],
      "documents": ["ipfs://..."],
      "seller": "0x...",
      "isActive": true,
      "createdAt": "2025-01-15T10:30:00Z"
    }
  ]
}
```

```http
POST /properties
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Property Title",
  "description": "Property Description",
  "location": "City, State",
  "totalValue": 1000000,
  "totalTokens": 1000,
  "pricePerToken": 1000,
  "monthlyRent": 25000,
  "images": [File],
  "documents": [File]
}
```

#### Transactions
```http
GET /transactions/user/:walletAddress
Response: {
  "success": true,
  "transactions": [
    {
      "id": "64f7b8a9c123456789012346",
      "propertyId": "64f7b8a9c123456789012345",
      "buyer": "0x...",
      "tokenAmount": 10,
      "totalPrice": 10000,
      "transactionHash": "0x...",
      "status": "completed",
      "createdAt": "2025-01-15T11:30:00Z"
    }
  ]
}
```

#### File Upload (IPFS)
```http
POST /upload/property-images
Authorization: Bearer <token>
Content-Type: multipart/form-data

Files: image1.jpg, image2.jpg

Response: {
  "success": true,
  "ipfsHashes": [
    "QmXrYx8VE5vj6jJ8kG9b2hN5mW4cF7pQ1sA3dR6tY8uI9o",
    "QmYsZx9VF6wk7jK9lH0c3iO6nX5dG8qR2tB4eS7uJ0pL1m"
  ]
}
```

#### Analytics
```http
GET /analytics/property/:propertyId
Response: {
  "success": true,
  "analytics": {
    "totalInvestors": 45,
    "tokensSold": 750,
    "tokensAvailable": 250,
    "totalRevenue": 750000,
    "monthlyRentCollected": 18750,
    "averageInvestment": 16667,
    "topInvestors": [
      { "address": "0x...", "tokens": 50, "percentage": 5.0 }
    ],
    "salesHistory": [
      { "date": "2025-01-01", "tokensSold": 100, "revenue": 100000 }
    ]
  }
}
```

---

## 🔗 Smart Contract Interface

### LandToken.sol Main Functions

#### Property Management
```solidity
function listLand(
    string memory _metadataHash,
    uint256 _totalTokens,
    uint256 _pricePerTokenInUSD,
    uint256 _rentPerTokenPerMonth
) external returns (uint256);

function updateLandStatus(uint256 _landId, bool _isActive) external;

function updateRentPerToken(uint256 _landId, uint256 _newRent) external;
```

#### Token Operations
```solidity
function buyTokens(uint256 _landId, uint256 _tokenAmount) external payable;

function getTokenPrice(uint256 _landId, uint256 _tokenAmount) 
    external view returns (uint256);

function balanceOf(address _owner, uint256 _landId) 
    external view returns (uint256);
```

#### Rent Distribution
```solidity
function distributeRent(uint256 _landId) external payable;

function claimRent(uint256 _landId) external;

function getPendingRent(address _owner, uint256 _landId) 
    external view returns (uint256);
```

#### Chainlink Integration
```solidity
function getLatestPrice() public view returns (int256);

function requestRandomWords(uint256 _landId) external;

function fulfillRandomWords(uint256 _requestId, uint256[] memory _randomWords) 
    internal override;
```

### Events
```solidity
event LandListed(
    uint256 indexed landId,
    address indexed seller,
    uint256 totalTokens,
    uint256 pricePerToken
);

event TokensPurchased(
    uint256 indexed landId,
    address indexed buyer,
    uint256 tokenAmount,
    uint256 totalPrice
);

event RentDistributed(
    uint256 indexed landId,
    uint256 totalAmount,
    uint256 timestamp
);

event RentClaimed(
    uint256 indexed landId,
    address indexed owner,
    uint256 amount
);
```

---

## 🗄️ Database Schema

### MongoDB Collections

#### Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique),
  password: String (hashed),
  walletAddress: String (unique),
  role: String (enum: ['buyer', 'seller', 'admin']),
  profile: {
    firstName: String,
    lastName: String,
    phone: String,
    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String
    }
  },
  isVerified: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

#### Properties Collection
```javascript
{
  _id: ObjectId,
  landId: Number (contract ID),
  title: String,
  description: String,
  location: {
    address: String,
    city: String,
    state: String,
    zipCode: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  financials: {
    totalValue: Number,
    totalTokens: Number,
    availableTokens: Number,
    pricePerToken: Number,
    monthlyRent: Number
  },
  media: {
    images: [String], // IPFS hashes
    documents: [String], // IPFS hashes
    virtualTour: String
  },
  seller: ObjectId (ref: 'User'),
  contractAddress: String,
  transactionHash: String,
  status: String (enum: ['draft', 'active', 'soldOut', 'inactive']),
  tags: [String],
  createdAt: Date,
  updatedAt: Date
}
```

#### Transactions Collection
```javascript
{
  _id: ObjectId,
  propertyId: ObjectId (ref: 'Property'),
  buyer: ObjectId (ref: 'User'),
  seller: ObjectId (ref: 'User'),
  tokenAmount: Number,
  pricePerToken: Number,
  totalPrice: Number,
  transactionHash: String,
  blockNumber: Number,
  status: String (enum: ['pending', 'completed', 'failed']),
  createdAt: Date,
  updatedAt: Date
}
```

#### RentDistributions Collection
```javascript
{
  _id: ObjectId,
  propertyId: ObjectId (ref: 'Property'),
  totalAmount: Number,
  distributions: [{
    investor: ObjectId (ref: 'User'),
    walletAddress: String,
    tokenAmount: Number,
    rentAmount: Number,
    claimed: Boolean,
    claimedAt: Date
  }],
  transactionHash: String,
  distributionDate: Date,
  createdAt: Date
}
```

---

## 🔧 Environment Configuration

### Development Environment Setup

#### Frontend (.env.local)
```bash
# Blockchain Configuration
NEXT_PUBLIC_CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
NEXT_PUBLIC_CHAIN_ID=43113
NEXT_PUBLIC_RPC_URL=https://api.avax-test.network/ext/bc/C/rpc

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/

# Analytics (Optional)
NEXT_PUBLIC_GOOGLE_ANALYTICS=G-XXXXXXXXXX
```

#### Backend (.env)
```bash
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/propchain
DB_NAME=propchain

# Authentication
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d

# IPFS/Pinata
PINATA_API_KEY=your-pinata-api-key
PINATA_SECRET_KEY=your-pinata-secret-key
PINATA_JWT=your-pinata-jwt-token

# Blockchain
PRIVATE_KEY=your-wallet-private-key
CONTRACT_ADDRESS=0x1234567890123456789012345678901234567890
RPC_URL=https://api.avax-test.network/ext/bc/C/rpc

# Email (Optional)
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# External APIs
COINMARKETCAP_API_KEY=your-cmc-api-key
```

#### Smart Contracts (.env)
```bash
# Wallet
PRIVATE_KEY=your-private-key-without-0x-prefix

# Networks
AVALANCHE_FUJI_RPC=https://api.avax-test.network/ext/bc/C/rpc
AVALANCHE_MAINNET_RPC=https://api.avax.network/ext/bc/C/rpc

# Verification
SNOWTRACE_API_KEY=your-snowtrace-api-key

# Chainlink (Fuji Testnet)
VRF_COORDINATOR=0x2eD832Ba664535e5886b75D64C46EB9a228C2610
LINK_TOKEN=0x0b9d5D9136855f6FEc3c0993feE6E9CE8a297846
VRF_KEY_HASH=0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61
SUBSCRIPTION_ID=your-chainlink-subscription-id

# Price Feeds
AVAX_USD_FEED=0x5498BB86BC934c8D34FDA08E81D444153d0D06aD
```

---

## 📊 Performance Metrics

### Frontend Performance
```javascript
// Lighthouse Scores (Target)
{
  "performance": 95,
  "accessibility": 98,
  "bestPractices": 92,
  "seo": 90
}

// Bundle Analysis
{
  "totalSize": "2.1 MB",
  "mainChunk": "845 KB",
  "vendorChunk": "1.2 MB",
  "loadTime": "< 3 seconds",
  "timeToInteractive": "< 2 seconds"
}
```

### Smart Contract Gas Usage
```solidity
// Function Gas Costs (Approximate)
listLand(): ~80,000 gas
buyTokens(): ~65,000 gas
distributeRent(): ~45,000 gas
claimRent(): ~35,000 gas
getLatestPrice(): ~25,000 gas (view)
```

### API Performance
```javascript
// Response Times (Target)
{
  "authentication": "< 200ms",
  "propertyListing": "< 300ms",
  "fileUpload": "< 2 seconds",
  "analytics": "< 500ms",
  "transactions": "< 400ms"
}

// Database Performance
{
  "avgQueryTime": "< 50ms",
  "concurrentUsers": "1000+",
  "throughput": "500 req/sec"
}
```

---

## 🧪 Testing Strategy

### Frontend Testing
```bash
# Unit Tests
npm run test

# E2E Tests
npm run test:e2e

# Performance Tests
npm run lighthouse

# Type Checking
npm run type-check
```

### Smart Contract Testing
```bash
# Hardhat Tests
npx hardhat test

# Coverage Report
npx hardhat coverage

# Gas Reporter
npx hardhat test --reporter gas-reporter

# Slither Security Analysis
slither contracts/
```

### API Testing
```bash
# Jest Tests
npm run test

# Integration Tests
npm run test:integration

# Load Testing
npm run test:load
```

---

## 🚀 Deployment Pipeline

### CI/CD Workflow
```yaml
# .github/workflows/deploy.yml
name: Deploy PropChain
on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm test

  deploy-contracts:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npx hardhat deploy --network fuji

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@v1
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: railway/action@v1
        with:
          api-key: ${{ secrets.RAILWAY_API_KEY }}
```

---

## 📈 Monitoring & Analytics

### Application Monitoring
- **Sentry** - Error tracking and performance monitoring
- **Google Analytics** - User behavior tracking
- **Mixpanel** - Event tracking and funnels
- **DataDog** - Infrastructure monitoring

### Blockchain Monitoring
- **The Graph** - Blockchain data indexing
- **Tenderly** - Transaction monitoring and debugging
- **OpenZeppelin Defender** - Security monitoring
- **Chainlink Monitoring** - Oracle performance tracking

---

*Technical Documentation v1.0*
*Last Updated: August 24, 2025*
