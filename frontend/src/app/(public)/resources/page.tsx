import Link from "next/link";
import { ArrowRight, BookOpen, Clock3, Layers3 } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicSettings } from "@/lib/public-api";
import { RESOURCE_ARTICLES } from "@/lib/resources";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { getSiteName } from "@/lib/site";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Resources" },
];

const breadcrumbSchemaItems = [
  { name: "Home", path: "/" },
  { name: "Resources", path: "/resources" },
];

const description =
  "Study resources, exam strategy guides, and planning articles for +2 and engineering students.";

export async function generateMetadata() {
  const settings = await getPublicSettings();
  const siteName = getSiteName(settings);

  return buildMetadata({
    title: "Resources",
    description,
    path: "/resources",
    keywords: [
      "study resources",
      "+2 exam tips",
      "engineering preparation guide",
      "revision strategy articles",
    ],
    siteName,
  });
}

export default function ResourcesPage() {
  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            title: "Resources",
            description,
            path: "/resources",
          }),
          buildBreadcrumbSchema(breadcrumbSchemaItems),
          buildItemListSchema(
            RESOURCE_ARTICLES.map((article) => ({
              name: article.title,
              path: `/resources/${article.slug}`,
            })),
          ),
        ]}
      />

      <div className="min-h-screen bg-[linear-gradient(180deg,#081224_0%,#111827_18%,#f8fafc_18%,#ffffff_60%,#f8fafc_100%)] px-6 pb-24 pt-36">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />

          <section className="rounded-[36px] border border-white/10 bg-white/6 p-8 text-white shadow-[0_28px_90px_-54px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80">
              <BookOpen className="h-4 w-4" />
              Content hub
            </div>
            <h1
              className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl"
              style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
            >
              Helpful study resources for stronger preparation.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/72">
              These guides are built for students and parents who need practical planning help, not
              generic advice. Use them to improve revision, choose the right support, and prepare
              with more structure.
            </p>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-3">
            {[
              {
                title: "+2 preparation",
                description:
                  "Guides focused on syllabus coverage, revision rhythm, and exam confidence for +2 students.",
                href: "/courses?query=%2B2",
                linkLabel: "See +2-ready courses",
              },
              {
                title: "Engineering preparation",
                description:
                  "Planning advice for engineering students who need better structure, problem practice, and backlog control.",
                href: "/courses?query=engineering",
                linkLabel: "Browse engineering support",
              },
              {
                title: "Revision strategy",
                description:
                  "Human-first articles about study systems, mistake review, and faster syllabus completion without rushing.",
                href: "/testimonials",
                linkLabel: "See student outcomes",
              },
            ].map((cluster) => (
              <div
                key={cluster.title}
                className="rounded-[30px] border border-slate-200 bg-white px-6 py-7 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                  <Layers3 className="h-5 w-5" />
                </div>
                <h2
                  className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                  style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                >
                  {cluster.title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-slate-600">{cluster.description}</p>
                <Link
                  href={cluster.href}
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-[color:var(--color-primary)]"
                >
                  {cluster.linkLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </section>

          <section className="mt-10">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                  Featured guides
                </p>
                <h2
                  className="mt-3 text-4xl font-bold tracking-[-0.04em] text-slate-950"
                  style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                >
                  Start with the most useful articles.
                </h2>
              </div>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-900 transition-transform hover:-translate-y-0.5"
              >
                Ask a study question <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-3">
              {RESOURCE_ARTICLES.map((article) => (
                <article
                  key={article.slug}
                  className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)]"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      {article.targetKeyword}
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      <Clock3 className="h-3.5 w-3.5" />
                      {article.readingTime}
                    </span>
                  </div>
                  <h3
                    className="mt-5 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                    style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                  >
                    {article.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{article.description}</p>
                  <Link
                    href={`/resources/${article.slug}`}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-slate-900"
                  >
                    Read the guide <ArrowRight className="h-4 w-4" />
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
