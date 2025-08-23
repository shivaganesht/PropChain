const express = require('express');
const router = express.Router();
const { ethers } = require('ethers');
const { authMiddleware } = require('../middleware/auth');

// Get provider
const getProvider = () => {
  const rpcUrl = process.env.AVALANCHE_RPC_URL || 'https://api.avax-test.network/ext/bc/C/rpc';
  return new ethers.JsonRpcProvider(rpcUrl);
};

// Get AVAX price from Chainlink
router.get('/price/avax-usd', async (req, res) => {
  try {
    const provider = getProvider();
    const priceFeedAddress = process.env.CHAINLINK_PRICE_FEED || '0x5498BB86BC934c8D34FDA08E81D444153d0D06aD';
    
    // Chainlink Price Feed ABI (only the function we need)
    const abi = [
      'function latestRoundData() external view returns (uint80 roundId, int256 price, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)'
    ];
    
    const priceFeed = new ethers.Contract(priceFeedAddress, abi, provider);
    const roundData = await priceFeed.latestRoundData();
    
    // Price has 8 decimals
    const price = Number(roundData.price) / 1e8;
    
    res.json({
      price,
      decimals: 8,
      timestamp: Number(roundData.updatedAt)
    });
  } catch (error) {
    console.error('Price feed error:', error);
    res.status(500).json({ error: 'Failed to fetch AVAX price' });
  }
});

// Get contract details
router.get('/contract/info', async (req, res) => {
  try {
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
      return res.status(404).json({ error: 'Contract not deployed yet' });
    }
    
    const provider = getProvider();
    const code = await provider.getCode(contractAddress);
    
    if (code === '0x') {
      return res.status(404).json({ error: 'No contract found at this address' });
    }
    
    res.json({
      address: contractAddress,
      network: 'Avalanche Fuji Testnet',
      chainId: 43113,
      rpcUrl: process.env.AVALANCHE_RPC_URL
    });
  } catch (error) {
    console.error('Contract info error:', error);
    res.status(500).json({ error: 'Failed to fetch contract info' });
  }
});

// Get land details from blockchain
router.get('/land/:landId', async (req, res) => {
  try {
    const { landId } = req.params;
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
      return res.status(404).json({ error: 'Contract not deployed yet' });
    }
    
    const provider = getProvider();
    
    // Simplified ABI for the functions we need
    const abi = [
      'function getLandDetails(uint256 _landId) external view returns (address seller, string memory metadataHash, uint256 totalTokens, uint256 availableTokens, uint256 pricePerTokenInUSD, bool isActive)',
      'function getOwnershipDistribution(uint256 _landId) external view returns (address[] memory owners, uint256[] memory percentages)'
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, provider);
    
    try {
      const landDetails = await contract.getLandDetails(landId);
      const ownership = await contract.getOwnershipDistribution(landId);
      
      res.json({
        landId,
        seller: landDetails.seller,
        metadataHash: landDetails.metadataHash,
        totalTokens: landDetails.totalTokens.toString(),
        availableTokens: landDetails.availableTokens.toString(),
        pricePerTokenInUSD: landDetails.pricePerTokenInUSD.toString(),
        isActive: landDetails.isActive,
        owners: ownership.owners,
        ownershipPercentages: ownership.percentages.map(p => p.toString())
      });
    } catch (contractError) {
      return res.status(404).json({ error: 'Land not found on blockchain' });
    }
  } catch (error) {
    console.error('Blockchain land fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch land from blockchain' });
  }
});

// Estimate gas for tokenization
router.post('/estimate/tokenize', authMiddleware, async (req, res) => {
  try {
    const { metadataHash, totalTokens, pricePerTokenInUSD, rentPerTokenPerMonth } = req.body;
    const contractAddress = process.env.CONTRACT_ADDRESS;
    
    if (!contractAddress) {
      return res.status(404).json({ error: 'Contract not deployed yet' });
    }
    
    const provider = getProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);
    
    const abi = [
      'function tokenizeLand(string memory _metadataHash, uint256 _totalTokens, uint256 _pricePerTokenInUSD, uint256 _rentPerTokenPerMonth) external'
    ];
    
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    
    const gasEstimate = await contract.tokenizeLand.estimateGas(
      metadataHash,
      totalTokens,
      pricePerTokenInUSD,
      rentPerTokenPerMonth
    );
    
    const gasPrice = await provider.getFeeData();
    
    res.json({
      gasLimit: gasEstimate.toString(),
      gasPrice: gasPrice.gasPrice?.toString(),
      estimatedCost: ethers.formatEther(gasEstimate * (gasPrice.gasPrice || 0n))
    });
  } catch (error) {
    console.error('Gas estimation error:', error);
    res.status(500).json({ error: 'Failed to estimate gas' });
  }
});

// Get transaction status
router.get('/transaction/:hash', async (req, res) => {
  try {
    const { hash } = req.params;
    const provider = getProvider();
    
    const tx = await provider.getTransaction(hash);
    if (!tx) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    
    const receipt = await provider.getTransactionReceipt(hash);
    
    res.json({
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: ethers.formatEther(tx.value),
      status: receipt ? (receipt.status === 1 ? 'success' : 'failed') : 'pending',
      blockNumber: receipt?.blockNumber,
      gasUsed: receipt?.gasUsed?.toString()
    });
  } catch (error) {
    console.error('Transaction fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch transaction' });
  }
});

module.exports = router;
