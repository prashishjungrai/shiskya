import { resolveMediaUrl } from "@/lib/media";
import {
  DEFAULT_AREA_SERVED,
  DEFAULT_LANGUAGE,
  absoluteUrl,
  getPrimaryPhone,
  getSiteDescription,
  getSiteName,
  getSiteUrl,
} from "@/lib/site";
import type { Course, SiteSettings, Teacher, Testimonial } from "@/lib/types";

export type SchemaBreadcrumbItem = {
  name: string;
  path: string;
};

export type SchemaFaqItem = {
  question: string;
  answer: string;
};

function removeEmptyValues<T>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => removeEmptyValues(item))
      .filter(
        (item) =>
          item !== undefined &&
          item !== null &&
          !(Array.isArray(item) && item.length === 0),
      ) as T;
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .map(([key, nestedValue]) => [key, removeEmptyValues(nestedValue)])
        .filter(([, nestedValue]) => {
          if (nestedValue === undefined || nestedValue === null) return false;
          if (Array.isArray(nestedValue) && nestedValue.length === 0) return false;
          if (
            typeof nestedValue === "object" &&
            !Array.isArray(nestedValue) &&
            Object.keys(nestedValue as Record<string, unknown>).length === 0
          ) {
            return false;
          }

          return true;
        }),
    ) as T;
  }

  return value;
}

export function buildEducationalOrganizationSchema(settings?: SiteSettings | null) {
  const phone = getPrimaryPhone(settings);
  const sameAs = Object.values(settings?.social_links || {}).filter(Boolean);
  const logoUrl = resolveMediaUrl(settings?.logo_url) || absoluteUrl("/opengraph-image");

  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": absoluteUrl("/#organization"),
    name: getSiteName(settings),
    url: getSiteUrl(),
    description: getSiteDescription(settings),
    logo: logoUrl,
    image: logoUrl,
    email: settings?.contact_info?.email,
    telephone: phone,
    areaServed: DEFAULT_AREA_SERVED,
    address: settings?.contact_info?.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.contact_info.address,
          addressCountry: "NP",
        }
      : undefined,
    hasMap: settings?.contact_info?.map_embed || undefined,
    contactPoint:
      phone || settings?.contact_info?.email
        ? [
            {
              "@type": "ContactPoint",
              contactType: "customer support",
              telephone: phone || undefined,
              email: settings?.contact_info?.email || undefined,
              areaServed: DEFAULT_AREA_SERVED,
              availableLanguage: ["en", "ne"],
            },
          ]
        : undefined,
    sameAs,
    knowsAbout: [
      "+2 exam preparation",
      "engineering preparation",
      "fast syllabus completion",
      "exam strategy",
      "tuition and coaching",
    ],
  });
}

export function buildWebsiteSchema(settings?: SiteSettings | null) {
  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: getSiteUrl(),
    name: getSiteName(settings),
    description: getSiteDescription(settings),
    inLanguage: DEFAULT_LANGUAGE,
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: absoluteUrl("/courses?query={search_term_string}"),
      },
      "query-input": "required name=search_term_string",
    },
  });
}

export function buildWebPageSchema({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}) {
  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": absoluteUrl(`${path}#webpage`),
    url: absoluteUrl(path),
    name: title,
    description,
    inLanguage: DEFAULT_LANGUAGE,
    isPartOf: {
      "@id": absoluteUrl("/#website"),
    },
    about: {
      "@id": absoluteUrl("/#organization"),
    },
  });
}

export function buildBreadcrumbSchema(items: SchemaBreadcrumbItem[]) {
  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  });
}

export function buildItemListSchema(
  items: Array<{
    name: string;
    path: string;
  }>,
) {
  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  });
}

export function buildFAQSchema(items: SchemaFaqItem[]) {
  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
}

