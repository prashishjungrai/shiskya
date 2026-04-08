import CoursesListingView from "@/components/public/CoursesListingView";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicCourses, getPublicSettings } from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";
import {
  buildBreadcrumbSchema,
  buildItemListSchema,
  buildWebPageSchema,
} from "@/lib/schema";
import { getSiteName } from "@/lib/site";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Courses" },
];

const breadcrumbSchemaItems = [
  { name: "Home", path: "/" },
  { name: "Courses", path: "/courses" },
];

const description =
  "Explore +2 and engineering tuition courses at Bidhya Kendra, including syllabus support, fee guidance, duration, and exam-focused preparation.";

export async function generateMetadata() {
  const settings = await getPublicSettings();
  const siteName = getSiteName(settings);

  return buildMetadata({
    title: "Courses",
    description,
    path: "/courses",
    keywords: [
      "tuition courses in Nepal",
      "+2 exam preparation courses",
      "engineering preparation classes",
      "syllabus completion classes",
    ],
    siteName,
  });
}

export default async function CoursesListing() {
  const courses = await getPublicCourses();

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            title: "Courses",
            description,
            path: "/courses",
          }),
          buildBreadcrumbSchema(breadcrumbSchemaItems),
          buildItemListSchema(
            courses.map((course) => ({
              name: course.title,
              path: `/courses/${course.slug}`,
            })),
          ),
        ]}
      />
      <CoursesListingView courses={courses} breadcrumbs={breadcrumbItems} />
    </>
  );
}
