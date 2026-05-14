"use client";

import { useState } from "react";
import {
  FileUp, Search, History, Settings, Brain, ChevronRight, User,
  ShieldCheck, Scale, LayoutDashboard, FileCheck, Target, Zap,
  Menu, X, ExternalLink, Award, Code2, BookOpen, MessageSquare,
  Activity, Lock, Terminal
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import DocumentProcessor from "@/components/DocumentProcessor";
import DraftEditor from "@/components/DraftEditor";
import ChatInterface from "@/components/ChatInterface";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("workspace");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden bg-black text-white font-sans selection:bg-white/20">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed inset-y-0 left-0 z-50 w-80 border-r border-white/5 bg-black p-10 flex flex-col shrink-0"
          >
            <div className="mb-16 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                <Scale className="text-black" size={28} />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black tracking-tighter leading-none">PSL.AI</span>
              </div>
            </div>

            <nav className="flex-1 space-y-2">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-6 ml-4">Terminal</p>
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
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em] mb-6 ml-4">System Data</p>
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
              <a
                href="https://iamproloy.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col gap-4 p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/20 transition-all group overflow-hidden relative"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white text-black flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                    <User size={24} />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-white">Polok Poddar</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">AI Engineer</span>
                  </div>
                </div>
                <div className="w-full py-2.5 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-center">
                  View Portfolio
                </div>
              </a>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 overflow-y-auto relative transition-all duration-300 ${isSidebarOpen ? "md:ml-80" : "ml-0"}`}>
        {/* Visual Background */}
        <div className="absolute inset-0 -z-20">
          <img src="/bg.png" className="w-full h-full object-cover opacity-20 grayscale" alt="background" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-3xl" />
        </div>

        <header className="sticky top-0 z-40 px-12 py-8 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-md">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="h-10 w-10 flex items-center justify-center hover:bg-white/5 rounded-xl transition-all"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          <div className="flex items-center gap-8">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Deployment State</span>
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" /> CLOUD OPTIMIZED
              </span>
            </div>
            <div className="h-px w-8 bg-white/10 hidden md:block" />
            <span className="text-[10px] font-black text-slate-400">© POLOK PODDAR</span>
          </div>
        </header>

        <div className="p-8 lg:p-20 max-w-7xl mx-auto min-h-screen">
          <AnimatePresence mode="wait">
            {activeTab === "workspace" && (
              <motion.div
                key="workspace"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-32"
              >
                <div className="space-y-8 text-center lg:text-left">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "4rem" }}
                    className="h-1 bg-white mx-auto lg:mx-0"
                  />
                  <h1 className="text-6xl lg:text-8xl font-black tracking-tighter uppercase leading-[0.8]">
                    Document <br /> <span className="text-slate-700">Workspace</span>
                  </h1>
                  <p className="text-slate-500 text-xl max-w-2xl font-medium leading-relaxed mx-auto lg:mx-0">
                    Internal document processing and grounded drafting tool.
                    Built for the Pearson Specter Litt legal team.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-32">
                  <section className="space-y-12">
                    <SectionLabel label="Document Ingestion" />
                    <div className="bg-white/[0.02] border border-white/5 rounded-[48px] p-8 lg:p-16 backdrop-blur-sm">
                      <DocumentProcessor />
                    </div>
                  </section>

                  <section className="space-y-12 pb-20">
                    <SectionLabel label="Draft Generation" />
                    <div className="bg-white/[0.02] border border-white/5 rounded-[48px] p-8 lg:p-16 backdrop-blur-sm">
                      <DraftEditor />
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
                className="space-y-12"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h1 className="text-5xl font-black uppercase tracking-tighter italic">Intelligence</h1>
                    <p className="text-slate-500 font-medium">Real-time neural query engine for processed legal documents.</p>
                  </div>
                  <div className="h-20 w-20 rounded-[32px] border border-white/10 flex items-center justify-center">
                    <Brain size={40} className="text-slate-400" />
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  <div className="lg:col-span-2">
                    <ChatInterface />
                  </div>
                  <div className="space-y-8">
                    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 space-y-8">
                      <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-500">Node metrics</h3>
                      <div className="space-y-6">
                        <MetricRow label="Neural Path" value="Active" />
                        <MetricRow label="Token Affinity" value="99.4%" />
                        <MetricRow label="Search Latency" value="0.04s" />
                        <MetricRow label="Grounded Ratio" value="1.0" />
                      </div>
                    </div>
                    <div className="rounded-[32px] overflow-hidden grayscale border border-white/5 aspect-square">
                      <img src="/analysis.png" className="w-full h-full object-cover opacity-50" alt="analysis" />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "logs" && (
              <motion.div
                key="logs"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <h1 className="text-5xl font-black uppercase tracking-tighter">System Logs</h1>
                <div className="bg-black/40 border border-white/5 rounded-[32px] p-8 font-mono text-xs text-slate-400 space-y-4 h-[600px] overflow-y-auto">
                  <LogLine time="20:19:01" type="INFO" msg="System kernel initialized. Version 4.0.0" />
                  <LogLine time="20:19:05" type="DEBUG" msg="Neural network weights loaded for legal-v2 model" />
                  <LogLine time="20:19:12" type="INFO" msg="Secure connection established with OpenAI API" />
                  <LogLine time="20:19:45" type="WARN" msg="Dirty input detected in buffer #003. Initializing OCR pipeline..." />
                  <LogLine time="20:19:47" type="SUCCESS" msg="OCR extraction complete. 124 entities identified." />
                  <LogLine time="20:20:01" type="INFO" msg="User POLOK session authenticated." />
                  <LogLine time="20:20:05" type="INFO" msg="Awaiting synthesis request..." />
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-12"
              >
                <h1 className="text-5xl font-black uppercase tracking-tighter">Security Protocols</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <SecurityCard icon={<Lock size={24} />} title="Encryption" status="AES-256 Enabled" />
                  <SecurityCard icon={<ShieldCheck size={24} />} title="Audit Trail" status="Immutable Records" />
                  <SecurityCard icon={<Zap size={24} />} title="Sanitization" status="Input Scrubbing Active" />
                  <SecurityCard icon={<Activity size={24} />} title="Monitoring" status="Real-time Threat Detection" />
                </div>
                <div className="p-12 rounded-[48px] bg-white/[0.01] border border-white/5 text-center space-y-6">
                  <ShieldCheck className="mx-auto text-white/20" size={64} />
                  <p className="text-slate-500 max-w-xl mx-auto italic">
                    This system is designed with a security-first architecture. All document processing occurs in isolated neural environments to ensure data integrity and confidentiality.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, onClick }: { icon: any, label: string, active?: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-6 px-6 py-4 rounded-2xl transition-all group ${active
          ? "bg-white text-black font-black"
          : "text-slate-500 hover:text-white hover:bg-white/5"
        }`}
    >
      <div className="transition-transform group-hover:scale-110">
        {icon}
      </div>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </button>
  );
}

