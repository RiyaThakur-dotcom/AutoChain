import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

// AutoChain - Premium Landing Page (v1.0)
const App = () => {
  const [account, setAccount] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        setIsModalOpen(false);
      } catch (err) { console.error(err); }
    } else { alert("Please install MetaMask!"); }
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 px-6 md:px-20 py-5 flex items-center justify-between ${isScrolled ? 'bg-primary-dark/80 backdrop-blur-md border-b border-white/5 py-3' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 cursor-pointer group">
           <div className="w-10 h-10 bg-gradient-to-tr from-neon-purple to-neon-blue rounded-xl flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(0,210,255,0.4)] transition-transform group-hover:rotate-12">
              <span className="text-white font-black text-xs">AC</span>
           </div>
           <span className="text-xl font-bold tracking-tighter text-white">AutoChain</span>
        </div>
        
        <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-white/70">
           <a href="#features" className="hover:text-neon-blue transition-colors uppercase tracking-widest text-[11px]">Features</a>
           <a href="#how-it-works" className="hover:text-neon-blue transition-colors uppercase tracking-widest text-[11px]">How it works</a>
           <a href="#security" className="hover:text-neon-blue transition-colors uppercase tracking-widest text-[11px]">Security</a>
        </div>

        <button onClick={() => account ? null : setIsModalOpen(true)} className="btn-premium btn-gradient text-xs">
           {account ? `${account.slice(0,6)}...${account.slice(-4)}` : "Connect Wallet"}
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 md:px-20 overflow-hidden">
         <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-neon-blue/10 blur-[150px] -z-10 animate-pulse"></div>
         
         <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
               AUTOMATE YOUR <br /> 
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-purple to-neon-blue neon-text-glow">BLOCKCHAIN FUTURE</span> <br /> 
               WITH AUTOCHAIN
            </h1>
            <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl font-medium">
               Smart AI-powered automation for decentralized workflows. 
               Experience speed, trust, and ultimate simplicity in the Web3 space.
            </p>
            
            <div className="flex flex-col md:flex-row gap-6">
               <button className="btn-premium btn-gradient">Get Started</button>
               <button onClick={() => setIsModalOpen(true)} className="btn-premium border border-white/20 hover:bg-white/5">Connect Wallet</button>
            </div>

            {/* Hero Illustration */}
            <div className="mt-24 relative w-full h-[300px] md:h-[500px] flex items-center justify-center">
               <div className="absolute w-[300px] h-[300px] md:w-[500px] md:h-[500px] border border-neon-blue/10 rounded-full animate-spin duration-[20s]"></div>
               <div className="absolute w-[200px] h-[200px] md:w-[350px] md:h-[350px] border border-neon-purple/20 rounded-full animate-spin duration-[15s] direction-reverse"></div>
               <div className="animate-float z-10 w-24 h-24 md:w-40 md:h-40 glass-card flex items-center justify-center p-8 shadow-[0_0_40px_rgba(0,210,255,0.2)]">
                  <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-neon-purple to-neon-blue">AI</span>
               </div>
            </div>
         </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 md:px-20">
         <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 uppercase tracking-tighter">Premium Intelligence</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-neon-purple to-neon-blue mx-auto rounded-full"></div>
         </div>
         
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard title="Smart Contract" desc="Fully automated execution of complex smart contracts via AI logic." icon={<ContractIcon />} />
            <FeatureCard title="AI Optimization" desc="Minimal gas usage via real-time transaction re-ordering." icon={<BrainIcon />} />
            <FeatureCard title="Multi-Chain" desc="Seamlessly bridging assets across 50+ EVM & Non-EVM chains." icon={<ChainIcon />} />
            <FeatureCard title="Secure Vault" desc="Military-grade encryption for all on-chain telemetry." icon={<ShieldIcon />} />
         </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-32 bg-white/2 border-y border-white/5 relative">
         <div className="timeline-line"></div>
         
         <div className="text-center mb-20">
            <h2 className="text-3xl font-bold uppercase tracking-widest text-neon-blue text-sm mb-4">The Process</h2>
            <h3 className="text-4xl font-black uppercase tracking-tighter">How AutoChain Executes</h3>
         </div>

         <div className="max-w-6xl mx-auto space-y-24 md:space-y-40 px-6">
            <StepItem step="01" title="Connect Wallet" desc="Initiate secure connection via MetaMask or WalletConnect." align="left" />
            <StepItem step="02" title="Define Rules" desc="Set AI-powered parameters for your automation logic." align="right" />
            <StepItem step="03" title="Let AI Execute" desc="Sit back as AutoChain manages your blockchain future." align="left" />
         </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-32 px-6 md:px-20 overflow-hidden">
         <div className="max-w-7xl mx-auto glass-card p-4 md:p-12 relative shadow-[0_0_100px_rgba(3,210,255,0.1)]">
            <div className="flex justify-between items-center mb-10 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                   <div className="w-3 h-3 rounded-full bg-red-500"></div>
                   <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                   <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-[10px] font-bold text-white/30 tracking-[0.3em] uppercase">AutoChain Control Panel v2.4</div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
               <div className="space-y-6">
                  <div className="h-40 bg-white/5 rounded-2xl p-6 border border-white/5">
                     <div className="text-xs font-bold text-white/40 mb-2 uppercase tracking-widest">Active Yield</div>
                     <div className="text-4xl font-black text-neon-blue">$14,204.02</div>
                     <div className="mt-4 flex gap-2">
                        {[1,2,3,4,5,6,7].map(i => <div key={i} className="flex-1 h-3 bg-neon-blue/20 rounded-sm"></div>)}
                     </div>
                  </div>
                  <div className="flex-1 p-6 border border-white/5 rounded-2xl bg-white/2">
                     <div className="text-xs font-bold text-white/40 mb-6 uppercase tracking-widest">Live Logs</div>
                     <div className="space-y-4">
                        <div className="flex justify-between text-[10px] mono"><span className="text-neon-blue">TX_AUTH</span><span>0xA4...E2</span></div>
                        <div className="flex justify-between text-[10px] mono"><span className="text-neon-purple">YIELD_OPT</span><span>SUCC</span></div>
                     </div>
                  </div>
               </div>
               
               <div className="lg:col-span-2 p-10 bg-white/2 border border-white/5 rounded-3xl flex items-center justify-center">
                   <div className="w-full h-full flex flex-col justify-end gap-2">
                      <div className="flex items-end gap-1 h-full">
                         {[40, 60, 45, 90, 65, 80, 50, 70, 40, 60, 95].map((h, i) => (
                           <div key={i} className="flex-1 bg-gradient-to-t from-neon-blue/10 to-neon-blue/40 rounded-t-md hover:to-neon-blue transition-all duration-300" style={{ height: `${h}%` }}></div>
                         ))}
                      </div>
                      <div className="text-center pt-4 text-[9px] font-bold text-white/20 uppercase tracking-[0.5em]">Real-time optimization matrix</div>
                   </div>
               </div>
            </div>
         </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-32 px-6 md:px-20 text-center relative overflow-hidden">
         <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-neon-purple/5 blur-[100px] -z-10"></div>
         
         <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight uppercase tracking-tighter">Built with Security First Approach</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
               <SecurityItem title="AES-256" desc="Military grade encryption layer." />
               <div className="h-px md:h-20 w-40 md:w-px bg-white/10 mx-auto"></div>
               <SecurityItem title="Decentralized" desc="Zero point of failure architecture." />
               <div className="h-px md:h-20 w-40 md:w-px bg-white/10 mx-auto"></div>
               <SecurityItem title="100% On-Chain" desc="Transparent proofs of every action." />
            </div>
         </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 px-6 md:px-20">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialCard user="Alex V." role="Protocol Lead" text="AutoChain changed how we manage yield strategies. Pure excellence." />
            <TestimonialCard user="Satoshi D." role="Hedge Fund Manager" text="Security is top-notch. I trust it with our primary treasury operations." />
            <TestimonialCard user="Elena R." role="Web3 Dev" text="The AI optimization logic is a masterpiece. Highly recommended." />
         </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 md:px-20 bg-black/50 border-t border-white/5 mt-auto">
         <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto">
            <div className="space-y-6">
               <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-neon-blue rounded-lg flex items-center justify-center font-black text-xs text-black">AC</div>
                  <span className="text-xl font-bold tracking-tighter">AutoChain</span>
               </div>
               <p className="text-sm text-white/30 leading-relaxed font-medium">Empowering the decentralized future through AI automation and trustless data.</p>
            </div>
            
            <FooterLinks title="Product" links={['Docs', 'GitHub', 'Api Reference']} />
            <FooterLinks title="Legal" links={['Privacy', 'Terms', 'Cookie Policy']} />
            <FooterLinks title="Community" links={['Twitter', 'Discord', 'Telegram']} />
         </div>
         <div className="mt-20 pt-10 border-t border-white/5 text-center text-[10px] font-bold text-white/20 uppercase tracking-[0.4em]">© 2026 AutoChain Labs. All rights reserved.</div>
      </footer>

      {/* Wallet Connect Modal UI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-0">
           <div className="absolute inset-0 bg-primary-dark/80 backdrop-blur-xl" onClick={() => setIsModalOpen(false)}></div>
           <div className="glass-card w-full max-w-md p-10 z-10 border-white/10 relative shadow-2xl animate-in fade-in zoom-in duration-300">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-white/30 hover:text-white transition-colors">
                 <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M6 18L18 6M6 6l12 12" strokeWidth="2" /></svg>
              </button>
              
              <h3 className="text-3xl font-black mb-1 leading-tight uppercase tracking-tighter">Connect Wallet</h3>
              <p className="text-sm text-white/40 mb-10 font-bold uppercase tracking-widest">Choose your entry node</p>
              
              <div className="space-y-4">
                 <WalletBar name="MetaMask" icon="🦊" onClick={connectWallet} />
                 <WalletBar name="WalletConnect" icon="🌐" onClick={() => {}} />
                 <WalletBar name="Coinbase" icon="🛡️" onClick={() => {}} />
              </div>

              <div className="mt-10 text-center text-[8px] font-bold text-white/20 uppercase tracking-[0.3em]">
                 By connecting, you agree to the decentralized protocol policies.
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

// Sub-components
const FeatureCard = ({ title, desc, icon }) => (
  <div className="glass-card p-10 hover:border-neon-blue/50 transition-all duration-500 group flex flex-col items-center text-center">
     <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-neon-blue mb-8 group-hover:scale-110 transition-transform">
        {icon}
     </div>
     <h4 className="text-xl font-bold mb-4 tracking-tight">{title}</h4>
     <p className="text-sm text-white/40 leading-relaxed font-medium">{desc}</p>
  </div>
);

const StepItem = ({ step, title, desc, align }) => (
  <div className={`flex flex-col md:flex-row items-center gap-10 md:gap-20 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}>
     <div className={`md:flex-1 text-center ${align === 'right' ? 'md:text-left' : 'md:text-right'}`}>
        <div className="text-sm font-bold text-neon-blue uppercase tracking-widest mb-2 opacity-50">Step {step}</div>
        <h4 className="text-4xl font-extrabold mb-6 tracking-tighter uppercase">{title}</h4>
        <p className="text-lg text-white/40 leading-relaxed font-medium">{desc}</p>
     </div>
     <div className="w-20 h-20 md:w-32 md:h-32 rounded-full glass-card border-none bg-gradient-to-tr from-neon-purple to-neon-blue p-px z-10">
        <div className="w-full h-full bg-primary-dark rounded-full flex items-center justify-center text-3xl font-black">{step}</div>
     </div>
     <div className="md:flex-1"></div>
  </div>
);

const SecurityItem = ({ title, desc }) => (
  <div className="p-8">
     <div className="text-2xl font-black text-neon-blue mb-2 uppercase italic">{title}</div>
     <div className="text-xs font-bold text-white/30 uppercase tracking-widest">{desc}</div>
  </div>
);

const TestimonialCard = ({ user, role, text }) => (
  <div className="glass-card p-10 flex flex-col gap-6">
     <div className="text-lg font-medium leading-relaxed italic text-white/80">"{text}"</div>
     <div className="flex items-center gap-4 mt-auto">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-neon-purple/20 to-neon-blue/20 border border-white/10"></div>
        <div>
           <div className="text-sm font-bold uppercase tracking-widest text-neon-blue">{user}</div>
           <div className="text-[10px] uppercase font-bold text-white/20">{role}</div>
        </div>
     </div>
  </div>
);

const WalletBar = ({ name, icon, onClick }) => (
  <button onClick={onClick} className="w-full flex items-center justify-between p-5 bg-white/5 border border-white/5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group">
     <div className="flex items-center gap-4">
        <span className="text-2xl group-hover:scale-110 transition-transform">{icon}</span>
        <span className="font-bold text-sm tracking-tight">{name}</span>
     </div>
     <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <svg className="w-4 h-4 text-neon-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M5 12h14m-7-7l7 7-7 7" strokeWidth="2.5" /></svg>
     </div>
  </button>
);

const FooterLinks = ({ title, links }) => (
  <div className="flex flex-col gap-6">
     <h4 className="text-[11px] font-black text-white uppercase tracking-[0.4em] mb-2">{title}</h4>
     <div className="flex flex-col gap-3">
        {links.map(l => <a key={l} href="#" className="text-sm text-white/30 hover:text-neon-blue transition-colors font-semibold">{l}</a>)}
     </div>
  </div>
);

// Icons
const ContractIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeWidth="1.5" /></svg>;
const BrainIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" strokeWidth="1.5" /></svg>;
const ChainIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" strokeWidth="1.5" /></svg>;
const ShieldIcon = () => <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" strokeWidth="1.5" /></svg>;

export default App;
