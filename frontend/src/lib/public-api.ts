import type {
  Banner,
  Course,
  Notice,
  SiteSettings,
  Teacher,
  Testimonial,
} from "@/lib/types";
import { getApiUrl } from "@/lib/site";
import { findTeacherBySlug } from "@/lib/teachers";

type FetchOptions<T> = {
  fallback: T;
  revalidate?: number;
  tags?: string[];
};

async function fetchPublicJson<T>(
  path: string,
  { fallback, revalidate = 3600, tags = [] }: FetchOptions<T>,
) {
  const url = `${getApiUrl()}${path}`;

  try {
    const response = await fetch(url, {
      next: {
        revalidate,
        tags: ["public-api", ...tags],
      },
    });

    if (!response.ok) {
      return fallback;
    }

    return (await response.json()) as T;
  } catch {
    return fallback;
  }
}

export function getPublicSettings() {
  return fetchPublicJson<SiteSettings | null>("/public/settings", {
    fallback: null,
    revalidate: 86400,
    tags: ["settings"],
  });
}

export function getPublicBanners() {
  return fetchPublicJson<Banner[]>("/public/banners", {
    fallback: [],
    revalidate: 3600,
    tags: ["banners"],
  });
}

export function getPublicCourses() {
  return fetchPublicJson<Course[]>("/public/courses", {
    fallback: [],
    revalidate: 3600,
    tags: ["courses"],
  });
}

export function getPublicCourse(slug: string) {
  return fetchPublicJson<Course | null>(`/public/courses/${slug}`, {
    fallback: null,
    revalidate: 3600,
    tags: [`course:${slug}`, "courses"],
  });
}

export function getPublicTeachers() {
  return fetchPublicJson<Teacher[]>("/public/teachers", {
    fallback: [],
    revalidate: 3600,
    tags: ["teachers"],
  });
}

export async function getPublicTeacher(slug: string) {
  const teachers = await getPublicTeachers();
  return findTeacherBySlug(teachers, slug);
}

export function getPublicTestimonials() {
  return fetchPublicJson<Testimonial[]>("/public/testimonials", {
    fallback: [],
    revalidate: 3600,
    tags: ["testimonials"],
  });
}

export function getPublicNotices() {
  return fetchPublicJson<Notice[]>("/public/notices", {
    fallback: [],
    revalidate: 3600,
    tags: ["notices"],
  });
}