function SectionLabel({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-6">
      <div className="h-px flex-1 bg-white/5" />
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">{label}</span>
      <div className="h-px flex-1 bg-white/5" />
    </div>
  );
}

function MetricRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center text-xs">
      <span className="text-slate-500 font-bold">{label}</span>
      <span className="text-white font-black">{value}</span>
    </div>
  );
}

function LogLine({ time, type, msg }: { time: string, type: string, msg: string }) {
  const colors: Record<string, string> = {
    INFO: "text-blue-400",
    DEBUG: "text-slate-500",
    WARN: "text-amber-400",
    SUCCESS: "text-emerald-400",
  };
  return (
    <div className="flex gap-4">
      <span className="text-slate-600">[{time}]</span>
      <span className={`font-black w-16 ${colors[type]}`}>{type}</span>
      <span className="text-slate-300">{msg}</span>
    </div>
  );
}

function SecurityCard({ icon, title, status }: { icon: any, title: string, status: string }) {
  return (
    <div className="p-8 rounded-[32px] bg-white/[0.02] border border-white/5 flex items-center gap-6 hover:bg-white/[0.04] transition-all">
      <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400">
        {icon}
      </div>
      <div className="flex flex-col">
        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{title}</span>
        <span className="text-sm font-bold text-white">{status}</span>
      </div>
    </div>
  );
}
