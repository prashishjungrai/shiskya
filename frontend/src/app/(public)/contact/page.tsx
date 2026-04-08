import ContactPageClient from "@/components/public/ContactPageClient";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicSettings } from "@/lib/public-api";
import { SITE_FAQS } from "@/lib/site-faqs";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildFAQSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { getSiteName } from "@/lib/site";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Contact" },
];

const breadcrumbSchemaItems = [
  { name: "Home", path: "/" },
  { name: "Contact", path: "/contact" },
];

const description =
  "Contact Bidhya Kendra for course enquiries, admission help, fee information, and guidance for +2 and engineering tuition.";
const contactFaqs = SITE_FAQS.slice(2, 6);

export async function generateMetadata() {
  const settings = await getPublicSettings();
  const siteName = getSiteName(settings);

  return buildMetadata({
    title: "Contact",
    description,
    path: "/contact",
    keywords: [
      "contact tuition center",
      "admission enquiry",
      "course guidance Nepal",
      "tuition contact form",
    ],
    siteName,
  });
}

export default async function ContactPage() {
  const settings = await getPublicSettings();

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            title: "Contact",
            description,
            path: "/contact",
          }),
          buildBreadcrumbSchema(breadcrumbSchemaItems),
          buildFAQSchema(contactFaqs),
        ]}
      />
      <ContactPageClient settings={settings} breadcrumbs={breadcrumbItems} />
      <section className="bg-[linear-gradient(180deg,#0f172a_0%,#111827_100%)] px-6 pb-24 pt-2">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 text-white shadow-[0_30px_90px_-56px_rgba(15,23,42,0.55)] backdrop-blur-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
              Common admission questions
            </p>
            <h2
              className="mt-4 text-4xl font-bold tracking-[-0.04em] text-white"
              style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
            >
              Quick answers before you send an enquiry.
            </h2>
            <div className="mt-6 space-y-4">
              {contactFaqs.map((faq) => (
                <details
                  key={faq.question}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4"
                >
                  <summary className="cursor-pointer list-none text-base font-semibold text-white">
                    {faq.question}
                  </summary>
                  <p className="mt-3 text-sm leading-7 text-white/68">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>

          <aside className="rounded-[34px] border border-white/10 bg-white/[0.04] p-8 text-white shadow-[0_30px_90px_-56px_rgba(15,23,42,0.55)] backdrop-blur-xl">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/45">
              Next steps
            </p>
            <h2
              className="mt-4 text-4xl font-bold tracking-[-0.04em] text-white"
              style={{ fontFamily: "var(--font-serif, Playfair Display)" }}
            >
              Compare first, then contact us with context.
            </h2>
            <p className="mt-4 text-base leading-8 text-white/68">
              Students and parents usually get better answers when they review the course catalogue,
              faculty profiles, and testimonial proof before submitting an enquiry.
            </p>
            <div className="mt-6 space-y-3">
              {[
                {
                  href: "/courses",
                  label: "Explore courses",
                  description: "Compare syllabus fit, fees, and next-step details.",
                },
                {
                  href: "/teachers",
                  label: "Meet the teachers",
                  description: "Review subject guidance and faculty credibility.",
                },
                {
                  href: "/testimonials",
                  label: "Read student feedback",
                  description: "See how real learners describe the teaching experience.",
                },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block rounded-[24px] border border-white/10 bg-white/[0.04] px-5 py-4 transition-colors hover:bg-white/[0.08]"
                >
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-white">
                    {item.label} <ArrowRight className="h-4 w-4" />
                  </span>
                  <p className="mt-2 text-sm leading-7 text-white/65">{item.description}</p>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
