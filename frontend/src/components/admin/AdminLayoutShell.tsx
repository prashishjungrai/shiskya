"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import api from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import { LogOut, PanelLeftClose, PanelLeftOpen, Users } from "lucide-react";
import { ADMIN_PRIMARY_NAV, getAdminRouteMeta } from "@/lib/admin-navigation";

export default function AdminLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    api.get("/public/settings").then((res) => setSettings(res.data)).catch(console.error);

    if (isLoginPage) return;

    api
      .get("/auth/me")
      .then(() => setIsAuthorized(true))
      .catch(() => router.push("/admin/login"));
  }, [pathname, router, isLoginPage]);

  useEffect(() => {
    const storedValue = window.localStorage.getItem("admin-sidebar-collapsed");
    setIsSidebarCollapsed(storedValue === "true");
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "admin-sidebar-collapsed",
      String(isSidebarCollapsed),
    );
  }, [isSidebarCollapsed]);

  if (!isAuthorized && !isLoginPage) {
    return (
      <div className="admin-shell min-h-screen flex items-center justify-center bg-background text-primary">
        <div className="flex flex-col items-center gap-6">
          <div className="flex h-16 w-16 animate-pulse items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-white shadow-premium">
            {settings?.site_name?.charAt(0) || "T"}
          </div>
          <p className="font-serif italic text-primary/40 tracking-widest text-[10px] uppercase">
            Establishing Authority...
          </p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  const currentPage = getAdminRouteMeta(pathname);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      router.push("/admin/login");
    }
  };

  return (
    <div className="admin-shell flex h-screen overflow-hidden font-sans text-primary">
      <aside
        className={`relative z-20 flex flex-col border-r border-white/10 bg-primary shadow-[0_28px_90px_-42px_rgba(0,0,0,0.75)] transition-[width] duration-300 ease-out ${
          isSidebarCollapsed ? "w-28" : "w-80"
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),transparent_30%,rgba(255,255,255,0.02))]" />

        <div
          className={`h-24 border-b border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all ${
            isSidebarCollapsed ? "px-4" : "px-8"
          }`}
        >
          <div
            className={`flex h-full items-center ${
              isSidebarCollapsed ? "justify-center" : "justify-between gap-4"
            }`}
          >
            <Link
              href="/"
              className={`group flex items-center ${
                isSidebarCollapsed ? "justify-center" : "gap-4"
              }`}
              title={settings?.site_name || "Bidhya Kendra"}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white text-xl font-serif font-black text-primary shadow-premium transition-all duration-300 group-hover:-translate-y-0.5 group-hover:-rotate-2 group-hover:shadow-[0_18px_36px_-18px_rgba(255,255,255,0.35)]">
                {settings?.site_name?.charAt(0) || "T"}
              </div>
              {!isSidebarCollapsed ? (
                <div>
                  <span className="block font-serif font-bold text-lg text-white leading-none tracking-tight">
                    {settings?.site_name || "Bidhya Kendra"}
                  </span>
                  <span className="text-[9px] uppercase tracking-[0.2em] font-bold text-white/45">
                    Elite Admin
                  </span>
                </div>
              ) : null}
            </Link>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-8">
          <ul className={`space-y-2 ${isSidebarCollapsed ? "px-3" : "px-6"}`}>
            {ADMIN_PRIMARY_NAV.map((link) => {
              const active = link.matches.some((match) =>
                match === "/admin"
                  ? pathname === match
                  : pathname === match || pathname.startsWith(`${match}/`),
              );
              const Icon = link.icon;

              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    title={isSidebarCollapsed ? link.name : undefined}
                    className={`flex rounded-2xl text-[11px] font-bold uppercase tracking-widest transition-all duration-300 group ${
                      active
                        ? "bg-white text-primary shadow-premium scale-[1.01]"
                        : "text-white/50 hover:bg-white/[0.07] hover:text-white hover:translate-x-1"
                    } ${
                      isSidebarCollapsed
                        ? "justify-center px-0 py-4"
                        : "items-center gap-4 px-5 py-4"
                    }`}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                        active ? "text-primary" : "text-white/80"
                      }`}
                    />
                    {!isSidebarCollapsed ? link.name : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div
          className={`border-t border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all ${
            isSidebarCollapsed ? "p-4" : "p-8"
          }`}
        >
          <button
            onClick={handleLogout}
            title={isSidebarCollapsed ? "Terminate Session" : undefined}
            className={`flex w-full rounded-2xl border border-transparent text-[11px] font-bold uppercase tracking-widest text-white/55 transition-all duration-300 hover:border-white/10 hover:bg-white/[0.07] hover:text-white ${
              isSidebarCollapsed
                ? "justify-center px-0 py-4"
                : "items-center gap-4 px-5 py-4"
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isSidebarCollapsed ? "Terminate Session" : null}
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto relative flex flex-col">
        <header className="sticky top-0 z-10 flex h-24 items-center justify-between border-b border-primary/10 bg-white/86 px-8 backdrop-blur-md lg:px-12">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsSidebarCollapsed((current) => !current)}
              className="flex h-11 w-11 items-center justify-center rounded-2xl border border-primary/10 bg-primary/[0.03] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white hover:shadow-[0_18px_32px_-18px_rgba(0,0,0,0.45)]"
              aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isSidebarCollapsed ? (
                <PanelLeftOpen className="h-4 w-4" />
              ) : (
                <PanelLeftClose className="h-4 w-4" />
              )}
            </button>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/25">
                Admin workspace
              </p>
              <div className="mt-2 flex items-center gap-4">
                <h1 className="text-xl font-serif font-bold text-primary">{currentPage.name}</h1>
                <span className="hidden text-sm text-primary/35 xl:inline">
                  {currentPage.description}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-5 lg:gap-8">
            {currentPage.publicHref ? (
              <Link
                href={currentPage.publicHref}
                target="_blank"
                className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/40 transition-all duration-300 hover:text-primary md:flex"
              >
                Preview Page ↗
              </Link>
            ) : (
              <Link
                href="/"
                target="_blank"
                className="hidden items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-primary/40 transition-all duration-300 hover:text-primary md:flex"
              >
                Public Site ↗
              </Link>
            )}
            <div className="group flex h-10 w-10 items-center justify-center rounded-full border border-primary/10 bg-primary/[0.03] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary">
              <Users className="w-4 h-4 text-primary/60 transition-colors duration-300 group-hover:text-white" />
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-7xl mx-auto w-full flex-1">{children}</div>
      </main>
    </div>
  );
}
