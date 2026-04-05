import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/ui/ToastProvider";
import DynamicStyles from "@/components/DynamicStyles";
import { getPublicSettings } from "@/lib/get-public-settings";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.tuitionhubnepal.com'),
  title: {
    template: "%s | Premium Tuition Center in Nepal",
    default: "TuitionHub | #1 Tuition Center in Nepal | +2 & Class 10",
  },
  description: "Top-rated educational tuition center in Nepal offering expert classes for +2 Science, Management, Class 9, Class 10/SEE, and Entrance preparation. Enroll today for premium learning.",
  keywords: [
    "tuition in nepal",
    "+2 tuition nepal",
    "class 10 tuition nepal",
    "SEE preparation classes nepal",
    "best tuition center Kathmandu",
    "entrance preparation nepal",
    "physics tuition nepal",
    "online tuition nepal",
  ],
  authors: [{ name: "TuitionHub Admissions" }],
  openGraph: {
    title: "TuitionHub | Leading Tuition Institute in Nepal",
    description: "Expert +2 and High School tuition classes by top educators in Nepal.",
    url: "/",
    siteName: "TuitionHub Nepal",
    locale: "en_US",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        {settings && <DynamicStyles settings={settings} />}
      </head>
      <body className="min-h-full flex flex-col">
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