export function buildCourseSchema({
  course,
  settings,
  path,
}: {
  course: Course;
  settings?: SiteSettings | null;
  path: string;
}) {
  const imageUrl = resolveMediaUrl(course.image_url) || absoluteUrl("/opengraph-image");

  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": "Course",
    "@id": absoluteUrl(`${path}#course`),
    name: course.title,
    description:
      course.description ||
      `${course.title} at ${getSiteName(settings)} for students who want structured academic support.`,
    url: absoluteUrl(path),
    image: imageUrl,
    educationalLevel: course.target_group,
    provider: {
      "@id": absoluteUrl("/#organization"),
    },
    isAccessibleForFree: !course.fee || course.fee === 0,
    offers:
      typeof course.fee === "number" && course.fee > 0
        ? {
            "@type": "Offer",
            price: course.fee,
            priceCurrency: "NPR",
            url: absoluteUrl(path),
            availability: "https://schema.org/InStock",
          }
        : undefined,
  });
}

export function buildArticleSchema({
  title,
  description,
  path,
  settings,
  image,
}: {
  title: string;
  description: string;
  path: string;
  settings?: SiteSettings | null;
  image?: string;
}) {
  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": absoluteUrl(`${path}#article`),
    headline: title,
    description,
    url: absoluteUrl(path),
    mainEntityOfPage: absoluteUrl(path),
    image: image || absoluteUrl("/opengraph-image"),
    inLanguage: DEFAULT_LANGUAGE,
    author: {
      "@type": "Organization",
      name: getSiteName(settings),
    },
    publisher: {
      "@id": absoluteUrl("/#organization"),
    },
  });
}

export function buildPersonSchema({
  teacher,
  settings,
  path,
}: {
  teacher: Teacher;
  settings?: SiteSettings | null;
  path: string;
}) {
  const imageUrl = resolveMediaUrl(teacher.photo_url) || absoluteUrl("/opengraph-image");
  const description =
    teacher.bio?.trim() ||
    `${teacher.name} supports students at ${getSiteName(settings)} with structured academic guidance.`;

  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": absoluteUrl(`${path}#person`),
    name: teacher.name,
    description,
    image: imageUrl,
    url: absoluteUrl(path),
    jobTitle: teacher.subject ? `${teacher.subject} teacher` : "Teacher",
    knowsAbout: teacher.subject ? [teacher.subject] : undefined,
    worksFor: {
      "@id": absoluteUrl("/#organization"),
    },
  });
}

export function buildOrganizationReviewsSchema({
  settings,
  testimonials,
}: {
  settings?: SiteSettings | null;
  testimonials: Testimonial[];
}) {
  const validTestimonials = testimonials.filter(
    (testimonial) =>
      Boolean(testimonial.student_name?.trim()) &&
      Boolean(testimonial.content?.trim()) &&
      typeof testimonial.rating === "number" &&
      testimonial.rating > 0,
  );

  if (validTestimonials.length === 0) {
    return removeEmptyValues({
      "@context": "https://schema.org",
      "@type": ["EducationalOrganization", "LocalBusiness"],
      "@id": absoluteUrl("/#organization"),
      name: getSiteName(settings),
    });
  }

  const averageRating =
    validTestimonials.reduce((total, testimonial) => total + testimonial.rating, 0) /
    validTestimonials.length;

  return removeEmptyValues({
    "@context": "https://schema.org",
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": absoluteUrl("/#organization"),
    name: getSiteName(settings),
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: Number(averageRating.toFixed(1)),
      reviewCount: validTestimonials.length,
      bestRating: 5,
      worstRating: 1,
    },
    review: validTestimonials.map((testimonial) => ({
      "@type": "Review",
      author: {
        "@type": "Person",
        name: testimonial.student_name,
      },
      reviewBody: testimonial.content,
      name: testimonial.course
        ? `${testimonial.course} student feedback`
        : "Student feedback",
      reviewRating: {
        "@type": "Rating",
        ratingValue: testimonial.rating,
        bestRating: 5,
        worstRating: 1,
      },
    })),
  });
}
