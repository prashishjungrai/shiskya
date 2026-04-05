"use client";

import type { CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Quote, Sparkles } from "lucide-react";
import { ABOUT_ICON_MAP, getTextStyle, normalizeAboutPage } from "@/lib/about-page";
import type {
  AboutBadgeStyle,
  AboutButtonStyle,
  AboutPageSettings,
  AboutStatementSettings,
  SiteSettings,
} from "@/lib/types";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 210, damping: 22 },
  },
};

type AboutPageViewProps = {
  settings: SiteSettings | null;
  interactive?: boolean;
};

function badgeStyle(style: AboutBadgeStyle): CSSProperties {
  return {
    color: style.text_color,
    background: style.background,
    borderColor: style.border_color,
  };
}

function panelStyle(background: string, borderColor: string): CSSProperties {
  return { background, borderColor };
}

function buttonStyle(style: AboutButtonStyle): CSSProperties {
  return {
    background: style.background,
    color: style.text_color,
    borderColor: style.border_color,
  };
}

function AboutActionLink({
  href,
  label,
  style,
  variant = "solid",
}: {
  href: string;
  label: string;
  style: AboutButtonStyle;
  variant?: "solid" | "outline";
}) {
  if (!label.trim()) return null;

  return (
    <Link
      href={href || "#"}
      className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-semibold transition-transform hover:-translate-y-0.5 ${
        variant === "solid" ? "shadow-[0_18px_40px_-28px_rgba(15,23,42,0.45)]" : ""
      }`}
      style={buttonStyle(style)}
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function StatementCard({
  section,
  previewSection,
}: {
  section: AboutStatementSettings;
  previewSection?: string;
}) {
  const Icon = ABOUT_ICON_MAP[section.icon] || ABOUT_ICON_MAP.target;

  return (
    <div
      data-preview-section={previewSection}
      className="rounded-[34px] border px-8 py-8 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.36)]"
      style={panelStyle(section.style.panel_background, section.style.panel_border_color)}
    >
      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
        style={{ background: section.style.icon_background }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 tracking-[-0.03em]" style={getTextStyle(section.style.heading)}>
        {section.title}
      </h3>
      <p className="mt-4 leading-relaxed" style={getTextStyle(section.style.body)}>
        {section.content}
      </p>
    </div>
  );
}

export default function AboutPageView({
  settings,
  interactive = true,
}: AboutPageViewProps) {
  const { scrollY } = useScroll();
  const accentY = useTransform(scrollY, [0, 900], [0, interactive ? 62 : 0]);

  if (!settings) return null;

  const aboutPage = normalizeAboutPage(settings.about_page, settings.site_name, settings.about_content);
  const stats = aboutPage.stats_band.stats;
  const heroStats = aboutPage.visibility.hero_stats ? stats : [];
  const visibleStatements = [
    aboutPage.visibility.mission ? aboutPage.mission : null,
    aboutPage.visibility.vision ? aboutPage.vision : null,
  ].filter(Boolean) as AboutStatementSettings[];
  const visiblePrinciples = aboutPage.visibility.principles
    ? aboutPage.principles.items.filter((item) => item.title.trim() || item.description.trim())
    : [];

  return (
    <div
      className={`min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_24%,#ffffff_58%,#f8fafc_100%)] ${
        interactive ? "" : "pointer-events-none select-none"
      }`}
    >
      {aboutPage.visibility.hero ? (
        <section
          id="about-hero"
          data-preview-section="about-hero"
          className="relative overflow-hidden px-6 pb-28 pt-36 text-white"
        >
          <div
            className="absolute inset-0"
            style={{ background: aboutPage.hero.style.section_background }}
          />
          <motion.div
            style={{ y: accentY }}
            className="pointer-events-none absolute right-[-8rem] top-[-6rem] h-[34rem] w-[34rem] rounded-full bg-white/10 blur-[120px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:88px_88px] opacity-10" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <motion.div
              initial={interactive ? { opacity: 0, y: 22 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={interactive ? { duration: 0.65 } : { duration: 0 }}
              className={`grid gap-10 ${
                aboutPage.visibility.hero_quote_card
                  ? "lg:grid-cols-[1.05fr_0.95fr] lg:items-end"
                  : ""
              }`}
            >
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.24em]"
                  style={badgeStyle(aboutPage.hero.style.badge)}
                >
                  <Sparkles className="h-4 w-4" />
                  {aboutPage.hero.badge_text}
                </div>
                <h1 className="mt-6 max-w-4xl text-balance tracking-[-0.045em]" style={getTextStyle(aboutPage.hero.style.heading)}>
                  {aboutPage.hero.heading}
                </h1>
                <p className="mt-5 max-w-3xl leading-relaxed" style={getTextStyle(aboutPage.hero.style.description)}>
                  {aboutPage.hero.description}
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                  <AboutActionLink
                    href={aboutPage.hero.primary_cta_link}
                    label={aboutPage.hero.primary_cta_label}
                    style={aboutPage.hero.style.primary_button}
                  />
                  <AboutActionLink
                    href={aboutPage.hero.secondary_cta_link}
                    label={aboutPage.hero.secondary_cta_label}
                    style={aboutPage.hero.style.secondary_button}
                    variant="outline"
                  />
                </div>
              </div>

              {aboutPage.visibility.hero_quote_card ? (
                <div
                  className="rounded-[32px] border p-5 shadow-[0_26px_90px_-48px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
                  style={panelStyle(
                    aboutPage.hero.style.panel_background,
                    aboutPage.hero.style.panel_border_color,
                  )}
                >
                  <div
                    className="rounded-[26px] border p-6"
                    style={panelStyle(
                      aboutPage.hero.style.quote_panel_background,
                      aboutPage.hero.style.quote_panel_border_color,
                    )}
                  >
                    <Quote className="h-10 w-10 text-white/45" />
                    <p className="mt-5 leading-tight" style={getTextStyle(aboutPage.hero.style.quote_title)}>
                      {aboutPage.hero.quote_title}
                    </p>
                    <p className="mt-4 leading-relaxed" style={getTextStyle(aboutPage.hero.style.quote_body)}>
                      {aboutPage.hero.quote_body}
                    </p>
                  </div>

                  {heroStats.length > 0 ? (
                    <div
                      className={`mt-4 grid gap-3 ${
                        heroStats.length === 1
                          ? "sm:grid-cols-1"
                          : heroStats.length === 2
                            ? "sm:grid-cols-2"
                            : "sm:grid-cols-3"
                      }`}
                    >
                      {heroStats.map((stat) => (
                        <div
                          key={stat.id}
                          className="rounded-[22px] border px-4 py-4"
                          style={panelStyle(
                            aboutPage.hero.style.quote_panel_background,
                            aboutPage.hero.style.quote_panel_border_color,
                          )}
                        >
                          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                            {stat.label}
                          </p>
                          <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : null}
            </motion.div>
          </div>
        </section>
      ) : null}

      {(aboutPage.visibility.narrative || visibleStatements.length > 0) ? (
        <section
          id="about-narrative"
          data-preview-section="about-narrative"
          className={`relative z-10 mx-auto max-w-7xl px-6 ${aboutPage.visibility.hero ? "-mt-14" : "pt-24"}`}
        >
          <motion.div
            variants={containerVariants}
            initial={interactive ? "hidden" : false}
            animate={interactive ? undefined : "show"}
            whileInView={interactive ? "show" : undefined}
            viewport={interactive ? { once: true, margin: "-120px" } : undefined}
            className={`grid gap-6 ${visibleStatements.length > 0 && aboutPage.visibility.narrative ? "xl:grid-cols-[1.06fr_0.94fr]" : ""}`}
          >
            <div data-preview-section="about-mission" className="sr-only" />
            <div data-preview-section="about-vision" className="sr-only" />
            {aboutPage.visibility.narrative ? (
              <motion.div
                variants={itemVariants}
                className="rounded-[34px] border px-8 py-9 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.36)]"
                style={panelStyle(
                  aboutPage.narrative.style.panel_background,
                  aboutPage.narrative.style.panel_border_color,
                )}
              >
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.26em]"
                  style={badgeStyle(aboutPage.narrative.style.badge)}
                >
                  {aboutPage.narrative.badge_text}
                </p>
                <h2 className="mt-4 text-balance tracking-[-0.04em]" style={getTextStyle(aboutPage.narrative.style.heading)}>
                  {aboutPage.narrative.heading}
                </h2>
                <div className="mt-8 whitespace-pre-wrap leading-relaxed" style={getTextStyle(aboutPage.narrative.style.body)}>
                  {aboutPage.narrative.content}
                </div>
              </motion.div>
            ) : null}

            {visibleStatements.length > 0 ? (
              <motion.div variants={itemVariants} className="grid gap-6">
                {visibleStatements.map((statement) => (
                  <StatementCard
                    key={`${statement.title}-${statement.icon}`}
                    section={statement}
                    previewSection={
                      statement === aboutPage.mission ? "about-mission" : "about-vision"
                    }
                  />
                ))}
              </motion.div>
            ) : null}
          </motion.div>
        </section>
      ) : null}

      {visiblePrinciples.length > 0 ? (
        <section
          id="about-principles"
          data-preview-section="about-principles"
          className="mx-auto max-w-7xl px-6 py-24"
        >
          <motion.div
            variants={containerVariants}
            initial={interactive ? "hidden" : false}
            animate={interactive ? undefined : "show"}
            whileInView={interactive ? "show" : undefined}
            viewport={interactive ? { once: true, margin: "-120px" } : undefined}
            className="grid gap-6 lg:grid-cols-3"
          >
            {visiblePrinciples.map((item) => {
              const Icon = ABOUT_ICON_MAP[item.icon] || ABOUT_ICON_MAP.shield;

              return (
                <motion.div
                  key={item.id}
                  variants={itemVariants}
                  className="rounded-[30px] border px-6 py-7 shadow-[0_24px_70px_-58px_rgba(15,23,42,0.35)]"
                  style={panelStyle(
                    aboutPage.principles.style.panel_background,
                    aboutPage.principles.style.panel_border_color,
                  )}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ background: aboutPage.principles.style.icon_background }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-5 tracking-[-0.03em]" style={getTextStyle(aboutPage.principles.style.heading)}>
                    {item.title}
                  </h3>
                  <p className="mt-3 leading-relaxed" style={getTextStyle(aboutPage.principles.style.body)}>
                    {item.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      ) : null}

      {aboutPage.visibility.stats_band && stats.length > 0 ? (
        <section
          id="about-stats-band"
          data-preview-section="about-stats-band"
          className="relative overflow-hidden px-6 py-24 text-white"
          style={{ background: aboutPage.stats_band.style.section_background }}
        >
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_30%)]" />
          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.26em]"
                  style={badgeStyle(aboutPage.stats_band.style.badge)}
                >
                  {aboutPage.stats_band.badge_text}
                </p>
                <h2 className="mt-4 text-balance tracking-[-0.04em]" style={getTextStyle(aboutPage.stats_band.style.heading)}>
                  {aboutPage.stats_band.heading}
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed" style={getTextStyle(aboutPage.stats_band.style.body)}>
                  {aboutPage.stats_band.description}
                </p>
              </div>

              <div
                className={`grid gap-4 ${
                  stats.length === 1 ? "sm:grid-cols-1" : stats.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3"
                }`}
              >
                {stats.map((stat) => (
                  <div
                    key={stat.id}
                    className="rounded-[28px] border px-5 py-6 text-center backdrop-blur-xl"
                    style={panelStyle(
                      aboutPage.stats_band.style.stat_panel_background,
                      aboutPage.stats_band.style.stat_panel_border_color,
                    )}
                  >
                    <p className="tracking-[-0.05em]" style={getTextStyle(aboutPage.stats_band.style.stat_value)}>
                      {stat.value}
                    </p>
                    <p className="mt-3 uppercase tracking-[0.26em]" style={getTextStyle(aboutPage.stats_band.style.stat_label)}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {aboutPage.visibility.final_cta ? (
        <section
          id="about-final-cta"
          data-preview-section="about-final-cta"
          className="mx-auto max-w-7xl px-6 py-24"
        >
          <div
            className="overflow-hidden rounded-[34px] border px-8 py-10 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.36)]"
            style={panelStyle(
              aboutPage.final_cta.style.panel_background,
              aboutPage.final_cta.style.panel_border_color,
            )}
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p
                  className="text-[10px] font-bold uppercase tracking-[0.26em]"
                  style={badgeStyle(aboutPage.final_cta.style.badge)}
                >
                  {aboutPage.final_cta.badge_text}
                </p>
                <h2 className="mt-4 text-balance tracking-[-0.04em]" style={getTextStyle(aboutPage.final_cta.style.heading)}>
                  {aboutPage.final_cta.heading}
                </h2>
                <p className="mt-4 max-w-2xl leading-relaxed" style={getTextStyle(aboutPage.final_cta.style.body)}>
                  {aboutPage.final_cta.description}
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row">
                <AboutActionLink
                  href={aboutPage.final_cta.primary_cta_link}
                  label={aboutPage.final_cta.primary_cta_label}
                  style={aboutPage.final_cta.style.primary_button}
                />
                <AboutActionLink
                  href={aboutPage.final_cta.secondary_cta_link}
                  label={aboutPage.final_cta.secondary_cta_label}
                  style={aboutPage.final_cta.style.secondary_button}
                  variant="outline"
                />
              </div>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}
