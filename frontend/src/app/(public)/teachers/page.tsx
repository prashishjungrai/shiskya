import TeachersDirectoryView from "@/components/public/TeachersDirectoryView";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicSettings, getPublicTeachers } from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";
import { getSiteName } from "@/lib/site";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "Teachers" },
];

const breadcrumbSchemaItems = [
  { name: "Home", path: "/" },
  { name: "Teachers", path: "/teachers" },
];

const description =
  "Meet the Bidhya Kendra teaching team for +2 and engineering tuition, and review the faculty members guiding student progress.";

export async function generateMetadata() {
  const settings = await getPublicSettings();
  const siteName = getSiteName(settings);

  return buildMetadata({
    title: "Teachers",
    description,
    path: "/teachers",
    keywords: [
      "tuition teachers in Nepal",
      "experienced faculty for +2",
      "engineering tuition teachers",
    ],
    siteName,
  });
}

export default async function TeachersDirectory() {
  const [settings, teachers] = await Promise.all([
    getPublicSettings(),
    getPublicTeachers(),
  ]);

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            title: "Teachers",
            description,
            path: "/teachers",
          }),
          buildBreadcrumbSchema(breadcrumbSchemaItems),
        ]}
      />
      <TeachersDirectoryView
        teachers={teachers}
        settings={settings?.teachers_page}
        siteName={settings?.site_name}
        breadcrumbs={breadcrumbItems}
      />
    </>
  );
}
