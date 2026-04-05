"use client";

import type { ReactNode } from "react";
import type {
  AboutVisibilitySettings,
  HomeVisibilitySettings,
  SiteSettings,
  TeachersVisibilitySettings,
} from "@/lib/types";

function SkeletonBlock({
  className,
  tone = "light",
}: {
  className: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      aria-hidden="true"
      className={`${tone === "dark" ? "skeleton-block-dark" : "skeleton-block"} ${className}`}
    />
  );
}

function SkeletonLines({
  tone = "light",
  widths,
}: {
  tone?: "light" | "dark";
  widths: string[];
}) {
  return (
    <div className="space-y-3">
      {widths.map((width, index) => (
        <SkeletonBlock
          key={`${width}-${index}`}
          tone={tone}
          className={`h-4 ${width} rounded-full`}
        />
      ))}
    </div>
  );
}

function SkeletonCard({
  children,
  tone = "light",
  className = "",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <div
      className={`rounded-[28px] border ${
        tone === "dark"
          ? "border-white/10 bg-white/[0.06]"
          : "border-slate-200/80 bg-white/90"
      } ${className}`}
    >
      {children}
    </div>
  );
}

function SectionIntroSkeleton({
  tone = "light",
}: {
  tone?: "light" | "dark";
}) {
  return (
    <div className="space-y-5">
      <SkeletonBlock
        tone={tone}
        className={`h-9 w-44 rounded-full ${tone === "dark" ? "bg-white/10" : ""}`}
      />
      <SkeletonLines tone={tone} widths={["w-11/12", "w-9/12"]} />
      <SkeletonLines tone={tone} widths={["w-full", "w-10/12", "w-8/12"]} />
    </div>
  );
}

function homeVisibilityState(visibility?: Partial<HomeVisibilitySettings>) {
  return {
    command_bar: visibility?.command_bar ?? true,
    hero: visibility?.hero ?? true,
    hero_social_proof: visibility?.hero_social_proof ?? true,
    hero_snapshot: visibility?.hero_snapshot ?? true,
    hero_banner_tabs: visibility?.hero_banner_tabs ?? true,
    metrics_rail: visibility?.metrics_rail ?? true,
    course_explorer: visibility?.course_explorer ?? true,
    faculty_showcase: visibility?.faculty_showcase ?? true,
    proof_section: visibility?.proof_section ?? true,
    cta_section: visibility?.cta_section ?? true,
  };
}

function aboutVisibilityState(visibility?: Partial<AboutVisibilitySettings>) {
  return {
    hero: visibility?.hero ?? true,
    hero_quote_card: visibility?.hero_quote_card ?? true,
    hero_stats: visibility?.hero_stats ?? true,
    narrative: visibility?.narrative ?? true,
    mission: visibility?.mission ?? true,
    vision: visibility?.vision ?? true,
    principles: visibility?.principles ?? true,
    stats_band: visibility?.stats_band ?? true,
    final_cta: visibility?.final_cta ?? true,
  };
}

function teachersVisibilityState(visibility?: Partial<TeachersVisibilitySettings>) {
  return {
    hero: visibility?.hero ?? true,
    filter_bar: visibility?.filter_bar ?? true,
    spotlight: visibility?.spotlight ?? true,
    principles: visibility?.principles ?? true,
    cta: visibility?.cta ?? true,
  };
}

