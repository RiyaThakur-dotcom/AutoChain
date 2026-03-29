# AutoChain: Decentralized Off-Road Autonomous Telemetry
## Hackathon Demo Script (3 Minutes)

**[Scene: Presenter stands confident, dark dashboard active behind them on the screen]**

### 1. Hook (0:00 - 0:15)
"Imagine a search-and-rescue rover loses control on a snowy ridge in the Himalayas. It makes a split-second decision that ends in a critical collision. When the dust settles, the core question remains: *Why?* Who was at fault? The AI? The sensor? Or was it external interference?"

### 2. Problem (0:15 - 0:45)
"Current off-road autonomous systems operate in a 'black box.' They make high-stakes decisions across unpredictable terrains with zero public auditability or tamper-proof accountability. If data is stored only on the vehicle's local disk, it's vulnerable to corruption, loss, or intentional tempering after an incident. In high-risk sectors like defense, mining, and autonomous logistics, this lack of trust is the primary barrier to mass adoption."

### 3. Solution (0:45 - 1:15)
"Welcome to **AutoChain**. We've built a decentralized trust layer for autonomous assets. By leveraging the Ethereum Sepolia testnet, AutoChain logs every critical vehicle decision, terrain transition, and sensor alert in real-time. We use a gas-optimized architecture: full, heavy sensor payloads are hashed and stored off-chain in MongoDB, while the immutable cryptographic fingerprint and key telemetry metadata are anchored permanently on-chain."

### 4. Demo Walkthrough (1:15 - 2:15)
"**[Show Dashboard]** 
On screen, you see our live mission dashboard. 
**[Click 'Connect Hardware' Button]** 
We connect the vehicle's wallet—this 'ROVER-001' identity is its cryptographic fingerprint.

**[Points to the Telemetry Stream]** 
As our Python-driven simulator navigates a rocky course, you see the live feed updates. Each block represents a 'TelemetryLogged' event emitted directly from the smart contract. 

**[Click a 'TERRAIN_CHANGE' event]** 
Look at this event. The vehicle detected a transition from gravel to mud. It lowered its speed to 1200 cm/s to maintain traction. 

**[Click 'Verify Receipt' on an older event]** 
The power of AutoChain is verification. I can take any Event ID, query the blockchain, and prove that at precisely 4:15 PM, this vehicle was at these GPS coordinates with this exact sensor hash. It's tamper-proof evidence for insurance, regulators, and developers."

### 5. Tech Stack (2:15 - 2:35)
"Our stack is built for production:
- **Solidity ^0.8.20** for the core logic and access control.
- **Python + Web3.py** for the hardware-level telemetry simulation.
- **Ethers.js v6 + React** for our high-fidelity operator dashboard.
- **MongoDB Atlas** for scalable off-chain data storage."

### 6. Impact & Future (2:35 - 2:55)
"AutoChain isn't just a log; it's an infrastructure for the future of robotic insurance. By proving safety records on-chain, fleet operators can lower premiums. Moving forward, we're looking at ZK-proofs to keep mission-critical decisions private while still proving they followed safety protocols."

### 7. Close (2:55 - 3:00)
"AutoChain: Because autonomous vehicles should be as accountable as they are capable. Thank you."

**[Final Pose / Q&A Transition]**
