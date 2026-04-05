"use client";

import { useTheme } from "@/components/ThemeProvider";
import { AboutPageSkeleton } from "@/components/public/PublicSkeletons";

export default function Loading() {
  const settings = useTheme();
  return <AboutPageSkeleton visibility={settings?.about_page?.visibility} />;
}
