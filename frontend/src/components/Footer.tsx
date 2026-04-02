"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import api from "@/lib/api";
import { SiteSettings } from "@/lib/types";

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    api.get("/public/settings").then(res => setSettings(res.data)).catch(console.error);
  }, []);

  return (
    <footer className="bg-gray-950 text-gray-300 border-t border-gray-900 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              {settings?.institute_name?.charAt(0) || "T"}
            </div>
            <span className="font-extrabold text-xl text-white">
              {settings?.institute_name || "TuitionHub"}
            </span>
          </Link>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            {settings?.hero_subtitle || "Empowering students through premium education and exceptional instructors."}
          </p>
          <p className="text-sm">
            <strong className="block text-white mb-1">Contact Us</strong>
            {settings?.contact_email}<br/>
            {settings?.contact_phone}
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Explore</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/courses" className="hover:text-blue-400 transition">Our Courses</Link></li>
            <li><Link href="/teachers" className="hover:text-blue-400 transition">Expert Instructors</Link></li>
            <li><Link href="/about" className="hover:text-blue-400 transition">About the Institute</Link></li>
            <li><Link href="/contact" className="hover:text-blue-400 transition">Enrollment & Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Legal</h4>
          <ul className="space-y-3 text-sm">
            <li><Link href="/terms" className="hover:text-amber-500 transition">Terms of Service</Link></li>
            <li><Link href="/privacy" className="hover:text-amber-500 transition">Privacy Policy</Link></li>
            <li><Link href="/refunds" className="hover:text-amber-500 transition">Refund Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-6">Office Address</h4>
          <p className="text-sm text-gray-500 leading-relaxed">
            {settings?.address || "123 Education Lane\nLearning District, AC 12345"}
          </p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-sm text-gray-600">
          &copy; {new Date().getFullYear()} {settings?.institute_name}. All rights reserved.
        </p>
        <div className="flex items-center gap-4 relative z-50">
           <Link href="/admin/login" className="text-sm text-gray-700 hover:text-white transition">Admin Portal</Link>
        </div>
      </div>
    </footer>
  );
}
