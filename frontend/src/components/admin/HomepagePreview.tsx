"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import PublicPagePreview from "@/components/admin/PublicPagePreview";
import HomePageView from "@/components/public/HomePageView";
import { Banner, Course, Notice, SiteSettings, Teacher, Testimonial } from "@/lib/types";

type Props = {
  settings: SiteSettings | null;
  banners?: Banner[];
  courses?: Course[];
  teachers?: Teacher[];
  testimonials?: Testimonial[];
  notices?: Notice[];
};

export default function HomepagePreview({
  settings,
  banners,
  courses,
  teachers,
  testimonials,
  notices,
}: Props) {
  const [fetchedBanners, setFetchedBanners] = useState<Banner[]>([]);
  const [fetchedCourses, setFetchedCourses] = useState<Course[]>([]);
  const [fetchedTeachers, setFetchedTeachers] = useState<Teacher[]>([]);
  const [fetchedTestimonials, setFetchedTestimonials] = useState<Testimonial[]>([]);
  const [fetchedNotices, setFetchedNotices] = useState<Notice[]>([]);

  useEffect(() => {
    if (banners || courses || teachers || testimonials || notices) return;

    Promise.all([
      api.get("/public/banners"),
      api.get("/public/courses"),
      api.get("/public/teachers"),
      api.get("/public/testimonials"),
      api.get("/public/notices"),
    ])
      .then(([bannerResponse, courseResponse, teacherResponse, testimonialResponse, noticeResponse]) => {
        setFetchedBanners(
          (bannerResponse.data as Banner[]).filter((item) => item.is_active),
        );
        setFetchedCourses(
          (courseResponse.data as Course[]).filter((item) => item.is_active),
        );
        setFetchedTeachers(
          (teacherResponse.data as Teacher[]).filter((item) => item.is_active),
        );
        setFetchedTestimonials(
          (testimonialResponse.data as Testimonial[]).filter((item) => item.is_active),
        );
        setFetchedNotices(
          (noticeResponse.data as Notice[]).filter((item) => item.is_active),
        );
      })
      .catch(console.error);
  }, [banners, courses, teachers, testimonials, notices]);

  if (!settings) return <div className="p-8 text-center text-gray-400">Loading preview...</div>;

  return (
    <PublicPagePreview settings={settings} pathname="/">
      <HomePageView
        settings={settings}
        banners={banners ?? fetchedBanners}
        courses={courses ?? fetchedCourses}
        teachers={teachers ?? fetchedTeachers}
        testimonials={testimonials ?? fetchedTestimonials}
        notices={notices ?? fetchedNotices}
        interactive={false}
      />
    </PublicPagePreview>
  );
}
