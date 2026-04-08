import type { SiteSettings } from "@/lib/types";

export const DEFAULT_SITE_NAME = "Bidhya Kendra";
export const DEFAULT_SITE_DESCRIPTION =
  "Bidhya Kendra helps +2 and engineering students in Nepal with exam-focused tuition, fast syllabus completion, trusted teachers, and guided admissions support.";
export const DEFAULT_SITE_KEYWORDS = [
  "Bidhya Kendra",
  "+2 tuition in Nepal",
  "engineering tuition in Nepal",
  "exam preparation classes",
  "fast syllabus completion",
  "science tuition",
  "bridge course for students",
  "tuition for parents and students",
];
export const DEFAULT_LOCALE = "en_NP";
export const DEFAULT_LANGUAGE = "en-NP";
export const DEFAULT_AREA_SERVED = "Nepal";

function trimTrailingSlash(value: string) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

function parseAbsoluteUrl(value: string, fallback: string) {
  try {
    return trimTrailingSlash(new URL(value).toString());
  } catch {
    return fallback;
  }
}

export function getSiteUrl() {
  const vercelUrl =
    process.env.VERCEL_URL && !process.env.VERCEL_URL.startsWith("http")
      ? `https://${process.env.VERCEL_URL}`
      : process.env.VERCEL_URL;

  return parseAbsoluteUrl(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_FRONTEND_URL ||
      vercelUrl ||
      "http://localhost:3000",
    "http://localhost:3000",
  );
}

export function getSiteMetadataBase() {
  return new URL(getSiteUrl());
}

export function getApiUrl() {
  return parseAbsoluteUrl(
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api",
    "http://127.0.0.1:8000/api",
  );
}

export function absoluteUrl(path = "/") {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return new URL(normalizedPath, getSiteUrl()).toString();
}

export function getSiteName(settings?: Pick<SiteSettings, "site_name"> | null) {
  return settings?.site_name?.trim() || DEFAULT_SITE_NAME;
}

export function getSiteDescription(
  settings?: Pick<SiteSettings, "meta_seo"> | null,
) {
  return settings?.meta_seo?.description?.trim() || DEFAULT_SITE_DESCRIPTION;
}

export function splitKeywords(value?: string | null) {
  if (!value) return [];

  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export function mergeKeywords(...keywordGroups: Array<Array<string> | undefined>) {
  return Array.from(
    new Set(
      keywordGroups
        .flatMap((group) => group || [])
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    ),
  );
}

export function getPrimaryPhone(settings?: Pick<SiteSettings, "contact_info"> | null) {
  return settings?.contact_info?.phone?.find((phone) => phone?.trim()) || "";
}
