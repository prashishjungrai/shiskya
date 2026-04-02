"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, MapPin, Phone, Mail } from "lucide-react";
import api from "@/lib/api";

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      await api.post("/public/contacts", formData);
      setStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-start">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">Get in Touch</h1>
          <p className="text-lg text-slate-600 mb-12">Have questions about our programs or enrollment process? Drop us a line and our admissions team will reach out to you within 24 hours.</p>
        
          <div className="space-y-8">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 shrink-0"><MapPin /></div>
              <div><h3 className="font-bold text-slate-900 text-lg">Our Campus</h3><p className="text-slate-500">123 Education Lane<br/>Learning District, AC 12345</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0"><Phone /></div>
              <div><h3 className="font-bold text-slate-900 text-lg">Call Us Directly</h3><p className="text-slate-500">(555) 123-4567<br/>Mon-Fri, 9am - 5pm</p></div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0"><Mail /></div>
              <div><h3 className="font-bold text-slate-900 text-lg">Email Admissions</h3><p className="text-slate-500">admissions@tuitionhub.edu</p></div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Address *</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="john@example.com" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <input type="text" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="+1 (555) 000-0000" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Your Message *</label>
              <textarea required value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 min-h-[150px] focus:ring-2 focus:ring-blue-500 outline-none transition" placeholder="How can we help you?" />
            </div>

            {status === "success" && <div className="p-4 bg-green-50 text-green-700 rounded-xl font-medium border border-green-200">Message sent successfully! We will be in touch shortly.</div>}
            {status === "error" && <div className="p-4 bg-red-50 text-red-700 rounded-xl font-medium border border-red-200">Failed to send message. Please try again.</div>}

            <button disabled={status === "submitting"} type="submit" className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-blue-600 hover:shadow-lg hover:-translate-y-1 transition disabled:opacity-50">
              {status === "submitting" ? "Sending..." : <><Send className="w-5 h-5"/> Send Inquiry</>}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
