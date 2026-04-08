import { MetadataRoute } from "next";
import { getPublicCourses, getPublicTeachers } from "@/lib/public-api";
import { RESOURCE_ARTICLES } from "@/lib/resources";
import { getSiteUrl } from "@/lib/site";
import { getTeacherPath } from "@/lib/teachers";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/courses`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/teachers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.75,
    },
    {
      url: `${baseUrl}/resources`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/testimonials`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.75,
    },
  ];

  const [courses, teachers] = await Promise.all([getPublicCourses(), getPublicTeachers()]);
  const courseRoutes: MetadataRoute.Sitemap = courses.map((course) => ({
    url: `${baseUrl}/courses/${course.slug}`,
    lastModified: course.updated_at || course.created_at || now,
    changeFrequency: "weekly",
    priority: 0.85,
  }));

  const teacherRoutes: MetadataRoute.Sitemap = teachers.map((teacher) => ({
    url: `${baseUrl}${getTeacherPath(teacher)}`,
    lastModified: teacher.created_at || now,
    changeFrequency: "monthly",
    priority: 0.72,
  }));

  const resourceRoutes: MetadataRoute.Sitemap = RESOURCE_ARTICLES.map((article) => ({
    url: `${baseUrl}/resources/${article.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...courseRoutes, ...teacherRoutes, ...resourceRoutes];
}
