const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("AutoChain Smart Contract", function () {
  let AutoChain;
  let autoChain;
  let owner;
  let vehicle_addr;
  let user_addr;

  // Constants
  const HUMAN_ID = "ROVER-001";
  const SENSOR_HASH = ethers.keccak256(ethers.toUtf8Bytes("random_sensor_payload"));

  beforeEach(async function () {
    [owner, vehicle_addr, user_addr] = await ethers.getSigners();
    AutoChain = await ethers.getContractFactory("AutoChain");
    autoChain = await AutoChain.deploy();
    await autoChain.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the correct admin", async function () {
      expect(await autoChain.admin()).to.equal(owner.address);
    });
    
    it("Should initialize event ID correctly", async function () {
      expect(await autoChain.nextEventId()).to.equal(1n);
    });
  });

  describe("Vehicle Management", function () {
    it("Should allow admin to register a vehicle", async function () {
      await expect(autoChain.registerVehicle(vehicle_addr.address, HUMAN_ID))
        .to.emit(autoChain, "VehicleRegistered")
        .withArgs(vehicle_addr.address, HUMAN_ID);

      const vehicle = await autoChain.vehicles(vehicle_addr.address);
      expect(vehicle.humanReadableId).to.equal(HUMAN_ID);
      expect(vehicle.isRegistered).to.be.true;
    });

    it("Should NOT allow non-admins to register vehicles", async function () {
      await expect(
        autoChain.connect(user_addr).registerVehicle(user_addr.address, "HACKER-001")
      ).to.be.revertedWith("AutoChain: Caller is not admin");
    });
    
    it("Should NOT allow duplicate registrations", async function () {
      await autoChain.registerVehicle(vehicle_addr.address, HUMAN_ID);
      await expect(
        autoChain.registerVehicle(vehicle_addr.address, "DUP-001")
      ).to.be.revertedWith("AutoChain: Vehicle already registered");
    });
  });

  describe("Telemetry Logging", function () {
    beforeEach(async function () {
      await autoChain.registerVehicle(vehicle_addr.address, HUMAN_ID);
    });

    it("Should allow registered vehicle to log an event", async function () {
      // EventType.IGNITION = 0
      await expect(
        autoChain.connect(vehicle_addr).logEvent(
          0, // IGNITION
          45000000, 75000000, // GPS
          3000, 24000, // Speed/Alt
          "rocky", "Baseline check",
          SENSOR_HASH
        )
      ).to.emit(autoChain, "TelemetryLogged")
       .withArgs(1n, vehicle_addr.address, 0, SENSOR_HASH);

      const event = await autoChain.fetchEventData(1n);
      expect(event.vehicleAddress).to.equal(vehicle_addr.address);
      expect(event.terrainType).to.equal("rocky");
    });

    it("Should NOT allow unregistered wallets to log events", async function () {
      await expect(
        autoChain.connect(user_addr).logEvent(
          0, 45, 75, 100, 100, "mud", "None", SENSOR_HASH
        )
      ).to.be.revertedWith("AutoChain: Vehicle not registered");
    });

    it("Should fire EmergencyAlert for EMERGENCY_STOP", async function () {
      // EventType.EMERGENCY_STOP = 4
      await expect(
        autoChain.connect(vehicle_addr).logEvent(
          4, 45, 75, 0, 24000, "ice", "Slip detected", SENSOR_HASH
        )
      ).to.emit(autoChain, "EmergencyAlert");
    });
  });

  describe("Data Retrieval", function () {
    beforeEach(async function () {
        await autoChain.registerVehicle(vehicle_addr.address, HUMAN_ID);
        // Log 3 events
        for(let i=0; i<3; i++) {
           await autoChain.connect(vehicle_addr).logEvent(1, 45, 75, 1000, 240, "sand", "Moving", SENSOR_HASH);
        }
    });

    it("Should return correct event total for vehicle", async function () {
        const vehicle = await autoChain.vehicles(vehicle_addr.address);
        expect(vehicle.totalEvents).to.equal(3n);
    });

    it("Should return all event IDs for a vehicle", async function () {
        const ids = await autoChain.getEventsByVehicle(vehicle_addr.address);
        expect(ids.length).to.equal(3);
        expect(ids[0]).to.equal(1n);
        expect(ids[2]).to.equal(3n);
    });
  });
});
