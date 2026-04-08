import type { Metadata } from "next";
import type { SiteSettings } from "@/lib/types";
import {
  DEFAULT_LOCALE,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_KEYWORDS,
  DEFAULT_SITE_NAME,
  absoluteUrl,
  getSiteDescription,
  getSiteMetadataBase,
  getSiteName,
  mergeKeywords,
  splitKeywords,
} from "@/lib/site";

type SeoMetadataInput = {
  title: string;
  description?: string;
  path?: string;
  imagePath?: string;
  keywords?: string[];
  noIndex?: boolean;
  type?: "website" | "article";
  siteName?: string;
};

function resolveTitle(title: string, siteName: string) {
  const normalizedTitle = title.trim();

  if (!normalizedTitle) return siteName;
  if (normalizedTitle.toLowerCase().includes(siteName.toLowerCase())) {
    return normalizedTitle;
  }

  return `${normalizedTitle} | ${siteName}`;
}

function resolveImageUrl(imagePath: string) {
  return imagePath.startsWith("http") ? imagePath : absoluteUrl(imagePath);
}

function buildRobots(noIndex: boolean): Metadata["robots"] {
  if (noIndex) {
    return {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
        "max-snippet": -1,
        "max-image-preview": "none",
        "max-video-preview": -1,
      },
    };
  }

  return {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  };
}

export function buildMetadata({
  title,
  description = DEFAULT_SITE_DESCRIPTION,
  path = "/",
  imagePath = "/opengraph-image",
  keywords = [],
  noIndex = false,
  type = "website",
  siteName = DEFAULT_SITE_NAME,
}: SeoMetadataInput): Metadata {
  const canonical = absoluteUrl(path);
  const resolvedTitle = resolveTitle(title, siteName);
  const resolvedImage = resolveImageUrl(imagePath);

  return {
    metadataBase: getSiteMetadataBase(),
    title: resolvedTitle,
    description,
    keywords: mergeKeywords(DEFAULT_SITE_KEYWORDS, keywords),
    alternates: {
      canonical,
    },
    openGraph: {
      title: resolvedTitle,
      description,
      url: canonical,
      siteName,
      type,
      locale: DEFAULT_LOCALE,
      images: [
        {
          url: resolvedImage,
          width: 1200,
          height: 630,
          alt: resolvedTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description,
      images: [resolvedImage],
    },
    robots: buildRobots(noIndex),
  };
}

export function buildHomeMetadata(settings?: SiteSettings | null) {
  const siteName = getSiteName(settings);
  const description = getSiteDescription(settings);
  const explicitTitle = settings?.meta_seo?.title?.trim() || siteName;

  return buildMetadata({
    title: explicitTitle,
    description,
    path: "/",
    keywords: mergeKeywords(
      DEFAULT_SITE_KEYWORDS,
      splitKeywords(settings?.meta_seo?.keywords),
    ),
    siteName,
  });
}
