"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, ChevronRight, BookOpen, Users, Clock, Award } from "lucide-react";
import api from "@/lib/api";
import { SiteSettings } from "@/lib/types";

// Variant for staggered children
const containerV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};
const itemV = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

export default function Home() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [banners, setBanners] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [activeBanner, setActiveBanner] = useState(0);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [setRes, banRes, couRes, teaRes, tstRes] = await Promise.all([
          api.get("/public/settings"),
          api.get("/public/banners"),
          api.get("/public/courses"),
          api.get("/public/teachers"),
          api.get("/public/testimonials")
        ]);
        setSettings(setRes.data);
        setBanners(banRes.data.filter((b: any) => b.is_active));
        setCourses(couRes.data.filter((c: any) => c.is_active));
        setTeachers(teaRes.data.filter((t: any) => t.is_active));
        setTestimonials(tstRes.data.filter((t: any) => t.is_active));
      } catch (err) {
        console.error("Error loading home:", err);
      }
    };
    loadHomeData();
  }, []);

  // Banner Auto-cycle
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveBanner(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners]);

  if (!settings) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="bg-slate-50 overflow-hidden w-full">
      
      {/* 1. HERO SECTION (Dynamic Carousel) */}
      <section className="relative h-[85vh] w-full flex items-center justify-center pt-20">
        <AnimatePresence mode="wait">
          {banners.length > 0 ? (
            <motion.div
              key={activeBanner}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 z-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${banners[activeBanner].image_url})` }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-slate-900/40 backdrop-blur-[2px]"></div>
            </motion.div>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900"></div>
          )}
        </AnimatePresence>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium mb-6 text-blue-200">
              Welcome to {settings.institute_name}
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 drop-shadow-xl text-balance">
              {banners.length > 0 && banners[activeBanner].title ? banners[activeBanner].title : settings.hero_title}
            </h1>
            <p className="text-lg md:text-2xl text-slate-200 max-w-2xl mx-auto mb-10 drop-shadow-md font-light text-balance">
              {banners.length > 0 && banners[activeBanner].subtitle ? banners[activeBanner].subtitle : settings.hero_subtitle}
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/courses" className="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-1 w-full sm:w-auto">
                Explore Courses
              </Link>
              <Link href="/contact" className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-bold text-lg hover:bg-white/20 transition-all hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2">
                Join Now <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Banner Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`transition-all duration-500 rounded-full ${activeBanner === i ? 'w-8 h-2 bg-blue-500' : 'w-2 h-2 bg-white/50 hover:bg-white/80'}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* 2. STATS OR FEATURE STRIP */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
          <div className="text-center px-4">
            <h3 className="text-4xl font-extrabold text-blue-600 mb-2">{courses.length}+</h3>
            <p className="text-gray-500 font-medium">Premium Courses</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-4xl font-extrabold text-indigo-600 mb-2">{teachers.length}+</h3>
            <p className="text-gray-500 font-medium">Expert Instructors</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-4xl font-extrabold text-blue-600 mb-2">10k+</h3>
            <p className="text-gray-500 font-medium">Happy Students</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-4xl font-extrabold text-indigo-600 mb-2">4.9</h3>
            <p className="text-gray-500 font-medium">Average Rating</p>
          </div>
        </div>
      </section>

      {/* 3. HIGHLIGHTED COURSES */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-12">
          <div>
            <span className="text-blue-600 font-bold uppercase tracking-wider text-sm mb-2 block">Our Curriculum</span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Featured Courses</h2>
          </div>
          <Link href="/courses" className="hidden md:flex items-center gap-2 text-blue-600 font-bold hover:text-blue-800 transition">
            View All <ChevronRight className="w-5 h-5"/>
          </Link>
        </div>

        <motion.div variants={containerV} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }} className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.slice(0, 3).map((c) => (
            <motion.div key={c._id} variants={itemV} className="group bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors z-10" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <BookOpen className="w-16 h-16 text-slate-300 transform group-hover:scale-110 transition-transform duration-500" />
                </div>
              </div>
              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900 mb-3">{c.title}</h3>
                <p className="text-slate-500 mb-6 line-clamp-2">{c.description || "Comprehensive syllabus covered by top tier educators."}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4 text-blue-600"/> {c.duration || "N/A"}
                  </div>
                  <span className="text-xl font-black text-blue-600">{c.price ? `$${c.price}` : "Free"}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        <div className="mt-8 text-center md:hidden">
          <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-700 font-bold rounded-full">
            View All Courses <ChevronRight className="w-4 h-4"/>
          </Link>
        </div>
      </section>

      {/* 4. EXPERT TEACHERS */}
      <section className="py-24 bg-gradient-to-b from-slate-900 to-indigo-950 text-white relative overflow-hidden">
        {/* Glow decoration */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <span className="text-blue-400 font-bold uppercase tracking-wider text-sm mb-2 block">Learn from the Best</span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">Our Faculty</h2>
          </div>

          <motion.div variants={containerV} initial="hidden" whileInView="show" viewport={{ once:true }} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teachers.slice(0, 4).map((t) => (
              <motion.div key={t._id} variants={itemV} className="bg-white/5 backdrop-blur-lg border border-white/10 p-8 rounded-3xl text-center hover:-translate-y-2 transition-transform duration-300">
                <div className="w-24 h-24 mx-auto bg-gradient-to-tr from-blue-500 to-indigo-500 rounded-full mb-6 flex items-center justify-center text-3xl font-black shadow-inner shadow-white/30 text-white">
                  {t.name.charAt(0)}
                </div>
                <h3 className="text-xl font-bold mb-1">{t.name}</h3>
                <p className="text-blue-300 font-medium mb-4 text-sm">{t.subject}</p>
                <p className="text-slate-400 text-sm line-clamp-3">{t.bio || "Dedicated professional with years of teaching experience."}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      {testimonials.length > 0 && (
        <section className="py-24 max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-extrabold text-center mb-16 text-slate-900 tracking-tight">Student Success Stories</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.slice(0, 3).map((t) => (
              <div key={t._id} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm relative">
                <div className="absolute top-8 right-8 text-blue-100 opacity-50">
                  <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 32 32"><path d="M10 8c-3.3 0-6 2.7-6 6v10h10V14H6c0-2.2 1.8-4 4-4V8zm18 0c-3.3 0-6 2.7-6 6v10h10V14h-8c0-2.2 1.8-4 4-4V8z"/></svg>
                </div>
                <div className="flex items-center gap-1 text-amber-400 mb-6 relative z-10">
                  {Array(t.rating).fill(0).map((_,i) => <Star key={i} className="w-5 h-5 fill-current"/>)}
                </div>
                <p className="text-slate-600 text-lg leading-relaxed relative z-10 mb-8 italic">"{t.content}"</p>
                <div className="flex items-center gap-4 border-t border-slate-100 pt-6">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                    {t.student_name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">{t.student_name}</h4>
                    <span className="text-sm text-slate-500">{t.course_taken || "Student"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 6. CTA / FOOTER PREP */}
      <section className="py-24 bg-blue-600 text-white text-center px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6 tracking-tight">Ready to start your journey?</h2>
        <p className="text-blue-100 text-xl font-light mb-10 max-w-2xl mx-auto">Enroll today and get access to the best curriculum designed to propel your career forward.</p>
        <Link href="/contact" className="inline-block px-10 py-5 rounded-full bg-white text-blue-600 font-bold text-xl hover:shadow-2xl hover:scale-105 transition-all duration-300">
          Contact Admissions
        </Link>
      </section>

    </div>
  );
}
