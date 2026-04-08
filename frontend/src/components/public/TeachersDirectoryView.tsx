"use client";

import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BriefcaseBusiness,
  Search,
  ShieldCheck,
  Users,
  X,
} from "lucide-react";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/seo/Breadcrumbs";
import { resolveMediaUrl } from "@/lib/media";
import {
  getTeachersTextStyle,
  normalizeTeachersPage,
  TEACHERS_ICON_MAP,
} from "@/lib/teachers-page";
import { getTeacherPath } from "@/lib/teachers";
import type { Teacher, TeachersPageSettings } from "@/lib/types";

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
} as const;

const itemVariants = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring" as const, stiffness: 205, damping: 22 },
  },
};

export default function TeachersDirectoryView({
  teachers,
  settings,
  siteName,
  breadcrumbs = [],
  interactive = true,
}: {
  teachers: Teacher[];
  settings?: TeachersPageSettings;
  siteName?: string;
  breadcrumbs?: BreadcrumbItem[];
  interactive?: boolean;
}) {
  const teachersPage = useMemo(() => normalizeTeachersPage(settings, siteName), [settings, siteName]);
  const allSubjectsLabel = teachersPage.filter_bar.all_subjects_label;
  const [query, setQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState(allSubjectsLabel);
  const deferredQuery = useDeferredValue(query);
  const { scrollY } = useScroll();
  const accentY = useTransform(scrollY, [0, 900], [0, interactive ? 56 : 0]);

  const subjectOptions = useMemo(
    () =>
      [
        allSubjectsLabel,
        ...Array.from(
          new Set(
            teachers
              .map((teacher) => teacher.subject?.trim())
              .filter(Boolean) as string[],
          ),
        ),
      ].slice(0, 8),
    [allSubjectsLabel, teachers],
  );
  const safeActiveSubject = subjectOptions.includes(activeSubject)
    ? activeSubject
    : allSubjectsLabel;

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const normalizedSubject =
    safeActiveSubject === allSubjectsLabel ? null : safeActiveSubject.toLowerCase();

  const filteredTeachers = teachers.filter((teacher) => {
    const matchesSubject = normalizedSubject
      ? (teacher.subject || "").toLowerCase() === normalizedSubject
      : true;
    const matchesQuery = normalizedQuery
      ? [teacher.name, teacher.subject, teacher.qualification, teacher.bio]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery))
      : true;

    return matchesSubject && matchesQuery;
  });

  const spotlightTeacher = filteredTeachers[0] || null;
  const rosterTeachers = teachersPage.visibility.spotlight
    ? filteredTeachers.slice(1, 5)
    : filteredTeachers.slice(0, 4);
  const hero = teachersPage.hero;
  const filterBar = teachersPage.filter_bar;
  const spotlight = teachersPage.spotlight;
  const roster = teachersPage.roster;
  const principles = teachersPage.principles;
  const cta = teachersPage.cta;

  const facultyMetricValue = hero.faculty_metric_value.trim() || `${teachers.length}+`;
  const subjectsMetricValue =
    hero.subjects_metric_value.trim() || `${Math.max(subjectOptions.length - 1, 1)}`;

  return (
    <div
      className={`min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_26%,#ffffff_56%,#f8fafc_100%)] ${
        interactive ? "" : "pointer-events-none select-none"
      }`}
    >
      {teachersPage.visibility.hero ? (
        <section
          id="teachers-hero"
          data-preview-section="teachers-hero"
          className="relative overflow-hidden px-6 pb-28 pt-36 text-white"
        >
          <div
            className="absolute inset-0"
            style={{ background: hero.style.section_background }}
          />
          <motion.div
            style={{ y: accentY }}
            className="pointer-events-none absolute left-[-8rem] top-[-6rem] h-[30rem] w-[30rem] rounded-full bg-white/10 blur-[110px]"
          />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:88px_88px] opacity-10" />

          <div className="relative z-10 mx-auto max-w-7xl">
            {breadcrumbs.length > 0 ? (
              <Breadcrumbs items={breadcrumbs} variant="light" className="mb-6" />
            ) : null}
            <motion.div
              initial={interactive ? { opacity: 0, y: 22 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={interactive ? { duration: 0.65 } : { duration: 0 }}
              className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-end"
            >
              <div>
                <div
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
                  style={{
                    color: hero.style.badge.text_color,
                    background: hero.style.badge.background,
                    borderColor: hero.style.badge.border_color,
                  }}
                >
                  <Users className="h-4 w-4" />
                  <span
                    className="text-xs uppercase tracking-[0.24em]"
                    style={getTeachersTextStyle({
                      ...hero.style.badge,
                      size: "12px",
                      font_family: "sans",
                      font_style: "normal",
                      font_weight: "700",
                      color: hero.style.badge.text_color,
                    })}
                  >
                    {hero.badge_text}
                  </span>
                </div>
                <h1
                  className="mt-6 max-w-4xl text-balance tracking-[-0.045em]"
                  style={getTeachersTextStyle(hero.style.heading)}
                >
                  {hero.heading}
                </h1>
                <p
                  className="mt-5 max-w-3xl leading-relaxed"
                  style={getTeachersTextStyle(hero.style.description)}
                >
                  {hero.description}
                </p>
              </div>

              <div
                className="rounded-[30px] border p-5 shadow-[0_26px_90px_-48px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
                style={{
                  background: hero.style.search_panel_background,
                  borderColor: hero.style.search_panel_border_color,
                }}
              >
                <div
                  className="flex items-center gap-3 rounded-[24px] border px-4 py-3"
                  style={{
                    background: hero.style.search_input_background,
                    borderColor: hero.style.search_input_border_color,
                  }}
                >
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{
                      background: hero.style.search_icon_background,
                      color: hero.style.search_icon_color,
                    }}
                  >
                    <Search className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p
                      className="uppercase tracking-[0.24em]"
                      style={getTeachersTextStyle(hero.style.search_label)}
                    >
                      {hero.search_label}
                    </p>
                    <input
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      placeholder={hero.search_placeholder}
                      className="mt-1 w-full bg-transparent outline-none placeholder:text-slate-400"
                      style={getTeachersTextStyle(hero.style.search_input)}
                    />
                  </div>
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {[
                    {
                      label: hero.faculty_metric_label,
                      value: facultyMetricValue,
                    },
                    {
                      label: hero.subjects_metric_label,
                      value: subjectsMetricValue,
                    },
                    {
                      label: hero.mentorship_metric_label,
                      value: hero.mentorship_metric_value,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[22px] border px-4 py-4"
                      style={{
                        background: hero.style.metric_panel_background,
                        borderColor: hero.style.metric_panel_border_color,
                      }}
                    >
                      <Users className="h-5 w-5 text-white/72" />
                      <p
                        className="mt-4 uppercase tracking-[0.24em]"
                        style={getTeachersTextStyle(hero.style.metric_label)}
                      >
                        {item.label}
                      </p>
                      <p
                        className="mt-2"
                        style={getTeachersTextStyle(hero.style.metric_value)}
                      >
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ) : null}

      {teachersPage.visibility.filter_bar ? (
        <section
          id="teachers-filter-bar"
          data-preview-section="teachers-filter-bar"
          className="relative z-10 mx-auto -mt-14 max-w-7xl px-6 pb-8"
        >
          <div
            className="rounded-[30px] border p-4 shadow-[0_30px_90px_-54px_rgba(15,23,42,0.32)] backdrop-blur-xl"
            style={{
              background: filterBar.style.panel_background,
              borderColor: filterBar.style.panel_border_color,
            }}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => {
                  const isActive = safeActiveSubject === subject;
                  return (
                    <button
                      key={subject}
                      type="button"
                      onClick={() => {
                        startTransition(() => {
                          setActiveSubject(subject);
                        });
                      }}
                      className="rounded-full border px-4 py-2.5 transition-all"
                      style={{
                        ...getTeachersTextStyle(filterBar.style.chip_text),
                        background: isActive
                          ? filterBar.style.chip_active_background
                          : filterBar.style.chip_background,
                        borderColor: isActive
                          ? filterBar.style.chip_active_border_color
                          : filterBar.style.chip_border_color,
                        color: isActive
                          ? filterBar.style.chip_active_text_color
                          : filterBar.style.chip_text.color,
                      }}
                    >
                      {subject}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="rounded-full border px-3 py-2"
                  style={{
                    ...getTeachersTextStyle(filterBar.style.results_text),
                    background: filterBar.style.results_background,
                    borderColor: filterBar.style.results_border_color,
                  }}
                >
                  {filterBar.results_prefix} {filteredTeachers.length} {filterBar.results_suffix}
                </span>
                {query.trim() ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="inline-flex items-center gap-2 rounded-full border px-3 py-2"
                    style={{
                      ...getTeachersTextStyle(filterBar.style.clear_text),
                      background: filterBar.style.clear_button_background,
                      borderColor: filterBar.style.clear_button_border_color,
                    }}
                  >
                    {filterBar.clear_search_label} <X className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section
        id="teachers-spotlight"
        data-preview-section="teachers-spotlight"
        className="mx-auto max-w-7xl px-6 py-14"
      >
        <div data-preview-section="teachers-roster" className="sr-only" />
        {spotlightTeacher ? (
          <motion.div
            variants={containerVariants}
            initial={interactive ? "hidden" : false}
            animate={interactive ? undefined : "show"}
            whileInView={interactive ? "show" : undefined}
            viewport={interactive ? { once: true, margin: "-120px" } : undefined}
            className={`grid gap-6 ${
              teachersPage.visibility.spotlight ? "xl:grid-cols-[1.02fr_0.98fr]" : ""
            }`}
          >
            {teachersPage.visibility.spotlight ? (
              <motion.div variants={itemVariants}>
                <div
                  className="overflow-hidden rounded-[34px] border p-4 shadow-[0_28px_90px_-56px_rgba(15,23,42,0.36)]"
                  style={{
                    background: spotlight.style.panel_background,
                    borderColor: spotlight.style.panel_border_color,
                  }}
                >
                  <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                    <div className="relative min-h-[24rem] overflow-hidden rounded-[28px] bg-slate-100">
                      {resolveMediaUrl(spotlightTeacher.photo_url) ? (
                        <Image
                          src={resolveMediaUrl(spotlightTeacher.photo_url)}
                          alt={`${spotlightTeacher.name} teacher profile`}
                          fill
                          sizes="(min-width: 1024px) 32vw, 100vw"
                          className="object-cover"
                        />
                      ) : (
                        <div
                          className="flex h-full min-h-[24rem] w-full items-center justify-center text-7xl font-bold text-white"
                          style={{
                            background:
                              "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, white 45%) 100%)",
                          }}
                        >
                          {spotlightTeacher.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div
                      className="flex flex-col justify-between rounded-[28px] border p-7"
                      style={{
                        background: spotlight.style.content_background,
                        borderColor: spotlight.style.content_border_color,
                      }}
                    >
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <span
                            className="rounded-full border px-3 py-1.5 uppercase tracking-[0.24em]"
                            style={{
                              color: spotlight.style.badge.text_color,
                              background: spotlight.style.badge.background,
                              borderColor: spotlight.style.badge.border_color,
                              fontSize: "10px",
                              fontWeight: 700,
                            }}
                          >
                            {spotlight.badge_text}
                          </span>
                          {spotlightTeacher.subject ? (
                            <span
                              className="rounded-full border px-3 py-1.5 uppercase tracking-[0.24em]"
                              style={{
                                color: spotlight.style.badge.text_color,
                                background: spotlight.style.badge.background,
                                borderColor: spotlight.style.badge.border_color,
                                fontSize: "10px",
                                fontWeight: 700,
                              }}
                            >
                              {spotlightTeacher.subject}
                            </span>
                          ) : null}
                        </div>
                        <h2
                          className="mt-6 text-balance tracking-[-0.04em]"
                          style={getTeachersTextStyle(spotlight.style.name)}
                        >
                          {spotlightTeacher.name}
                        </h2>
                        {spotlightTeacher.qualification ? (
                          <p
                            className="mt-4"
                            style={getTeachersTextStyle(spotlight.style.qualification)}
                          >
                            {spotlightTeacher.qualification}
                          </p>
                        ) : null}
                        <p
                          className="mt-5 leading-relaxed"
                          style={getTeachersTextStyle(spotlight.style.body)}
                        >
                          {spotlightTeacher.bio || spotlight.bio_fallback}
                        </p>
                      </div>

                      <div className="mt-8 grid gap-3 sm:grid-cols-2">
                        {[
                          {
                            icon: BriefcaseBusiness,
                            label: spotlight.focus_label,
                            value: spotlightTeacher.subject || spotlight.focus_fallback,
                          },
                          {
                            icon: ShieldCheck,
                            label: spotlight.role_label,
                            value: spotlight.role_value,
                          },
                        ].map((item) => (
                          <div
                            key={item.label}
                            className="rounded-[22px] border px-4 py-4"
                            style={{
                              background: spotlight.style.meta_panel_background,
                              borderColor: spotlight.style.meta_panel_border_color,
                            }}
                          >
                            <item.icon className="h-5 w-5 text-white/72" />
                            <p
                              className="mt-4 uppercase tracking-[0.24em]"
                              style={getTeachersTextStyle(spotlight.style.meta_label)}
                            >
                              {item.label}
                            </p>
                            <p
                              className="mt-2"
                              style={getTeachersTextStyle(spotlight.style.meta_value)}
                            >
                              {item.value}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-6">
                        <Link
                          href={getTeacherPath(spotlightTeacher)}
                          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-[color:var(--color-primary)]"
                        >
                          View full teacher profile <ArrowRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}

            <div data-preview-section="teachers-roster" className="grid gap-6 md:grid-cols-2">
              {rosterTeachers.map((teacher) => (
                <motion.div key={teacher.id} variants={itemVariants}>
                  <TeacherCard teacher={teacher} roster={roster} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div
            className="rounded-[32px] border border-dashed px-8 py-16 text-center shadow-sm"
            style={{
              background: spotlight.style.panel_background,
              borderColor: spotlight.style.panel_border_color,
            }}
          >
            <Users className="mx-auto h-14 w-14 text-slate-300" />
            <p
              className="mt-5"
              style={getTeachersTextStyle(spotlight.style.empty_title)}
            >
              {spotlight.empty_title}
            </p>
            <p
              className="mt-3 leading-relaxed"
              style={getTeachersTextStyle(spotlight.style.empty_body)}
            >
              {spotlight.empty_description}
            </p>
          </div>
        )}
      </section>

      {teachersPage.visibility.principles ? (
        <section
          id="teachers-principles"
          data-preview-section="teachers-principles"
          className="mx-auto max-w-7xl px-6 pb-24 pt-8"
        >
          <div className="grid gap-6 lg:grid-cols-3">
            {principles.items.map((item) => {
              const Icon = TEACHERS_ICON_MAP[item.icon];

              return (
                <div
                  key={item.id}
                  className="rounded-[30px] border px-6 py-7 shadow-[0_24px_70px_-58px_rgba(15,23,42,0.35)]"
                  style={{
                    background: principles.style.panel_background,
                    borderColor: principles.style.panel_border_color,
                  }}
                >
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                    style={{ background: principles.style.icon_background }}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3
                    className="mt-5 tracking-[-0.03em]"
                    style={getTeachersTextStyle(principles.style.heading)}
                  >
                    {item.title}
                  </h3>
                  <p
                    className="mt-3 leading-relaxed"
                    style={getTeachersTextStyle(principles.style.body)}
                  >
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>

          {teachersPage.visibility.cta ? (
            <div
              data-preview-section="teachers-cta"
              className="mt-10 overflow-hidden rounded-[34px] border px-8 py-10 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.55)]"
              style={{
                background: cta.style.panel_background,
                borderColor: cta.style.panel_border_color,
              }}
            >
              <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                  <p
                    className="uppercase tracking-[0.26em]"
                    style={getTeachersTextStyle({
                      ...cta.style.badge,
                      size: "10px",
                      font_family: "sans",
                      font_style: "normal",
                      font_weight: "700",
                      color: cta.style.badge.text_color,
                    })}
                  >
                    {cta.badge_text}
                  </p>
                  <h2
                    className="mt-4 text-balance tracking-[-0.04em]"
                    style={getTeachersTextStyle(cta.style.heading)}
                  >
                    {cta.heading}
                  </h2>
                  <p
                    className="mt-4 max-w-2xl leading-relaxed"
                    style={getTeachersTextStyle(cta.style.body)}
                  >
                    {cta.description}
                  </p>
                </div>
                <Link
                  href={cta.button_link}
                  className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 transition-transform hover:-translate-y-0.5"
                  style={{
                    background: cta.style.button.background,
                    color: cta.style.button.text_color,
                    borderColor: cta.style.button.border_color,
                    fontSize: "14px",
                    fontWeight: 600,
                  }}
                >
                  {cta.button_label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      ) : teachersPage.visibility.cta ? (
        <section
          id="teachers-cta"
          data-preview-section="teachers-cta"
          className="mx-auto max-w-7xl px-6 pb-24 pt-8"
        >
          <div
            className="overflow-hidden rounded-[34px] border px-8 py-10 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.55)]"
            style={{
              background: cta.style.panel_background,
              borderColor: cta.style.panel_border_color,
            }}
          >
            <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p
                  className="uppercase tracking-[0.26em]"
                  style={getTeachersTextStyle({
                    ...cta.style.badge,
                    size: "10px",
                    font_family: "sans",
                    font_style: "normal",
                    font_weight: "700",
                    color: cta.style.badge.text_color,
                  })}
                >
                  {cta.badge_text}
                </p>
                <h2
                  className="mt-4 text-balance tracking-[-0.04em]"
                  style={getTeachersTextStyle(cta.style.heading)}
                >
                  {cta.heading}
                </h2>
                <p
                  className="mt-4 max-w-2xl leading-relaxed"
                  style={getTeachersTextStyle(cta.style.body)}
                >
                  {cta.description}
                </p>
              </div>
              <Link
                href={cta.button_link}
                className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 transition-transform hover:-translate-y-0.5"
                style={{
                  background: cta.style.button.background,
                  color: cta.style.button.text_color,
                  borderColor: cta.style.button.border_color,
                  fontSize: "14px",
                  fontWeight: 600,
                }}
              >
                {cta.button_label} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      ) : null}
    </div>
  );
}

function TeacherCard({
  teacher,
  roster,
}: {
  teacher: Teacher;
  roster: TeachersPageSettings["roster"];
}) {
  const photoUrl = resolveMediaUrl(teacher.photo_url);
  const teacherPath = getTeacherPath(teacher);

  return (
    <div
      className="group h-full overflow-hidden rounded-[30px] border p-4 shadow-[0_24px_70px_-58px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-54px_rgba(15,23,42,0.42)]"
      style={{
        background: roster.style.panel_background,
        borderColor: roster.style.panel_border_color,
      }}
    >
      <div className="relative h-56 overflow-hidden rounded-[24px] bg-slate-100">
        {photoUrl ? (
          <Image
            src={photoUrl}
            alt={`${teacher.name} teacher profile`}
            fill
            sizes="(min-width: 768px) 33vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-56 w-full items-center justify-center text-6xl font-bold text-white"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, white 45%) 100%)",
            }}
          >
            {teacher.name.charAt(0)}
          </div>
        )}
      </div>
      <div className="p-2 pt-5">
        {teacher.subject ? (
          <p
            className="uppercase tracking-[0.22em]"
            style={getTeachersTextStyle(roster.style.subject)}
          >
            {teacher.subject}
          </p>
        ) : null}
        <h3
          className="mt-3 tracking-[-0.03em]"
          style={getTeachersTextStyle(roster.style.name)}
        >
          <Link href={teacherPath} className="transition-colors hover:text-[color:var(--color-primary)]">
            {teacher.name}
          </Link>
        </h3>
        {teacher.qualification ? (
          <p className="mt-3" style={getTeachersTextStyle(roster.style.qualification)}>
            {teacher.qualification}
          </p>
        ) : null}
        <p className="mt-4 line-clamp-4 leading-relaxed" style={getTeachersTextStyle(roster.style.body)}>
          {teacher.bio || roster.fallback_bio}
        </p>
        <Link
          href={teacherPath}
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-[color:var(--color-primary)]"
        >
          Explore faculty profile <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
