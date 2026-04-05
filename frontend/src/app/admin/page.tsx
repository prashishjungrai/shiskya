"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import api from "@/lib/api";
import {
  EditorPanel,
  PublicPreviewLink,
  ShortcutCard,
} from "@/components/admin/EditorToolkit";
import {
  ADMIN_COLLECTION_SHORTCUTS,
  ADMIN_PRIMARY_NAV,
} from "@/lib/admin-navigation";
import {
  Banner,
  ContactSubmission,
  Course,
  Notice,
  SiteSettings,
  Teacher,
  Testimonial,
} from "@/lib/types";

type DashboardStats = {
  courses: number;
  teachers: number;
  banners: number;
  testimonials: number;
  notices: number;
  unreadContacts: number;
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [settings, setSettings] = useState<SiteSettings | null>(null);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [siteSettings, c, t, b, tes, n, contacts] = await Promise.all([
          api.get("/public/settings"),
          api.get("/admin/courses"),
          api.get("/admin/teachers"),
          api.get("/admin/banners"),
          api.get("/admin/testimonials"),
          api.get("/admin/notices"),
          api.get("/admin/contacts"),
        ]);

        const courses = c.data as Course[];
        const teachers = t.data as Teacher[];
        const banners = b.data as Banner[];
        const testimonials = tes.data as Testimonial[];
        const notices = n.data as Notice[];
        const contactItems = contacts.data as ContactSubmission[];

        setSettings(siteSettings.data);
        setStats({
          courses: courses.length,
          teachers: teachers.length,
          banners: banners.length,
          testimonials: testimonials.length,
          notices: notices.length,
          unreadContacts: contactItems.filter((item) => !item.is_read).length,
        });
      } catch (err) {
        console.error("Failed to load metrics", err);
      }
    };
    fetchMetrics();
  }, []);

  if (!stats) return (
    <div className="flex flex-col gap-6 animate-pulse">
       <div className="h-20 w-1/3 bg-primary/5 rounded-2xl" />
       <div className="grid grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-32 bg-primary/5 rounded-3xl" />)}
       </div>
    </div>
  );

  const pageCards = ADMIN_PRIMARY_NAV.filter((item) => item.href !== "/admin");

  const pageStats: Record<string, { label: string; value: string | number }> = {
    "/admin/home": { label: "Home tools", value: 5 },
    "/admin/courses": { label: "Programs", value: stats.courses },
    "/admin/teachers": { label: "Faculty", value: stats.teachers },
    "/admin/about": { label: "Narrative", value: settings?.about_content ? "Ready" : "Empty" },
    "/admin/contact": { label: "Unread inquiries", value: stats.unreadContacts },
    "/admin/global": { label: "Global areas", value: 4 },
  };

  return (
    <div className="space-y-12">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/25">
          Control surface
        </p>
        <h2 className="mt-3 text-4xl font-serif font-bold tracking-tight text-primary">
          Page First <span className="italic text-primary/40">Admin</span>
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary/45">
          Every primary admin route now mirrors a public page. Start from the page you want to
          change, then drop into the underlying collection manager only when needed.
        </p>
      </header>

      <div className="grid gap-8 xl:grid-cols-3">
        {pageCards.map((page) => (
          <div
            key={page.href}
            className="group rounded-[34px] border border-primary/10 bg-white p-8 shadow-premium transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:bg-primary/[0.015] hover:shadow-[0_28px_70px_-34px_rgba(0,0,0,0.28)]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="rounded-2xl bg-primary/[0.05] p-4 text-primary/65 transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                <page.icon className="h-6 w-6" />
              </div>
              <Link
                href={page.href}
                className="rounded-full p-2 text-primary/20 transition-all duration-300 hover:bg-primary hover:text-white"
                aria-label={`Open ${page.name} editor`}
              >
                <ArrowUpRight className="h-5 w-5 transition-all group-hover:-translate-y-1 group-hover:translate-x-1" />
              </Link>
            </div>
            <h3 className="mt-8 text-2xl font-serif font-bold text-primary">{page.name}</h3>
            <p className="mt-3 text-sm leading-relaxed text-primary/45">{page.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {page.sections.map((section) => (
                <span
                  key={section}
                  className="rounded-full border border-primary/10 bg-primary/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/45"
                >
                  {section}
                </span>
              ))}
            </div>
            <div className="mt-8 flex items-end justify-between gap-4 border-t border-primary/5 pt-6">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/25">
                  {pageStats[page.href].label}
                </p>
                <p className="mt-2 text-3xl font-serif font-bold text-primary">
                  {pageStats[page.href].value}
                </p>
              </div>
              <div className="flex flex-col items-end gap-3">
                <Link
                  href={page.href}
                  className="text-[10px] font-bold uppercase tracking-widest text-primary/55 transition-colors duration-300 group-hover:text-primary"
                >
                  Open editor
                </Link>
                {page.publicHref ? <PublicPreviewLink href={page.publicHref} /> : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      <EditorPanel
        title="Underlying Collection Tools"
        description="Advanced collection managers remain available, but now they sit underneath the page-first routes instead of being the main navigation."
      >
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {ADMIN_COLLECTION_SHORTCUTS.map((item) => {
            const statMap: Record<string, string | number> = {
              "/admin/banners": stats.banners,
              "/admin/testimonials": stats.testimonials,
              "/admin/notices": stats.notices,
              "/admin/contacts": `${stats.unreadContacts} unread`,
            };

            return (
              <ShortcutCard
                key={item.href}
                href={item.href}
                title={item.name}
                description={item.description}
                statLabel="Current status"
                statValue={statMap[item.href]}
              />
            );
          })}
        </div>
      </EditorPanel>
    </div>
  );
}
