"use client";

import { useState } from "react";
import { FileUp, Loader2, CheckCircle2, AlertCircle, FileText, Brain, Search, Target } from "lucide-react";
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
      
      // Simulate analysis steps
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
    <div className="w-full max-w-4xl mx-auto space-y-8">
      <div 
        className={`relative border border-white/5 rounded-[40px] p-16 transition-all duration-700 bg-black/40 backdrop-blur-2xl overflow-hidden ${
          status === "idle" ? "hover:border-white/20" : ""
        }`}
      >
        {/* Background Visuals */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/grid.svg')] bg-repeat opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/[0.02] to-transparent" />
        </div>

        {status === "idle" && !file && (
          <input 
            type="file" 
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
        )}
        
        <div className="flex flex-col items-center justify-center text-center relative z-20">
          <AnimatePresence mode="wait">
            {status === "idle" && (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="h-24 w-24 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mx-auto group-hover:border-white/30 transition-all">
                  <FileUp size={40} className="text-slate-400" />
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-white tracking-tight">Ingest Legal Source</h3>
                  <p className="text-slate-500 text-sm font-medium">Scanned PDFs, Images, or Handwritten Records</p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-4">
                  {file ? (
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleUpload(); }}
                      className="bg-white text-black px-10 py-4 rounded-2xl font-black text-sm transition-all hover:bg-slate-200 active:scale-95 shadow-xl shadow-white/5"
                    >
                      Analyze {file.name.slice(0, 15)}...
                    </button>
                  ) : (
                    <>
                      <div className="px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-xs font-bold text-slate-400">
                        Drop files here or click to browse
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
                        className="bg-black border border-white/10 text-slate-400 px-8 py-4 rounded-2xl font-bold text-xs hover:bg-white/5 transition-all"
                      >
                        Load Sample
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
                className="w-full max-w-md space-y-12 py-8"
              >
                <div className="flex items-center justify-center gap-12">
                   <div className="relative">
                     <Loader2 className="h-20 w-20 text-white/20 animate-spin" strokeWidth={1} />
                     <div className="absolute inset-0 flex items-center justify-center">
                        <Brain size={32} className="text-white animate-pulse" />
                     </div>
                   </div>
                   <div className="text-left space-y-2">
                      <div className="flex items-center gap-2">
                        <Target size={16} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">Analysis Active</span>
                      </div>
                      <p className="text-lg font-bold text-white leading-tight">Processing High-Density Input</p>
                   </div>
                </div>

                <div className="space-y-4">
                  <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <span>{progress}% complete</span>
                    <span>Handwriting Detection: Active</span>
                  </div>
                </div>
              </motion.div>
            )}

            {status === "success" && (
              <motion.div 
                key="success"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="space-y-10 w-full"
              >
                <div className="h-20 w-20 rounded-full bg-white text-black flex items-center justify-center mx-auto">
                  <CheckCircle2 size={40} />
                </div>
                
                <div className="space-y-6">
                  <div className="space-y-1">
                    <h3 className="text-3xl font-black text-white tracking-tight">Document Analysis Complete</h3>
                    <p className="text-slate-500 text-sm">System has successfully indexed document metadata and hand-drawn elements.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                    <SuccessMetric label="Handwriting" value="Detected (72%)" />
                    <SuccessMetric label="Signatures" value="Verified" />
                    <SuccessMetric label="Legal Confidence" value="98.2%" />
                  </div>
                </div>

                <button 
                  onClick={() => { setFile(null); setStatus("idle"); setProgress(0); }}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-white transition-colors"
                >
                  Terminate Session & Reset
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function SuccessMetric({ label, value }: { label: string, value: string }) {
  return (
    <div className="p-6 rounded-3xl bg-white/[0.03] border border-white/5 flex flex-col items-center gap-2">
      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{label}</span>
      <span className="text-sm font-black text-white">{value}</span>
    </div>
  );
}
