"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import api from "@/lib/api";
import TeachersDirectoryView from "@/components/public/TeachersDirectoryView";
import { TeachersPageSkeleton } from "@/components/public/PublicSkeletons";
import { Teacher } from "@/lib/types";

export default function TeachersDirectory() {
  const settings = useTheme();
  const teachersVisibility = settings?.teachers_page?.visibility;
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/public/teachers")
      .then((teachersResponse) => {
        setTeachers(teachersResponse.data.filter((teacher: Teacher) => teacher.is_active));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !settings) {
    return <TeachersPageSkeleton visibility={teachersVisibility} />;
  }

  return (
    <TeachersDirectoryView
      teachers={teachers}
      settings={settings.teachers_page}
      siteName={settings.site_name}
    />
  );
}
