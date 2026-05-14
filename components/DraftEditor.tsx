"use client";

import { useState, useEffect } from "react";
import { Sparkles, Save, Send, ChevronRight, FileText, Quote, History, Loader2 } from "lucide-react";
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
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 min-h-[600px]">
      {/* Sidebar Controls */}
      <div className="xl:col-span-4 space-y-8">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Source Document</label>
          <select 
            value={selectedDoc}
            onChange={(e) => setSelectedDoc(e.target.value)}
            className="w-full bg-slate-900 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:ring-2 ring-blue-500 outline-none appearance-none cursor-pointer hover:bg-slate-800/50 transition-colors text-white"
          >
            <option value="">Select a document...</option>
            {documents.map(doc => (
              <option key={doc.id} value={doc.id}>{doc.metadata.fileName}</option>
            ))}
          </select>
          {documents.length === 0 && (
            <p className="text-[10px] text-amber-500/80 font-bold ml-1 animate-pulse">
              No documents found. Ingest one first.
            </p>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Intelligent Formats</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
            {["Case Fact Summary", "Internal Memo", "Document Checklist", "Notice Review"].map(type => (
              <button
                key={type}
                onClick={() => setTaskType(type)}
                className={`text-left px-6 py-4 rounded-2xl text-sm font-bold transition-all border ${
                  taskType === type 
                    ? "bg-white text-black border-white shadow-lg shadow-white/5" 
                    : "bg-black/40 text-slate-400 border-white/5 hover:bg-white/5 hover:border-white/10"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedDoc || isGenerating}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed text-black font-black py-5 rounded-2xl transition-all shadow-xl shadow-white/5 group"
        >
          {isGenerating ? <Loader2 className="animate-spin" size={20} /> : <Sparkles className="group-hover:rotate-12 transition-transform" size={20} />}
          {isGenerating ? "Synthesizing Draft..." : "Generate AI Draft"}
        </button>
      </div>

      {/* Editor Area */}
      <div className="xl:col-span-8 bg-black/40 rounded-[32px] border border-white/5 flex flex-col overflow-hidden relative min-h-[500px]">
        <div className="flex items-center justify-between px-8 py-6 border-b border-white/5 bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
              <FileText size={20} className="text-slate-400" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">{taskType}</h3>
              <p className="text-[10px] text-slate-500 font-mono">
                {draft ? `REF: ${draft.id.slice(0,12)}` : "System: Ready for generation"}
              </p>
            </div>
          </div>
          {draft && (
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-xl text-xs font-black transition-all hover:bg-slate-200 disabled:opacity-50"
            >
              {isSaving ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
              Apply & Refine
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-8 prose prose-invert prose-sm max-w-none">
          <AnimatePresence mode="wait">
            {!draft && !isGenerating ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col items-center justify-center text-slate-700 space-y-6"
              >
                <div className="h-20 w-20 rounded-full border-2 border-dashed border-slate-800 flex items-center justify-center">
                   <Quote size={32} className="opacity-20" />
                </div>
                <p className="text-xs font-bold uppercase tracking-[0.2em]">Awaiting Instruction</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full"
              >
                {isGenerating ? (
                  <div className="space-y-4 animate-pulse">
                    <div className="h-4 bg-white/5 rounded w-3/4" />
                    <div className="h-4 bg-white/5 rounded w-1/2" />
                    <div className="h-4 bg-white/5 rounded w-5/6" />
                  </div>
                ) : (
                  <div className="group relative">
                    <textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="w-full min-h-[400px] bg-transparent resize-none outline-none font-mono text-sm leading-relaxed text-slate-300 mb-8 border-b border-white/5 pb-8 focus:border-white/30 transition-colors"
                      placeholder="Start editing..."
                    />
                    <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mb-4">Preview Rendering</div>
                    <div className="p-8 rounded-3xl bg-white/[0.02] border border-white/5 text-slate-400">
                      <ReactMarkdown>{editedContent}</ReactMarkdown>
                    </div>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showLearningToast && (
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="absolute bottom-6 right-6 bg-white text-black px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 z-50 border border-white/30"
            >
              <div className="h-8 w-8 rounded-full bg-black/10 flex items-center justify-center">
                <Sparkles size={16} />
              </div>
              <div>
                <p className="text-sm font-bold">Optimization Complete</p>
                <p className="text-[10px] opacity-80 uppercase font-bold tracking-wider">Style patterns integrated into global system</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
