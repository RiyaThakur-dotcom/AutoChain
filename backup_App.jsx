import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';

// AutoChain Dashboard Components & UI
// Using Tailwind CSS for deep navy dark mode

const ABI = [
  "event TelemetryLogged(uint256 indexed eventId, address indexed vehicleAddress, uint8 eventType, bytes32 sensorDataHash)",
  "event VehicleRegistered(address indexed vehicleAddress, string humanId)",
  "function registerVehicle(address _vehicleAddress, string memory _humanId) external",
  "function getEventsByVehicle(address _vehicle) external view returns (uint256[] memory)",
  "function getEvent(uint256 _eventId) external view returns (tuple(uint256 eventId, address vehicleAddress, uint8 eventType, int32 latitude, int32 longitude, uint32 speed, int32 altitude, string terrainType, string decisionReason, bytes32 sensorDataHash, uint256 timestamp))",
  "function vehicles(address) view returns (string humanReadableId, address owner, bool isRegistered, uint256 totalEvents)"
];

const CONTRACT_ADDRESS = "0x0000000000000000000000000000000000000000"; // REPLACE WITH DEPLOYED ADDR

const EVENT_TYPES = [
  "IGNITION", "TERRAIN_CHANGE", "OBSTACLE_DETECT", "DECISION_MADE", 
  "EMERGENCY_STOP", "WAYPOINT_REACH", "SENSOR_ALERT", "SHUTDOWN"
];

