import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  GraduationCap,
  HelpCircle,
  IndianRupee,
  Layers3,
  Users,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { resolveMediaUrl } from "@/lib/media";
import {
  getPublicCourse,
  getPublicCourses,
  getPublicSettings,
} from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildCourseSchema,
  buildFAQSchema,
  buildWebPageSchema,
  type SchemaFaqItem,
} from "@/lib/schema";
import { getSiteName } from "@/lib/site";
import type { Course } from "@/lib/types";

type CoursePageProps = {
  params: Promise<{ id: string }>;
};

function getCourseDescription(course: Course, siteName: string) {
  if (course.description?.trim()) {
    return course.description.trim();
  }

  const targetGroup = course.target_group?.trim() || "+2 and engineering students";

  return `${course.title} at ${siteName} supports ${targetGroup} with structured tuition, guided practice, and a clearer path to syllabus completion.`;
}

function parseCourseTopics(course: Course) {
  const source = course.syllabus?.trim() || course.description?.trim() || "";

  return Array.from(
    new Set(
      source
        .split(/\r?\n|,|;|•/g)
        .map((topic) => topic.replace(/\s+/g, " ").trim())
        .filter((topic) => topic.length > 3),
    ),
  ).slice(0, 8);
}

function buildAudienceBullets(course: Course) {
  const targetGroup = course.target_group?.trim() || "students who need structured academic support";

  return [
    `${targetGroup} who want guided syllabus coverage and steady progress.`,
    "Students preparing for exams and looking for clearer revision support.",
    "Parents who want a more structured learning plan and a direct enquiry path.",
  ];
}

function buildLearningOutcomes(course: Course, topics: string[]) {
  return [
    `Build stronger understanding in ${topics[0] || "core concepts"} through guided explanation and practice.`,
    "Get a more structured route through the syllabus instead of last-minute exam pressure.",
    "Use teacher support and enquiry guidance to clarify the next academic step quickly.",
  ];
}

function buildCourseFaqs(course: Course): SchemaFaqItem[] {
  const topics = parseCourseTopics(course);

  return [
    {
      question: `Who should join ${course.title}?`,
      answer: `${
        course.target_group?.trim() || "Students looking for guided tuition"
      } can use this course for structured preparation, faster syllabus coverage, and more confident revision.`,
    },
    {
      question: `How long does ${course.title} run?`,
      answer: course.duration?.trim()
        ? `${course.title} currently runs for ${course.duration.trim()}.`
        : `The current duration for ${course.title} is shared during enquiry so students and parents can confirm the right batch.`,
    },
    {
      question: `What topics are covered in ${course.title}?`,
      answer:
        topics.length > 0
          ? `${course.title} covers ${topics.slice(0, 4).join(", ")}${
              topics.length > 4 ? ", and more" : ""
            }.`
          : `The visible course overview outlines the focus of ${course.title}, and the full syllabus can be requested from the admissions team.`,
    },
    {
      question: "How do I ask about fees, schedule, or admission?",
      answer:
        "Use the enquiry button on this page or visit the contact page to ask about fees, available batches, and the current admission process.",
    },
  ];
}

function formatCourseFee(fee?: number) {
  if (typeof fee !== "number") return "Fee on request";
  if (fee === 0) return "Free";

  return `NPR ${fee.toLocaleString("en-NP")}`;
}

function formatCourseTrack(course: Course) {
  return course.target_group?.trim() || "Structured tuition program";
}