export function HomePageSkeleton({
  visibility,
}: {
  visibility?: Partial<HomeVisibilitySettings>;
}) {
  const show = homeVisibilityState(visibility);

  return (
    <div
      role="status"
      aria-label="Loading homepage"
      className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef2ff_0%,#f7f9fc_22%,#ffffff_54%,#f8fafc_100%)]"
    >
      <section className="relative overflow-hidden px-6 pb-28 pt-32 text-white md:pt-36">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#0a1224_0%,#111827_48%,#0f172a_100%)]" />
        <div className="relative z-10 mx-auto max-w-7xl space-y-10">
          {show.command_bar ? (
            <SkeletonCard tone="dark" className="p-4 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.55)]">
              <div className="grid gap-4 xl:grid-cols-[1.05fr_1.8fr_0.95fr]">
                <SkeletonCard tone="dark" className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <SkeletonBlock tone="dark" className="h-11 w-11 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <SkeletonBlock tone="dark" className="h-3 w-24 rounded-full" />
                      <SkeletonBlock tone="dark" className="h-5 w-40 rounded-full" />
                    </div>
                  </div>
                </SkeletonCard>

                <SkeletonCard tone="light" className="px-4 py-4">
                  <div className="flex items-center gap-3">
                    <SkeletonBlock className="h-11 w-11 rounded-2xl" />
                    <div className="flex-1 space-y-2">
                      <SkeletonBlock className="h-3 w-28 rounded-full" />
                      <SkeletonBlock className="h-5 w-full rounded-full" />
                    </div>
                    <SkeletonBlock className="hidden h-10 w-16 rounded-full md:block" />
                  </div>
                </SkeletonCard>

                <SkeletonCard tone="dark" className="px-5 py-5">
                  <SkeletonBlock tone="dark" className="h-3 w-24 rounded-full" />
                  <SkeletonLines tone="dark" widths={["w-full", "w-9/12"]} />
                  <SkeletonBlock className="mt-4 h-11 w-36 rounded-full" />
                </SkeletonCard>
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-white/10 pt-4">
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonBlock
                    key={`home-lane-${index}`}
                    tone="dark"
                    className="h-9 w-28 rounded-full"
                  />
                ))}
              </div>
            </SkeletonCard>
          ) : null}

          <div className="grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
            <div className="space-y-8">
              {show.hero ? (
                <>
                  <SectionIntroSkeleton tone="dark" />
                  <div className="flex flex-wrap gap-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <SkeletonBlock
                        key={`hero-pill-${index}`}
                        tone="dark"
                        className="h-11 w-36 rounded-full"
                      />
                    ))}
                  </div>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <SkeletonBlock className="h-14 w-56 rounded-full" />
                    <SkeletonBlock tone="dark" className="h-14 w-56 rounded-full" />
                  </div>
                </>
              ) : null}
              {show.hero_social_proof ? (
                <SkeletonCard tone="dark" className="px-5 py-5">
                  <div className="flex items-center gap-4">
                    <div className="flex -space-x-3">
                      {Array.from({ length: 4 }).map((_, index) => (
                        <SkeletonBlock
                          key={`avatar-${index}`}
                          tone="dark"
                          className="h-11 w-11 rounded-full border-2 border-[#0b1220]"
                        />
                      ))}
                    </div>
                    <div className="flex-1">
                      <SkeletonLines tone="dark" widths={["w-full", "w-10/12"]} />
                    </div>
                  </div>
                </SkeletonCard>
              ) : null}
            </div>

            {show.hero_snapshot ? (
              <SkeletonCard tone="dark" className="p-4 shadow-[0_40px_110px_-40px_rgba(0,0,0,0.6)]">
                <div className="rounded-[28px] border border-white/10 bg-slate-900 p-5">
                  <div className="flex items-center justify-between gap-3">
                    <SkeletonBlock tone="dark" className="h-9 w-52 rounded-full" />
                    <SkeletonBlock tone="dark" className="h-9 w-36 rounded-full" />
                  </div>
                  <SkeletonBlock tone="dark" className="mt-5 h-[30rem] w-full rounded-[24px]" />
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {Array.from({ length: 3 }).map((_, index) => (
                      <SkeletonCard key={`snapshot-${index}`} tone="dark" className="px-4 py-4">
                        <SkeletonBlock tone="dark" className="h-3 w-20 rounded-full" />
                        <SkeletonBlock tone="dark" className="mt-3 h-7 w-24 rounded-full" />
                      </SkeletonCard>
                    ))}
                  </div>
                </div>
              </SkeletonCard>
            ) : null}
          </div>
        </div>
      </section>

      {show.metrics_rail ? (
      <section className="relative z-20 mx-auto -mt-14 max-w-7xl px-6">
        <div className="grid gap-4 rounded-[32px] border border-slate-200/80 bg-white/92 p-4 shadow-[0_38px_110px_-48px_rgba(15,23,42,0.35)] md:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={`rail-${index}`} className="px-5 py-5">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-11 w-11 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-3 w-24 rounded-full" />
                  <SkeletonBlock className="h-6 w-28 rounded-full" />
                </div>
              </div>
              <SkeletonLines widths={["w-full", "w-8/12"]} />
            </SkeletonCard>
          ))}
        </div>
      </section>
      ) : null}

      {show.course_explorer ? (
      <section className="mx-auto max-w-7xl px-6 py-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionIntroSkeleton />
          <SkeletonBlock className="h-12 w-48 rounded-full" />
        </div>
        <div className="mt-8 flex flex-wrap gap-2">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonBlock key={`filter-${index}`} className="h-11 w-28 rounded-full" />
          ))}
        </div>
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <SkeletonCard className="p-4">
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <SkeletonCard tone="dark" className="p-7">
                <SkeletonBlock tone="dark" className="h-7 w-40 rounded-full" />
                <SkeletonLines tone="dark" widths={["w-full", "w-10/12", "w-8/12"]} />
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <SkeletonCard tone="dark" className="px-4 py-4">
                    <SkeletonBlock tone="dark" className="h-3 w-16 rounded-full" />
                    <SkeletonBlock tone="dark" className="mt-3 h-5 w-24 rounded-full" />
                  </SkeletonCard>
                  <SkeletonCard tone="dark" className="px-4 py-4">
                    <SkeletonBlock tone="dark" className="h-3 w-16 rounded-full" />
                    <SkeletonBlock tone="dark" className="mt-3 h-5 w-24 rounded-full" />
                  </SkeletonCard>
                </div>
              </SkeletonCard>
              <SkeletonBlock className="h-[22rem] w-full rounded-[28px]" />
            </div>
          </SkeletonCard>
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`program-${index}`} className="p-4">
                <SkeletonBlock className="h-48 w-full rounded-[24px]" />
                <div className="p-2 pt-5">
                  <div className="flex gap-2">
                    <SkeletonBlock className="h-7 w-24 rounded-full" />
                    <SkeletonBlock className="h-7 w-24 rounded-full" />
                  </div>
                  <SkeletonLines widths={["w-10/12", "w-full", "w-7/12"]} />
                </div>
              </SkeletonCard>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {show.faculty_showcase ? (
      <section className="mx-auto max-w-7xl px-6 pb-24">
        <div className="grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          <SkeletonCard tone="dark" className="px-8 py-10">
            <SectionIntroSkeleton tone="dark" />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonCard key={`faculty-highlight-${index}`} tone="dark" className="px-5 py-5">
                  <SkeletonBlock tone="dark" className="h-5 w-5 rounded-full" />
                  <SkeletonBlock tone="dark" className="mt-4 h-3 w-24 rounded-full" />
                  <SkeletonBlock tone="dark" className="mt-3 h-6 w-20 rounded-full" />
                  <SkeletonLines tone="dark" widths={["w-full", "w-8/12"]} />
                </SkeletonCard>
              ))}
            </div>
          </SkeletonCard>
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={`mentor-${index}`} className="p-4">
                <SkeletonBlock className="h-72 w-full rounded-[24px]" />
                <div className="p-2 pt-5">
                  <SkeletonBlock className="h-3 w-24 rounded-full" />
                  <SkeletonBlock className="mt-4 h-7 w-36 rounded-full" />
                  <SkeletonLines widths={["w-8/12", "w-full", "w-10/12"]} />
                </div>
              </SkeletonCard>
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {show.proof_section ? (
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
            <SkeletonCard tone="dark" className="px-8 py-8">
              <SectionIntroSkeleton tone="dark" />
              <div className="mt-8 grid gap-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <SkeletonCard key={`proof-metric-${index}`} tone="dark" className="px-5 py-5">
                    <SkeletonBlock tone="dark" className="h-3 w-24 rounded-full" />
                    <SkeletonBlock tone="dark" className="mt-3 h-10 w-28 rounded-full" />
                    <SkeletonLines tone="dark" widths={["w-full", "w-9/12"]} />
                  </SkeletonCard>
                ))}
              </div>
            </SkeletonCard>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={`proof-card-${index}`} className="px-6 py-6">
                  <SkeletonBlock className="h-4 w-20 rounded-full" />
                  <SkeletonLines widths={["w-full", "w-full", "w-10/12"]} />
                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <SkeletonBlock className="h-5 w-32 rounded-full" />
                    <SkeletonBlock className="mt-3 h-4 w-28 rounded-full" />
                  </div>
                </SkeletonCard>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {show.cta_section ? (
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="grid gap-6 overflow-hidden rounded-[36px] border border-slate-200/80 bg-white p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.35)] lg:grid-cols-[1.1fr_0.9fr] lg:p-8">
            <SkeletonCard tone="dark" className="px-8 py-10">
              <SectionIntroSkeleton tone="dark" />
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <SkeletonBlock className="h-14 w-52 rounded-full" />
                <SkeletonBlock tone="dark" className="h-14 w-48 rounded-full" />
              </div>
            </SkeletonCard>
            <div className="grid gap-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={`cta-info-${index}`} className="px-5 py-5">
                  <div className="flex items-center gap-3">
                    <SkeletonBlock className="h-11 w-11 rounded-2xl" />
                    <div className="flex-1">
                      <SkeletonBlock className="h-3 w-24 rounded-full" />
                      <SkeletonBlock className="mt-3 h-5 w-40 rounded-full" />
                    </div>
                  </div>
                </SkeletonCard>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <span className="sr-only">Loading homepage content</span>
    </div>
  );
}

