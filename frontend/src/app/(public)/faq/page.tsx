import Link from "next/link";
import { ArrowRight, HelpCircle, MessagesSquare } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_FAQS } from "@/lib/site-faqs";
import { getPublicSettings } from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildFAQSchema, buildWebPageSchema } from "@/lib/schema";
import { getSiteName } from "@/lib/site";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "FAQ" },
];

const breadcrumbSchemaItems = [
  { name: "Home", path: "/" },
  { name: "FAQ", path: "/faq" },
];

const description =
  "Answers to common questions about Bidhya Kendra courses, teachers, syllabus completion, fees, and the enquiry process.";

export async function generateMetadata() {
  const settings = await getPublicSettings();
  const siteName = getSiteName(settings);

  return buildMetadata({
    title: "FAQ",
    description,
    path: "/faq",
    keywords: [
      "tuition FAQ",
      "course fee questions",
      "syllabus completion help",
      "Bidhya Kendra FAQ",
    ],
    siteName,
  });
}

export default function FaqPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            title: "FAQ",
            description,
            path: "/faq",
          }),
          buildBreadcrumbSchema(breadcrumbSchemaItems),
          buildFAQSchema(SITE_FAQS),
        ]}
      />

      <div className="min-h-screen bg-[linear-gradient(180deg,#081224_0%,#111827_18%,#f8fafc_18%,#ffffff_60%,#f8fafc_100%)] px-6 pb-24 pt-36">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />

          <section className="rounded-[36px] border border-white/10 bg-white/6 p-8 text-white shadow-[0_28px_90px_-54px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80">
              <HelpCircle className="h-4 w-4" />
              Frequently asked questions
            </div>
            <h1
              className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl"
              style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
            >
              Clear answers for students and parents.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/72">
              Use this page to understand how Bidhya Kendra courses work, what support is available,
              and how to ask practical questions before joining.
            </p>
          </section>

          <section className="mt-10 grid gap-4">
            {SITE_FAQS.map((item) => (
              <details
                key={item.question}
                className="rounded-[28px] border border-slate-200 bg-white px-6 py-5 shadow-[0_22px_60px_-54px_rgba(15,23,42,0.34)]"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-slate-950">
                  {item.question}
                </summary>
                <p className="mt-4 max-w-4xl text-base leading-8 text-slate-600">{item.answer}</p>
              </details>
            ))}
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center rounded-[34px] border border-slate-200 bg-slate-950 px-8 py-10 text-white shadow-[0_28px_80px_-56px_rgba(15,23,42,0.55)]">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/70">
                <MessagesSquare className="h-4 w-4" />
                Still need help?
              </div>
              <h2
                className="mt-5 text-4xl font-bold tracking-[-0.04em]"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                Ask a direct question about courses, fees, or timing.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/70">
                If the answer depends on the student&apos;s current level or subject pressure, the
                fastest next step is a direct enquiry.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                Contact admissions <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Explore courses <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