export async function generateStaticParams() {
  const courses = await getPublicCourses();

  return courses.map((course) => ({
    id: course.slug,
  }));
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  const { id } = await params;
  const [settings, course] = await Promise.all([
    getPublicSettings(),
    getPublicCourse(id),
  ]);
  const siteName = getSiteName(settings);

  if (!course) {
    return buildMetadata({
      title: "Course not found",
      description: "The requested course could not be found.",
      path: `/courses/${id}`,
      noIndex: true,
      siteName,
    });
  }

  return buildMetadata({
    title: `${course.title} Course`,
    description: getCourseDescription(course, siteName),
    path: `/courses/${course.slug}`,
    keywords: [
      course.title,
      `${course.title} tuition`,
      formatCourseTrack(course),
      "course fee and syllabus",
    ],
    type: "article",
    siteName,
  });
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { id } = await params;
  const [settings, course, allCourses] = await Promise.all([
    getPublicSettings(),
    getPublicCourse(id),
    getPublicCourses(),
  ]);

  if (!course) {
    notFound();
  }

  const siteName = getSiteName(settings);
  const description = getCourseDescription(course, siteName);
  const topics = parseCourseTopics(course);
  const faqs = buildCourseFaqs(course);
  const relatedCourses = allCourses
    .filter((item) => item.slug !== course.slug)
    .slice(0, 3);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Courses", href: "/courses" },
    { label: course.title },
  ];
  const breadcrumbSchemaItems = [
    { name: "Home", path: "/" },
    { name: "Courses", path: "/courses" },
    { name: course.title, path: `/courses/${course.slug}` },
  ];
  const courseImage = resolveMediaUrl(course.image_url);
  const overviewParagraphs = description
    .split(/\n+/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
  const learningOutcomes = buildLearningOutcomes(course, topics);
  const audienceBullets = buildAudienceBullets(course);

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            title: course.title,
            description,
            path: `/courses/${course.slug}`,
          }),
          buildBreadcrumbSchema(breadcrumbSchemaItems),
          buildCourseSchema({
            course,
            settings,
            path: `/courses/${course.slug}`,
          }),
          buildFAQSchema(faqs),
        ]}
      />

      <div className="min-h-screen bg-[linear-gradient(180deg,#09111f_0%,#111827_16%,#f8fafc_16%,#ffffff_56%,#f8fafc_100%)] pb-24">
        <section className="relative overflow-hidden px-6 pb-20 pt-36 text-white">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 88%, #050816 12%) 0%, #0b1528 48%, #111827 100%)",
            }}
          />
          <div className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:88px_88px] opacity-10" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/72 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all courses
            </Link>

            <div className="mt-8 grid gap-10 xl:grid-cols-[1.15fr_0.85fr] xl:items-end">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80">
                  <GraduationCap className="h-4 w-4" />
                  {formatCourseTrack(course)}
                </div>
                <h1
                  className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl"
                  style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                >
                  {course.title}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/72 md:text-xl">
                  {description}
                </p>

                <div className="mt-8 flex flex-wrap gap-3">
                  <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/80">
                    Duration: {course.duration || "Shared during enquiry"}
                  </div>
                  <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/80">
                    Fee: {formatCourseFee(course.fee)}
                  </div>
                  <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/80">
                    Enquiry support available
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/8 p-4 shadow-[0_30px_90px_-50px_rgba(0,0,0,0.55)] backdrop-blur-2xl">
                <div className="relative h-[18rem] overflow-hidden rounded-[26px] bg-slate-900 md:h-[22rem]">
                  {courseImage ? (
                    <Image
                      src={courseImage}
                      alt={`${course.title} course image`}
                      fill
                      priority
                      sizes="(min-width: 1280px) 32vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-[18rem] w-full items-center justify-center bg-[linear-gradient(135deg,var(--color-primary),color-mix(in_srgb,var(--color-accent)_55%,white_45%))] text-6xl font-black text-white md:h-[22rem]">
                      {course.title.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                      Course focus
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      {formatCourseTrack(course)}
                    </p>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-black/15 px-4 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                      Admission
                    </p>
                    <p className="mt-2 text-sm font-semibold text-white">
                      Contact for current batch
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/contact"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
                  >
                    Ask about this course <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/teachers"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    Meet the teachers <Users className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto grid max-w-7xl gap-8 px-6 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-8">
            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                <BookOpen className="h-4 w-4" />
                Course overview
              </div>
              <h2
                className="mt-5 text-4xl font-bold tracking-[-0.04em] text-slate-950"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                What this course covers
              </h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-slate-600">
                {overviewParagraphs.map((paragraph, index) => (
                  <p key={`${paragraph}-${index}`}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)]">
              <div className="grid gap-8 lg:grid-cols-2">
                <div>
                  <h2
                    className="text-3xl font-bold tracking-[-0.04em] text-slate-950"
                    style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                  >
                    Who this course is for
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {audienceBullets.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-accent)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2
                    className="text-3xl font-bold tracking-[-0.04em] text-slate-950"
                    style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                  >
                    Learning outcomes
                  </h2>
                  <ul className="mt-5 space-y-4">
                    {learningOutcomes.map((item) => (
                      <li key={item} className="flex items-start gap-3 text-slate-600">
                        <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[color:var(--color-accent)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                <Layers3 className="h-4 w-4" />
                Syllabus and topics
              </div>
              <h2
                className="mt-5 text-4xl font-bold tracking-[-0.04em] text-slate-950"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                Key areas covered in class
              </h2>

              {topics.length > 0 ? (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {topics.map((topic) => (
                    <li
                      key={topic}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 text-sm font-medium text-slate-700"
                    >
                      {topic}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-6 text-base leading-8 text-slate-600">
                  The current course overview is available above. Contact the admissions team for
                  the latest detailed syllabus and batch plan.
                </p>
              )}
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)]">
              <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                <HelpCircle className="h-4 w-4" />
                FAQs
              </div>
              <h2
                className="mt-5 text-4xl font-bold tracking-[-0.04em] text-slate-950"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                Questions students and parents ask
              </h2>
              <div className="mt-6 space-y-4">
                {faqs.map((item) => (
                  <details
                    key={item.question}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4"
                  >
                    <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                      {item.question}
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{item.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8">
            <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)]">
              <h2
                className="text-3xl font-bold tracking-[-0.04em] text-slate-950"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                Course details at a glance
              </h2>
              <div className="mt-6 space-y-4">
                {[
                  {
                    icon: Clock3,
                    label: "Duration",
                    value: course.duration || "Shared during enquiry",
                  },
                  {
                    icon: IndianRupee,
                    label: "Fee structure",
                    value: formatCourseFee(course.fee),
                  },
                  {
                    icon: GraduationCap,
                    label: "Course track",
                    value: formatCourseTrack(course),
                  },
                  {
                    icon: Users,
                    label: "Faculty support",
                    value: "Experienced teachers listed in the faculty directory",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white">
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                          {item.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_24px_70px_-56px_rgba(15,23,42,0.55)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
                Need a recommendation?
              </p>
              <h2
                className="mt-4 text-3xl font-bold tracking-[-0.04em]"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                Get help choosing the right course.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                If you are comparing options, talk to the admissions team and ask which course fits
                your current level, syllabus pressure, and exam goals.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
                >
                  Start an enquiry <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/teachers"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  View teachers <Users className="h-4 w-4" />
                </Link>
              </div>
            </section>

            {relatedCourses.length > 0 ? (
              <section className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)]">
                <h2
                  className="text-3xl font-bold tracking-[-0.04em] text-slate-950"
                  style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                >
                  Related courses
                </h2>
                <div className="mt-6 space-y-4">
                  {relatedCourses.map((item) => (
                    <Link
                      key={item.id}
                      href={`/courses/${item.slug}`}
                      className="group block rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4 transition-colors hover:border-slate-300 hover:bg-white"
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                        {formatCourseTrack(item)}
                      </p>
                      <h3
                        className="mt-2 text-xl font-semibold tracking-[-0.03em] text-slate-950"
                        style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                      >
                        {item.title}
                      </h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.description || "See the course page for syllabus, fee, and enquiry details."}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-900">
                        View course <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </>
  );
}
