"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import api from "@/lib/api";

export default function TeachersDirectory() {
  const [teachers, setTeachers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/public/teachers")
      .then(res => setTeachers(res.data.filter((t: any) => t.is_active)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen pt-32 text-center text-gray-500 animate-pulse">Loading faculty...</div>;

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">Expert Faculty</h1>
          <p className="text-lg text-slate-600">Learn directly from our passionate, battle-tested educators who bring years of industry and academic excellence.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {teachers.map((t, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              key={t._id} 
              className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm text-center hover:-translate-y-2 hover:shadow-xl hover:shadow-indigo-900/5 transition-all duration-300"
            >
              <div className="w-28 h-28 mx-auto bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full mb-6 flex items-center justify-center text-4xl font-black text-white shadow-inner">
                {t.name.charAt(0)}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{t.name}</h3>
              <p className="text-blue-600 font-semibold mb-4 text-sm">{t.subject}</p>
              <p className="text-slate-500 text-sm leading-relaxed">{t.bio || "Dedicated professional with a profound record of teaching excellence."}</p>
            </motion.div>
          ))}
          {teachers.length === 0 && <div className="col-span-full text-center text-slate-400 p-12">No instructors listed yet.</div>}
        </div>
      </div>
    </div>
  );
}
