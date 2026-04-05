"use client";

import {
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
  startTransition,
} from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  ArrowUpRight,
  BellRing,
  BookOpen,
  BriefcaseBusiness,
  ChevronRight,
  Clock3,
  Command,
  GraduationCap,
  Headphones,
  MapPin,
  PhoneCall,
  Quote,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  X,
} from "lucide-react";
import {
  getHomeTextStyle,
  HOME_ICON_MAP,
  normalizeHomePage,
} from "@/lib/home-page";
import { pickFirstMediaUrl, resolveMediaUrl } from "@/lib/media";
import {
  Banner,
  Course,
  HomeMetricCard,
  Notice,
  SiteSettings,
  Teacher,
  Testimonial,
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

const heroRevealVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.04 },
  },
} as const;

const heroItemVariants = {
  hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
} as const;

type HomePageViewProps = {
  settings: SiteSettings | null;
  banners: Banner[];
  courses: Course[];
  teachers: Teacher[];
  testimonials: Testimonial[];
  notices: Notice[];
  interactive?: boolean;
};

type SearchResult = {
  kind: "course" | "mentor" | "story" | "action";
  title: string;
  description: string;
  href: string;
  meta?: string;
};

export default function HomePageView({
  settings,
  banners,
  courses,
  teachers,
  testimonials,
  notices,
  interactive = true,
}: HomePageViewProps) {
  const router = useRouter();
  const homePage = useMemo(
    () => normalizeHomePage(settings?.home_page, settings?.hero_section),
    [settings?.hero_section, settings?.home_page],
  );
  const { scrollY } = useScroll();
  const imageFloatY = useTransform(scrollY, [0, 1200], [0, interactive ? 42 : 0]);
  const accentFloatY = useTransform(scrollY, [0, 1200], [0, interactive ? -72 : 0]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState(
    homePage.course_explorer.all_programs_label,
  );
  const deferredSearchQuery = useDeferredValue(searchQuery);
  const searchRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (activeBanner >= banners.length) {
      setActiveBanner(0);
    }
  }, [activeBanner, banners.length]);

  const allProgramsLabel = homePage.course_explorer.all_programs_label;

  useEffect(() => {
    if (banners.length <= 1 || !interactive) return;

    const interval = window.setInterval(() => {
      setActiveBanner((previous) => (previous + 1) % banners.length);
    }, 6500);

    return () => window.clearInterval(interval);
  }, [banners, interactive]);

  useEffect(() => {
    if (!interactive) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!searchRef.current?.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    };

    window.addEventListener("mousedown", handlePointerDown);
    return () => window.removeEventListener("mousedown", handlePointerDown);
  }, [interactive]);

  useEffect(() => {
    if (!interactive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();

      if (
        target?.isContentEditable ||
        tag === "input" ||
        tag === "textarea" ||
        tag === "select"
      ) {
        return;
      }

      if (event.key === "/") {
        event.preventDefault();
        inputRef.current?.focus();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [interactive]);

  if (!settings) return null;

  const currentBanner =
    banners.length > 0 && activeBanner < banners.length ? banners[activeBanner] : null;
  const primaryPhone = settings.contact_info?.phone?.[0] || settings.contact_info?.email || "";
  const averageRating = testimonials.length
    ? (
        testimonials.reduce((total, testimonial) => total + testimonial.rating, 0) /
        testimonials.length
      ).toFixed(1)
    : "4.9";
  const teacherAvatars = teachers.slice(0, 4);
  const categoryOptions = [
    allProgramsLabel,
    ...Array.from(
      new Set(
        courses
          .map((course) =>
            resolveCourseCategory(course, homePage.course_explorer.category_fallback_label),
          )
          .filter(Boolean),
      ),
    ),
  ].slice(0, 7);

  useEffect(() => {
    if (!categoryOptions.includes(activeCategory)) {
      setActiveCategory(allProgramsLabel);
    }
  }, [activeCategory, allProgramsLabel, categoryOptions]);

  const normalizedCategory =
    activeCategory === allProgramsLabel ? null : activeCategory.toLowerCase();
  const normalizedSearch = deferredSearchQuery.trim().toLowerCase();

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = normalizedCategory
      ? resolveCourseCategory(
          course,
          homePage.course_explorer.category_fallback_label,
        ).toLowerCase() === normalizedCategory
      : true;
    const matchesSearch = normalizedSearch
      ? [
          course.title,
          course.description,
          course.duration,
          course.target_group,
          course.syllabus,
        ]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(normalizedSearch))
      : true;

    return matchesCategory && matchesSearch;
  });

  const featuredCourse = filteredCourses[0] || courses[0] || null;
  const secondaryCourses = filteredCourses.slice(featuredCourse ? 1 : 0, featuredCourse ? 5 : 4);

  const actionResults: SearchResult[] = homePage.command_bar.quick_actions.map((action) => ({
    kind: "action",
    title: action.title,
    description: action.description,
    href: action.href,
    meta: action.meta,
  }));

  const searchResults = normalizedSearch
    ? [
        ...courses
          .filter((course) =>
            [
              course.title,
              course.description,
              course.duration,
              course.target_group,
              course.syllabus,
            ]
              .filter(Boolean)
              .some((value) => value!.toLowerCase().includes(normalizedSearch)),
          )
          .slice(0, 4)
          .map((course) => ({
            kind: "course" as const,
            title: course.title,
            description:
              course.description ||
              `${resolveCourseCategory(
                course,
                homePage.course_explorer.category_fallback_label,
              )} program for ambitious learners.`,
            href: `/courses/${course.slug}`,
            meta:
              course.duration ||
              resolveCourseCategory(course, homePage.course_explorer.category_fallback_label),
          })),
        ...teachers
          .filter((teacher) =>
            [teacher.name, teacher.subject, teacher.qualification, teacher.bio]
              .filter(Boolean)
              .some((value) => value!.toLowerCase().includes(normalizedSearch)),
          )
          .slice(0, 3)
          .map((teacher) => ({
            kind: "mentor" as const,
            title: teacher.name,
            description:
              teacher.subject ||
              teacher.qualification ||
              "Instructor profile available in the faculty directory.",
            href: "/teachers",
            meta: teacher.subject || "Faculty",
          })),
        ...testimonials
          .filter((testimonial) =>
            [testimonial.student_name, testimonial.course, testimonial.content]
              .filter(Boolean)
              .some((value) => value!.toLowerCase().includes(normalizedSearch)),
          )
          .slice(0, 2)
          .map((testimonial) => ({
            kind: "story" as const,
            title: testimonial.student_name,
            description: testimonial.content,
            href: "#student-proof",
            meta: testimonial.course || "Student story",
          })),
        ...actionResults.filter((result) =>
          [result.title, result.description, result.meta]
            .filter(Boolean)
            .some((value) => value!.toLowerCase().includes(normalizedSearch)),
        ),
      ].slice(0, 8)
    : [];

  const onResultSelect = (href: string) => {
    setSearchOpen(false);

    if (href.startsWith("#")) {
      const target = document.getElementById(href.slice(1));
      target?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    router.push(href);
  };

  const onEnterSearch = () => {
    if (searchResults[0]) {
      onResultSelect(searchResults[0].href);
      return;
    }

    const explorer = document.getElementById("course-explorer");
    explorer?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className={`relative overflow-hidden bg-[linear-gradient(180deg,#eef2ff_0%,#f7f9fc_24%,#ffffff_52%,#f8fafc_100%)] ${
        interactive ? "" : "pointer-events-none select-none"
      }`}
    >
      <HomeHeroCommandSection
        settings={settings}
        homePage={homePage}
        currentBanner={currentBanner}
        banners={banners}
        activeBanner={activeBanner}
        onBannerSelect={setActiveBanner}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        searchOpen={searchOpen}
        setSearchOpen={setSearchOpen}
        searchResults={searchResults}
        actionResults={actionResults}
        categoryOptions={categoryOptions}
        inputRef={inputRef}
        searchRef={searchRef}
        onResultSelect={onResultSelect}
        onEnterSearch={onEnterSearch}
        onCategoryPick={(category) => {
          startTransition(() => {
            setActiveCategory(category);
          });
          setSearchQuery("");
          setSearchOpen(false);
          document.getElementById("course-explorer")?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }}
        teachers={teacherAvatars}
        courses={courses}
        rating={averageRating}
        testimonialsCount={testimonials.length}
        primaryPhone={primaryPhone}
        imageFloatY={imageFloatY}
        accentFloatY={accentFloatY}
        interactive={interactive}
      />

      {notices.length > 0 ? (
        <HomeNoticeSection notices={notices} interactive={interactive} />
      ) : null}

      {homePage.visibility.metrics_rail ? (
        <HomeMetricsRail
          items={homePage.metrics_rail.items}
          style={homePage.metrics_rail.style}
          settings={settings}
          averageRating={averageRating}
          coursesCount={courses.length}
          teachersCount={teachers.length}
          testimonialsCount={testimonials.length}
          interactive={interactive}
        />
      ) : null}

      {homePage.visibility.course_explorer ? (
        <HomeCourseExplorerSection
          explorer={homePage.course_explorer}
          featuredCourse={featuredCourse}
          secondaryCourses={secondaryCourses}
          filteredCoursesCount={filteredCourses.length}
          searchQuery={searchQuery}
          activeCategory={activeCategory}
          categoryOptions={categoryOptions}
          onCategorySelect={(category) => {
            startTransition(() => {
              setActiveCategory(category);
            });
          }}
          onClearSearch={() => setSearchQuery("")}
          interactive={interactive}
        />
      ) : null}

      {homePage.visibility.faculty_showcase ? (
        <HomeFacultyShowcaseSection
          teachers={teachers}
          settings={settings}
          facultyShowcase={homePage.faculty_showcase}
          rating={averageRating}
          interactive={interactive}
        />
      ) : null}

      {homePage.visibility.proof_section ? (
        <HomeProofSection
          proofSection={homePage.proof_section}
          testimonials={testimonials}
          settings={settings}
          teachersCount={teachers.length}
          coursesCount={courses.length}
          rating={averageRating}
          interactive={interactive}
        />
      ) : null}

      {homePage.visibility.cta_section ? (
        <HomeCtaSection settings={settings} ctaSection={homePage.cta_section} />
      ) : null}
    </div>
  );
}

