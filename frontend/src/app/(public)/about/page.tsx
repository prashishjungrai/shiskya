import AboutPageView from "@/components/public/AboutPageView";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicSettings } from "@/lib/public-api";
import { buildMetadata } from "@/lib/seo";
import { buildBreadcrumbSchema, buildWebPageSchema } from "@/lib/schema";
import { getSiteName } from "@/lib/site";

const breadcrumbItems = [
  { label: "Home", href: "/" },
  { label: "About" },
];

const breadcrumbSchemaItems = [
  { name: "Home", path: "/" },
  { name: "About", path: "/about" },
];

const description =
  "Learn how Bidhya Kendra supports +2 and engineering students with structured tuition, trusted teachers, and faster syllabus completion.";

export async function generateMetadata() {
  const settings = await getPublicSettings();
  const siteName = getSiteName(settings);

  return buildMetadata({
    title: `About ${siteName}`,
    description,
    path: "/about",
    keywords: [
      "about Bidhya Kendra",
      "tuition institute in Nepal",
      "+2 and engineering coaching",
    ],
    siteName,
  });
}

export default async function AboutPage() {
  const settings = await getPublicSettings();
  const siteName = getSiteName(settings);

  return (
    <>
      <JsonLd
        data={[
          buildWebPageSchema({
            title: `About ${siteName}`,
            description,
            path: "/about",
          }),
          buildBreadcrumbSchema(breadcrumbSchemaItems),
        ]}
      />
      <AboutPageView settings={settings} breadcrumbs={breadcrumbItems} />
    </>
  );
}
