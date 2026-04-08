import HomePageView from "@/components/public/HomePageView";
import JsonLd from "@/components/seo/JsonLd";
import {
  getPublicBanners,
  getPublicCourses,
  getPublicNotices,
  getPublicSettings,
  getPublicTeachers,
  getPublicTestimonials,
} from "@/lib/public-api";
import { buildHomeMetadata } from "@/lib/seo";
import { buildWebPageSchema } from "@/lib/schema";
import { getSiteDescription, getSiteName } from "@/lib/site";

export async function generateMetadata() {
  const settings = await getPublicSettings();

  return buildHomeMetadata(settings);
}

export default async function Home() {
  const [settings, banners, courses, teachers, testimonials, notices] = await Promise.all([
    getPublicSettings(),
    getPublicBanners(),
    getPublicCourses(),
    getPublicTeachers(),
    getPublicTestimonials(),
    getPublicNotices(),
  ]);
  const siteName = getSiteName(settings);
  const description = getSiteDescription(settings);

  return (
    <>
      <JsonLd
        data={buildWebPageSchema({
          title: siteName,
          description,
          path: "/",
        })}
      />
      <HomePageView
        settings={settings}
        banners={banners}
        courses={courses}
        teachers={teachers}
        testimonials={testimonials}
        notices={notices}
      />
    </>
  );
}
