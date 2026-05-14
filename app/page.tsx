"use client";

import { useState } from "react";
import { 
  Scale, LayoutDashboard, MessageSquare, Terminal, ShieldCheck, 
  X, Menu, Zap, Brain, Target, Lock, FileText, Quote
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import DocumentProcessor from "@/components/DocumentProcessor";
import DraftEditor from "@/components/DraftEditor";
import ChatInterface from "@/components/ChatInterface";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("workspace");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white font-sans selection:bg-white/20">
      {/* Sidebar Navigation */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="w-80 border-r border-white/5 bg-black flex flex-col shrink-0 z-50 shadow-[20px_0_50px_rgba(0,0,0,0.5)]"
          >
            <div className="p-10 flex flex-col h-full">
              <div className="mb-16 flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.1)]">
                  <Scale className="text-black" size={28} />
                </div>
                <div className="flex flex-col">
                  <span className="text-2xl font-black tracking-tighter leading-none">PSL.AI</span>
                </div>
              </div>

              <nav className="flex-1 space-y-2">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6 ml-4 text-center lg:text-left">Command Center</p>
                <SidebarItem 
                  icon={<LayoutDashboard size={20} />} 
                  label="Workspace" 
                  active={activeTab === "workspace"} 
                  onClick={() => setActiveTab("workspace")}
                />
                <SidebarItem 
                  icon={<MessageSquare size={20} />} 
                  label="Intelligence" 
                  active={activeTab === "chat"} 
                  onClick={() => setActiveTab("chat")}
                />
                
                <div className="pt-12">
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em] mb-6 ml-4 text-center lg:text-left">System Health</p>
                  <SidebarItem 
                     icon={<Terminal size={20} />} 
                     label="Logs" 
                     active={activeTab === "logs"}
                     onClick={() => setActiveTab("logs")} 
                  />
                  <SidebarItem 
                     icon={<ShieldCheck size={20} />} 
                     label="Security" 
                     active={activeTab === "security"}
                     onClick={() => setActiveTab("security")} 
                  />
                </div>
              </nav>

              <div className="mt-auto">
                 <div className="p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden">
                   <div className="flex items-center gap-4">
                     <div className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center group-hover:scale-105 transition-transform shrink-0 shadow-lg">
                       <Zap size={24} />
                     </div>
                     <div className="flex flex-col">
                       <span className="text-sm font-black text-white">Polok Poddar</span>
                       <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider italic">AI Engineer</span>
                     </div>
                   </div>
                   <div className="h-px w-full bg-white/10 my-4" />
                   <a 
                     href="https://iamproloy.vercel.app/" 
                     target="_blank" 
                     className="block w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center hover:bg-slate-200 transition-colors"
                   >
                     View Portfolio
                   </a>
                 </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Control Interface */}
      <div className="flex-1 flex flex-col relative h-full overflow-hidden">
        {/* Cinematic Backdrop */}
        <div className="absolute inset-0 -z-20">
          <img src="/bg.png" className="w-full h-full object-cover opacity-10 grayscale" alt="" />
          <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/95 to-transparent" />
        </div>

        <header className="px-12 py-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-3xl z-40">
           <div className="flex items-center gap-6">
             <button 
               onClick={() => setIsSidebarOpen(!isSidebarOpen)}
               className="h-12 w-12 flex items-center justify-center hover:bg-white/5 rounded-2xl border border-white/5 transition-all active:scale-95"
             >
               {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
             </button>
             <div className="h-8 w-px bg-white/10" />
             <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Operations</span>
                <span className="text-xs font-bold flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]" /> POLOK PODDAR
                </span>
             </div>
           </div>

           <div className="flex items-center gap-8">
              <span className="text-[10px] font-black text-slate-700 tracking-[0.6em] hidden xl:block uppercase">Internal Workspace v4.0</span>
              <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                <ShieldCheck size={16} className="text-slate-500" />
              </div>
           </div>
        </header>

        <main className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth bg-black/20">
          <div className="max-w-7xl mx-auto p-12 lg:p-24 min-h-full">
            <AnimatePresence mode="wait">
              {activeTab === "workspace" && (
                <motion.div 
                  key="workspace"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  className="space-y-40"
                >
                  {/* Hero Intro */}
                  <div className="relative space-y-12">
                    <div className="flex items-center gap-4">
                      <div className="h-1 bg-white/20 w-12 rounded-full" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.5em]">System Ready</span>
                    </div>
                    <h1 className="text-7xl lg:text-[10rem] font-black tracking-tighter uppercase leading-[0.75] italic">
                      Legal <br /> <span className="text-white/10">Lab</span>
                    </h1>
                    <p className="text-slate-500 text-xl lg:text-2xl max-w-2xl font-medium leading-relaxed italic border-l-2 border-white/5 pl-8 ml-2">
                      Precision document ingestion, grounded context retrieval, and style-adaptive draft synthesis.
                    </p>
                  </div>

                  {/* Operational Modules */}
                  <div className="grid grid-cols-1 gap-40">
                    <section className="space-y-16">
                       <ModuleHeading num="01" title="Inbound Processing" />
                       <div className="relative group">
                         <div className="absolute -inset-1 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                         <div className="relative bg-black/40 border border-white/5 rounded-[60px] p-12 lg:p-24 backdrop-blur-sm shadow-2xl">
                           <DocumentProcessor />
                         </div>
                       </div>
                    </section>

                    <section className="space-y-16 pb-40">
                       <ModuleHeading num="02" title="Grounded Synthesis" />
                       <div className="relative group">
                         <div className="absolute -inset-1 bg-white/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                         <div className="relative bg-black/40 border border-white/5 rounded-[60px] p-12 lg:p-24 backdrop-blur-sm shadow-2xl">
                           <DraftEditor />
                         </div>
                       </div>
                    </section>
                  </div>
                </motion.div>
              )}

              {activeTab === "chat" && (
                <motion.div 
                  key="chat"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-20 h-full flex flex-col"
                >
                  <div className="flex items-end justify-between border-b border-white/5 pb-16">
                     <div className="space-y-4">
                       <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.6em]">System Channel</span>
                       <h1 className="text-7xl font-black uppercase tracking-tighter leading-none italic">Intelligence</h1>
                     </div>
                     <div className="h-24 w-24 rounded-[40px] bg-white text-black flex items-center justify-center shadow-[0_0_50px_rgba(255,255,255,0.1)]">
                       <Brain size={40} />
                     </div>
                  </div>
                  <div className="flex-1 min-h-[600px]">
                    <ChatInterface />
                  </div>
                </motion.div>
              )}

              {activeTab === "logs" && (
                <motion.div key="logs" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-16">
                  <h1 className="text-6xl font-black uppercase tracking-tighter italic">Process Logs</h1>
                  <div className="bg-white/[0.01] border border-white/5 rounded-[40px] p-12 font-mono text-[11px] text-slate-500 space-y-6 h-[700px] overflow-y-auto">
                     <LogItem time="21:05:01" type="SYSTEM" msg="Kernel re-aligned for submission v4.0" />
                     <LogItem time="21:05:12" type="OCR" msg="Handwriting module initialized. Calibration 100%" />
                     <LogItem time="21:05:25" type="AUTH" msg="Session verified: POLOK PODDAR" />
                     <LogLine time="21:05:45" type="INFO" msg="Grounded retrieval engine online." />
                  </div>
                </motion.div>
              )}

              {activeTab === "security" && (
                <motion.div key="security" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-20 text-center py-20">
                  <Lock size={80} className="mx-auto text-white/10" />
                  <h1 className="text-7xl font-black uppercase tracking-tighter italic">Security Shield</h1>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
                    <ProtocolCard title="AES-256" desc="Encryption layer active" />
                    <ProtocolCard title="Privacy" desc="Zero-retention buffers" />
                    <ProtocolCard title="Grounding" status="Strict Verification" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-6 px-8 py-5 rounded-2xl transition-all group ${
        active 
          ? "bg-white text-black font-black shadow-2xl" 
          : "text-slate-500 hover:text-white hover:bg-white/5"
      }`}
    >
      <div className="shrink-0 transition-transform group-hover:scale-110">{icon}</div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function ModuleHeading({ num, title }: { num: string, title: string }) {
  return (
    <div className="flex items-center gap-10">
      <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-700 font-black text-xl italic">{num}</div>
      <div className="h-px flex-1 bg-white/10" />
      <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.6em]">{title}</span>
    </div>
  );
}

function LogItem({ time, type, msg }: { time: string, type: string, msg: string }) {
  return (
    <div className="flex gap-8 border-b border-white/5 pb-4 last:border-0">
      <span className="text-slate-700">[{time}]</span>
      <span className="w-20 font-black text-white">{type}</span>
      <span className="text-slate-400">{msg}</span>
    </div>
  );
}

function LogLine({ time, type, msg }: { time: string, type: string, msg: string }) {
  return (
    <div className="flex gap-8">
      <span className="text-slate-700">[{time}]</span>
      <span className="w-20 font-black text-white">{type}</span>
      <span className="text-slate-400">{msg}</span>
    </div>
  );
}

function ProtocolCard({ title, desc, status }: { title: string, desc?: string, status?: string }) {
  return (
    <div className="p-12 rounded-[40px] bg-white/[0.02] border border-white/5 space-y-4">
      <h3 className="text-2xl font-black uppercase italic tracking-tighter">{title}</h3>
      <p className="text-slate-500 font-medium">{desc || status}</p>
    </div>
  );
}
