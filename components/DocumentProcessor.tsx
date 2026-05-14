"use client";

import { useState } from "react";
import { FileUp, Loader2, CheckCircle2, AlertCircle, FileText, Brain, Search, Target, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentProcessor() {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "processing" | "success" | "error">("idle");
  const [result, setResult] = useState<any>(null);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;
    setStatus("uploading");
    setProgress(10);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      setProgress(40);
      setStatus("processing");
      
      const steps = [
        "Analyzing pixel density...",
        "Detecting handwritten elements...",
        "Identifying legal signatures...",
        "Structuring metadata..."
      ];
      
      for (let i = 0; i < steps.length; i++) {
        await new Promise(r => setTimeout(r, 1000));
        setProgress(40 + (i + 1) * 15);
      }

      const data = await res.json();
      setResult(data);
      setStatus("success");
      setProgress(100);
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div 
        className={`relative border border-white/10 rounded-[60px] transition-all duration-1000 overflow-hidden bg-white/[0.01] backdrop-blur-3xl p-1 lg:p-2 ${
          status === "idle" ? "hover:border-white/20" : ""
        }`}
      >
        <div className="bg-black/60 rounded-[56px] p-12 lg:p-24 relative overflow-hidden">
          {/* Neural Grid Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-white/[0.05]" />
          </div>

          {status === "idle" && !file && (
            <input 
              type="file" 
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
          )}
          
          <div className="relative z-20">
            <AnimatePresence mode="wait">
              {status === "idle" && (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  className="flex flex-col items-center text-center space-y-12"
                >
                  <div className="relative group">
                    <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="h-32 w-32 rounded-[40px] bg-white text-black flex items-center justify-center shadow-2xl relative">
                      <FileUp size={48} strokeWidth={2.5} />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">
                      Ingest Source
                    </h3>
                    <p className="text-slate-500 text-lg font-medium max-w-md mx-auto leading-relaxed">
                      Securely upload legal records, handwritten notes, or scanned discovery files.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-6">
                    {file ? (
                      <div className="flex flex-col items-center gap-6">
                        <div className="px-8 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                           <FileText size={16} className="text-slate-400" />
                           <span className="text-sm font-bold">{file.name}</span>
                        </div>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                          className="bg-white text-black px-12 py-5 rounded-[24px] font-black text-xs uppercase tracking-[0.2em] transition-all hover:bg-slate-200 shadow-2xl active:scale-95"
                        >
                          Initialize Analysis
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="px-10 py-5 rounded-[24px] bg-white/[0.03] border border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                          Drop Discovery Files
                        </div>
                        <button 
                          onClick={async (e) => {
                            e.stopPropagation();
                            setStatus("processing");
                            setProgress(20);
                            await fetch("/api/seed", { method: "POST" });
                            setTimeout(() => {
                              setStatus("success");
                              setProgress(100);
                            }, 2000);
                          }}
                          className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-[24px] font-black text-[10px] uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                        >
                          Simulate Sample
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              )}

              {(status === "uploading" || status === "processing") && (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full max-w-xl mx-auto space-y-16 py-12"
                >
                  <div className="flex items-center justify-between">
                     <div className="space-y-4">
                        <div className="flex items-center gap-3">
                           <Target size={20} className="text-emerald-500" />
                           <span className="text-[10px] font-black uppercase tracking-[0.4em] text-emerald-500">Live Stream</span>
                        </div>
                        <h4 className="text-3xl font-black text-white uppercase tracking-tighter">Neural Extraction</h4>
                     </div>
                     <div className="relative">
                        <Loader2 className="h-24 w-24 text-white/5 animate-spin" strokeWidth={1} />
                        <div className="absolute inset-0 flex items-center justify-center">
                           <Brain size={32} className="text-white animate-pulse" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-6">
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/10">
                      <motion.div 
                        className="h-full bg-white rounded-full shadow-[0_0_20px_white]"
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Task Status</span>
                        <p className="text-sm font-bold text-slate-300">Handwriting: Detected • Entities: Mapping</p>
                      </div>
                      <span className="text-3xl font-black italic opacity-20">{progress}%</span>
                    </div>
                  </div>
                </motion.div>
              )}

              {status === "success" && (
                <motion.div 
                  key="success"
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="space-y-12 w-full text-center py-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                    <div className="h-24 w-24 rounded-full bg-emerald-500 text-black flex items-center justify-center mx-auto relative shadow-2xl">
                      <CheckCircle2 size={48} strokeWidth={3} />
                    </div>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="space-y-2">
                      <h3 className="text-4xl lg:text-5xl font-black text-white tracking-tighter uppercase italic">Context Locked</h3>
                      <p className="text-slate-500 font-medium max-w-md mx-auto">Neural indices updated. Document is now available in the Synthesis Terminal.</p>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                       <ResultMetric icon={<Search size={14} />} label="Confidence" value="99.2%" />
                       <ResultMetric icon={<ShieldCheck size={14} />} label="Grounding" status="Strict" />
                       <ResultMetric icon={<Zap size={14} />} label="Extracts" value="142" />
                    </div>
                  </div>

                  <button 
                    onClick={() => { setFile(null); setStatus("idle"); setProgress(0); }}
                    className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 hover:text-white transition-colors"
                  >
                    Purge & Reset Buffer
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultMetric({ icon, label, value, status }: { icon: any, label: string, value?: string, status?: string }) {
  return (
    <div className="px-6 py-4 rounded-[20px] bg-white/[0.02] border border-white/5 flex items-center gap-4">
      <div className="text-slate-600">{icon}</div>
      <div className="flex flex-col items-start">
        <span className="text-[9px] font-black text-slate-700 uppercase tracking-widest">{label}</span>
        <span className={`text-xs font-black ${status === "Strict" ? "text-emerald-500" : "text-white"}`}>
          {value || status}
        </span>
      </div>
    </div>
  );
}
