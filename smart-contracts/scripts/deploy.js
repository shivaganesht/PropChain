const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying PropChain LandToken contract to Avalanche Fuji...");
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with account:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", hre.ethers.formatEther(balance), "AVAX");
  
  // Chainlink addresses for Avalanche Fuji
  const PRICE_FEED_ADDRESS = "0x5498BB86BC934c8D34FDA08E81D444153d0D06aD"; // AVAX/USD
  const VRF_COORDINATOR = "0x2eD832Ba664535e5886b75D64C46EB9a228C2610";
  const SUBSCRIPTION_ID = 0; // You need to create a subscription at https://vrf.chain.link
  const KEY_HASH = "0x354d2f95da55398f44b7cff77da56283d9c6c829a4bdf1bbcaf2ad6a4d081f61";
  
  // Deploy LandToken contract
  console.log("\nDeploying LandToken contract...");
  const LandToken = await hre.ethers.getContractFactory("LandToken");
  const landToken = await LandToken.deploy(
    PRICE_FEED_ADDRESS,
    VRF_COORDINATOR,
    SUBSCRIPTION_ID,
    KEY_HASH
  );
  
  await landToken.waitForDeployment();
  const contractAddress = await landToken.getAddress();
  
  console.log("LandToken deployed to:", contractAddress);
  console.log("Transaction hash:", landToken.deploymentTransaction().hash);
  
  // Save deployment info
  const deploymentInfo = {
    network: "avalanche-fuji",
    chainId: 43113,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    chainlinkAddresses: {
      priceFeed: PRICE_FEED_ADDRESS,
      vrfCoordinator: VRF_COORDINATOR,
      subscriptionId: SUBSCRIPTION_ID,
      keyHash: KEY_HASH
    },
    blockNumber: await hre.ethers.provider.getBlockNumber()
  };
  
  // Save to file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }
  
  fs.writeFileSync(
    path.join(deploymentsDir, "avalanche-fuji.json"),
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("\n✅ Deployment successful!");
  console.log("📁 Deployment info saved to deployments/avalanche-fuji.json");
  
  // Verify contract on Snowtrace
  console.log("\n🔍 To verify the contract on Snowtrace, run:");
  console.log(`npx hardhat verify --network fuji ${contractAddress} "${PRICE_FEED_ADDRESS}" "${VRF_COORDINATOR}" ${SUBSCRIPTION_ID} "${KEY_HASH}"`);
  
  // Update backend .env
  console.log("\n📝 Update your backend .env file with:");
  console.log(`CONTRACT_ADDRESS=${contractAddress}`);
  
  // Important notes
  console.log("\n⚠️  IMPORTANT NOTES:");
  console.log("1. Create a VRF subscription at https://vrf.chain.link");
  console.log("2. Fund your VRF subscription with LINK tokens");
  console.log("3. Add your contract address as a consumer to the VRF subscription");
  console.log("4. Set up Chainlink Automation for rent distribution at https://automation.chain.link");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
