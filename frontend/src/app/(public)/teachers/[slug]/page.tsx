import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  GraduationCap,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { resolveMediaUrl } from "@/lib/media";
import {
  getPublicSettings,
  getPublicTeacher,
  getPublicTeachers,
} from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildPersonSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { getSiteName } from "@/lib/site";
import { getTeacherPath, getTeacherSlug } from "@/lib/teachers";
import type { Teacher } from "@/lib/types";

type TeacherPageProps = {
  params: Promise<{ slug: string }>;
};

function getTeacherDescription(teacher: Teacher, siteName: string) {
  if (teacher.bio?.trim()) {
    return teacher.bio.trim();
  }

  const subject = teacher.subject?.trim() || "academic support";
  return `${teacher.name} supports students at ${siteName} with guided ${subject.toLowerCase()} preparation, structured mentoring, and exam-focused teaching.`;
}

function buildTeacherHighlights(teacher: Teacher) {
  const subject = teacher.subject?.trim() || "core subjects";

  return [
    `Focused support in ${subject} with clearer topic-by-topic guidance.`,
    "A structured teaching approach that helps students revise with more confidence.",
    "Direct enquiry support for parents and students comparing faculty and batches.",
  ];
}

export async function generateStaticParams() {
  const teachers = await getPublicTeachers();

  return teachers.map((teacher) => ({
    slug: getTeacherSlug(teacher),
  }));
}

export async function generateMetadata({
  params,
}: TeacherPageProps): Promise<Metadata> {
  const { slug } = await params;
  const [settings, teacher] = await Promise.all([
    getPublicSettings(),
    getPublicTeacher(slug),
  ]);
  const siteName = getSiteName(settings);

  if (!teacher) {
    return buildMetadata({
      title: "Teacher not found",
      description: "The requested teacher profile could not be found.",
      path: `/teachers/${slug}`,
      noIndex: true,
      siteName,
    });
  }

  const subject = teacher.subject?.trim();

  return buildMetadata({
    title: `${teacher.name}${subject ? ` | ${subject} Teacher` : " | Faculty"}`,
    description: getTeacherDescription(teacher, siteName),
    path: getTeacherPath(teacher),
    keywords: [
      teacher.name,
      subject ? `${subject} teacher` : "tuition teacher",
      subject ? `${subject} tuition faculty` : "experienced faculty",
      `${siteName} teachers`,
    ],
    siteName,
  });
}