export function AboutPageSkeleton({
  visibility,
}: {
  visibility?: Partial<AboutVisibilitySettings>;
}) {
  const show = aboutVisibilityState(visibility);

  return (
    <div
      role="status"
      aria-label="Loading about page"
      className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_24%,#ffffff_58%,#f8fafc_100%)] px-6"
    >
      {show.hero ? (
      <section className="relative overflow-hidden rounded-b-[48px] bg-[linear-gradient(135deg,#0a1224_0%,#111827_48%,#0f172a_100%)] pb-24 pt-36 text-white">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="space-y-6">
            <SectionIntroSkeleton tone="dark" />
            <div className="flex flex-col gap-4 sm:flex-row">
              <SkeletonBlock className="h-14 w-52 rounded-full" />
              <SkeletonBlock tone="dark" className="h-14 w-52 rounded-full" />
            </div>
          </div>
          {show.hero_quote_card ? (
            <SkeletonCard tone="dark" className="p-5">
              <SkeletonCard tone="dark" className="p-6">
                <SkeletonBlock tone="dark" className="h-10 w-10 rounded-2xl" />
                <SkeletonLines tone="dark" widths={["w-9/12", "w-full", "w-10/12"]} />
              </SkeletonCard>
              {show.hero_stats ? (
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <SkeletonCard key={`about-stat-${index}`} tone="dark" className="px-4 py-4">
                      <SkeletonBlock tone="dark" className="h-3 w-16 rounded-full" />
                      <SkeletonBlock tone="dark" className="mt-3 h-8 w-20 rounded-full" />
                    </SkeletonCard>
                  ))}
                </div>
              ) : null}
            </SkeletonCard>
          ) : null}
        </div>
      </section>
      ) : null}

      <div className="mx-auto -mt-12 max-w-7xl space-y-6 pb-24">
        {show.narrative ? (
          <SkeletonCard className="px-8 py-9">
            <SectionIntroSkeleton />
            <SkeletonLines widths={["w-full", "w-full", "w-11/12", "w-10/12"]} />
          </SkeletonCard>
        ) : null}
        {show.mission || show.vision ? (
          <div className="grid gap-6 lg:grid-cols-2">
            {show.mission ? (
              <SkeletonCard className="px-8 py-8">
                <SkeletonBlock className="h-12 w-12 rounded-2xl" />
                <SkeletonBlock className="mt-5 h-8 w-44 rounded-full" />
                <SkeletonLines widths={["w-full", "w-11/12", "w-10/12"]} />
              </SkeletonCard>
            ) : null}
            {show.vision ? (
              <SkeletonCard className="px-8 py-8">
                <SkeletonBlock className="h-12 w-12 rounded-2xl" />
                <SkeletonBlock className="mt-5 h-8 w-44 rounded-full" />
                <SkeletonLines widths={["w-full", "w-11/12", "w-10/12"]} />
              </SkeletonCard>
            ) : null}
          </div>
        ) : null}
        {show.principles ? (
          <div className="grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={`principle-${index}`} className="px-7 py-7">
                <SkeletonBlock className="h-11 w-11 rounded-2xl" />
                <SkeletonBlock className="mt-5 h-7 w-36 rounded-full" />
                <SkeletonLines widths={["w-full", "w-full", "w-9/12"]} />
              </SkeletonCard>
            ))}
          </div>
        ) : null}
        {show.stats_band ? (
          <SkeletonCard tone="dark" className="px-8 py-10">
            <SectionIntroSkeleton tone="dark" />
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={`band-${index}`} className="space-y-3">
                  <SkeletonBlock tone="dark" className="h-12 w-24 rounded-full" />
                  <SkeletonBlock tone="dark" className="h-4 w-32 rounded-full" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        ) : null}
        {show.final_cta ? (
          <SkeletonCard className="px-8 py-9">
            <SectionIntroSkeleton />
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <SkeletonBlock className="h-14 w-52 rounded-full" />
              <SkeletonBlock className="h-14 w-52 rounded-full" />
            </div>
          </SkeletonCard>
        ) : null}
      </div>
      <span className="sr-only">Loading about page content</span>
    </div>
  );
}

