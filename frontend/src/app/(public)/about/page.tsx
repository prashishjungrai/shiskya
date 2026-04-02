"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

export default function AboutPage() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    api.get("/public/settings").then(res => setSettings(res.data)).catch(console.error);
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8 text-center">
          About {settings?.institute_name || "Us"}
        </h1>
        
        <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-lg text-slate-600 leading-relaxed space-y-6">
          <p>
            Welcome to <strong>{settings?.institute_name || "TuitionHub"}</strong>, the premiere destination for rigorous, modern education. 
            We are dedicated to forging a pathway of academic excellence and empowering students of all backgrounds to unleash their potential.
          </p>
          <p>
            {settings?.hero_subtitle}
          </p>
          <p>
            Founded by a collective of industry veterans and academic scholars, our core philosophy is simple: Education shouldn't merely involve 
            rote memorization; it must challenge paradigms, provoke critical thinking, and arm individuals with actionable, real-world skills.
          </p>
          <div className="pt-6 border-t border-slate-100 mt-8 grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-black text-blue-600 mb-2">10+</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-black text-indigo-600 mb-2">50+</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Awards Won</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-600 mb-2">99%</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-wider">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
