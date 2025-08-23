export const LAND_TOKEN_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_metadataHash", "type": "string" },
      { "internalType": "uint256", "name": "_totalTokens", "type": "uint256" },
      { "internalType": "uint256", "name": "_pricePerTokenInUSD", "type": "uint256" },
      { "internalType": "uint256", "name": "_rentPerTokenPerMonth", "type": "uint256" }
    ],
    "name": "tokenizeLand",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_landId", "type": "uint256" },
      { "internalType": "uint256", "name": "_tokenAmount", "type": "uint256" }
    ],
    "name": "purchaseTokens",
    "outputs": [],
    "stateMutability": "payable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAvaxPrice",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_landId", "type": "uint256" },
      { "internalType": "uint256", "name": "_tokenAmount", "type": "uint256" }
    ],
    "name": "calculateTokenPriceInAvax",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_landId", "type": "uint256" }],
    "name": "getLandDetails",
    "outputs": [
      { "internalType": "address", "name": "seller", "type": "address" },
      { "internalType": "string", "name": "metadataHash", "type": "string" },
      { "internalType": "uint256", "name": "totalTokens", "type": "uint256" },
      { "internalType": "uint256", "name": "availableTokens", "type": "uint256" },
      { "internalType": "uint256", "name": "pricePerTokenInUSD", "type": "uint256" },
      { "internalType": "bool", "name": "isActive", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "_landId", "type": "uint256" }],
    "name": "getOwnershipDistribution",
    "outputs": [
      { "internalType": "address[]", "name": "owners", "type": "address[]" },
      { "internalType": "uint256[]", "name": "percentages", "type": "uint256[]" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "landId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "seller", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "totalTokens", "type": "uint256" }
    ],
    "name": "LandTokenized",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "uint256", "name": "landId", "type": "uint256" },
      { "indexed": true, "internalType": "address", "name": "buyer", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "TokensPurchased",
    "type": "event"
  }
] as const;
