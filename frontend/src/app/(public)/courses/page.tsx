"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import CoursesListingView from "@/components/public/CoursesListingView";
import { CoursesPageSkeleton } from "@/components/public/PublicSkeletons";
import { Course } from "@/lib/types";

export default function CoursesListing() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/public/courses")
      .then(res => setCourses(res.data.filter((c: Course) => c.is_active)))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <CoursesPageSkeleton />;

  return <CoursesListingView courses={courses} />;
}
