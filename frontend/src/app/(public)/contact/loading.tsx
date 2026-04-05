"use client";

import { useTheme } from "@/components/ThemeProvider";
import { ContactPageSkeleton } from "@/components/public/PublicSkeletons";

export default function Loading() {
  const settings = useTheme();
  return <ContactPageSkeleton settings={settings} />;
}
