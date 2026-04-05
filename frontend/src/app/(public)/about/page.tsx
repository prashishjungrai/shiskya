"use client";

import { useTheme } from "@/components/ThemeProvider";
import AboutPageView from "@/components/public/AboutPageView";
import { AboutPageSkeleton } from "@/components/public/PublicSkeletons";

export default function AboutPage() {
  const settings = useTheme();
  const aboutVisibility = settings?.about_page?.visibility;

  if (!settings) return <AboutPageSkeleton visibility={aboutVisibility} />;
  return <AboutPageView settings={settings} />;
}
