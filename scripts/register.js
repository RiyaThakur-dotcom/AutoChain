const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddress = process.env.CONTRACT_ADDRESS; 
  if (!contractAddress) {
    console.error("❌ CONTRACT_ADDRESS not found in .env. Please deploy first.");
    process.exit(1);
  }

  // Use the deployer address or another wallet as the vehicle for testing
  const [deployer] = await hre.ethers.getSigners();
  const vehicleAddress = deployer.address;
  const vehicleName = "ROVER-S1-MARS";

  console.log(`Connecting to contract at: ${contractAddress}...`);
  const AutoChain = await hre.ethers.getContractAt("AutoChain", contractAddress);

  console.log(`🚀 Registering vehicle ${vehicleName} (${vehicleAddress})...`);
  
  const tx = await AutoChain.registerVehicle(vehicleAddress, vehicleName);
  console.log("⏳ Waiting for transaction confirmation...");
  await tx.wait();

  console.log("✅ Vehicle successfully registered on-chain!");
  console.log("-----------------------------------------");
  console.log(`Contract: ${contractAddress}`);
  console.log(`Vehicle : ${vehicleAddress}`);
  console.log("-----------------------------------------");
  console.log("You can now run the Python simulator!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
