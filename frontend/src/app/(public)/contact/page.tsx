"use client";

import { useTheme } from "@/components/ThemeProvider";
import api from "@/lib/api";
import ContactPageView, { ContactFormState } from "@/components/public/ContactPageView";
import { ContactPageSkeleton } from "@/components/public/PublicSkeletons";

export default function ContactPage() {
  const settings = useTheme();
  const contactSettings = settings;

  if (!settings) return <ContactPageSkeleton settings={contactSettings} />;

  return (
    <ContactPageView
      settings={settings}
      onSubmitRequest={async (formData: ContactFormState) => {
        await api.post("/public/contacts", formData);
      }}
    />
  );
}
