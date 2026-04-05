"use client";

import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";

export default function Footer() {
  const settings = useTheme();

  const socialLinks = [
    { label: "Facebook", href: settings?.social_links?.facebook },
    { label: "Instagram", href: settings?.social_links?.instagram },
    { label: "YouTube", href: settings?.social_links?.youtube },
    { label: "TikTok", href: settings?.social_links?.tiktok },
  ].filter((item) => item.href);

  return (
    <footer
      data-preview-section="site-footer"
      id="site-footer"
      className="relative mt-16 overflow-hidden border-t border-white/8"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--color-primary, #0f172a) 92%, #020617 8%) 0%, #06101d 100%)",
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent" />
      <div className="ambient-drift pointer-events-none absolute -right-24 top-[-6rem] h-72 w-72 rounded-full bg-white/6 blur-[90px]" />
      <div className="ambient-drift-reverse pointer-events-none absolute -left-16 bottom-[-8rem] h-80 w-80 rounded-full bg-[color:var(--color-accent)] opacity-10 blur-[120px]" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-7 pt-14 md:px-10">
        <div className="grid gap-10 border-b border-white/8 pb-10 lg:grid-cols-[1.25fr_0.7fr_0.8fr_1fr]">
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              {settings?.logo_url ? (
                <div className="h-10 w-10 overflow-hidden rounded-2xl border border-white/12 bg-white p-0.5 shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={settings.logo_url}
                    alt={settings.site_name}
                    className="h-full w-full rounded-[14px] object-cover"
                  />
                </div>
              ) : (
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 text-lg font-bold text-white transition-transform duration-300 group-hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary, #0f172a) 0%, var(--color-accent, #38bdf8) 100%)",
                  }}
                >
                  {settings?.site_name?.charAt(0) || "T"}
                </div>
              )}
              <span
                className="text-2xl font-bold tracking-tight text-white"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                {settings?.site_name || "Tuition Institute"}
              </span>
            </Link>

            <p className="max-w-md text-sm leading-7 text-white/72">
              {settings?.footer_content?.description ||
                "Premium academic guidance, visible faculty, and a clearer admissions path for students who want confident next steps."}
            </p>

            <div className="flex flex-wrap gap-3">
              {settings?.contact_info?.email ? (
                <a
                  href={`mailto:${settings.contact_info.email}`}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.1] hover:text-white"
                >
                  {settings.contact_info.email}
                </a>
              ) : null}
              {settings?.contact_info?.phone?.[0] ? (
                <a
                  href={`tel:${settings.contact_info.phone[0]}`}
                  className="rounded-full border border-white/10 bg-white/[0.06] px-4 py-2.5 text-sm font-medium text-white/78 transition-colors hover:bg-white/[0.1] hover:text-white"
                >
                  {settings.contact_info.phone[0]}
                </a>
              ) : null}
            </div>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/44">
              Explore
            </h4>
            <ul className="mt-5 space-y-3.5 text-sm">
              {[
                { label: "Courses", href: "/courses" },
                { label: "Instructors", href: "/teachers" },
                { label: "About", href: "/about" },
                { label: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/68 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/44">
              Reach Us
            </h4>
            <div className="mt-5 space-y-4 rounded-[26px] border border-white/10 bg-white/[0.05] p-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                  Address
                </p>
                <p className="mt-2 text-sm leading-6 text-white/78">
                  {settings?.contact_info?.address || "123 Education Lane"}
                </p>
              </div>
              {settings?.contact_info?.hours ? (
                <div className="border-t border-white/10 pt-4">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                    Office Hours
                  </p>
                  <p className="mt-2 text-sm text-white/82">{settings.contact_info.hours}</p>
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/44">
                Social
              </h4>
              <ul className="mt-5 space-y-3.5 text-sm">
                {socialLinks.length > 0 ? (
                  socialLinks.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-white/68 transition-colors hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4 text-white/42" />
                        {item.label}
                      </a>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-white/50">No social links configured</li>
                )}
              </ul>
            </div>

            <div className="rounded-[24px] border border-white/10 bg-white/[0.05] p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/40">
                Admin Access
              </p>
              <p className="mt-2 text-sm leading-6 text-white/68">
                Internal portal for institutional publishing and page management.
              </p>
              <Link
                href="/admin/login"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/12 px-4 py-2.5 text-xs font-bold uppercase tracking-[0.18em] text-white/80 transition-all hover:bg-white/[0.08] hover:text-white"
              >
                Institutional Portal
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 pt-6 md:flex-row md:items-center md:justify-between">
          <p className="text-xs tracking-[0.12em] text-white/46">
            {settings?.footer_content?.copyright ||
              `© ${new Date().getFullYear()} ${settings?.site_name || "Tuition Institute"}. All rights reserved.`}
          </p>
          <p className="text-xs text-white/38">
            Designed for clarity, faster decisions, and a stronger admissions flow.
          </p>
        </div>
      </div>
    </footer>
  );
}
