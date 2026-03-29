import json
import time
import random
import hashlib
from datetime import datetime
from decimal import Decimal
import os
from dotenv import load_dotenv

# Web3 and Database imports
from web3 import Web3
from pymongo import MongoClient

# Load environment variables
load_dotenv()

# Configuration from .env
RPC_URL = os.getenv("RPC_URL", "https://eth-sepolia.g.alchemy.com/v2/YOUR_KEY")
PRIVATE_KEY = os.getenv("PRIVATE_KEY", "YOUR_PRIVATE_KEY")
CONTRACT_ADDRESS = os.getenv("CONTRACT_ADDRESS", "0x0000000000000000000000000000000000000000")
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://admin:password@cluster.mongodb.net/test?retryWrites=true&w=majority")

# ABI for the AutoChain contract (simplified for simulation logging)
ABI = [
    {
        "inputs": [
            {"internalType": "uint8", "name": "_eventType", "type": "uint8"},
            {"internalType": "int32", "name": "_latitude", "type": "int32"},
            {"internalType": "int32", "name": "_longitude", "type": "int32"},
            {"internalType": "uint32", "name": "_speed", "type": "uint32"},
            {"internalType": "int32", "name": "_altitude", "type": "int32"},
            {"internalType": "string", "name": "_terrainType", "type": "string"},
            {"internalType": "string", "name": "_decisionReason", "type": "string"},
            {"internalType": "bytes32", "name": "_sensorDataHash", "type": "bytes32"},
            {"internalType": "bytes32", "name": "_safetyProof", "type": "bytes32"}
        ],
        "name": "logEvent",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalGasSaved",
        "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
        "stateMutability": "view",
        "type": "function"
    }
]

# Constants
VEHICLE_ID = "ROVER-001"
TERRAINS = ["rocky", "mud", "sand", "gravel", "snow"]
EVENT_TYPES = {
    "IGNITION": 0,
    "TERRAIN_CHANGE": 1,
    "OBSTACLE_DETECT": 2,
    "DECISION_MADE": 3,
    "EMERGENCY_STOP": 4,
    "WAYPOINT_REACH": 5,
    "SENSOR_ALERT": 6,
    "SHUTDOWN": 7
}