export function CoursesPageSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading courses page"
      className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_26%,#ffffff_58%,#f8fafc_100%)] px-6"
    >
      <section className="relative overflow-hidden rounded-b-[48px] bg-[linear-gradient(135deg,#0a1224_0%,#111827_48%,#0f172a_100%)] pb-24 pt-36 text-white">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <SectionIntroSkeleton tone="dark" />
          <SkeletonCard tone="dark" className="p-5">
            <SkeletonCard tone="light" className="p-4">
              <div className="flex items-center gap-3">
                <SkeletonBlock className="h-11 w-11 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock className="h-3 w-28 rounded-full" />
                  <SkeletonBlock className="h-5 w-full rounded-full" />
                </div>
              </div>
            </SkeletonCard>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={`course-metric-${index}`} tone="dark" className="px-4 py-4">
                  <SkeletonBlock tone="dark" className="h-5 w-5 rounded-full" />
                  <SkeletonBlock tone="dark" className="mt-4 h-3 w-20 rounded-full" />
                  <SkeletonBlock tone="dark" className="mt-3 h-8 w-20 rounded-full" />
                </SkeletonCard>
              ))}
            </div>
          </SkeletonCard>
        </div>
      </section>
      <div className="mx-auto -mt-12 max-w-7xl pb-24">
        <SkeletonCard className="p-4">
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: 7 }).map((_, index) => (
              <SkeletonBlock key={`track-${index}`} className="h-11 w-28 rounded-full" />
            ))}
          </div>
        </SkeletonCard>
        <div className="mt-10 grid gap-6 xl:grid-cols-[1.08fr_0.92fr]">
          <SkeletonCard className="p-4">
            <div className="grid gap-6 lg:grid-cols-[1.04fr_0.96fr]">
              <SkeletonCard tone="dark" className="p-7">
                <SkeletonLines tone="dark" widths={["w-full", "w-10/12", "w-8/12"]} />
                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <SkeletonCard tone="dark" className="px-4 py-4">
                    <SkeletonBlock tone="dark" className="h-3 w-20 rounded-full" />
                    <SkeletonBlock tone="dark" className="mt-3 h-6 w-24 rounded-full" />
                  </SkeletonCard>
                  <SkeletonCard tone="dark" className="px-4 py-4">
                    <SkeletonBlock tone="dark" className="h-3 w-20 rounded-full" />
                    <SkeletonBlock tone="dark" className="mt-3 h-6 w-24 rounded-full" />
                  </SkeletonCard>
                </div>
              </SkeletonCard>
              <SkeletonBlock className="h-[22rem] w-full rounded-[28px]" />
            </div>
          </SkeletonCard>
          <div className="grid gap-6 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`course-card-${index}`} className="p-4">
                <SkeletonBlock className="h-48 w-full rounded-[24px]" />
                <div className="p-2 pt-5">
                  <div className="flex gap-2">
                    <SkeletonBlock className="h-7 w-20 rounded-full" />
                    <SkeletonBlock className="h-7 w-24 rounded-full" />
                  </div>
                  <SkeletonLines widths={["w-10/12", "w-full", "w-9/12"]} />
                </div>
              </SkeletonCard>
            ))}
          </div>
        </div>
      </div>
      <span className="sr-only">Loading courses page content</span>
    </div>
  );
}

