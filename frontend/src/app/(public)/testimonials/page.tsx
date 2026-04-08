import Link from "next/link";
import { ArrowRight, Quote, Star } from "lucide-react";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicSettings, getPublicTestimonials } from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildOrganizationReviewsSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { getSiteName } from "@/lib/site";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Testimonials" },
];

const breadcrumbSchemaItems = [
  { name: "Home", path: "/" },
  { name: "Testimonials", path: "/testimonials" },
];

const description =
  "Read what Bidhya Kendra students say about tuition support, teacher guidance, and exam preparation.";

export async function generateMetadata() {
  const settings = await getPublicSettings();
  const siteName = getSiteName(settings);

  return buildMetadata({
    title: "Testimonials",
    description,
    path: "/testimonials",
    keywords: [
      "student testimonials",
      "tuition reviews",
      "Bidhya Kendra student feedback",
    ],
    siteName,
  });
}

export default async function TestimonialsPage() {
  const [settings, testimonials] = await Promise.all([
    getPublicSettings(),
    getPublicTestimonials(),
  ]);
  const averageRating = testimonials.length
    ? (
        testimonials.reduce((total, testimonial) => total + testimonial.rating, 0) /
        testimonials.length
      ).toFixed(1)
    : "5.0";

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            title: "Testimonials",
            description,
            path: "/testimonials",
          }),
          buildBreadcrumbSchema(breadcrumbSchemaItems),
          buildOrganizationReviewsSchema({
            settings,
            testimonials,
          }),
        ]}
      />

      <div className="min-h-screen bg-[linear-gradient(180deg,#081224_0%,#111827_18%,#f8fafc_18%,#ffffff_60%,#f8fafc_100%)] px-6 pb-24 pt-36">
        <div className="mx-auto max-w-7xl">
          <Breadcrumbs items={breadcrumbItems} variant="light" className="mb-6" />

          <section className="rounded-[36px] border border-white/10 bg-white/6 p-8 text-white shadow-[0_28px_90px_-54px_rgba(0,0,0,0.45)] backdrop-blur-2xl md:p-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-white/80">
              <Quote className="h-4 w-4" />
              Student proof
            </div>
            <h1
              className="mt-6 max-w-4xl text-balance text-5xl font-bold tracking-[-0.05em] text-white md:text-7xl"
              style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
            >
              Student feedback that supports trust.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/72">
              Real testimonials help students and parents understand how the teaching experience
              feels before they make an enquiry.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/80">
                Visible testimonials: {testimonials.length}
              </div>
              <div className="rounded-full border border-white/12 bg-white/8 px-4 py-2.5 text-sm font-medium text-white/80">
                Average rating: {averageRating}/5
              </div>
            </div>
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.id}
                className="rounded-[30px] border border-slate-200 bg-white p-6 shadow-[0_24px_70px_-56px_rgba(15,23,42,0.34)]"
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-slate-500">
                      {testimonial.course || "Student feedback"}
                    </p>
                    <h2
                      className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-950"
                      style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
                    >
                      {testimonial.student_name}
                    </h2>
                  </div>
                  <div className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-600">
                    <Star className="h-4 w-4 fill-current" />
                    {testimonial.rating}/5
                  </div>
                </div>
                <p className="mt-5 text-base leading-8 text-slate-600">{testimonial.content}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href={
                      testimonial.course
                        ? `/courses?query=${encodeURIComponent(testimonial.course)}`
                        : "/courses"
                    }
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition-colors hover:text-[color:var(--color-primary)]"
                  >
                    View matching courses <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-slate-900"
                  >
                    Ask about admission fit <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))}
          </section>

          <section className="mt-10 grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center rounded-[34px] border border-slate-200 bg-slate-950 px-8 py-10 text-white shadow-[0_28px_80px_-56px_rgba(15,23,42,0.55)]">
            <div>
              <h2
                className="text-4xl font-bold tracking-[-0.04em]"
                style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
              >
                Ready to compare the next step?
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-white/70">
                Review the course catalogue, then ask for help choosing the right tuition path for
                the student&apos;s current goals.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/courses"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition-transform hover:-translate-y-0.5"
              >
                Explore courses <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/12 bg-white/8 px-5 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Contact admissions <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
