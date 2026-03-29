const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  const AutoChain = await hre.ethers.getContractFactory("AutoChain");
  const autoChain = await AutoChain.deploy();

  await autoChain.waitForDeployment();

  const address = await autoChain.getAddress();
  console.log("AutoChain deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
