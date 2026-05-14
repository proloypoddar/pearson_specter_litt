"use client";

import { useState, useEffect } from "react";
import { Sparkles, Save, FileText, Quote, History, Loader2, Target, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

export default function DraftEditor() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [selectedDoc, setSelectedDoc] = useState("");
  const [taskType, setTaskType] = useState("Case Fact Summary");
  const [draft, setDraft] = useState<any>(null);
  const [editedContent, setEditedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showLearningToast, setShowLearningToast] = useState(false);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const res = await fetch("/api/documents");
        const data = await res.json();
        setDocuments(data.documents || []);
      } catch (error) {
        console.error("Failed to fetch documents", error);
      }
    };
    fetchDocs();
    
    const interval = setInterval(() => {
      if (documents.length === 0) fetchDocs();
    }, 5000);
    return () => clearInterval(interval);
  }, [documents.length]);

  const handleGenerate = async () => {
    if (!selectedDoc) return;
    setIsGenerating(true);
    
    try {
      const res = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ docId: selectedDoc, taskType }),
      });
      const data = await res.json();
      setDraft(data.draft);
      setEditedContent(data.draft.originalContent);
    } catch (error) {
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!draft) return;
    setIsSaving(true);
    
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: draft.id, editedContent }),
      });
      
      if (res.ok) {
        setShowLearningToast(true);
        setTimeout(() => setShowLearningToast(false), 5000);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-20 min-h-[700px]">
      {/* Configuration Sidebar */}
      <div className="xl:col-span-4 space-y-12">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Context Source</label>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-white/5 rounded-3xl blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <select 
              value={selectedDoc}
              onChange={(e) => setSelectedDoc(e.target.value)}
              className="relative w-full bg-black/60 border border-white/10 rounded-3xl px-8 py-6 text-sm focus:ring-2 ring-white/20 outline-none appearance-none cursor-pointer text-white backdrop-blur-xl"
            >
              <option value="">Select an analyzed document...</option>
              {documents.map(doc => (
                <option key={doc.id} value={doc.id}>{doc.metadata.fileName}</option>
              ))}
            </select>
            {documents.length === 0 && (
              <p className="text-[10px] text-amber-500/60 font-bold mt-3 ml-2 flex items-center gap-2">
                <Zap size={10} className="animate-pulse" /> Inbound buffer empty.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] ml-2">Intelligent Objective</label>
          <div className="grid grid-cols-1 gap-3">
            {["Case Fact Summary", "Internal Memo", "Document Checklist", "Notice Review"].map(type => (
              <button
                key={type}
                onClick={() => setTaskType(type)}
                className={`relative px-8 py-5 rounded-3xl text-xs font-black tracking-widest transition-all border text-left group overflow-hidden ${
                  taskType === type 
                    ? "bg-white text-black border-white shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                    : "bg-black/40 text-slate-500 border-white/5 hover:bg-white/5 hover:border-white/20"
                }`}
              >
                {type}
                {taskType === type && (
                   <motion.div layoutId="btn-active" className="absolute right-6 top-1/2 -translate-y-1/2">
                      <ChevronRight size={16} />
                   </motion.div>
                )}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedDoc || isGenerating}
          className="w-full flex items-center justify-center gap-4 bg-white hover:bg-slate-200 disabled:opacity-20 disabled:cursor-not-allowed text-black font-black py-6 rounded-[32px] transition-all shadow-2xl group relative overflow-hidden"
        >
          {isGenerating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span className="uppercase tracking-[0.2em] text-[10px]">Synthesizing Context...</span>
            </>
          ) : (
            <>
              <Sparkles className="group-hover:rotate-12 transition-transform" size={20} />
              <span className="uppercase tracking-[0.2em] text-[10px]">Generate Legal Draft</span>
            </>
          )}
        </button>
      </div>

      {/* Synthesis Terminal */}
      <div className="xl:col-span-8 flex flex-col min-h-[600px]">
        <div className="bg-white/[0.03] border border-white/10 rounded-[40px] flex flex-col h-full overflow-hidden relative shadow-inner">
          <div className="flex items-center justify-between px-10 py-8 border-b border-white/5 bg-white/[0.01]">
            <div className="flex items-center gap-6">
              <div className="h-14 w-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <FileText size={24} className="text-slate-500" />
              </div>
              <div className="flex flex-col">
                <h3 className="text-sm font-black text-white uppercase tracking-[0.3em]">{taskType}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-slate-600 font-mono">
                    {draft ? `REF: ${draft.id.slice(0,16)}` : "SYSTEM_IDLE"}
                  </span>
                  {selectedDoc && !draft && (
                    <div className="flex items-center gap-2 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded text-[9px] font-black text-emerald-500 uppercase tracking-widest">
                       Context Ready
                    </div>
                  )}
                </div>
              </div>
            </div>
            {draft && (
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-3 bg-white text-black px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-200 disabled:opacity-50"
              >
                {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                Learn Stylistic Edits
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar relative">
            <AnimatePresence mode="wait">
              {!draft && !isGenerating ? (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  className="h-full flex flex-col items-center justify-center space-y-10"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full" />
                    <div className="relative h-24 w-24 rounded-[32px] border border-white/10 flex items-center justify-center text-slate-800">
                       <Quote size={40} className="opacity-40 rotate-180" />
                    </div>
                  </div>
                  <div className="text-center space-y-4">
                    <p className="text-[10px] font-black uppercase tracking-[0.6em] text-slate-600">Awaiting Neural Link</p>
                    <div className="flex gap-4 justify-center">
                       <StatusBadge icon={<Target size={12} />} label="Retrieval" status={selectedDoc ? "Active" : "Wait"} />
                       <StatusBadge icon={<ShieldCheck size={12} />} label="Grounding" status="Strict" />
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full h-full flex flex-col"
                >
                  {isGenerating ? (
                    <div className="space-y-8 py-10">
                      {[1, 2, 3, 4].map(i => (
                        <div key={i} className="space-y-3">
                          <div className={`h-4 bg-white/5 rounded-full ${i % 2 === 0 ? "w-3/4" : "w-full"}`} />
                          <div className={`h-4 bg-white/5 rounded-full ${i % 2 === 0 ? "w-1/2" : "w-2/3"}`} />
                        </div>
                      ))}
                      <div className="flex items-center gap-3 text-slate-600 animate-pulse mt-12">
                        <Loader2 className="animate-spin" size={14} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Applying learned style preferences...</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-12 pb-20">
                      <div className="relative group">
                        <textarea
                          value={editedContent}
                          onChange={(e) => setEditedContent(e.target.value)}
                          className="w-full min-h-[400px] bg-transparent resize-none outline-none font-mono text-sm leading-relaxed text-slate-300 border-b border-white/5 pb-12 focus:border-white/20 transition-colors"
                          placeholder="Refine draft..."
                        />
                      </div>
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                           <span className="text-[10px] font-black text-slate-600 uppercase tracking-[0.4em]">Preview Rendering</span>
                           <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <div className="p-12 rounded-[40px] bg-white/[0.01] border border-white/5 text-slate-400 prose prose-invert prose-sm max-w-none shadow-2xl">
                          <ReactMarkdown>{editedContent}</ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
        
        {/* Learning Notification */}
        <AnimatePresence>
          {showLearningToast && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="fixed bottom-12 right-12 bg-white text-black px-8 py-5 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 z-[100]"
            >
              <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center text-white">
                <Sparkles size={18} />
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-black uppercase tracking-tight">Context Synchronized</span>
                <span className="text-[10px] font-bold opacity-60">System learned 1 new stylistic pattern.</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatusBadge({ icon, label, status }: { icon: any, label: string, status: string }) {
  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/5">
      <span className="text-slate-700">{icon}</span>
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{label}:</span>
      <span className={`text-[9px] font-black uppercase tracking-widest ${status === "Active" || status === "Strict" ? "text-emerald-500" : "text-slate-800"}`}>
        {status}
      </span>
    </div>
  );
}

function ChevronRight(props: any) {
  return (
    <svg 
      {...props}
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
