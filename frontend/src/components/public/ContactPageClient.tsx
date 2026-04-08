"use client";

import api from "@/lib/api";
import type { SiteSettings } from "@/lib/types";
import ContactPageView, { type ContactFormState } from "@/components/public/ContactPageView";
import type { BreadcrumbItem } from "@/components/seo/Breadcrumbs";

export default function ContactPageClient({
  settings,
  breadcrumbs = [],
}: {
  settings: SiteSettings | null;
  breadcrumbs?: BreadcrumbItem[];
}) {
  return (
    <ContactPageView
      settings={settings}
      breadcrumbs={breadcrumbs}
      onSubmitRequest={async (formData: ContactFormState) => {
        await api.post("/public/contacts", formData);
      }}
    />
  );
}
