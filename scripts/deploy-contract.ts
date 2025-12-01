import { ethers } from "hardhat";

/**
 * Deploy ChristmasCapPFP contract to Base network
 * 
 * This script deploys the ChristmasCapPFP contract with USDC address on Base mainnet.
 * 
 * Usage: npx hardhat run scripts/deploy-contract.ts --network base
 */

const USDC_BASE_MAINNET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

async function main() {
  console.log("🎄 Deploying ChristmasCapPFP contract to Base...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  // Deploy the contract
  const ChristmasCapPFP = await ethers.getContractFactory("ChristmasCapPFP");
  const contract = await ChristmasCapPFP.deploy(USDC_BASE_MAINNET);

  await contract.waitForDeployment();
  const contractAddress = await contract.getAddress();

  console.log("✅ ChristmasCapPFP deployed to:", contractAddress);
  console.log("\n📝 Next steps:");
  console.log("1. Update .env.local with:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${contractAddress}`);
  console.log("\n2. Verify the contract on BaseScan:");
  console.log(`   npx hardhat verify --network base ${contractAddress} ${USDC_BASE_MAINNET}`);
  console.log("\n3. Fund the contract with test USDC if needed");
  console.log("\n🎅 Deployment complete!");
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
