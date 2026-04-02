"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { BookOpen, Clock, ChevronRight } from "lucide-react";
import api from "@/lib/api";

export default function CoursesListing() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/public/courses")
      .then(res => setCourses(res.data.filter((c: any) => c.is_active)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="min-h-screen pt-32 text-center text-gray-500 animate-pulse">Loading all programs...</div>;

  return (
    <div className="bg-slate-50 min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="mb-16 text-center max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-6">Our Curriculum</h1>
          <p className="text-lg text-slate-600">Browse our robust catalog of premium courses designed to elevate your theoretical and practical knowledge.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((c, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={c._id} 
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 flex flex-col"
            >
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                   <BookOpen className="w-16 h-16 text-blue-200 transform group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{c.title}</h3>
                <p className="text-slate-500 mb-6 line-clamp-3 flex-1">{c.description || "In-depth lectures, actionable coursework, and continuous assessments."}</p>
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-slate-50">
                  <span className="text-2xl font-black text-blue-600">{c.price ? `$${c.price}` : "Free"}</span>
                  <Link href={`/courses/${c._id}`} className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-full hover:bg-blue-600 hover:shadow-lg transition flex items-center gap-2">
                    Details <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
          {courses.length === 0 && <div className="col-span-full text-center text-slate-400 p-12">No public courses available.</div>}
        </div>
      </div>
    </div>
  );
}
