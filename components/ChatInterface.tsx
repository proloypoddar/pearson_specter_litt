"use client";

import { useState } from "react";
import { Send, User, Brain, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatInterface() {
  const [messages, setMessages] = useState<Array<{ role: "user" | "ai"; content: string }>>([
    { role: "ai", content: "System initialized. Welcome, Polok. How can I assist with your legal documents today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: "ai", content: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "ai", content: "Error: System link interrupted." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-black/40 border border-white/5 rounded-[32px] overflow-hidden backdrop-blur-xl">
      <div className="p-6 border-b border-white/5 flex items-center gap-3">
        <div className="h-2 w-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Secure AI Channel</span>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
              msg.role === "user" ? "bg-slate-800" : "bg-blue-600/20 text-blue-400"
            }`}>
              {msg.role === "user" ? <User size={16} /> : <Brain size={16} />}
            </div>
            <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
              msg.role === "user" ? "bg-slate-800 text-slate-100" : "bg-white/5 text-slate-300"
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="h-8 w-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center animate-pulse">
              <Brain size={16} />
            </div>
            <div className="bg-white/5 p-4 rounded-2xl">
              <Loader2 size={16} className="animate-spin text-slate-500" />
            </div>
          </div>
        )}
      </div>

      <div className="p-6 bg-black/20 border-t border-white/5">
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Query system intelligence..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm outline-none focus:border-blue-500/50 transition-colors pr-16"
          />
          <button 
            onClick={handleSend}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-10 w-10 bg-blue-600 hover:bg-blue-500 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-900/20"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
