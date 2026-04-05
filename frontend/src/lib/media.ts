const DEFAULT_API_URL = "http://localhost:8000/api";

function getApiOrigin() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_URL;

  try {
    return new URL(apiUrl).origin;
  } catch {
    return "http://localhost:8000";
  }
}

const API_ORIGIN = getApiOrigin();
const ABSOLUTE_URL_PATTERN = /^(https?:)?\/\//i;
const DATA_URL_PATTERN = /^(data:image\/|blob:)/i;

export function resolveMediaUrl(value?: string | null) {
  if (!value) return "";

  const trimmed = value.trim();
  if (!trimmed) return "";

  if (DATA_URL_PATTERN.test(trimmed)) {
    return trimmed;
  }

  if (ABSOLUTE_URL_PATTERN.test(trimmed)) {
    return trimmed.startsWith("//") ? `https:${trimmed}` : trimmed;
  }

  if (trimmed.startsWith("/")) {
    return `${API_ORIGIN}${trimmed}`;
  }

  if (trimmed.startsWith("uploads/") || trimmed.startsWith("static/")) {
    return `${API_ORIGIN}/${trimmed}`;
  }

  return "";
}

export function pickFirstMediaUrl(...values: Array<string | null | undefined>) {
  for (const value of values) {
    const resolved = resolveMediaUrl(value);
    if (resolved) {
      return resolved;
    }
  }

  return "";
}
