"use client";

import { startTransition, useDeferredValue, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Clock3,
  Filter,
  GraduationCap,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import Breadcrumbs, { type BreadcrumbItem } from "@/components/seo/Breadcrumbs";
import { resolveMediaUrl } from "@/lib/media";
import { Course } from "@/lib/types";

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

export default function CoursesListingView({
  courses,
  breadcrumbs = [],
  interactive = true,
}: {
  courses: Course[];
  breadcrumbs?: BreadcrumbItem[];
  interactive?: boolean;
}) {
  const { scrollY } = useScroll();
  const accentY = useTransform(scrollY, [0, 900], [0, interactive ? 64 : 0]);
  const searchParams = useSearchParams();
  const allProgramsLabel = "All Programs";
  const urlQuery = searchParams.get("query")?.trim() || "";
  const urlTrack = searchParams.get("track")?.trim() || "";
  const [queryOverride, setQueryOverride] = useState<string | null>(null);
  const [trackOverride, setTrackOverride] = useState<string | null>(null);
  const query = queryOverride ?? urlQuery;
  const activeTrack = trackOverride ?? (urlTrack || allProgramsLabel);
  const deferredQuery = useDeferredValue(query);

  const trackOptions = [
    allProgramsLabel,
    ...Array.from(
      new Set(
        courses
          .map((course) => resolveCourseCategory(course))
          .filter(Boolean),
      ),
    ),
  ].slice(0, 8);
  const safeActiveTrack = trackOptions.includes(activeTrack)
    ? activeTrack
    : allProgramsLabel;

  const normalizedQuery = deferredQuery.trim().toLowerCase();
  const normalizedTrack =
    safeActiveTrack === allProgramsLabel ? null : safeActiveTrack.trim().toLowerCase();

  const filteredCourses = courses.filter((course) => {
    const matchesTrack = normalizedTrack
      ? resolveCourseCategory(course).toLowerCase() === normalizedTrack
      : true;
    const matchesQuery = normalizedQuery
      ? [
          course.title,
          course.description,
          course.duration,
          course.target_group,
          course.syllabus,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedQuery))
      : true;

    return matchesTrack && matchesQuery;
  });

  const featuredCourse = filteredCourses[0] || courses[0] || null;
  const secondaryCourses = filteredCourses.slice(featuredCourse ? 1 : 0);
  const selfPacedCount = courses.filter((course) => !course.duration).length;
  const featuredCourseImage = resolveMediaUrl(featuredCourse?.image_url);

  return (
    <div
      className={`min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_26%,#ffffff_58%,#f8fafc_100%)] ${
        interactive ? "" : "pointer-events-none select-none"
      }`}
    >
      <section className="relative overflow-hidden px-6 pb-28 pt-36 text-white">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 90%, #050816 10%) 0%, #0b1528 48%, #101828 100%)",
          }}
        />
        <motion.div
          style={{ y: accentY }}
          className="pointer-events-none absolute right-[-10rem] top-[-8rem] h-[34rem] w-[34rem] rounded-full bg-white/10 blur-[120px]"
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
            className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"
          >
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/78">
                <Sparkles className="h-4 w-4" />
                Program catalogue
              </div>
              <h1
                className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-[-0.045em] text-white md:text-7xl"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                Choose with clarity, not with guesswork.
              </h1>
              <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/72 md:text-xl">
                The course page should feel like a guided catalogue. Search, filter, compare
                learning tracks, and move into the right program with confidence.
              </p>
            </div>

            <div className="rounded-[30px] border border-white/10 bg-white/[0.08] p-5 shadow-[0_26px_90px_-48px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
              <div className="flex items-center gap-3 rounded-[24px] border border-white/10 bg-white px-4 py-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Search className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                    Search programs
                  </p>
                  <input
                    value={query}
                    onChange={(event) => setQueryOverride(event.target.value)}
                    placeholder="Search by title, duration, skill lane, or syllabus"
                    className="mt-1 w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: BookOpen,
                    label: "Programs",
                    value: `${courses.length}+`,
                  },
                  {
                    icon: GraduationCap,
                    label: "Tracks",
                    value: `${Math.max(trackOptions.length - 1, 1)}`,
                  },
                  {
                    icon: Clock3,
                    label: "Flexible",
                    value: `${selfPacedCount}+`,
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-4"
                  >
                    <item.icon className="h-5 w-5 text-white/72" />
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                      {item.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative z-10 mx-auto -mt-14 max-w-7xl px-6 pb-8">
        <div className="rounded-[30px] border border-slate-200/80 bg-white/88 p-4 shadow-[0_30px_90px_-54px_rgba(15,23,42,0.32)] backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                <Filter className="h-4 w-4" />
                Filter by track
              </div>
              {trackOptions.map((track) => (
                <button
                  key={track}
                  type="button"
                  onClick={() => {
                    startTransition(() => {
                      setTrackOverride(track);
                    });
                  }}
                  className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all ${
                    safeActiveTrack === track
                      ? "bg-slate-950 text-white shadow-lg"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {track}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
              <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-2 font-medium text-slate-700">
                Showing {filteredCourses.length} programs
              </span>
              {query.trim() ? (
                <button
                  type="button"
                  onClick={() => setQueryOverride("")}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 font-medium text-slate-600 hover:bg-slate-50"
                >
                  Clear search <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-14">
        {featuredCourse ? (
          <motion.div
            variants={containerVariants}
            initial={interactive ? "hidden" : false}
            animate={interactive ? undefined : "show"}
            whileInView={interactive ? "show" : undefined}
            viewport={interactive ? { once: true, margin: "-120px" } : undefined}
            className="grid gap-6 xl:grid-cols-[1.08fr_0.92fr]"
          >
            <motion.div variants={itemVariants}>
              <Link
                href={`/courses/${featuredCourse.slug}`}
                className="group block overflow-hidden rounded-[34px] border border-slate-200 bg-white p-4 shadow-[0_28px_90px_-56px_rgba(15,23,42,0.36)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_34px_100px_-52px_rgba(15,23,42,0.42)]"
              >
                <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
                  <div className="flex flex-col justify-between rounded-[28px] bg-slate-950 p-7 text-white">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/76">
                          Spotlight program
                        </span>
                        <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/76">
                          {resolveCourseCategory(featuredCourse)}
                        </span>
                      </div>
                      <h2
                        className="mt-6 text-balance text-4xl font-bold tracking-[-0.04em] text-white"
                        style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                      >
                        {featuredCourse.title}
                      </h2>
                      <p className="mt-4 text-base leading-relaxed text-white/72">
                        {featuredCourse.description ||
                          "A premium institute program designed for ambitious learners who want a stronger path into outcomes."}
                      </p>
                    </div>

                    <div className="mt-8 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                          Duration
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {featuredCourse.duration || "Flexible learning path"}
                        </p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                          Fee
                        </p>
                        <p className="mt-2 text-sm font-semibold text-white">
                          {formatCourseFee(featuredCourse.fee)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
                      Open program detail
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>

                  <div className="relative min-h-[20rem] overflow-hidden rounded-[28px] bg-slate-100">
                    {featuredCourseImage ? (
                      <Image
                        src={featuredCourseImage}
                        alt={`${featuredCourse.title} course image`}
                        fill
                        priority
                        sizes="(min-width: 1280px) 30vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div
                        className="h-full min-h-[20rem] w-full"
                        style={{
                          background:
                            "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, white 45%) 100%)",
                        }}
                      />
                    )}
                  </div>
                </div>
              </Link>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2">
              {secondaryCourses.slice(0, 4).map((course) => (
                <motion.div key={course.id} variants={itemVariants}>
                  <CourseCard course={course} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
            <BookOpen className="mx-auto h-14 w-14 text-slate-300" />
            <p className="mt-5 text-xl font-semibold text-slate-900">No programs match the current filter.</p>
            <p className="mt-3 text-sm leading-relaxed text-slate-500">
              Adjust the search or switch back to “All Programs” to reopen the full catalogue.
            </p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24 pt-8">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: ShieldCheck,
              title: "Guided program selection",
              description:
                "Use the catalogue as a decision tool, then speak with admissions when you need a sharper recommendation.",
            },
            {
              icon: GraduationCap,
              title: "Outcome-focused learning",
              description:
                "Every course card now frames what matters first: fit, duration, lane, and next step.",
            },
            {
              icon: Sparkles,
              title: "Premium browsing experience",
              description:
                "The page is designed to feel structured and credible instead of forcing users through a flat card wall.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-[30px] border border-slate-200 bg-white px-6 py-7 shadow-[0_24px_70px_-58px_rgba(15,23,42,0.35)]"
            >
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-white"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, var(--color-primary) 45%) 100%)",
                }}
              >
                <item.icon className="h-5 w-5" />
              </div>
              <h3
                className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 overflow-hidden rounded-[34px] border border-slate-200 bg-slate-950 px-8 py-10 text-white shadow-[0_30px_90px_-56px_rgba(15,23,42,0.55)]">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-white/45">
                Need help choosing?
              </p>
              <h2
                className="mt-4 text-balance text-4xl font-bold tracking-[-0.04em] text-white"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                Let admissions narrow the options with you.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/68">
                When the catalogue feels wide, the right move is guided selection. Start the
                conversation and get matched to the strongest next step.
              </p>
            </div>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
            >
              Talk to an advisor <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function CourseCard({ course }: { course: Course }) {
  const courseImage = resolveMediaUrl(course.image_url);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block h-full overflow-hidden rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_-58px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-54px_rgba(15,23,42,0.42)]"
    >
      <div className="relative h-48 overflow-hidden rounded-[24px] bg-slate-100">
        {courseImage ? (
          <Image
            src={courseImage}
            alt={`${course.title} course image`}
            fill
            sizes="(min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="h-48 w-full"
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, white 45%) 100%)",
            }}
          />
        )}
      </div>
      <div className="p-2 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {resolveCourseCategory(course)}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {course.duration || "Flexible"}
          </span>
        </div>
        <h3
          className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
          style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
        >
          {course.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-500">
          {course.description || "A premium institute program with applied learning support."}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-sm font-medium text-slate-500">{formatCourseFee(course.fee)}</div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            Details <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function resolveCourseCategory(course: Course) {
  return course.target_group?.trim() || "Featured Program";
}

function formatCourseFee(fee?: number) {
  if (!fee) return "Fee on request";
  return `Fee ${fee.toLocaleString()}`;
}