class AutoChainSimulator:
    def __init__(self):
        # Setup Web3
        self.w3 = Web3(Web3.HTTPProvider(RPC_URL))
        self.account = self.w3.eth.account.from_key(PRIVATE_KEY)
        self.contract = self.w3.eth.contract(address=CONTRACT_ADDRESS, abi=ABI)
        
        # Setup DB
        try:
            self.client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
            self.client.server_info() # Trigger connection check
            self.db = self.client.autochain
            self.events_collection = self.db.telemetry_events
            self.db_connected = True
            print("INFO: [AutoChain] Connected to MongoDB Atlas")
        except Exception as e:
            self.db_connected = False
            print(f"WARN: [AutoChain] MongoDB connection failed (Optional): {e}")
        
        # Simulation State
        self.lat = 45.421529
        self.lon = -75.697193
        self.speed = 4500  # cm/s
        self.alt = 24000   # cm
        
        # Salt for ZK-Lite Safety Proofs (Private to Vehicle)
        self.salt = Web3.to_bytes(hexstr="0xdeadbeef12345678deadbeef12345678deadbeef12345678deadbeef12345678")
        
        print(f"START: [AutoChain] Started simulation for {VEHICLE_ID}")
        print(f"Connected to Ethereum: {self.w3.is_connected()}")
        print(f"Connected to MongoDB: {self.db_connected}")
        print("-" * 50)

    def generate_telemetry(self):
        """Generates realistic telemetry data based on previous state."""
        # Random drift for GPS
        self.lat += random.uniform(-0.0001, 0.0001)
        self.lon += random.uniform(-0.0001, 0.0001)
        
        # Vary speed
        self.speed = max(0, min(6000, self.speed + random.randint(-500, 500)))
        
        # Altitude drift
        self.alt += random.randint(-100, 100)
        
        terrain = random.choice(TERRAINS)
        
        # Decide event type
        event_roll = random.random()
        if event_roll < 0.02:
            event_type = "EMERGENCY_STOP"
            reason = "Critical sensor failure detected in LIDAR-B"
            self.speed = 0
        elif event_roll < 0.15:
            event_type = "OBSTACLE_DETECT"
            reason = f"Avoidance maneuver: obstacle at {random.randint(2, 15)}m"
            self.speed *= 0.3 # Slow down on obstacles
        elif event_roll < 0.30:
            event_type = "DECISION_MADE"
            reason = f"Rerouting for optimal traction on {terrain}"
        elif event_roll < 0.45:
            event_type = "TERRAIN_CHANGE"
            reason = f"Transitioning to {terrain} surface"
        elif event_roll < 0.60:
            event_type = "WAYPOINT_REACH"
            reason = f"Reached waypoint WP-{random.randint(100, 999)}"
        else:
            event_type = "DECISION_MADE"
            reason = "Maintaining cruising speed and path"

        payload = {
            "vehicleId": VEHICLE_ID,
            "vehicleAddress": self.account.address,
            "eventType": event_type,
            "latitude": round(self.lat, 6),
            "longitude": round(self.lon, 6),
            "speed_cms": int(self.speed),
            "altitude_cm": int(self.alt),
            "terrain": terrain,
            "reason": reason,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        return payload

    def send_to_blockchain(self, payload):
        """Hashes payload and sends to smart contract."""
        # Compute SHA-256 hash
        payload_json = json.dumps(payload, sort_keys=True)
        data_hash = hashlib.sha256(payload_json.encode()).hexdigest()
        
        # Compute ZK-Lite Safety Proof Hash
        # H(lat, lon, salt)
        lat_int = int(payload["latitude"] * 1e6)
        lon_int = int(payload["longitude"] * 1e6)
        
        safety_proof = Web3.solidity_keccak(
            ['int32', 'int32', 'bytes32'],
            [lat_int, lon_int, self.salt]
        )

        # Format for contract
        tx = self.contract.functions.logEvent(
            EVENT_TYPES[payload["eventType"]],
            lat_int,
            lon_int,
            payload["speed_cms"],
            payload["altitude_cm"],
            payload["terrain"],
            payload["reason"],
            bytes.fromhex(data_hash),
            safety_proof
        ).build_transaction({
            'from': self.account.address,
            'nonce': self.w3.eth.get_transaction_count(self.account.address),
            'gas': 1000000,
            'gasPrice': self.w3.eth.gas_price
        })

        # Retry logic
        for attempt in range(3):
            try:
                signed_tx = self.w3.eth.account.sign_transaction(tx, PRIVATE_KEY)
                tx_hash = self.w3.eth.send_raw_transaction(signed_tx.raw_transaction)
                return self.w3.to_hex(tx_hash), data_hash
            except Exception as e:
                print(f"WARN: Transaction failed (Attempt {attempt+1}): {e}")
                time.sleep(2)
        
        return None, data_hash

    def run(self):
        try:
            while True:
                payload = self.generate_telemetry()
                
                # Store full payload in MongoDB
                if self.db_connected:
                    try:
                        self.events_collection.insert_one(payload.copy())
                    except Exception as e:
                        print(f"⚠️ Failed to insert to MongoDB: {e}")
                
                # Send hash to blockchain
                tx_hash, data_hash = self.send_to_blockchain(payload)
                
                if tx_hash:
                    status = "OK: SENT"
                else:
                    status = "ERR: FAIL"
                    
                print(f"[{datetime.now().strftime('%H:%M:%S')}] {status} | Type: {payload['eventType']: <15} | Lat: {payload['latitude']: <10} | Hash: {data_hash[:10]}...")
                
                if payload['eventType'] == "EMERGENCY_STOP":
                    print("STOP: EMERGENCY STOP TRIGGERED. Simulator pausing for 10s.")
                    time.sleep(10)
                
                # Wait 3-5 seconds between events
                time.sleep(random.uniform(3, 5))
                
        except KeyboardInterrupt:
            print("\n👋 Simulation stopped by user.")

if __name__ == "__main__":
    sim = AutoChainSimulator()
    sim.run()
