import React from 'react';

const Thumbnail = () => {
  return (
    <div className="w-[1280px] h-[720px] bg-[#050510] flex items-center justify-center relative overflow-hidden font-sans border-[20px] border-white/5">
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-[800px] h-[800px] bg-[#9d50bb]/10 blur-[150px] -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-[#00d2ff]/10 blur-[150px] translate-x-1/2 translate-y-1/2"></div>
      
      {/* Decorative Grid */}
      <div className="absolute inset-0 opacity-10" style={{backgroundImage: 'radial-gradient(#ffffff 0.5px, transparent 0.5px)', backgroundSize: '30px 30px'}}></div>

      {/* Main Content Card */}
      <div className="z-10 text-center flex flex-col items-center">
         
         <div className="mb-12 flex items-center gap-6 animate-pulse">
            <div className="w-24 h-24 bg-gradient-to-tr from-[#9d50bb] to-[#00d2ff] rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(0,210,255,0.4)] p-4">
               <span className="text-white font-black text-3xl">AC</span>
            </div>
            <div className="h-20 w-1 bg-white/10 rounded-full"></div>
            <div className="text-left">
               <div className="text-[14px] font-black text-[#00d2ff] uppercase tracking-[0.5em] mb-1">Web3 Protocol</div>
               <div className="text-[14px] font-black text-white/40 uppercase tracking-[0.5em]">Audit Node 2026</div>
            </div>
         </div>

         <h1 className="text-[110px] font-black leading-[0.85] tracking-tighter text-white mb-10 select-none">
            AUTOCHAIN <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#9d50bb] to-[#00d2ff] uppercase italic tracking-[-0.05em]">PROJECT RED</span>
         </h1>

         <p className="text-2xl text-white/50 max-w-2xl font-semibold leading-relaxed mb-16 tracking-tight">
            Decentralized Vehicle Telemetry. <br /> 
            Immutable Logs. Verified by Ethereum.
         </p>

         <div className="flex gap-10">
            <Badge label="100% ON-CHAIN" color="#00d2ff" />
            <Badge label="AI AUDITED" color="#9d50bb" />
            <Badge label="TAMPER-PROOF" color="#F6851B" />
         </div>

      </div>

      {/* Side Accents */}
      <div className="absolute bottom-10 left-10 text-[10px] mono text-white/20 uppercase tracking-widest font-black">SYSTEM.CORE.v4.0 // PRODUCTION.BUILD</div>
      <div className="absolute top-10 right-10 flex gap-2">
         {[1,2,3].map(i => <div key={i} className="w-2 h-2 rounded-full bg-[#00d2ff]/30"></div>)}
      </div>

    </div>
  );
};

const Badge = ({ label, color }) => (
  <div className="px-8 py-3 rounded-2xl border border-white/10 flex items-center gap-4 bg-white/2 backdrop-blur-md">
     <div className="w-3 h-3 rounded-full shadow-[0_0_15px_currentColor]" style={{backgroundColor: color, color: color}}></div>
     <span className="text-sm font-black text-white tracking-[0.2em] uppercase">{label}</span>
  </div>
);

export default Thumbnail;
