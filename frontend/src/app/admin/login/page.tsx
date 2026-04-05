"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, ArrowRight, Globe } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import api from "@/lib/api";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", { username, password });
      router.push("/admin");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Institutional credentials invalid.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-shell relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-primary">
      <div className="pointer-events-none absolute right-0 top-0 h-[800px] w-[800px] rounded-full bg-white/6 blur-[150px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full bg-white/5 blur-[120px]" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[480px] px-6"
      >
        <div className="text-center mb-12">
           <motion.div 
             initial={{ scale: 0.8 }}
             animate={{ scale: 1 }}
             className="mx-auto mb-8 flex h-20 w-20 rotate-3 items-center justify-center rounded-[32px] border border-white/10 bg-white text-primary shadow-premium"
           >
             <Lock className="w-8 h-8 text-primary" />
           </motion.div>
           <h1 className="mb-4 text-4xl font-serif font-bold tracking-tight text-white">
             Institutional <span className="italic text-white/45">Portal</span>
           </h1>
           <p className="text-sm font-light uppercase tracking-widest text-white/40">
             Restricted Administrative Access
           </p>
        </div>

        <div className="relative overflow-hidden rounded-[48px] border border-white/10 bg-white/[0.04] p-12 shadow-[0_36px_120px_-44px_rgba(0,0,0,0.8)] backdrop-blur-xl">
           <div className="absolute left-0 top-0 h-px w-full bg-gradient-to-r from-transparent via-white/50 to-transparent" />
           
           {error && (
             <motion.div 
               initial={{ opacity:0, x:-10 }} 
               animate={{ opacity:1, x:0 }}
               className="mb-8 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/6 p-4 text-xs font-bold uppercase tracking-widest text-white/72"
             >
               <ShieldCheck className="w-4 h-4"/> {error}
             </motion.div>
           )}

           <form onSubmit={handleLogin} className="space-y-8">
             <div className="space-y-3">
               <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] ml-2">Access Username</label>
               <input
                 type="text"
                 required
                 value={username}
                 onChange={(e) => setUsername(e.target.value)}
                 className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 font-light text-white outline-none transition-all duration-300 placeholder:text-white/15 focus:border-white/30 focus:bg-white/[0.08] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.06)]"
                 placeholder="Institutional ID"
               />
             </div>

             <div className="space-y-3">
               <label className="block text-[10px] font-bold text-white/30 uppercase tracking-[0.3em] ml-2">Secure Protocol (Password)</label>
               <input
                 type="password"
                 required
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full rounded-2xl border border-white/10 bg-white/5 p-6 font-light text-white outline-none transition-all duration-300 placeholder:text-white/15 focus:border-white/30 focus:bg-white/[0.08] focus:shadow-[0_0_0_4px_rgba(255,255,255,0.06)]"
                 placeholder="••••••••••••"
               />
             </div>

             <button
               type="submit"
               disabled={loading}
               className="group flex w-full items-center justify-center gap-4 rounded-2xl bg-white py-6 text-[10px] font-bold uppercase tracking-[0.3em] text-primary shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-200 hover:shadow-[0_22px_36px_-22px_rgba(255,255,255,0.5)] disabled:opacity-50"
             >
               {loading ? "Authenticating Authority..." : <>Establish Connection <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" /></>}
             </button>
           </form>
        </div>

        <div className="mt-12 flex justify-between items-center px-4">
           <Link href="/" className="flex items-center gap-2 text-[10px] font-bold uppercase text-white/25 transition-colors hover:text-white/70">
             <Globe className="w-3 h-3"/> Public Terminal
           </Link>
           <span className="text-[10px] uppercase font-bold text-white/10 tracking-[0.2em]">&copy; 2026 The Elite Academy</span>
        </div>
      </motion.div>
    </div>
  );
}
