"use client";

import { useTheme } from "@/components/ThemeProvider";
import { TeachersPageSkeleton } from "@/components/public/PublicSkeletons";

export default function Loading() {
  const settings = useTheme();
  return <TeachersPageSkeleton visibility={settings?.teachers_page?.visibility} />;
}
