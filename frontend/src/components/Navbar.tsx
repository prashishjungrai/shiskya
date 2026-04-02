"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, BookOpen, Users, Phone, Info } from "lucide-react";
import api from "@/lib/api";
import { SiteSettings } from "@/lib/types";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  useEffect(() => {
    api.get("/public/settings").then(res => setSettings(res.data)).catch(console.error);
  }, []);

  const links = [
    { name: "Home", href: "/", icon: null },
    { name: "Courses", href: "/courses", icon: BookOpen },
    { name: "Instructors", href: "/teachers", icon: Users },
    { name: "About", href: "/about", icon: Info },
    { name: "Contact", href: "/contact", icon: Phone },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-white/80 backdrop-blur-lg border-b border-gray-100 shadow-sm py-4"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:shadow-blue-500/50 transition-all duration-300 transform group-hover:scale-105">
              {settings?.institute_name?.charAt(0) || "T"}
            </div>
            <span className={`font-extrabold tracking-tight text-2xl transition-colors ${isScrolled ? 'text-gray-900' : 'text-gray-900 md:text-white drop-shadow-md'}`}>
              {settings?.institute_name || "TuitionHub"}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1 bg-white/10 backdrop-blur-md rounded-full px-2 py-1 border border-white/20 shadow-inner">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`relative px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    active 
                      ? "text-blue-600 bg-white shadow-sm" 
                      : isScrolled ? "text-gray-600 hover:text-black hover:bg-gray-50/50" : "text-white hover:bg-white/20"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block">
            <Link href="/contact" className="px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium text-sm hover:shadow-lg hover:shadow-blue-500/30 transition-all hover:-translate-y-0.5 inline-block">
              Enroll Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className={`md:hidden p-2 rounded-lg ${isScrolled ? "text-gray-900" : "text-gray-900 bg-white/80"}`}
          >
            <Menu className="w-6 h-6" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-white/90 backdrop-blur-2xl p-6 md:hidden flex flex-col pt-24">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-6 right-6 p-2 text-gray-500 hover:text-gray-900 bg-gray-100 rounded-full"
          >
            <X className="w-6 h-6" />
          </button>
          
          <nav className="flex flex-col gap-6 text-2xl font-bold tracking-tight text-gray-900">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-4 border-b border-gray-100 pb-4 ${
                  pathname === link.href ? "text-blue-600" : "text-gray-400"
                }`}
              >
                {link.icon && <link.icon className="w-6 h-6" />}
                {link.name}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto pb-8">
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block w-full py-4 text-center rounded-2xl bg-blue-600 text-white font-bold text-lg">
              Get Started
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
