const hre = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment of AutoChain contract...");

  const AutoChain = await hre.ethers.getContractFactory("AutoChain");
  const autoChain = await AutoChain.deploy();

  await autoChain.waitForDeployment();

  const address = await autoChain.getAddress();

  console.log("✅ AutoChain deployed successfully!");
  console.log("-" * 30);
  console.log(`Contract Address: ${address}`);
  console.log("-" * 30);
  console.log("To verify on Etherscan run:");
  console.log(`npx hardhat verify --network sepolia ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
