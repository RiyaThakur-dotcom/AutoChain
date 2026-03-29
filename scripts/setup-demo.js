const hre = require("hardhat");

async function main() {
  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const [deployer] = await hre.ethers.getSigners();
  const vehicleAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"; // Local Hardhat Default

  const AutoChain = await hre.ethers.getContractAt("AutoChain", contractAddress);
  
  console.log(`Registering vehicle at ${vehicleAddress}...`);
  const tx = await AutoChain.registerVehicle(vehicleAddress, "LOC-ROVER-1");
  await tx.wait();
  console.log("✅ Vehicle registered!");
}

main().catch(console.error);
