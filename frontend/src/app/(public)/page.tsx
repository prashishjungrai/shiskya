"use client";

import { useEffect, useState } from "react";
import { useTheme } from "@/components/ThemeProvider";
import api from "@/lib/api";
import HomePageView from "@/components/public/HomePageView";
import { HomePageSkeleton } from "@/components/public/PublicSkeletons";
import { Banner, Course, Notice, Teacher, Testimonial } from "@/lib/types";

export default function Home() {
  const settings = useTheme();
  const homeVisibility = settings?.home_page?.visibility;
  const [banners, setBanners] = useState<Banner[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.get("/public/banners"),
      api.get("/public/courses"),
      api.get("/public/teachers"),
      api.get("/public/testimonials"),
      api.get("/public/notices"),
    ]).then(([b, c, t, ts, n]) => {
      setBanners(b.data.filter((x: Banner) => x.is_active));
      setCourses(c.data.filter((x: Course) => x.is_active));
      setTeachers(t.data.filter((x: Teacher) => x.is_active));
      setTestimonials(ts.data.filter((x: Testimonial) => x.is_active));
      setNotices(n.data.filter((x: Notice) => x.is_active));
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (!settings || loading) {
    return <HomePageSkeleton visibility={homeVisibility} />;
  }

  return (
    <HomePageView
      settings={settings}
      banners={banners}
      courses={courses}
      teachers={teachers}
      testimonials={testimonials}
      notices={notices}
    />
  );
}