export default async function TeacherProfilePage({ params }: TeacherPageProps) {
  const { slug } = await params;
  const [settings, teacher, teachers] = await Promise.all([
    getPublicSettings(),
    getPublicTeacher(slug),
    getPublicTeachers(),
  ]);

  if (!teacher) {
    notFound();
  }

  const siteName = getSiteName(settings);
  const description = getTeacherDescription(teacher, siteName);
  const teacherPath = getTeacherPath(teacher);
  const teacherImage = resolveMediaUrl(teacher.photo_url);
  const relatedTeachers = teachers
    .filter((item) => item.id !== teacher.id)
    .slice(0, 3);
  const highlights = buildTeacherHighlights(teacher);
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Teachers", href: "/teachers" },
    { label: teacher.name },
  ];
  const breadcrumbSchemaItems = [
    { name: "Home", path: "/" },
    { name: "Teachers", path: "/teachers" },
    { name: teacher.name, path: teacherPath },
  ];

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            title: teacher.name,
            description,
            path: teacherPath,
          }),
          buildBreadcrumbSchema(breadcrumbSchemaItems),
          buildPersonSchema({
            teacher,
            settings,
            path: teacherPath,
          }),
        ]}
      />

      <div className="min-h-screen bg-[linear-gradient(180deg,#08111f_0%,#101827_16%,#f8fafc_16%,#ffffff_58%,#f8fafc_100%)] pb-24">
        <section className="relative overflow-hidden px-6 pb-20 pt-36 text-white">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 86%, #040816 14%) 0%, #0b1528 52%, #111827 100%)",
            }}
          />
          <div className="pointer-events-none absolute -left-24 top-0 h-[28rem] w-[28rem] rounded-full bg-white/10 blur-[120px]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:88px_88px] opacity-10" />

          <div className="relative z-10 mx-auto max-w-7xl">
            <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />
            <Link
              href="/teachers"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/72 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to all teachers
            </Link>

            <div className="mt-8 grid gap-10 xl:grid-cols-[0.8fr_1.2fr] xl:items-center">
              <div className="relative overflow-hidden rounded-[34px] border border-white/12 bg-white/8 p-4 shadow-[0_30px_100px_-56px_rgba(0,0,0,0.55)]">
                <div className="relative h-[26rem] overflow-hidden rounded-[28px] bg-white/10">
                  {teacherImage ? (
                    <Image
                      src={teacherImage}
                      alt={`${teacher.name} faculty profile`}
                      fill
                      priority
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-8xl font-bold text-white">
                      {teacher.name.charAt(0)}
                    </div>
                  )}
                </div>
              </div>

              <div>
                <div className="inline-flex flex-wrap items-center gap-2">
                  {teacher.subject ? (
                    <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80">
                      {teacher.subject}
                    </span>
                  ) : null}
                  <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80">
                    Bidhya Kendra faculty
                  </span>
                </div>
                <h1
                  className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl"
                  style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                >
                  {teacher.name}
                </h1>
                <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/72 md:text-xl">
                  {description}
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      icon: UserRound,
                      label: "Role",
                      value: teacher.subject ? `${teacher.subject} teacher` : "Faculty mentor",
                    },
                    {
                      icon: GraduationCap,
                      label: "Qualification",
                      value: teacher.qualification?.trim() || "Qualification shared during enquiry",
                    },
                    {
                      icon: ShieldCheck,
                      label: "Support",
                      value: "Exam-focused and student-friendly guidance",
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-[26px] border border-white/12 bg-white/8 px-5 py-5"
                    >
                      <item.icon className="h-5 w-5 text-white/72" />
                      <p className="mt-4 text-xs font-bold uppercase tracking-[0.24em] text-white/60">
                        {item.label}
                      </p>
                      <p className="mt-2 text-base font-semibold text-white">{item.value}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href="/contact"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
                  >
                    Ask about classes with this teacher <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/courses"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/14 bg-white/8 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/12"
                  >
                    Browse matching courses
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-[1.1fr_0.9fr]">
          <article className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-[0_28px_80px_-58px_rgba(15,23,42,0.35)]">
            <h2 className="text-3xl font-bold tracking-[-0.04em] text-slate-950">
              About this faculty profile
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-700">
              {description}
            </p>
            <p className="mt-5 text-base leading-8 text-slate-700">
              Students and parents often compare teacher experience, subject focus, and communication style before making an enquiry. This page helps surface those details clearly so the right academic fit is easier to evaluate.
            </p>
          </article>

          <aside className="rounded-[32px] border border-slate-200 bg-slate-950 p-8 text-white shadow-[0_28px_80px_-58px_rgba(15,23,42,0.42)]">
            <h2 className="text-2xl font-bold tracking-[-0.04em] text-white">
              Why students learn well here
            </h2>
            <ul className="mt-6 space-y-4">
              {highlights.map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm leading-7 text-white/78">
                  <BookOpenCheck className="mt-1 h-4 w-4 shrink-0 text-white" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </section>

        {relatedTeachers.length > 0 ? (
          <section className="mx-auto max-w-7xl px-6 py-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  More faculty
                </p>
                <h2 className="mt-3 text-3xl font-bold tracking-[-0.04em] text-slate-950">
                  Explore more teachers at {siteName}
                </h2>
              </div>
              <Link
                href="/teachers"
                className="hidden text-sm font-semibold text-slate-900 transition-colors hover:text-[color:var(--color-primary)] md:inline-flex"
              >
                View all faculty
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {relatedTeachers.map((item) => (
                <Link
                  key={item.id}
                  href={getTeacherPath(item)}
                  className="group rounded-[28px] border border-slate-200 bg-white p-5 shadow-[0_24px_70px_-58px_rgba(15,23,42,0.35)] transition-all hover:-translate-y-1 hover:shadow-[0_30px_80px_-54px_rgba(15,23,42,0.42)]"
                >
                  <p className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                    {item.subject || "Faculty"}
                  </p>
                  <h3 className="mt-3 text-2xl font-bold tracking-[-0.03em] text-slate-950 transition-colors group-hover:text-[color:var(--color-primary)]">
                    {item.name}
                  </h3>
                  {item.qualification ? (
                    <p className="mt-3 text-sm text-slate-600">{item.qualification}</p>
                  ) : null}
                  <p className="mt-4 line-clamp-4 text-sm leading-7 text-slate-700">
                    {item.bio?.trim() || "Read this teacher profile to compare faculty strengths, subjects, and the kind of support students can expect."}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors group-hover:text-[color:var(--color-primary)]">
                    Read faculty profile <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </>
  );
}
