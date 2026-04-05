"use client";

import { useTheme } from "@/components/ThemeProvider";
import { HomePageSkeleton } from "@/components/public/PublicSkeletons";

export default function Loading() {
  const settings = useTheme();
  return <HomePageSkeleton visibility={settings?.home_page?.visibility} />;
}
