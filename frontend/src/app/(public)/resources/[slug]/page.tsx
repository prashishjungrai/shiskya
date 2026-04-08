import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Clock3 } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicSettings } from "@/lib/public-api";
import { getResourceArticle, RESOURCE_ARTICLES } from "@/lib/resources";
import { buildMetadata } from "@/lib/seo";
import {
  buildArticleSchema,
  buildBreadcrumbSchema,
  buildFAQSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { getSiteName } from "@/lib/site";

type ResourcePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return RESOURCE_ARTICLES.map((article) => ({
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: ResourcePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getResourceArticle(slug);
  const settings = await getPublicSettings();
  const siteName = getSiteName(settings);

  if (!article) {
    return buildMetadata({
      title: "Resource not found",
      description: "The requested resource could not be found.",
      path: `/resources/${slug}`,
      noIndex: true,
      siteName,
    });
  }

  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/resources/${article.slug}`,
    keywords: [article.targetKeyword, "study resources", "exam strategy"],
    type: "article",
    siteName,
  });
}

export default async function ResourceArticlePage({ params }: ResourcePageProps) {
  const { slug } = await params;
  const settings = await getPublicSettings();
  const article = getResourceArticle(slug);

  if (!article) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: article.title },
  ];
  const breadcrumbSchemaItems = [
    { name: "Home", path: "/" },
    { name: "Resources", path: "/resources" },
    { name: article.title, path: `/resources/${article.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            title: article.title,
            description: article.description,
            path: `/resources/${article.slug}`,
          }),
          buildBreadcrumbSchema(breadcrumbSchemaItems),
          buildArticleSchema({
            title: article.title,
            description: article.description,
            path: `/resources/${article.slug}`,
            settings,
          }),
          buildFAQSchema(article.faqs),
        ]}
      />

      <div className="min-h-screen bg-[linear-gradient(180deg,#081224_0%,#111827_18%,#f8fafc_18%,#ffffff_60%,#f8fafc_100%)] px-6 pb-24 pt-36">
        <div className="mx-auto max-w-5xl">
          <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />

          <section className="rounded-[36px] border border-white/10 bg-white/6 p-8 text-white shadow-[0_28px_90px_-54px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12">
            <Link
              href="/resources"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white/72 transition-colors hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to resources
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80">
                {article.targetKeyword}
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80">
                <Clock3 className="h-3.5 w-3.5" />
                {article.readingTime}
              </span>
            </div>

            <h1
              className="mt-6 text-balance text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl"
              style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
            >
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-white/72">{article.intro}</p>
          </section>

          <article className="mt-10 rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)] md:p-10">
            {article.sections.map((section) => (
              <section key={section.heading} className="border-b border-slate-100 py-8 last:border-b-0 first:pt-0 last:pb-0">
                <h2
                  className="text-4xl font-bold tracking-[-0.04em] text-slate-950"
                  style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                >
                  {section.heading}
                </h2>
                <div className="mt-5 space-y-4 text-base leading-8 text-slate-600">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets?.length ? (
                  <ul className="mt-5 space-y-3 text-base leading-8 text-slate-600">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-3">
                        <BookOpen className="mt-1 h-5 w-5 shrink-0 text-[color:var(--color-accent)]" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </article>

          <section className="mt-10 rounded-[34px] border border-slate-200 bg-white p-8 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)]">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
              Related questions
            </p>
            <h2
              className="mt-3 text-4xl font-bold tracking-[-0.04em] text-slate-950"
              style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
            >
              Quick answers before you decide the next step
            </h2>
            <div className="mt-6 space-y-4">
              {article.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 px-5 py-4"
                >
                  <summary className="cursor-pointer list-none text-base font-semibold text-slate-900">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center rounded-[34px] border border-slate-200 bg-slate-950 px-8 py-10 text-white shadow-[0_28px_80px_-56px_rgba(15,23,42,0.55)]">
            <div>
              <h2
                className="text-4xl font-bold tracking-[-0.04em]"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                {article.cta.heading}
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/70">
                {article.cta.body}
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href={article.cta.primaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                {article.cta.primaryLabel} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={article.cta.secondaryHref}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                {article.cta.secondaryLabel} <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