function HomeNoticeSection({
  notices,
  interactive,
}: {
  notices: Notice[];
  interactive: boolean;
}) {
  const leadNotice = notices[0] ?? null;
  const secondaryNotices = notices.slice(1, 3);
  const hiddenNoticeCount = Math.max(notices.length - 3, 0);

  if (!leadNotice) return null;

  return (
    <section
      id="home-notices"
      data-preview-section="home-notices"
      className="relative z-20 -mt-10 px-6 pb-4 md:-mt-14 md:pb-8"
    >
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={interactive ? { opacity: 0, y: 22 } : false}
          animate={{ opacity: 1, y: 0 }}
          whileInView={interactive ? { opacity: 1, y: 0 } : undefined}
          viewport={interactive ? { once: true, margin: "-80px" } : undefined}
          transition={interactive ? { duration: 0.55 } : { duration: 0 }}
          className="overflow-hidden rounded-[30px] border border-slate-200/80 bg-white/95 p-3 shadow-[0_34px_100px_-60px_rgba(15,23,42,0.3)] backdrop-blur-xl md:p-4"
        >
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-700">
              <BellRing className="h-4 w-4" />
              Alerts and notices
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-700">
                {leadNotice.is_pinned ? "Priority live" : "Live update"}
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                {notices.length} active
              </div>
            </div>
          </div>

          <div className="grid gap-3 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div
              className={`rounded-[26px] border p-4 shadow-[0_24px_70px_-48px_rgba(15,23,42,0.28)] md:p-5 ${
                leadNotice.is_pinned
                  ? "border-amber-300/70 bg-[linear-gradient(135deg,#fff8eb_0%,#fff3d9_52%,#fffaf1_100%)]"
                  : "border-cyan-200/70 bg-[linear-gradient(135deg,#effbff_0%,#eef8ff_52%,#f8fbff_100%)]"
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex min-w-0 items-start gap-3">
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[16px] ${
                      leadNotice.is_pinned
                        ? "bg-amber-500 text-white"
                        : "bg-cyan-500 text-white"
                    }`}
                  >
                    <BellRing className="h-4 w-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <div
                        className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] ${
                          leadNotice.is_pinned
                            ? "border-amber-300 bg-white/65 text-amber-700"
                            : "border-cyan-200 bg-white/75 text-cyan-700"
                        }`}
                      >
                        {leadNotice.is_pinned ? "Priority alert" : "Academic update"}
                      </div>
                      <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                        {formatNoticeDate(leadNotice.created_at)}
                      </div>
                    </div>
                    <h2
                      className="mt-3 text-balance text-[clamp(1.15rem,2vw,1.7rem)] leading-tight tracking-[-0.04em] text-slate-950"
                      style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                    >
                      {leadNotice.title}
                    </h2>
                  </div>
                </div>

                <div className="rounded-[18px] border border-slate-200 bg-white/70 px-3 py-2 text-right">
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-slate-400">
                    Status
                  </p>
                  <p
                    className={`mt-1 text-sm font-semibold ${
                      leadNotice.is_pinned ? "text-amber-700" : "text-cyan-700"
                    }`}
                  >
                    {leadNotice.is_pinned ? "Pinned" : "Active"}
                  </p>
                </div>
              </div>

              {leadNotice.content ? (
                <p className="mt-4 line-clamp-2 text-sm leading-relaxed text-slate-600 md:text-[0.95rem]">
                  {leadNotice.content}
                </p>
              ) : null}

              <div className="mt-4 flex flex-wrap items-center gap-2">
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] ${
                    leadNotice.is_pinned
                      ? "bg-amber-500/10 text-amber-700"
                      : "bg-cyan-500/10 text-cyan-700"
                  }`}
                >
                  <BellRing className="h-4 w-4" />
                  Designed for holidays, discounts, schedules, or urgent campus info
                </div>
                {hiddenNoticeCount > 0 ? (
                  <div className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-white">
                    +{hiddenNoticeCount} more live
                  </div>
                ) : null}
              </div>
            </div>

            <div className="grid gap-3">
              {secondaryNotices.length > 0 ? (
                secondaryNotices.map((notice, index) => {
                  const tone =
                    index % 2 === 0
                      ? {
                          card: "border-violet-200 bg-[linear-gradient(135deg,#faf5ff_0%,#f6f3ff_100%)]",
                          badge: "border-violet-200 bg-white/80 text-violet-700",
                          icon: "bg-violet-600 text-white",
                        }
                      : {
                          card: "border-emerald-200 bg-[linear-gradient(135deg,#ecfdf5_0%,#f0fdf4_100%)]",
                          badge: "border-emerald-200 bg-white/80 text-emerald-700",
                          icon: "bg-emerald-600 text-white",
                        };

                  return (
                  <motion.article
                    key={notice.id}
                    variants={itemVariants}
                    initial={interactive ? "hidden" : false}
                    animate={interactive ? undefined : "show"}
                    whileInView={interactive ? "show" : undefined}
                    viewport={interactive ? { once: true, margin: "-100px" } : undefined}
                    className={`rounded-[24px] border px-4 py-4 text-slate-900 shadow-[0_20px_50px_-48px_rgba(15,23,42,0.24)] ${tone.card}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div
                          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] ${tone.badge}`}
                        >
                          {notice.is_pinned ? "Priority" : "Alert"}
                        </div>
                        <h3
                          className="mt-3 text-balance text-lg tracking-[-0.04em] text-slate-950"
                          style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                        >
                          {notice.title}
                        </h3>
                      </div>
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[16px] ${tone.icon}`}>
                        <BellRing className="h-4 w-4" />
                      </div>
                    </div>
                    {notice.content ? (
                      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-slate-600">
                        {notice.content}
                      </p>
                    ) : null}
                    <div className="mt-4 flex items-center justify-between gap-4 border-t border-slate-200/70 pt-3">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">
                        {notice.is_pinned ? "Pinned" : "Live"}
                      </p>
                      <p className="text-xs font-medium text-slate-500">
                        {formatNoticeDate(notice.created_at)}
                      </p>
                    </div>
                  </motion.article>
                )})
              ) : (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-slate-900 shadow-[0_20px_50px_-48px_rgba(15,23,42,0.22)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                    Notice rail
                  </p>
                  <h3
                    className="mt-3 text-balance text-lg tracking-[-0.04em] text-slate-950"
                    style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                  >
                    Future alerts stack here automatically.
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-500">
                    Discounts, leave notices, schedule changes, admissions offers, or exam alerts
                    can all surface in this compact rail.
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function HomeHeroCommandSection({
  settings,
  homePage,
  currentBanner,
  banners,
  activeBanner,
  onBannerSelect,
  searchQuery,
  setSearchQuery,
  searchOpen,
  setSearchOpen,
  searchResults,
  actionResults,
  categoryOptions,
  inputRef,
  searchRef,
  onResultSelect,
  onEnterSearch,
  onCategoryPick,
  teachers,
  courses,
  rating,
  testimonialsCount,
  primaryPhone,
  imageFloatY,
  accentFloatY,
  interactive,
}: {
  settings: SiteSettings;
  homePage: ReturnType<typeof normalizeHomePage>;
  currentBanner: Banner | null;
  banners: Banner[];
  activeBanner: number;
  onBannerSelect: (index: number) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  searchOpen: boolean;
  setSearchOpen: (value: boolean) => void;
  searchResults: SearchResult[];
  actionResults: SearchResult[];
  categoryOptions: string[];
  inputRef: React.RefObject<HTMLInputElement | null>;
  searchRef: React.RefObject<HTMLDivElement | null>;
  onResultSelect: (href: string) => void;
  onEnterSearch: () => void;
  onCategoryPick: (category: string) => void;
  teachers: Teacher[];
  courses: Course[];
  rating: string;
  testimonialsCount: number;
  primaryPhone: string;
  imageFloatY: MotionValue<number>;
  accentFloatY: MotionValue<number>;
  interactive: boolean;
}) {
  const { command_bar: commandBar, hero, visibility } = homePage;
  const heroVisual = pickFirstMediaUrl(
    currentBanner?.image_url,
    hero.background_image,
    courses[0]?.image_url,
    teachers[0]?.photo_url,
  );

  return (
    <section
      id="home-hero"
      data-preview-section="home-hero"
      className="relative overflow-hidden px-6 pb-28 pt-32 text-white md:pt-36"
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at top left, color-mix(in srgb, var(--color-accent) 30%, transparent) 0%, transparent 28%), linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 90%, #050816 10%) 0%, #081224 48%, #0f172a 100%)",
        }}
      />
      <motion.div
        style={{ y: accentFloatY }}
        className="ambient-drift pointer-events-none absolute inset-y-0 right-[-8rem] w-[28rem] rounded-full bg-white/10 blur-[110px]"
      />
      <div className="ambient-drift-reverse pointer-events-none absolute bottom-[-10rem] left-[-6rem] h-[24rem] w-[24rem] rounded-full bg-white/8 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:88px_88px] opacity-10" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {visibility.command_bar ? (
          <motion.div
            data-preview-section="home-command-bar"
            initial={interactive ? { opacity: 0, y: -18 } : false}
            animate={{ opacity: 1, y: 0 }}
            transition={interactive ? { duration: 0.65 } : { duration: 0 }}
            className="rounded-[30px] border p-4 shadow-[0_30px_80px_-36px_rgba(0,0,0,0.55)] backdrop-blur-2xl"
            style={{
              background: commandBar.style.panel_background,
              borderColor: commandBar.style.panel_border_color,
            }}
          >
            <div className="grid gap-4 xl:grid-cols-[1.05fr_1.8fr_0.95fr] xl:items-center">
              <div
                data-preview-section="home-command-hotline"
                className="rounded-[24px] border px-5 py-4"
                style={{
                  background: commandBar.style.card_background,
                  borderColor: commandBar.style.card_border_color,
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12 text-white">
                    <Headphones className="h-5 w-5" />
                  </div>
                  <div>
                    <p
                      className="uppercase tracking-[0.28em]"
                      style={getHomeTextStyle(commandBar.style.label)}
                    >
                      {commandBar.admissions_label}
                    </p>
                    <p className="mt-1" style={getHomeTextStyle(commandBar.style.body)}>
                      {primaryPhone || settings.contact_info?.email || "Always available"}
                    </p>
                  </div>
                </div>
              </div>

              <div
                ref={searchRef}
                data-preview-section="home-command-search"
                className="relative"
              >
                <div
                  className="flex items-center gap-3 rounded-[24px] border px-4 py-3 shadow-[0_18px_50px_-28px_rgba(0,0,0,0.35)]"
                  style={{
                    background: commandBar.style.search_panel_background,
                    borderColor: commandBar.style.search_panel_border_color,
                  }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                    <Search className="h-5 w-5" />
                  </div>
                  <div
                    className="flex-1 rounded-[18px] border px-3 py-2"
                    style={{
                      background: commandBar.style.search_input_background,
                      borderColor: commandBar.style.search_input_border_color,
                    }}
                  >
                    <p
                      className="uppercase tracking-[0.28em]"
                      style={getHomeTextStyle(commandBar.style.search_label)}
                    >
                      {commandBar.search_label}
                    </p>
                    <input
                      ref={inputRef}
                      value={searchQuery}
                      onChange={(event) => {
                        setSearchQuery(event.target.value);
                        setSearchOpen(true);
                      }}
                      onFocus={() => setSearchOpen(true)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          onEnterSearch();
                        }
                        if (event.key === "Escape") {
                          setSearchOpen(false);
                        }
                      }}
                      placeholder={commandBar.search_placeholder}
                      className="mt-1 w-full bg-transparent outline-none placeholder:text-slate-400"
                      style={getHomeTextStyle(commandBar.style.search_input)}
                    />
                  </div>
                  <div
                    className="hidden items-center gap-2 rounded-full border px-3 py-2 md:flex"
                    style={{
                      background: commandBar.style.search_hint_background,
                      borderColor: commandBar.style.search_hint_border_color,
                      ...getHomeTextStyle(commandBar.style.search_hint),
                    }}
                  >
                    <Command className="h-3.5 w-3.5" /> {commandBar.shortcut_hint}
                  </div>
                </div>

                <AnimatePresence>
                  {searchOpen ? (
                    <motion.div
                      data-preview-section="home-command-results"
                      initial={interactive ? { opacity: 0, y: 16 } : false}
                      animate={{ opacity: 1, y: 0 }}
                      exit={interactive ? { opacity: 0, y: 10 } : undefined}
                      transition={interactive ? { duration: 0.22 } : { duration: 0 }}
                      className="absolute left-0 right-0 top-[calc(100%+0.9rem)] z-30 overflow-hidden rounded-[28px] border border-slate-200 bg-white text-slate-900 shadow-[0_40px_90px_-42px_rgba(0,0,0,0.45)]"
                    >
                      <div className="border-b border-slate-100 px-5 py-4">
                        <p
                          className="uppercase tracking-[0.28em]"
                          style={getHomeTextStyle(commandBar.style.search_label)}
                        >
                          {searchQuery.trim()
                            ? `${searchResults.length} ${commandBar.search_results_suffix}`
                            : commandBar.quick_jump_label}
                        </p>
                      </div>

                      {searchQuery.trim() ? (
                        searchResults.length > 0 ? (
                          <div className="max-h-[24rem] overflow-y-auto p-3">
                            {searchResults.map((result) => (
                              <button
                                key={`${result.kind}-${result.title}-${result.href}`}
                                type="button"
                                onClick={() => onResultSelect(result.href)}
                                className="flex w-full items-start gap-4 rounded-[22px] px-4 py-3 text-left transition-colors hover:bg-slate-50"
                              >
                                <div className="mt-1 rounded-full border border-slate-200 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                                  {result.kind}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center justify-between gap-3">
                                    <p
                                      className="truncate"
                                      style={getHomeTextStyle(commandBar.style.action_title)}
                                    >
                                      {result.title}
                                    </p>
                                    {result.meta ? (
                                      <span style={getHomeTextStyle(commandBar.style.action_meta)}>
                                        {result.meta}
                                      </span>
                                    ) : null}
                                  </div>
                                  <p
                                    className="mt-1 line-clamp-2 leading-relaxed"
                                    style={getHomeTextStyle(commandBar.style.action_body)}
                                  >
                                    {result.description}
                                  </p>
                                </div>
                                <ArrowUpRight className="mt-1 h-4 w-4 text-slate-300" />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6">
                            <div
                              className="rounded-[24px] border px-5 py-6"
                              style={{
                                background: commandBar.style.quick_action_panel_background,
                                borderColor: commandBar.style.quick_action_panel_border_color,
                              }}
                            >
                              <p style={getHomeTextStyle(commandBar.style.action_title)}>
                                No exact result for “{searchQuery.trim()}”.
                              </p>
                              <p
                                className="mt-2 leading-relaxed"
                                style={getHomeTextStyle(commandBar.style.action_body)}
                              >
                                {commandBar.no_result_description}
                              </p>
                            </div>
                          </div>
                        )
                      ) : (
                        <div className="grid gap-4 p-4 md:grid-cols-[1.15fr_0.85fr]">
                          <div className="space-y-2">
                            {actionResults.map((result) => (
                              <button
                                key={result.title}
                                type="button"
                                onClick={() => onResultSelect(result.href)}
                                className="flex w-full items-center justify-between rounded-[22px] border px-4 py-3 text-left transition-colors hover:bg-slate-50"
                                style={{
                                  background: "#ffffff",
                                  borderColor: commandBar.style.quick_action_panel_border_color,
                                }}
                              >
                                <div>
                                  <p style={getHomeTextStyle(commandBar.style.action_title)}>
                                    {result.title}
                                  </p>
                                  <p
                                    className="mt-1"
                                    style={getHomeTextStyle(commandBar.style.action_body)}
                                  >
                                    {result.description}
                                  </p>
                                </div>
                                <ArrowRight className="h-4 w-4 text-slate-300" />
                              </button>
                            ))}
                          </div>
                          <div
                            className="rounded-[24px] border p-4"
                            style={{
                              background: commandBar.style.quick_action_panel_background,
                              borderColor: commandBar.style.quick_action_panel_border_color,
                            }}
                          >
                            <p
                              className="uppercase tracking-[0.28em]"
                              style={getHomeTextStyle(commandBar.style.popular_label)}
                            >
                              {commandBar.popular_searches_label}
                            </p>
                            <div className="mt-4 flex flex-wrap gap-2">
                              {categoryOptions.slice(1, 6).map((category) => (
                                <button
                                  key={category}
                                  type="button"
                                  onClick={() => onCategoryPick(category)}
                                  className="rounded-full border px-3 py-2 transition-colors hover:border-slate-300 hover:bg-slate-100"
                                  style={{
                                    background: "#ffffff",
                                    borderColor: "#e2e8f0",
                                    ...getHomeTextStyle(commandBar.style.action_body),
                                  }}
                                >
                                  {category}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div
                data-preview-section="home-command-fast-response"
                className="rounded-[24px] border px-5 py-4"
                style={{
                  background: commandBar.style.card_background,
                  borderColor: commandBar.style.card_border_color,
                }}
              >
                <p
                  className="uppercase tracking-[0.28em]"
                  style={getHomeTextStyle(commandBar.style.label)}
                >
                  {commandBar.fast_response_label}
                </p>
                <p
                  className="mt-2 leading-relaxed"
                  style={getHomeTextStyle(commandBar.style.body)}
                >
                  {commandBar.fast_response_description}
                </p>
                <Link
                  href={commandBar.fast_response_button_link}
                  className="mt-4 inline-flex items-center gap-2 rounded-full border px-4 py-2.5 uppercase tracking-[0.22em] transition-transform hover:-translate-y-0.5"
                  style={{
                    background: commandBar.style.button.background,
                    color: commandBar.style.button.text_color,
                    borderColor: commandBar.style.button.border_color,
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  {commandBar.fast_response_button_label} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div
              data-preview-section="home-command-popular-lanes"
              className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/10 pt-4"
            >
              <p
                className="uppercase tracking-[0.28em]"
                style={getHomeTextStyle(commandBar.style.popular_label)}
              >
                {commandBar.popular_lanes_label}
              </p>
              {categoryOptions.slice(1, 6).map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => onCategoryPick(category)}
                  className="rounded-full border px-3 py-2 transition-colors hover:bg-white/14"
                  style={{
                    background: commandBar.style.popular_chip_background,
                    borderColor: commandBar.style.popular_chip_border_color,
                    ...getHomeTextStyle(commandBar.style.popular_chip_text),
                  }}
                >
                  {category}
                </button>
              ))}
            </div>
          </motion.div>
        ) : null}

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <motion.div
            id="home-hero-copy"
            data-preview-section="home-hero-copy"
            variants={heroRevealVariants}
            initial={interactive ? "hidden" : false}
            animate={interactive ? "show" : undefined}
          >
            {visibility.hero ? (
              <>
                <motion.div
                  variants={heroItemVariants}
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
                  style={{
                    color: hero.style.badge.text_color,
                    background: hero.style.badge.background,
                    borderColor: hero.style.badge.border_color,
                  }}
                >
                  <Sparkles className="h-4 w-4" />
                  <span
                    className="text-xs uppercase tracking-[0.26em]"
                    style={{ fontWeight: 700 }}
                  >
                    {hero.badge_text}
                  </span>
                </motion.div>
                <motion.h1
                  variants={heroItemVariants}
                  className="mt-6 max-w-3xl text-balance leading-[0.96] tracking-[-0.04em]"
                  style={getHomeTextStyle(hero.style.heading)}
                >
                  {hero.title}
                </motion.h1>
                <motion.p
                  variants={heroItemVariants}
                  className="mt-6 max-w-2xl leading-relaxed"
                  style={getHomeTextStyle(hero.style.description)}
                >
                  {hero.description}
                </motion.p>

                <motion.div
                  id="home-hero-pills"
                  data-preview-section="home-hero-pills"
                  variants={heroItemVariants}
                  className="mt-8 flex flex-wrap gap-3"
                >
                  {hero.stat_pills.map((item) => {
                    const Icon = HOME_ICON_MAP[item.icon];
                    return (
                      <motion.div
                        key={item.id}
                        className="inline-flex items-center gap-2 rounded-full border px-4 py-2.5"
                        style={{
                          background: hero.style.stat_pill_background,
                          borderColor: hero.style.stat_pill_border_color,
                          ...getHomeTextStyle(hero.style.stat_pill_text),
                        }}
                        whileHover={interactive ? { y: -3, scale: 1.01 } : undefined}
                        transition={{ duration: 0.2 }}
                      >
                        <Icon className="h-4 w-4 text-white/70" />
                        {formatHomeMetricDisplay(item, {
                          settings,
                          averageRating: rating,
                          coursesCount: courses.length,
                          teachersCount: teachers.length,
                          testimonialsCount,
                        })}{" "}
                        {item.label}
                      </motion.div>
                    );
                  })}
                </motion.div>

                <motion.div
                  variants={heroItemVariants}
                  className="mt-10 flex flex-col gap-4 sm:flex-row"
                >
                  <Link
                    href={hero.primary_cta_link}
                    className="group inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 uppercase shadow-[0_24px_70px_-32px_rgba(255,255,255,0.75)] transition-all hover:-translate-y-0.5"
                    style={{
                      background: hero.style.primary_button.background,
                      color: hero.style.primary_button.text_color,
                      borderColor: hero.style.primary_button.border_color,
                      fontSize: "14px",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                    }}
                  >
                    {hero.primary_cta_label}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                  <Link
                    href={hero.secondary_cta_link}
                    className="inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 uppercase transition-colors hover:bg-white/12"
                    style={{
                      background: hero.style.secondary_button.background,
                      color: hero.style.secondary_button.text_color,
                      borderColor: hero.style.secondary_button.border_color,
                      fontSize: "14px",
                      fontWeight: 700,
                      letterSpacing: "0.2em",
                    }}
                  >
                    {hero.secondary_cta_label}
                  </Link>
                </motion.div>
              </>
            ) : null}

            {visibility.hero_social_proof ? (
              <motion.div
                id="home-hero-trust"
                data-preview-section="home-hero-trust"
                variants={heroItemVariants}
                className="mt-12 flex flex-wrap items-center gap-4 rounded-[28px] border px-5 py-5 backdrop-blur-xl"
                style={{
                  background: hero.style.social_panel_background,
                  borderColor: hero.style.social_panel_border_color,
                }}
              >
                <div className="flex -space-x-3">
                  {teachers.length > 0 ? (
                    teachers.map((teacher) => {
                      const teacherPhoto = resolveMediaUrl(teacher.photo_url);

                      return (
                        <div
                          key={teacher.id}
                          className="h-11 w-11 overflow-hidden rounded-full border-2 border-[#0b1220] bg-slate-700"
                        >
                          {teacherPhoto ? (
                            <img
                              src={teacherPhoto}
                              alt={teacher.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-bold text-white">
                              {teacher.name.charAt(0)}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#0b1220] bg-slate-700 text-sm font-bold text-white">
                      T
                    </div>
                  )}
                </div>
                <div style={getHomeTextStyle(hero.style.social_text)}>{hero.social_proof_text}</div>
              </motion.div>
            ) : null}
          </motion.div>

          {visibility.hero_snapshot ? (
            <motion.div
              id="home-hero-visual"
              data-preview-section="home-hero-visual"
              initial={interactive ? { opacity: 0, y: 32 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={interactive ? { duration: 0.7, delay: 0.16 } : { duration: 0 }}
              style={{ y: imageFloatY }}
              className="relative"
            >
              <div className="ambient-drift absolute -left-6 -top-6 h-32 w-32 rounded-full border border-white/10 bg-white/10 blur-2xl" />
              <div
                className="relative overflow-hidden rounded-[36px] border p-4 shadow-[0_40px_110px_-40px_rgba(0,0,0,0.6)] backdrop-blur-xl"
                style={{
                  background: hero.style.visual_panel_background,
                  borderColor: hero.style.visual_panel_border_color,
                }}
              >
                <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-slate-900">
                  <AnimatePresence mode="wait">
                    {heroVisual ? (
                      <motion.img
                        key={heroVisual}
                        src={heroVisual}
                        alt={settings.site_name}
                        className="h-[28rem] w-full object-cover md:h-[36rem]"
                        initial={interactive ? { opacity: 0, scale: 1.04 } : false}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={interactive ? { opacity: 0, scale: 0.98 } : undefined}
                        transition={
                          interactive
                            ? { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
                            : { duration: 0 }
                        }
                      />
                    ) : (
                      <motion.div
                        key="hero-visual-fallback"
                        className="h-[28rem] w-full md:h-[36rem]"
                        style={{
                          background:
                            "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 75%, black 25%) 0%, color-mix(in srgb, var(--color-accent) 55%, #0f172a 45%) 100%)",
                        }}
                        initial={interactive ? { opacity: 0.7, scale: 1.02 } : false}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={interactive ? { opacity: 0, scale: 0.98 } : undefined}
                        transition={interactive ? { duration: 0.4 } : { duration: 0 }}
                      />
                    )}
                  </AnimatePresence>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[#06111f]/10 to-transparent" />

                  <div className="absolute left-5 right-5 top-5 flex items-start justify-between gap-3">
                    <div
                      className="rounded-full border px-4 py-2 uppercase tracking-[0.26em] backdrop-blur-md"
                      style={{
                        color: hero.style.visual_badge.text_color,
                        background: hero.style.visual_badge.background,
                        borderColor: hero.style.visual_badge.border_color,
                        fontSize: "10px",
                        fontWeight: 700,
                      }}
                    >
                      {hero.visual_badge_text}
                    </div>
                    <div
                      className="rounded-full border px-4 py-2 backdrop-blur-md"
                      style={{
                        color: hero.style.visual_badge.text_color,
                        background: "rgba(255,255,255,0.10)",
                        borderColor: hero.style.visual_badge.border_color,
                        fontSize: "12px",
                        fontWeight: 600,
                      }}
                    >
                      {settings.contact_info?.hours || "Open all week"}
                    </div>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 grid gap-3 sm:grid-cols-3">
                    {hero.snapshot_cards.map((item) => {
                      const Icon = HOME_ICON_MAP[item.icon];
                      return (
                        <motion.div
                          key={item.id}
                          className="rounded-[24px] border px-4 py-4 backdrop-blur-lg"
                          style={{
                            background: hero.style.overlay_card_background,
                            borderColor: hero.style.overlay_card_border_color,
                          }}
                          whileHover={interactive ? { y: -4 } : undefined}
                          transition={{ duration: 0.18 }}
                        >
                          <div className="flex items-center gap-2 text-white/70">
                            <Icon className="h-4 w-4" />
                            <span
                              className="uppercase tracking-[0.24em]"
                              style={getHomeTextStyle(hero.style.overlay_label)}
                            >
                              {item.label}
                            </span>
                          </div>
                          <p className="mt-2" style={getHomeTextStyle(hero.style.overlay_value)}>
                            {formatHomeMetricDisplay(item, {
                              settings,
                              averageRating: rating,
                              coursesCount: courses.length,
                              teachersCount: teachers.length,
                              testimonialsCount,
                            })}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {visibility.hero_banner_tabs && banners.length > 1 ? (
                  <div
                    id="home-hero-tabs"
                    data-preview-section="home-hero-tabs"
                    className="mt-4 flex flex-wrap gap-2"
                  >
                    {banners.slice(0, 4).map((banner, index) => (
                      <button
                        key={banner.id}
                        type="button"
                        onClick={() => onBannerSelect(index)}
                        className="rounded-full border px-4 py-2 text-xs font-semibold transition-colors"
                        style={{
                          background:
                            activeBanner === index
                              ? hero.style.banner_tab_active_background
                              : hero.style.banner_tab_background,
                          color:
                            activeBanner === index
                              ? hero.style.banner_tab_active_text_color
                              : hero.style.banner_tab_text_color,
                          borderColor:
                            activeBanner === index
                              ? hero.style.banner_tab_active_border_color
                              : hero.style.banner_tab_border_color,
                        }}
                      >
                        {banner.title || `${hero.banner_fallback_prefix} ${index + 1}`}
                      </button>
                    ))}
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function HomeMetricsRail({
  items,
  style,
  settings,
  averageRating,
  coursesCount,
  teachersCount,
  testimonialsCount,
  interactive,
}: {
  items: HomeMetricCard[];
  style: ReturnType<typeof normalizeHomePage>["metrics_rail"]["style"];
  settings: SiteSettings;
  averageRating: string;
  coursesCount: number;
  teachersCount: number;
  testimonialsCount: number;
  interactive: boolean;
}) {
  return (
    <section
      id="home-metrics-rail"
      data-preview-section="home-metrics-rail"
      className="relative z-20 mx-auto -mt-14 max-w-7xl px-6"
    >
      <motion.div
        initial={interactive ? { opacity: 0, y: 28 } : false}
        animate={{ opacity: 1, y: 0 }}
        transition={interactive ? { duration: 0.65, delay: 0.18 } : { duration: 0 }}
        className="grid gap-4 rounded-[32px] border p-4 shadow-[0_38px_110px_-48px_rgba(15,23,42,0.35)] backdrop-blur-xl md:grid-cols-2 xl:grid-cols-4"
        style={{
          background: style.panel_background,
          borderColor: style.panel_border_color,
        }}
      >
        {items.map((metric) => {
          const Icon = HOME_ICON_MAP[metric.icon];
          return (
          <motion.div
            key={metric.id}
            className="rounded-[24px] border px-5 py-5 transition-transform duration-300 hover:-translate-y-1"
            style={{
              background: style.card_background,
              borderColor: style.card_border_color,
            }}
            whileHover={interactive ? { y: -6, scale: 1.01 } : undefined}
            transition={{ duration: 0.22 }}
          >
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-white shadow-sm"
                style={{
                  background:
                    "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, var(--color-primary) 45%) 100%)",
                }}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="uppercase tracking-[0.26em]" style={getHomeTextStyle(style.label)}>
                  {metric.label}
                </p>
                <p className="mt-1" style={getHomeTextStyle(style.value)}>
                  {formatHomeMetricDisplay(metric, {
                    settings,
                    averageRating,
                    coursesCount,
                    teachersCount,
                    testimonialsCount,
                  })}
                </p>
              </div>
            </div>
            <p className="mt-4 leading-relaxed" style={getHomeTextStyle(style.body)}>
              {metric.description}
            </p>
          </motion.div>
        )})}
      </motion.div>
    </section>
  );
}

function HomeCourseExplorerSection({
  explorer,
  featuredCourse,
  secondaryCourses,
  filteredCoursesCount,
  searchQuery,
  activeCategory,
  categoryOptions,
  onCategorySelect,
  onClearSearch,
  interactive,
}: {
  explorer: ReturnType<typeof normalizeHomePage>["course_explorer"];
  featuredCourse: Course | null;
  secondaryCourses: Course[];
  filteredCoursesCount: number;
  searchQuery: string;
  activeCategory: string;
  categoryOptions: string[];
  onCategorySelect: (category: string) => void;
  onClearSearch: () => void;
  interactive: boolean;
}) {
  return (
    <section
      id="course-explorer"
      data-preview-section="course-explorer"
      className="relative mx-auto max-w-7xl px-6 py-28"
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div data-preview-section="course-explorer-copy">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2 shadow-sm"
            style={{
              color: explorer.style.badge.text_color,
              background: explorer.style.badge.background,
              borderColor: explorer.style.badge.border_color,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            <Search className="h-4 w-4" />
            {explorer.badge_text}
          </div>
          <h2
            className="mt-5 max-w-3xl text-balance tracking-[-0.04em]"
            style={getHomeTextStyle(explorer.style.heading)}
          >
            {explorer.heading}
          </h2>
          <p className="mt-4 max-w-3xl leading-relaxed" style={getHomeTextStyle(explorer.style.description)}>
            {explorer.description}
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 rounded-full border px-5 py-3 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
          style={{
            background: explorer.style.action_button.background,
            color: explorer.style.action_button.text_color,
            borderColor: explorer.style.action_button.border_color,
            fontSize: "14px",
            fontWeight: 600,
          }}
        >
          {explorer.open_catalogue_label} <ChevronRight className="h-4 w-4" />
        </Link>
      </div>

      <div data-preview-section="course-explorer-filters">
        <div className="mt-8 flex flex-wrap gap-2">
          {categoryOptions.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onCategorySelect(category)}
              className="rounded-full border px-4 py-2.5 transition-all"
              style={{
                background:
                  activeCategory === category
                    ? explorer.style.filter_active_background
                    : explorer.style.filter_background,
                borderColor:
                  activeCategory === category
                    ? explorer.style.filter_active_border_color
                    : explorer.style.filter_border_color,
                ...getHomeTextStyle({
                  ...explorer.style.filter_text,
                  color:
                    activeCategory === category
                      ? explorer.style.filter_active_text_color
                      : explorer.style.filter_text.color,
                }),
              }}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <span
            className="rounded-full border px-3 py-2"
            style={{
              background: explorer.style.results_badge_background,
              borderColor: explorer.style.results_badge_border_color,
              ...getHomeTextStyle(explorer.style.results_text),
            }}
          >
            {explorer.results_prefix} {filteredCoursesCount} {explorer.results_suffix}
          </span>
          {searchQuery.trim() ? (
            <button
              type="button"
              onClick={onClearSearch}
              className="inline-flex items-center gap-2 rounded-full border px-3 py-2 transition-colors hover:bg-slate-50"
              style={{
                background: explorer.style.clear_button_background,
                borderColor: explorer.style.clear_button_border_color,
                ...getHomeTextStyle(explorer.style.clear_button_text),
              }}
            >
              {explorer.clear_search_label} “{searchQuery.trim()}” <X className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      {featuredCourse ? (
        <motion.div
          data-preview-section="course-explorer-featured"
          variants={containerVariants}
          initial={interactive ? "hidden" : false}
          animate={interactive ? undefined : "show"}
          whileInView={interactive ? "show" : undefined}
          viewport={interactive ? { once: true, margin: "-120px" } : undefined}
          className="mt-10 grid gap-6 xl:grid-cols-[1.1fr_0.9fr]"
        >
          <motion.div variants={itemVariants}>
            <ProgramFeatureCard course={featuredCourse} explorer={explorer} />
          </motion.div>
          <div className="grid gap-6 sm:grid-cols-2">
            {secondaryCourses.map((course) => (
              <motion.div key={course.id} variants={itemVariants}>
                <ProgramCard course={course} explorer={explorer} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      ) : (
        <div
          data-preview-section="course-explorer-featured"
          className="mt-10 rounded-[30px] border border-dashed border-slate-200 bg-white px-8 py-14 text-center shadow-sm"
        >
          <p style={getHomeTextStyle(explorer.style.empty_title)}>{explorer.empty_title}</p>
          <p className="mt-3 leading-relaxed" style={getHomeTextStyle(explorer.style.empty_body)}>
            {explorer.empty_description}
          </p>
        </div>
      )}
    </section>
  );
}

function ProgramFeatureCard({
  course,
  explorer,
}: {
  course: Course;
  explorer: ReturnType<typeof normalizeHomePage>["course_explorer"];
}) {
  const courseImage = resolveMediaUrl(course.image_url);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block h-full overflow-hidden rounded-[34px] border border-slate-200 bg-white p-4 shadow-[0_26px_90px_-54px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_32px_90px_-48px_rgba(15,23,42,0.4)]"
    >
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
        <div className="flex flex-col justify-between rounded-[28px] bg-slate-950 p-7 text-white">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/75">
                {resolveCourseCategory(course, explorer.category_fallback_label)}
              </span>
              <span className="rounded-full border border-white/12 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-white/75">
                {course.duration || explorer.card_duration_fallback}
              </span>
            </div>
            <h3
              className="mt-6 text-3xl font-bold tracking-[-0.04em] text-white md:text-4xl"
              style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
            >
              {course.title}
            </h3>
            <p className="mt-4 text-base leading-relaxed text-white/72">
              {course.description || explorer.card_description_fallback}
            </p>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                {explorer.duration_label}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {course.duration || explorer.card_duration_fallback}
              </p>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                {explorer.fee_label}
              </p>
              <p className="mt-2 text-sm font-semibold text-white">
                {formatCourseFee(course.fee)}
              </p>
            </div>
          </div>

          <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-white">
            {explorer.featured_cta_label}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[28px] bg-slate-100">
          {courseImage ? (
            <img
              src={courseImage}
              alt={course.title}
              className="h-full min-h-[18rem] w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <div
              className="h-full min-h-[18rem] w-full"
              style={{
                background:
                  "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 82%, white 18%) 0%, color-mix(in srgb, var(--color-accent) 62%, white 38%) 100%)",
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/35 to-transparent" />
        </div>
      </div>
    </Link>
  );
}

function ProgramCard({
  course,
  explorer,
}: {
  course: Course;
  explorer: ReturnType<typeof normalizeHomePage>["course_explorer"];
}) {
  const courseImage = resolveMediaUrl(course.image_url);

  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group block h-full overflow-hidden rounded-[30px] border border-slate-200 bg-white p-4 shadow-[0_24px_70px_-54px_rgba(15,23,42,0.35)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_80px_-50px_rgba(15,23,42,0.4)]"
    >
      <div className="overflow-hidden rounded-[24px] bg-slate-100">
        {courseImage ? (
          <img
            src={courseImage}
            alt={course.title}
            className="h-48 w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div
            className="h-48 w-full"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 78%, white 22%) 0%, color-mix(in srgb, var(--color-accent) 55%, white 45%) 100%)",
            }}
          />
        )}
      </div>
      <div className="p-2 pt-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {resolveCourseCategory(course, explorer.category_fallback_label)}
          </span>
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
            {course.duration || explorer.card_duration_fallback}
          </span>
        </div>
        <h3
          className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
          style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
        >
          {course.title}
        </h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-500">
          {course.description || explorer.card_description_fallback}
        </p>
        <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
          <div className="text-sm font-medium text-slate-500">{formatCourseFee(course.fee)}</div>
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
            {explorer.card_cta_label}{" "}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

function HomeFacultyShowcaseSection({
  teachers,
  settings,
  facultyShowcase,
  rating,
  interactive,
}: {
  teachers: Teacher[];
  settings: SiteSettings;
  facultyShowcase: ReturnType<typeof normalizeHomePage>["faculty_showcase"];
  rating: string;
  interactive: boolean;
}) {
  const faculty = teachers.slice(0, 3);
  const featuredTeacher = faculty[0] ?? null;
  const secondaryTeachers = faculty.slice(1);
  const hasFaculty = faculty.length > 0;

  return (
    <section
      id="faculty-showcase"
      data-preview-section="faculty-showcase"
      className="mx-auto max-w-7xl px-6 py-28"
    >
      <div
        className={`grid gap-8 ${hasFaculty ? "xl:grid-cols-[minmax(320px,0.82fr)_minmax(0,1.18fr)]" : "mx-auto max-w-4xl"}`}
      >
        <motion.div
          data-preview-section="faculty-feature-copy"
          initial={interactive ? { opacity: 0, y: 30 } : false}
          animate={{ opacity: 1, y: 0 }}
          whileInView={interactive ? { opacity: 1, y: 0 } : undefined}
          viewport={interactive ? { once: true, margin: "-120px" } : undefined}
          transition={interactive ? { duration: 0.65 } : { duration: 0 }}
          className="overflow-hidden rounded-[34px] border px-8 py-10 text-white shadow-[0_36px_110px_-58px_rgba(15,23,42,0.7)]"
          style={{
            background: facultyShowcase.style.feature_panel_background,
            borderColor: facultyShowcase.style.feature_panel_border_color,
          }}
        >
          <div
            className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
            style={{
              color: facultyShowcase.style.badge.text_color,
              background: facultyShowcase.style.badge.background,
              borderColor: facultyShowcase.style.badge.border_color,
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
            }}
          >
            <GraduationCap className="h-4 w-4" />
            {facultyShowcase.badge_text}
          </div>
          <h2
            className="mt-6 text-balance tracking-[-0.04em]"
            style={getHomeTextStyle(facultyShowcase.style.heading)}
          >
            {facultyShowcase.heading}
          </h2>
          <p
            className="mt-5 max-w-2xl leading-relaxed"
            style={getHomeTextStyle(facultyShowcase.style.description)}
          >
            {facultyShowcase.description}
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-3 text-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                  Mentors visible
                </p>
                <p className="mt-1 text-base font-semibold tracking-[-0.03em] text-white">
                  {faculty.length}
                </p>
              </div>
            </div>
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-3 text-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white">
                <Star className="h-4 w-4 fill-current" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                  Trust score
                </p>
                <p className="mt-1 text-base font-semibold tracking-[-0.03em] text-white">
                  {rating}/5
                </p>
              </div>
            </div>
          </div>

          <Link
            href={facultyShowcase.button_link}
            className="mt-8 inline-flex items-center gap-2 rounded-full border px-5 py-3 transition-transform hover:-translate-y-0.5"
            style={{
              background: facultyShowcase.style.button.background,
              color: facultyShowcase.style.button.text_color,
              borderColor: facultyShowcase.style.button.border_color,
              fontSize: "14px",
              fontWeight: 600,
            }}
          >
            {facultyShowcase.button_label} <ArrowRight className="h-4 w-4" />
          </Link>

          {!hasFaculty ? (
            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/6 p-6 text-white shadow-[0_26px_70px_-48px_rgba(15,23,42,0.72)]">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white/10 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">
                    Roster-ready state
                  </p>
                  <h3
                    className="mt-3 text-balance text-2xl tracking-[-0.04em] text-white"
                    style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                  >
                    Faculty cards expand automatically as mentors are added.
                  </h3>
                  <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                    The section stays composed for launch and scales into a richer mentor wall once
                    real teachers are published from admin.
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>

        {hasFaculty ? (
          <motion.div
            data-preview-section="faculty-roster-cards"
            variants={containerVariants}
            initial={interactive ? "hidden" : false}
            animate={interactive ? undefined : "show"}
            whileInView={interactive ? "show" : undefined}
            viewport={interactive ? { once: true, margin: "-120px" } : undefined}
            className="space-y-5"
          >
            {faculty.length === 1 && featuredTeacher ? (
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(240px,0.9fr)]">
                <HomeFacultyCard
                  teacher={featuredTeacher}
                  facultyShowcase={facultyShowcase}
                  variant="featured"
                  interactive={interactive}
                />
                <motion.div
                  variants={itemVariants}
                  className="rounded-[32px] border border-slate-200 bg-white p-6 text-slate-900 shadow-[0_28px_80px_-56px_rgba(15,23,42,0.28)]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                    Faculty orientation
                  </p>
                  <h3
                    className="mt-4 text-balance text-[1.7rem] leading-tight tracking-[-0.05em] text-slate-950"
                    style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                  >
                    One visible mentor should still feel intentional, not squeezed into a rail.
                  </h3>
                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    The roster grows into a multi-card wall as more teachers are added. Until then,
                    the section prioritizes a strong mentor profile and keeps the composition calm.
                  </p>
                  <div className="mt-8 grid gap-3">
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                        Visible mentor
                      </p>
                      <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-slate-950">
                        {faculty.length}
                      </p>
                    </div>
                    <div className="rounded-[22px] border border-slate-200 bg-slate-50 px-4 py-4">
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-400">
                        Learning signal
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-slate-500">
                        Subject, qualification, and teaching approach remain visible even before the
                        full roster is populated.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            ) : null}

            {faculty.length === 2 ? (
              <div className="grid gap-5 md:grid-cols-2">
                {faculty.map((teacher) => (
                  <HomeFacultyCard
                    key={teacher.id}
                    teacher={teacher}
                    facultyShowcase={facultyShowcase}
                    variant="standard"
                    interactive={interactive}
                  />
                ))}
              </div>
            ) : null}

            {faculty.length >= 3 && featuredTeacher ? (
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
                <HomeFacultyCard
                  teacher={featuredTeacher}
                  facultyShowcase={facultyShowcase}
                  variant="featured"
                  interactive={interactive}
                />
                <div className="grid gap-5">
                  {secondaryTeachers.map((teacher) => (
                    <HomeFacultyCard
                      key={teacher.id}
                      teacher={teacher}
                      facultyShowcase={facultyShowcase}
                      variant="compact"
                      interactive={interactive}
                    />
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        ) : null}
      </div>

    </section>
  );
}

function HomeFacultyCard({
  teacher,
  facultyShowcase,
  variant,
  interactive,
}: {
  teacher: Teacher;
  facultyShowcase: ReturnType<typeof normalizeHomePage>["faculty_showcase"];
  variant: "featured" | "standard" | "compact";
  interactive: boolean;
}) {
  const teacherPhoto = resolveMediaUrl(teacher.photo_url);
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";

  return (
    <motion.div
      variants={itemVariants}
      initial={interactive ? "hidden" : false}
      animate={interactive ? undefined : "show"}
      whileInView={interactive ? "show" : undefined}
      viewport={interactive ? { once: true, margin: "-120px" } : undefined}
      className="group rounded-[30px] border p-4 shadow-[0_26px_80px_-58px_rgba(15,23,42,0.28)] transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: facultyShowcase.style.roster_card_background,
        borderColor: facultyShowcase.style.roster_card_border_color,
      }}
    >
      <div className={`grid gap-5 ${isFeatured ? "lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch" : ""}`}>
        <div className="overflow-hidden rounded-[24px] bg-slate-100">
          {teacherPhoto ? (
            <img
              src={teacherPhoto}
              alt={teacher.name}
              className={`w-full object-cover transition-transform duration-700 group-hover:scale-105 ${
                isFeatured ? "h-full min-h-[24rem]" : isCompact ? "h-56" : "h-72"
              }`}
            />
          ) : (
            <div
              className={`flex w-full items-center justify-center font-bold text-white ${
                isFeatured ? "min-h-[24rem] text-7xl" : isCompact ? "h-56 text-5xl" : "h-72 text-6xl"
              }`}
              style={{
                background:
                  "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, var(--color-primary) 45%) 100%)",
              }}
            >
              {getNameInitials(teacher.name)}
            </div>
          )}
        </div>

        <div className={`flex flex-col ${isFeatured ? "justify-between p-2 pr-1" : "p-2 pt-5"}`}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p
                className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 uppercase tracking-[0.24em]"
                style={getHomeTextStyle(facultyShowcase.style.roster_subject)}
              >
                {teacher.subject || facultyShowcase.roster_subject_fallback}
              </p>
              {teacher.qualification ? (
                <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-400">
                  Qualification
                </span>
              ) : null}
            </div>
            <h3
              className={`mt-4 tracking-[-0.03em] ${isFeatured ? "text-balance" : ""}`}
              style={getHomeTextStyle(facultyShowcase.style.roster_name)}
            >
              {teacher.name}
            </h3>
            {teacher.qualification ? (
              <p
                className="mt-3"
                style={getHomeTextStyle(facultyShowcase.style.roster_qualification)}
              >
                {teacher.qualification}
              </p>
            ) : null}
            <p
              className={`mt-4 leading-relaxed ${isFeatured ? "line-clamp-5" : "line-clamp-4"}`}
              style={getHomeTextStyle(facultyShowcase.style.roster_body)}
            >
              {teacher.bio || facultyShowcase.roster_bio_fallback}
            </p>
          </div>

          <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-4">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">
              Mentor profile
            </div>
            <div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
              Explore faculty
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function HomeProofSection({
  proofSection,
  testimonials,
  settings,
  teachersCount,
  coursesCount,
  rating,
  interactive,
}: {
  proofSection: ReturnType<typeof normalizeHomePage>["proof_section"];
  testimonials: Testimonial[];
  settings: SiteSettings;
  teachersCount: number;
  coursesCount: number;
  rating: string;
  interactive: boolean;
}) {
  const visibleTestimonials = testimonials.slice(0, 3);
  const hasStories = visibleTestimonials.length > 0;
  const metricCount = proofSection.metrics.length;
  const featureStories = visibleTestimonials.slice(0, 3);
  const primaryStory = featureStories[0] ?? null;
  const secondaryStories = featureStories.slice(1);

  return (
    <section
      id="student-proof"
      data-preview-section="student-proof"
      className="relative overflow-hidden px-6 py-28"
      style={{ background: proofSection.style.section_background }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(255,255,255,0.1),transparent_30%)]" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div
          className={`grid gap-8 ${hasStories ? "xl:grid-cols-[minmax(320px,0.84fr)_minmax(0,1.16fr)] xl:items-start" : "mx-auto max-w-4xl"}`}
        >
          <motion.div
            data-preview-section="student-proof-copy"
            initial={interactive ? { opacity: 0, y: 30 } : false}
            animate={{ opacity: 1, y: 0 }}
            whileInView={interactive ? { opacity: 1, y: 0 } : undefined}
            viewport={interactive ? { once: true, margin: "-120px" } : undefined}
            transition={interactive ? { duration: 0.65 } : { duration: 0 }}
            className="rounded-[36px] border px-7 py-7 text-white shadow-[0_36px_100px_-60px_rgba(15,23,42,0.78)] backdrop-blur-xl md:px-8 md:py-8"
            style={{
              background: proofSection.style.feature_panel_background,
              borderColor: proofSection.style.feature_panel_border_color,
            }}
          >
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-2"
              style={{
                color: proofSection.style.badge.text_color,
                background: proofSection.style.badge.background,
                borderColor: proofSection.style.badge.border_color,
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
              }}
            >
              <Star className="h-4 w-4" />
              {proofSection.badge_text}
            </div>
            <h2
              className="mt-6 text-balance tracking-[-0.04em]"
              style={getHomeTextStyle(proofSection.style.heading)}
            >
              {proofSection.heading}
            </h2>
            <p
              className="mt-5 max-w-2xl leading-relaxed"
              style={getHomeTextStyle(proofSection.style.description)}
            >
              {proofSection.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-3 text-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white">
                  <Quote className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                    Stories live
                  </p>
                  <p className="mt-1 text-base font-semibold tracking-[-0.03em] text-white">
                    {featureStories.length}
                  </p>
                </div>
              </div>
              <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/8 px-4 py-3 text-white shadow-[0_20px_50px_-35px_rgba(15,23,42,0.55)]">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white/12 text-white">
                  <Star className="h-4 w-4 fill-current" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                    Average rating
                  </p>
                  <p className="mt-1 text-base font-semibold tracking-[-0.03em] text-white">
                    {rating}/5
                  </p>
                </div>
              </div>
            </div>

            {!hasStories ? (
              <div className="mt-8 rounded-[28px] border border-white/10 bg-white/6 p-6 text-white shadow-[0_26px_70px_-48px_rgba(15,23,42,0.72)]">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white/10 text-white">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-white/45">
                      Launch-ready state
                    </p>
                    <h3
                      className="mt-3 text-balance text-2xl tracking-[-0.04em] text-white"
                      style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                    >
                      This section stays compact until real student stories are published.
                    </h3>
                    <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/70">
                      The proof wall expands automatically as testimonials are added, so a new
                      institute never has to publish empty boxes just to fill space.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </motion.div>

          {hasStories ? (
            <motion.div
              data-preview-section="student-proof-stories"
              variants={containerVariants}
              initial={interactive ? "hidden" : false}
              animate={interactive ? undefined : "show"}
              whileInView={interactive ? "show" : undefined}
              viewport={interactive ? { once: true, margin: "-120px" } : undefined}
              className="space-y-5"
            >
              {featureStories.length === 1 && primaryStory ? (
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.16fr)_minmax(240px,0.84fr)]">
                  <HomeProofTestimonialCard
                    testimonial={primaryStory}
                    proofSection={proofSection}
                    variant="featured"
                    interactive={interactive}
                  />
                  <motion.div
                    variants={itemVariants}
                    className="rounded-[32px] border border-white/10 bg-white/[0.06] p-6 text-white shadow-[0_30px_90px_-56px_rgba(15,23,42,0.6)] backdrop-blur-xl"
                  >
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                      Proof orientation
                    </p>
                    <h3
                      className="mt-4 text-balance text-[1.7rem] leading-tight tracking-[-0.05em] text-white"
                      style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                    >
                      A single strong story should still feel designed, not temporary.
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/68">
                      This panel stays intentionally compact while the testimonial card carries the
                      proof itself. As more student stories are published, the wall expands without
                      needing a redesign.
                    </p>
                    <div className="mt-8 grid gap-3">
                      <div className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                          Visible story
                        </p>
                        <p className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-white">
                          {featureStories.length}
                        </p>
                      </div>
                      <div className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                          Credibility baseline
                        </p>
                        <p className="mt-2 text-sm leading-relaxed text-white/72">
                          Ratings, program count, and faculty depth still stay visible below.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ) : null}

              {featureStories.length === 2 ? (
                <div className="grid gap-5 md:grid-cols-2">
                  {featureStories.map((testimonial) => (
                    <HomeProofTestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                      proofSection={proofSection}
                      variant="standard"
                      interactive={interactive}
                    />
                  ))}
                </div>
              ) : null}

              {featureStories.length >= 3 && primaryStory ? (
                <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
                  <HomeProofTestimonialCard
                    testimonial={primaryStory}
                    proofSection={proofSection}
                    variant="featured"
                    interactive={interactive}
                  />
                  <div className="grid gap-5">
                    {secondaryStories.map((testimonial) => (
                      <HomeProofTestimonialCard
                        key={testimonial.id}
                        testimonial={testimonial}
                        proofSection={proofSection}
                        variant="compact"
                        interactive={interactive}
                      />
                    ))}
                  </div>
                </div>
              ) : null}
            </motion.div>
          ) : null}
        </div>

        <motion.div
          id="student-proof-metrics"
          data-preview-section="student-proof-metrics"
          variants={containerVariants}
          initial={interactive ? "hidden" : false}
          animate={interactive ? undefined : "show"}
          whileInView={interactive ? "show" : undefined}
          viewport={interactive ? { once: true, margin: "-120px" } : undefined}
          className={`mt-8 grid gap-4 ${metricCount > 1 ? "md:grid-cols-2 xl:grid-cols-3" : ""}`}
        >
          {proofSection.metrics.map((metric) => {
            const Icon = HOME_ICON_MAP[metric.icon];

            return (
              <motion.div
                key={metric.id}
                variants={itemVariants}
                className="group relative overflow-hidden rounded-[28px] border px-5 py-5 text-white shadow-[0_28px_90px_-60px_rgba(15,23,42,0.62)] transition-transform duration-300 hover:-translate-y-1"
                style={{
                  background: proofSection.style.metric_card_background,
                  borderColor: proofSection.style.metric_card_border_color,
                }}
              >
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.08),transparent_26%),linear-gradient(180deg,rgba(255,255,255,0.05),transparent_36%)] opacity-90" />
                <div className="relative z-10 flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="uppercase tracking-[0.24em]"
                      style={getHomeTextStyle(proofSection.style.metric_label)}
                    >
                      {metric.label}
                    </p>
                    <p className="mt-3" style={getHomeTextStyle(proofSection.style.metric_value)}>
                      {formatHomeMetricDisplay(metric, {
                        settings,
                        averageRating: rating,
                        coursesCount,
                        teachersCount,
                        testimonialsCount: testimonials.length,
                      })}
                    </p>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-white/10 text-white/80 shadow-[0_18px_32px_-24px_rgba(15,23,42,0.55)]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <div className="relative z-10 mt-5 h-px w-full bg-white/10" />
                <p
                  className="relative z-10 mt-4 leading-relaxed"
                  style={getHomeTextStyle(proofSection.style.metric_body)}
                >
                  {metric.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

function HomeProofTestimonialCard({
  testimonial,
  proofSection,
  variant,
  interactive,
}: {
  testimonial: Testimonial;
  proofSection: ReturnType<typeof normalizeHomePage>["proof_section"];
  variant: "featured" | "standard" | "compact";
  interactive: boolean;
}) {
  const courseLabel = testimonial.course || proofSection.testimonial_course_fallback;
  const isFeatured = variant === "featured";
  const isCompact = variant === "compact";
  const starCount = Math.min(Math.max(testimonial.rating || 0, 1), 5);

  return (
    <motion.article
      variants={itemVariants}
      initial={interactive ? "hidden" : false}
      animate={interactive ? undefined : "show"}
      whileInView={interactive ? "show" : undefined}
      viewport={interactive ? { once: true, margin: "-120px" } : undefined}
      className={`group relative overflow-hidden rounded-[32px] border text-slate-900 shadow-[0_30px_90px_-56px_rgba(15,23,42,0.52)] transition-transform duration-300 hover:-translate-y-1 ${
        isFeatured ? "min-h-[360px]" : isCompact ? "min-h-[250px]" : "min-h-[300px]"
      }`}
      style={{
        background: proofSection.style.testimonial_card_background,
        borderColor: proofSection.style.testimonial_card_border_color,
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(15,23,42,0.05),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.18),transparent_38%)]" />
      <div
        className={`relative z-10 flex h-full flex-col ${
          isFeatured ? "p-7 md:p-8" : isCompact ? "p-5" : "p-6"
        }`}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-amber-400">
              {Array(starCount)
                .fill(0)
                .map((_, starIndex) => (
                  <Star
                    key={`${testimonial.id}-star-${starIndex}`}
                    className="h-4 w-4 fill-current"
                  />
                ))}
            </div>
            <div className="mt-4 inline-flex max-w-full rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
              <span className="truncate">{courseLabel}</span>
            </div>
          </div>

          <div
            className={`flex shrink-0 items-center justify-center rounded-[20px] text-lg font-bold text-white shadow-[0_20px_40px_-24px_rgba(15,23,42,0.5)] ${
              isCompact ? "h-12 w-12 text-base" : "h-14 w-14"
            }`}
            style={{
              background:
                "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, var(--color-primary) 45%) 100%)",
            }}
          >
            {getNameInitials(testimonial.student_name)}
          </div>
        </div>

        <div className="mt-6 flex items-start justify-between gap-5">
          <p
            className={`max-w-2xl leading-relaxed ${
              isFeatured ? "text-lg md:text-[1.08rem]" : isCompact ? "text-[0.98rem]" : ""
            }`}
            style={getHomeTextStyle(proofSection.style.testimonial_body)}
          >
            {testimonial.content}
          </p>
          {isFeatured ? <Quote className="mt-1 hidden h-10 w-10 shrink-0 text-slate-200 lg:block" /> : null}
        </div>

        <div className="mt-auto pt-7">
          <div className="h-px w-full bg-slate-100" />
          <div className="mt-5 flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="truncate" style={getHomeTextStyle(proofSection.style.testimonial_name)}>
                {testimonial.student_name}
              </p>
              <p
                className="mt-1 truncate"
                style={getHomeTextStyle(proofSection.style.testimonial_course)}
              >
                {courseLabel}
              </p>
            </div>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-300">
              <Quote className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function HomeCtaSection({
  settings,
  ctaSection,
}: {
  settings: SiteSettings;
  ctaSection: ReturnType<typeof normalizeHomePage>["cta_section"];
}) {
  return (
    <section
      id="home-final-cta"
      data-preview-section="home-final-cta"
      className="mx-auto max-w-7xl px-6 py-24"
    >
      <div
        className="grid gap-6 overflow-hidden rounded-[36px] border p-6 shadow-[0_30px_100px_-60px_rgba(15,23,42,0.35)] lg:grid-cols-[1.1fr_0.9fr] lg:p-8"
        style={{
          background: ctaSection.style.outer_panel_background,
          borderColor: ctaSection.style.outer_panel_border_color,
        }}
      >
        <div
          data-preview-section="home-final-cta-copy"
          className="overflow-hidden rounded-[30px] px-8 py-10 text-white"
          style={{ background: ctaSection.style.feature_panel_background }}
        >
          <p
            className="uppercase tracking-[0.28em]"
            style={{
              color: ctaSection.style.badge.text_color,
              fontSize: "10px",
              fontWeight: 700,
            }}
          >
            {ctaSection.badge_text}
          </p>
          <h2
            className="mt-4 max-w-2xl text-balance tracking-[-0.04em]"
            style={getHomeTextStyle(ctaSection.style.heading)}
          >
            {ctaSection.heading}
          </h2>
          <p className="mt-5 max-w-2xl leading-relaxed" style={getHomeTextStyle(ctaSection.style.description)}>
            {ctaSection.description}
          </p>

          <div
            data-preview-section="home-final-cta-buttons"
            className="mt-8 flex flex-col gap-4 sm:flex-row"
          >
            <Link
              href={ctaSection.primary_cta_link}
              className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 transition-transform hover:-translate-y-0.5"
              style={{
                background: ctaSection.style.primary_button.background,
                color: ctaSection.style.primary_button.text_color,
                borderColor: ctaSection.style.primary_button.border_color,
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {ctaSection.primary_cta_label} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={ctaSection.secondary_cta_link}
              className="inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3.5 transition-colors hover:bg-white/12"
              style={{
                background: ctaSection.style.secondary_button.background,
                color: ctaSection.style.secondary_button.text_color,
                borderColor: ctaSection.style.secondary_button.border_color,
                fontSize: "14px",
                fontWeight: 600,
              }}
            >
              {ctaSection.secondary_cta_label}
            </Link>
          </div>
        </div>

        <div
          id="home-final-cta-info"
          data-preview-section="home-final-cta-info"
          className="grid gap-4"
        >
          {ctaSection.info_cards.map((item) => {
            const Icon = HOME_ICON_MAP[item.icon];
            return (
            <div
              key={item.id}
              className="rounded-[28px] border px-5 py-5"
              style={{
                background: ctaSection.style.info_card_background,
                borderColor: ctaSection.style.info_card_border_color,
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl text-white"
                  style={{
                    background:
                      "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 52%, var(--color-primary) 48%) 100%)",
                  }}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p
                    className="uppercase tracking-[0.24em]"
                    style={getHomeTextStyle(ctaSection.style.info_label)}
                  >
                    {item.label}
                  </p>
                  <p
                    className="mt-1 leading-relaxed"
                    style={getHomeTextStyle(ctaSection.style.info_value)}
                  >
                    {formatHomeMetricDisplay(item, {
                      settings,
                      averageRating: "4.9",
                      coursesCount: 0,
                      teachersCount: 0,
                      testimonialsCount: 0,
                    })}
                  </p>
                </div>
              </div>
            </div>
          )})}
        </div>
      </div>
    </section>
  );
}

function resolveCourseCategory(course: Course, fallbackLabel = "Featured Program") {
  return course.target_group?.trim() || fallbackLabel;
}

function resolveHomeMetricValue(
  metric: HomeMetricCard,
  {
    settings,
    averageRating,
    coursesCount,
    teachersCount,
    testimonialsCount,
  }: {
    settings: SiteSettings;
    averageRating: string;
    coursesCount: number;
    teachersCount: number;
    testimonialsCount: number;
  },
) {
  switch (metric.source) {
    case "courses_count":
      return String(coursesCount || 0);
    case "teachers_count":
      return String(teachersCount || 0);
    case "rating":
      return averageRating || metric.fallback_value || "4.9";
    case "testimonials_count":
      return String(testimonialsCount || 0);
    case "hours":
      return settings.contact_info?.hours || metric.fallback_value || "";
    case "primary_phone":
      return (
        settings.contact_info?.phone?.find((entry) => entry?.trim()) ||
        settings.contact_info?.email ||
        metric.fallback_value ||
        ""
      );
    case "address":
      return settings.contact_info?.address || metric.fallback_value || "";
    default:
      return metric.fallback_value || "";
  }
}

function formatHomeMetricDisplay(
  metric: HomeMetricCard,
  context: {
    settings: SiteSettings;
    averageRating: string;
    coursesCount: number;
    teachersCount: number;
    testimonialsCount: number;
  },
) {
  const resolvedValue = resolveHomeMetricValue(metric, context);
  const normalizedValue = typeof resolvedValue === "string" ? resolvedValue.trim() : String(resolvedValue);
  const displayValue = normalizedValue || metric.fallback_value || "";

  return `${metric.prefix || ""}${displayValue}${metric.suffix || ""}`;
}

function formatCourseFee(fee?: number) {
  if (!fee) return "Fee on request";
  return `Fee ${fee.toLocaleString()}`;
}

function getNameInitials(name: string) {
  const trimmed = name.trim();
  if (!trimmed) return "S";

  const parts = trimmed.split(/\s+/).filter(Boolean);
  return parts
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatNoticeDate(value?: string) {
  if (!value) return "Recently published";

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return "Recently published";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
}
