import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";
import DynamicStyles from "@/components/DynamicStyles";
import JsonLd from "@/components/seo/JsonLd";
import { getPublicSettings } from "@/lib/get-public-settings";
import { buildMetadata } from "@/lib/seo";
import {
  buildEducationalOrganizationSchema,
  buildWebsiteSchema,
} from "@/lib/schema";
import {
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_KEYWORDS,
  DEFAULT_SITE_NAME,
} from "@/lib/site";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  ...buildMetadata({
    title: DEFAULT_SITE_NAME,
    description: DEFAULT_SITE_DESCRIPTION,
    path: "/",
    keywords: DEFAULT_SITE_KEYWORDS,
  }),
  authors: [{ name: `${DEFAULT_SITE_NAME} Admissions` }],
  creator: DEFAULT_SITE_NAME,
  publisher: DEFAULT_SITE_NAME,
  applicationName: DEFAULT_SITE_NAME,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();
  const schemaPayload = [
    buildEducationalOrganizationSchema(settings),
    buildWebsiteSchema(settings),
  ];

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        {settings && <DynamicStyles settings={settings} />}
        <JsonLd data={schemaPayload} />
      </head>
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
