import type { SiteSettings } from "@/lib/types";

export async function getPublicSettings(): Promise<SiteSettings | null> {
  const url = `${
    process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api"
  }/public/settings`;

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;
    return (await res.json()) as SiteSettings;
  } catch {
    return null;
  }
}
