"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Menu, X, BookOpen, Users, Phone, Info } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Navbar({
  pathnameOverride,
  embedded = false,
}: {
  pathnameOverride?: string;
  embedded?: boolean;
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const settings = useTheme();
  const pathname = pathnameOverride || usePathname();
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    if (!embedded) {
      setIsScrolled(latest > 50);
    }
  });

  const navIsScrolled = embedded ? false : isScrolled;

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
        data-preview-section="site-navbar"
        id="site-navbar"
        initial={embedded ? false : { y: -100 }}
        animate={embedded ? undefined : { y: 0 }}
        transition={embedded ? undefined : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`${embedded ? "absolute" : "fixed"} inset-x-0 top-0 z-50 px-4 py-4 transition-all duration-500 ease-out md:px-6 md:py-6`}
      >
        <div 
          className="max-w-6xl mx-auto flex justify-between items-center px-4 py-2.5 md:px-6 md:py-3 rounded-[2rem] transition-all duration-500"
          style={{
            background: navIsScrolled ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.1)",
            backdropFilter: navIsScrolled ? "blur(24px) saturate(150%)" : "blur(12px)",
            border: navIsScrolled ? "1px solid rgba(255,255,255,0.8)" : "1px solid rgba(255,255,255,0.2)",
            boxShadow: navIsScrolled ? "0 10px 40px -10px rgba(0,0,0,0.08)" : "none",
          }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group relative z-10">
            {settings?.logo_url ? (
               <div className="w-10 h-10 rounded-[14px] bg-white overflow-hidden shadow-sm border border-white/20 group-hover:shadow-md transition-all duration-300">
                  <img src={settings.logo_url} alt={settings.site_name} className="w-full h-full object-cover" />
               </div>
            ) : (
              <div
                className="w-10 h-10 rounded-[14px] flex items-center justify-center text-white font-bold text-xl shadow-md border border-white/20 group-hover:scale-105 group-hover:-rotate-3 transition-all duration-300"
                style={{ background: `linear-gradient(135deg, var(--color-primary, #2563eb), var(--color-accent, #4f46e5))` }}
              >
                {settings?.site_name?.charAt(0) || "T"}
              </div>
            )}
            <span
              className="font-extrabold tracking-tight text-xl md:text-2xl transition-colors drop-shadow-sm"
              style={{
                color: navIsScrolled ? "var(--color-primary, #0f172a)" : "#fff",
                fontFamily: "var(--font-serif, 'Playfair Display'), serif"
              }}
            >
              {settings?.site_name || "TuitionHub"}
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            {links.map((link) => {
              const active = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative px-5 py-2 text-sm font-semibold transition-all duration-300 rounded-full group overflow-hidden"
                  style={{
                    color: active
                      ? "var(--color-primary, #2563eb)"
                      : navIsScrolled
                        ? "var(--color-text, #374151)"
                        : "rgba(255,255,255,0.9)",
                  }}
                >
                  <span className="relative z-10">{link.name}</span>
                  {active && (
                    <motion.div 
                      layoutId="navbar-active-pill"
                      className="absolute inset-0 rounded-full z-0"
                      style={{ background: navIsScrolled ? "#fff" : "rgba(255,255,255,0.2)", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
                    />
                  )}
                  {!active && (
                    <div className="absolute inset-0 rounded-full z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                         style={{ background: navIsScrolled ? "rgba(0,0,0,0.03)" : "rgba(255,255,255,0.1)" }} />
                  )}
                </Link>
              );
            })}
          </div>

          <div className="hidden md:block relative z-10">
            <Link
              href="/contact"
              className="group relative px-7 py-2.5 rounded-full text-white font-bold text-sm overflow-hidden inline-flex items-center gap-2"
              style={{ background: `var(--color-primary, #2563eb)` }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10">Enroll Now</span>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden relative z-10 p-2.5 rounded-xl border transition-colors"
            style={{ 
              color: navIsScrolled ? "var(--color-primary, #000)" : "#fff", 
              background: navIsScrolled ? "#fff" : "rgba(255,255,255,0.1)",
              borderColor: navIsScrolled ? "rgba(0,0,0,0.05)" : "transparent"
            }}
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
          animate={{ opacity: 1, backdropFilter: "blur(40px)" }}
          className={`${embedded ? "absolute" : "fixed"} inset-0 z-[100] bg-white/60 p-6 flex flex-col pt-24 md:hidden`}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/40 pointer-events-none" />
          
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="absolute top-8 right-6 p-4 text-gray-500 hover:text-gray-900 bg-white shadow-xl hover:shadow-2xl rounded-full transition-all border border-gray-100 z-10"
          >
            <X className="w-6 h-6" />
          </button>

          <nav className="flex flex-col gap-4 text-2xl font-black tracking-tight relative z-10">
            {links.map((link, i) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1, ease: "easeOut" }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-4 bg-white/50 p-5 rounded-[24px] border border-white"
                  style={{ color: pathname === link.href ? "var(--color-primary)" : "#64748b" }}
                >
                  {link.icon && <link.icon className="w-6 h-6" />}
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </nav>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-auto pb-8 relative z-10"
          >
            <Link
              href="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-5 text-center rounded-[24px] text-white font-bold text-lg shadow-xl"
              style={{ background: "var(--color-primary, #2563eb)" }}
            >
              Get Started
            </Link>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