export function TeachersPageSkeleton({
  visibility,
}: {
  visibility?: Partial<TeachersVisibilitySettings>;
}) {
  const show = teachersVisibilityState(visibility);

  return (
    <div
      role="status"
      aria-label="Loading teachers page"
      className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_26%,#ffffff_56%,#f8fafc_100%)] px-6"
    >
      {show.hero ? (
      <section className="relative overflow-hidden rounded-b-[48px] bg-[linear-gradient(135deg,#0a1224_0%,#111827_48%,#0f172a_100%)] pb-24 pt-36 text-white">
        <div className="mx-auto max-w-7xl grid gap-10 lg:grid-cols-[1.02fr_0.98fr]">
          <SectionIntroSkeleton tone="dark" />
          <SkeletonCard tone="dark" className="p-5">
            <SkeletonCard tone="dark" className="p-4">
              <div className="flex items-center gap-3">
                <SkeletonBlock tone="dark" className="h-11 w-11 rounded-2xl" />
                <div className="flex-1 space-y-2">
                  <SkeletonBlock tone="dark" className="h-3 w-28 rounded-full" />
                  <SkeletonBlock tone="dark" className="h-5 w-full rounded-full" />
                </div>
              </div>
            </SkeletonCard>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <SkeletonCard key={`teacher-metric-${index}`} tone="dark" className="px-4 py-4">
                  <SkeletonBlock tone="dark" className="h-5 w-5 rounded-full" />
                  <SkeletonBlock tone="dark" className="mt-4 h-3 w-20 rounded-full" />
                  <SkeletonBlock tone="dark" className="mt-3 h-8 w-20 rounded-full" />
                </SkeletonCard>
              ))}
            </div>
          </SkeletonCard>
        </div>
      </section>
      ) : null}
      <div className="mx-auto -mt-12 max-w-7xl pb-24">
        {show.filter_bar ? (
          <SkeletonCard className="p-4">
            <div className="flex flex-wrap gap-2">
              {Array.from({ length: 7 }).map((_, index) => (
                <SkeletonBlock key={`subject-${index}`} className="h-11 w-28 rounded-full" />
              ))}
            </div>
          </SkeletonCard>
        ) : null}
        <div className="mt-10 grid gap-6 xl:grid-cols-[0.94fr_1.06fr]">
          {show.spotlight ? (
            <SkeletonCard tone="dark" className="px-8 py-10">
              <SectionIntroSkeleton tone="dark" />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <SkeletonCard key={`teacher-highlight-${index}`} tone="dark" className="px-5 py-5">
                    <SkeletonBlock tone="dark" className="h-5 w-5 rounded-full" />
                    <SkeletonBlock tone="dark" className="mt-4 h-3 w-24 rounded-full" />
                    <SkeletonBlock tone="dark" className="mt-3 h-6 w-24 rounded-full" />
                  </SkeletonCard>
                ))}
              </div>
            </SkeletonCard>
          ) : null}
          <div className="grid gap-6 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <SkeletonCard key={`teacher-card-${index}`} className="p-4">
                <SkeletonBlock className="h-72 w-full rounded-[24px]" />
                <div className="p-2 pt-5">
                  <SkeletonBlock className="h-3 w-24 rounded-full" />
                  <SkeletonBlock className="mt-4 h-7 w-36 rounded-full" />
                  <SkeletonLines widths={["w-9/12", "w-full", "w-10/12"]} />
                </div>
              </SkeletonCard>
            ))}
          </div>
        </div>
        {show.principles ? (
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <SkeletonCard key={`teacher-principle-${index}`} className="px-7 py-7">
                <SkeletonBlock className="h-11 w-11 rounded-2xl" />
                <SkeletonBlock className="mt-5 h-7 w-36 rounded-full" />
                <SkeletonLines widths={["w-full", "w-full", "w-9/12"]} />
              </SkeletonCard>
            ))}
          </div>
        ) : null}
        {show.cta ? (
          <SkeletonCard tone="dark" className="mt-10 px-8 py-10">
            <SectionIntroSkeleton tone="dark" />
            <SkeletonBlock className="mt-8 h-14 w-56 rounded-full" />
          </SkeletonCard>
        ) : null}
      </div>
      <span className="sr-only">Loading teachers page content</span>
    </div>
  );
}

