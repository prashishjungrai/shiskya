"use client";

import { ReactNode } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

type Props = {
  children: ReactNode;
  pathnameOverride?: string;
  embedded?: boolean;
};

export default function PublicSiteChrome({
  children,
  pathnameOverride,
  embedded = false,
}: Props) {
  const showAnimatedBackdrop = !embedded;

  return (
    <div
      className="relative flex min-h-screen flex-col overflow-hidden"
      style={{
        background: "var(--color-bg, #f8fafc)",
        color: "var(--color-text, #0f172a)",
        fontFamily: "var(--font-sans, Inter), sans-serif",
      }}
    >
      <a
        href="#main-content"
        className="sr-only z-50 rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white focus:not-sr-only focus:absolute focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden opacity-40 mix-blend-multiply">
        <div
          className={`${showAnimatedBackdrop ? "animate-blob" : ""} absolute -left-[10%] -top-[20%] h-[50%] w-[50%] rounded-full opacity-60 blur-[120px] mix-blend-multiply`}
          style={{ background: "var(--color-primary, #3b82f6)" }}
        />
        <div
          className={`${showAnimatedBackdrop ? "animate-blob animation-delay-2000" : ""} absolute -right-[10%] top-[20%] h-[40%] w-[40%] rounded-full opacity-60 blur-[120px] mix-blend-multiply`}
          style={{ background: "var(--color-accent, #8b5cf6)" }}
        />
        <div
          className={`${showAnimatedBackdrop ? "animate-blob animation-delay-4000" : ""} absolute -bottom-[20%] left-[20%] h-[60%] w-[60%] rounded-full opacity-60 blur-[120px] mix-blend-multiply`}
          style={{ background: "var(--color-primary, #3b82f6)" }}
        />
      </div>

      <Navbar pathnameOverride={pathnameOverride} embedded={embedded} />
      <main id="main-content" className="relative z-10 flex w-full flex-1 flex-col">
        {children}
      </main>
      <Footer />

      {showAnimatedBackdrop ? (
        <style jsx global>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          .animate-blob {
            animation: blob 15s infinite alternate ease-in-out;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          @media (prefers-reduced-motion: reduce) {
            .animate-blob {
              animation: none;
            }
          }
        `}</style>
      ) : null}
    </div>
  );
}