const App = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [events, setEvents] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [verifyId, setVerifyId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Connect Wallet
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const browserProvider = new ethers.BrowserProvider(window.ethereum);
        const signer = await browserProvider.getSigner();
        const autoChainContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
        
        setAccount(accounts[0]);
        setProvider(browserProvider);
        setContract(autoChainContract);
        fetchInitialData(autoChainContract);
      } catch (err) {
        console.error("Connection failed:", err);
      }
    } else {
      alert("Please install MetaMask!");
    }
  };

  const fetchInitialData = async (contractInstance) => {
    // Example: fetch some mock or initial data for UX
    // In production, we'd query past events or use an indexer (The Graph/subgraph)
    console.log("Fetching contract data...");
  };

  // Listen for Live Events
  useEffect(() => {
    if (contract) {
      const filter = contract.filters.TelemetryLogged();
      contract.on(filter, (eventId, vehicleAddress, eventType, sensorDataHash, log) => {
        const newEvent = {
          id: eventId.toString(),
          vehicle: vehicleAddress,
          type: EVENT_TYPES[Number(eventType)],
          hash: sensorDataHash,
          timestamp: new Date().toLocaleTimeString()
        };
        setEvents(prev => [newEvent, ...prev].slice(0, 50));
      });
      return () => contract.removeAllListeners();
    }
  }, [contract]);

  const verifyEventOnChain = async () => {
    if (!contract || !verifyId) return;
    setIsLoading(true);
    try {
      const eventData = await contract.getEvent(verifyId);
      setSelectedEvent({
        ...eventData,
        type: EVENT_TYPES[Number(eventData[2])],
        lat: Number(eventData[3]) / 1e6,
        lon: Number(eventData[4]) / 1e6,
        speed: Number(eventData[5]),
        alt: Number(eventData[6]),
        timestamp: new Date(Number(eventData[10]) * 1000).toLocaleString()
      });
    } catch (err) {
      alert("Event not found on-chain!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0c10] text-[#e0e6ed] font-sans selection:bg-[#00c8f0] selection:text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10 p-4 sticky top-0 bg-[#0a0c10]/80 backdrop-blur-md z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#00c8f0] to-[#a0f060] rounded-lg shadow-lg shadow-[#00c8f0]/20 animate-pulse"></div>
            <h1 className="text-xl font-bold tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50">AutoChain</h1>
          </div>
          
          <button 
            onClick={connectWallet}
            className={`px-6 py-2 rounded-full font-medium transition-all transform active:scale-95 ${account ? 'bg-[#a0f060]/10 border border-[#a0f060] text-[#a0f060]' : 'bg-[#00c8f0] text-[#0a0c10] hover:shadow-[0_0_20px_rgba(0,200,240,0.4)] hover:-translate-y-0.5'}`}
          >
            {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Hardware"}
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Panel - Verification */}
        <div className="lg:col-span-1 space-y-6">
          <section className="bg-white/5 p-6 rounded-3xl border border-white/10 shadow-2xl">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#a0f060] mb-4">Validate Data</h2>
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Event ID (e.g. 142)"
                value={verifyId}
                onChange={(e) => setVerifyId(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-[#00c8f0] transition-colors"
                onKeyDown={(e) => e.key === 'Enter' && verifyEventOnChain()}
              />
              <button 
                onClick={verifyEventOnChain}
                className="w-full bg-white/5 border border-white/20 py-3 rounded-xl hover:bg-white/10 transition-all font-medium flex justify-center items-center gap-2"
              >
                {isLoading ? <Spinner /> : "Verify Receipt"}
              </button>
            </div>
          </section>

          <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[#00c8f0] mb-4 text-center">System Integrity</h2>
            <div className="flex flex-col items-center gap-4">
               <div className="relative w-32 h-32 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-[#a0f060]/20 rounded-full"></div>
                  <div className="absolute inset-0 border-4 border-[#a0f060] rounded-full border-t-transparent animate-spin-slow"></div>
                  <span className="text-2xl font-bold">99.8%</span>
               </div>
               <p className="text-xs text-center text-white/40">Real-time hash validation across Sepolia nodes</p>
            </div>
          </section>
        </div>

        {/* Middle - Real-time Feed */}
        <div className="lg:col-span-3 space-y-6">
          <section className="bg-white/5 p-8 rounded-[2rem] border border-white/10 shadow-inner relative overflow-hidden min-h-[600px]">
            <div className="flex justify-between items-center mb-8 relative z-10">
              <div>
                <h2 className="text-3xl font-bold">Telemetry Stream</h2>
                <p className="text-white/40 text-sm mt-1">Live encrypted logs from active off-road assets</p>
              </div>
              <div className="flex gap-2">
                 <span className="bg-red-500/10 text-red-400 border border-red-500/20 px-3 py-1 rounded-full text-xs font-mono">LIVE</span>
                 <span className="bg-[#a0f060]/10 text-[#a0f060] border border-[#a0f060]/20 px-3 py-1 rounded-full text-xs font-mono">SEPOLIA</span>
              </div>
            </div>

            {/* Event List */}
            <div className="space-y-4">
              {events.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-white/20 border-2 border-dashed border-white/5 rounded-3xl">
                  <p>No telemetry detected. Check vehicle connection...</p>
                </div>
              ) : (
                events.map((e, idx) => (
                  <div 
                    key={idx} 
                    className="group bg-[#0f1218] hover:bg-white/5 p-4 rounded-2xl border border-white/5 transition-all cursor-pointer flex items-center justify-between"
                    onClick={() => setVerifyId(e.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-10 rounded-full ${getTypeColor(e.type)}`}></div>
                      <div>
                        <div className="font-mono text-[#00c8f0] text-xs">ID #{e.id}</div>
                        <div className="font-bold">{e.type}</div>
                      </div>
                    </div>
                    <div className="text-right">
                       <div className="text-xs text-white/40 font-mono">{e.hash.slice(0, 16)}...</div>
                       <div className="text-[10px] uppercase text-[#a0f060] font-bold">{e.timestamp}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Detail Modal Overlay */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] p-6 flex items-center justify-center overflow-auto" onClick={() => setSelectedEvent(null)}>
           <div className="max-w-xl w-full bg-[#0f1218] border border-white/20 rounded-[3rem] p-10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative" onClick={e => e.stopPropagation()}>
              <button 
                className="absolute top-8 right-8 text-white/20 hover:text-white transition-colors"
                onClick={() => setSelectedEvent(null)}
              >
                ✕
              </button>
              
              <div className="mb-8">
                <span className={`px-4 py-1 rounded-full text-xs font-bold border ${getTypeColor(selectedEvent.type, true)}`}>
                  {selectedEvent.type}
                </span>
                <h3 className="text-4xl font-bold mt-4">Event Detail</h3>
                <p className="text-[#a0f060] font-mono text-sm mt-1">On-Chain Verified Record</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                 <Stat label="LAT/LON" value={`${selectedEvent.lat.toFixed(4)}, ${selectedEvent.lon.toFixed(4)}`} />
                 <Stat label="SPEED" value={`${selectedEvent.speed} cm/s`} />
                 <Stat label="ALTITUDE" value={`${selectedEvent.alt} cm`} />
                 <Stat label="TIMESTAMP" value={selectedEvent.timestamp} />
              </div>

              <div className="bg-black/40 p-6 rounded-3xl border border-white/5 mb-8">
                <div className="text-xs uppercase text-white/30 font-bold mb-2">Decision Logic / Reason</div>
                <p className="text-lg italic text-[#00c8f0]">"{selectedEvent.decisionReason}"</p>
              </div>

              <div className="space-y-4">
                <div>
                   <div className="text-[10px] uppercase text-white/30 font-bold">Terrain Analysis</div>
                   <div className="text-white/80">{selectedEvent.terrainType}</div>
                </div>
                <div>
                   <div className="text-[10px] uppercase text-white/30 font-bold">Secure Content Hash (SHA-256)</div>
                   <div className="text-xs font-mono break-all text-white/50">{selectedEvent.sensorDataHash}</div>
                </div>
              </div>

              <button 
                onClick={() => setSelectedEvent(null)}
                className="w-full mt-10 py-4 bg-white text-black font-bold rounded-2xl hover:scale-95 transition-transform"
              >
                Close Receipt
              </button>
           </div>
        </div>
      )}

      {/* Glow Effects */}
      <div className="fixed -bottom-48 -left-48 w-96 h-96 bg-[#00c8f0]/10 blur-[150px] pointer-events-none rounded-full"></div>
      <div className="fixed -top-48 -right-48 w-96 h-96 bg-[#a0f060]/10 blur-[150px] pointer-events-none rounded-full"></div>
    </div>
  );
};

// Helper Components
const Stat = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase text-white/30 font-bold mb-1 tracking-widest">{label}</div>
    <div className="text-xl font-bold">{value}</div>
  </div>
);

const Spinner = () => (
  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
);

const getTypeColor = (type, isBorder = false) => {
  if (type === "EMERGENCY_STOP") return isBorder ? "border-red-500/50 bg-red-500/10 text-red-400" : "bg-red-500";
  if (type === "OBSTACLE_DETECT") return isBorder ? "border-orange-500/50 bg-orange-500/10 text-orange-400" : "bg-orange-500";
  if (type === "WAYPOINT_REACH") return isBorder ? "border-[#a0f060]/50 bg-[#a0f060]/10 text-[#a0f060]" : "bg-[#a0f060]";
  return isBorder ? "border-[#00c8f0]/50 bg-[#00c8f0]/10 text-[#00c8f0]" : "bg-[#00c8f0]";
};

export default App;