export function ContactPageSkeleton({
  settings,
}: {
  settings?: SiteSettings | null;
}) {
  const visibleItems = settings?.contact_page?.left_panel?.visible_items;
  const visibleLeftCount = [
    visibleItems?.campus ?? true,
    visibleItems?.phone ?? true,
    visibleItems?.email ?? true,
    visibleItems?.website ?? true,
    visibleItems?.hours ?? true,
  ].filter(Boolean).length;
  const showEmail = settings?.contact_page?.form_panel?.field_visibility?.email ?? true;
  const showPhone = settings?.contact_page?.form_panel?.field_visibility?.phone ?? true;
  const customFields =
    settings?.contact_page?.form_panel?.custom_fields?.filter((field) => field.is_visible) || [];
  const showMap = Boolean(settings?.contact_info?.map_embed);

  return (
    <div
      role="status"
      aria-label="Loading contact page"
      className="min-h-screen overflow-hidden bg-[linear-gradient(180deg,#eef2ff_0%,#f8fafc_24%,#ffffff_58%,#f8fafc_100%)] px-6 py-36"
    >
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[40px] border border-slate-200/80 bg-white shadow-[0_28px_90px_-56px_rgba(15,23,42,0.36)]">
        <div className="grid lg:grid-cols-[0.42fr_0.58fr]">
          <div className="bg-[linear-gradient(135deg,#111827_0%,#0f172a_100%)] px-8 py-10 text-white">
            <SectionIntroSkeleton tone="dark" />
            <div className="mt-10 space-y-5">
              {Array.from({ length: Math.max(visibleLeftCount, 1) }).map((_, index) => (
                <div key={`contact-left-${index}`} className="flex items-center gap-4">
                  <SkeletonBlock tone="dark" className="h-12 w-12 rounded-2xl" />
                  <div className="flex-1">
                    <SkeletonBlock tone="dark" className="h-4 w-32 rounded-full" />
                    <SkeletonBlock tone="dark" className="mt-3 h-4 w-40 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="px-8 py-10">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-3">
                <SkeletonBlock className="h-3 w-24 rounded-full" />
                <SkeletonBlock className="h-14 w-full rounded-[18px]" />
              </div>
              {showEmail ? (
                <div className="space-y-3">
                  <SkeletonBlock className="h-3 w-24 rounded-full" />
                  <SkeletonBlock className="h-14 w-full rounded-[18px]" />
                </div>
              ) : null}
              {showPhone ? (
                <div className="space-y-3 md:col-span-2">
                  <SkeletonBlock className="h-3 w-24 rounded-full" />
                  <SkeletonBlock className="h-14 w-full rounded-[18px]" />
                </div>
              ) : null}
              {customFields.map((field) => (
                <div
                  key={field.id}
                  className={`space-y-3 ${field.width === "full" ? "md:col-span-2" : ""}`}
                >
                  <SkeletonBlock className="h-3 w-24 rounded-full" />
                  <SkeletonBlock
                    className={`${field.type === "textarea" ? "h-32" : "h-14"} w-full rounded-[18px]`}
                  />
                </div>
              ))}
              <div className="space-y-3 md:col-span-2">
                <SkeletonBlock className="h-3 w-28 rounded-full" />
                <SkeletonBlock className="h-40 w-full rounded-[24px]" />
              </div>
            </div>
            <SkeletonBlock className="mt-8 h-14 w-full rounded-[18px]" />
          </div>
        </div>
      </div>
      {showMap ? (
        <div className="mx-auto mt-10 max-w-7xl">
          <SkeletonBlock className="h-72 w-full rounded-[36px]" />
        </div>
      ) : null}
      <span className="sr-only">Loading contact page content</span>
    </div>
  );
}
