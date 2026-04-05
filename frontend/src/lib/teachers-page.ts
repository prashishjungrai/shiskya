import {
  Award,
  BriefcaseBusiness,
  GraduationCap,
  Headphones,
  ShieldCheck,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type {
  FontChoice,
  FontStyleChoice,
  FontWeightChoice,
  TeachersIconName,
  TeachersPageSettings,
  TeachersTextStyle,
} from "@/lib/types";

const DEFAULT_TEXT_STYLE = (
  color: string,
  size: string,
  fontFamily: FontChoice,
  fontStyle: FontStyleChoice,
  fontWeight: FontWeightChoice,
): TeachersTextStyle => ({
  color,
  size,
  font_family: fontFamily,
  font_style: fontStyle,
  font_weight: fontWeight,
});

export const TEACHERS_PAGE_DEFAULTS: TeachersPageSettings = {
  hero: {
    badge_text: "Faculty collective",
    heading: "Learn from mentors who make the institute believable.",
    description:
      "A premium faculty page should feel like a credibility layer. Search by subject, review mentor profiles, and understand who is shaping the learning experience.",
    search_label: "Search faculty",
    search_placeholder: "Search by mentor name, subject, qualification, or bio",
    faculty_metric_label: "Faculty",
    faculty_metric_value: "",
    subjects_metric_label: "Subjects",
    subjects_metric_value: "",
    mentorship_metric_label: "Mentor-led",
    mentorship_metric_value: "1:1",
    style: {
      section_background:
        "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 88%, #050816 12%) 0%, #0b1528 44%, #101828 100%)",
      search_panel_background: "rgba(255,255,255,0.08)",
      search_panel_border_color: "rgba(255,255,255,0.10)",
      search_input_background: "#ffffff",
      search_input_border_color: "rgba(255,255,255,0.10)",
      search_icon_background: "#020617",
      search_icon_color: "#ffffff",
      metric_panel_background: "rgba(0,0,0,0.15)",
      metric_panel_border_color: "rgba(255,255,255,0.10)",
      badge: {
        text_color: "rgba(255,255,255,0.78)",
        background: "rgba(255,255,255,0.10)",
        border_color: "rgba(255,255,255,0.10)",
      },
      heading: DEFAULT_TEXT_STYLE(
        "#ffffff",
        "clamp(3rem, 7vw, 5.5rem)",
        "serif",
        "normal",
        "700",
      ),
      description: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.72)",
        "1.125rem",
        "sans",
        "normal",
        "500",
      ),
      search_label: DEFAULT_TEXT_STYLE("#94a3b8", "10px", "sans", "normal", "700"),
      search_input: DEFAULT_TEXT_STYLE("#0f172a", "14px", "sans", "normal", "500"),
      metric_label: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.45)",
        "10px",
        "sans",
        "normal",
        "700",
      ),
      metric_value: DEFAULT_TEXT_STYLE("#ffffff", "1.5rem", "sans", "normal", "600"),
    },
  },
  filter_bar: {
    all_subjects_label: "All Faculty",
    clear_search_label: "Clear search",
    results_prefix: "Showing",
    results_suffix: "mentors",
    style: {
      panel_background: "rgba(255,255,255,0.88)",
      panel_border_color: "rgba(226,232,240,0.8)",
      chip_background: "#ffffff",
      chip_border_color: "#e2e8f0",
      chip_active_background: "#020617",
      chip_active_border_color: "#020617",
      chip_active_text_color: "#ffffff",
      results_background: "#f8fafc",
      results_border_color: "#e2e8f0",
      clear_button_background: "#ffffff",
      clear_button_border_color: "#e2e8f0",
      chip_text: DEFAULT_TEXT_STYLE("#475569", "14px", "sans", "normal", "600"),
      results_text: DEFAULT_TEXT_STYLE("#334155", "14px", "sans", "normal", "500"),
      clear_text: DEFAULT_TEXT_STYLE("#475569", "14px", "sans", "normal", "500"),
    },
  },
  spotlight: {
    badge_text: "Faculty spotlight",
    bio_fallback: "Experienced faculty profile with a clear teaching identity and subject focus.",
    focus_label: "Focus area",
    focus_fallback: "Institutional faculty",
    role_label: "Role",
    role_value: "Mentor-led learning",
    empty_title: "No mentor matches the current search.",
    empty_description: "Try another subject or clear the query to reopen the full faculty roster.",
    style: {
      panel_background: "#ffffff",
      panel_border_color: "#e2e8f0",
      content_background: "#020617",
      content_border_color: "rgba(255,255,255,0.10)",
      meta_panel_background: "rgba(255,255,255,0.08)",
      meta_panel_border_color: "rgba(255,255,255,0.10)",
      badge: {
        text_color: "rgba(255,255,255,0.75)",
        background: "rgba(255,255,255,0.10)",
        border_color: "rgba(255,255,255,0.10)",
      },
      name: DEFAULT_TEXT_STYLE(
        "#ffffff",
        "clamp(2rem, 4vw, 2.5rem)",
        "serif",
        "normal",
        "700",
      ),
      qualification: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.62)",
        "14px",
        "sans",
        "normal",
        "500",
      ),
      body: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.72)",
        "16px",
        "sans",
        "normal",
        "500",
      ),
      meta_label: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.45)",
        "10px",
        "sans",
        "normal",
        "700",
      ),
      meta_value: DEFAULT_TEXT_STYLE("#ffffff", "14px", "sans", "normal", "600"),
      empty_title: DEFAULT_TEXT_STYLE("#0f172a", "1.25rem", "sans", "normal", "600"),
      empty_body: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
    },
  },
  roster: {
    fallback_bio: "Dedicated faculty profile available in the institutional roster.",
    style: {
      panel_background: "#ffffff",
      panel_border_color: "#e2e8f0",
      subject: DEFAULT_TEXT_STYLE("#94a3b8", "10px", "sans", "normal", "700"),
      name: DEFAULT_TEXT_STYLE("#020617", "1.5rem", "serif", "normal", "600"),
      qualification: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
      body: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
    },
  },
  principles: {
    items: [
      {
        id: "visible-teaching-identity",
        title: "Visible teaching identity",
        description:
          "Every mentor card now gives a faster read on subject, qualification, and teaching context.",
        icon: "sparkles",
      },
      {
        id: "trust-before-inquiry",
        title: "Trust before inquiry",
        description:
          "The faculty page is designed to reduce uncertainty before a student reaches admissions.",
        icon: "shield",
      },
      {
        id: "mentor-led-culture",
        title: "Mentor-led culture",
        description:
          "The page positions faculty as a core part of the value proposition, not an afterthought.",
        icon: "headphones",
      },
    ],
    style: {
      panel_background: "#ffffff",
      panel_border_color: "#e2e8f0",
      icon_background:
        "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, var(--color-primary) 45%) 100%)",
      heading: DEFAULT_TEXT_STYLE("#020617", "1.5rem", "serif", "normal", "600"),
      body: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
    },
  },
  cta: {
    badge_text: "Need a recommendation?",
    heading: "Ask admissions which mentor path fits your next move.",
    description:
      "When users can see the faculty clearly, the next natural step is guided matching.",
    button_label: "Contact admissions",
    button_link: "/contact",
    style: {
      panel_background: "#020617",
      panel_border_color: "#0f172a",
      badge: {
        text_color: "rgba(255,255,255,0.45)",
        background: "transparent",
        border_color: "transparent",
      },
      heading: DEFAULT_TEXT_STYLE(
        "#ffffff",
        "clamp(2rem, 4vw, 2.75rem)",
        "serif",
        "normal",
        "700",
      ),
      body: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.68)",
        "16px",
        "sans",
        "normal",
        "500",
      ),
      button: {
        background: "#ffffff",
        text_color: "#020617",
        border_color: "#ffffff",
      },
    },
  },
  visibility: {
    hero: true,
    filter_bar: true,
    spotlight: true,
    principles: true,
    cta: true,
  },
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const TEACHERS_ICON_OPTIONS: Array<{ label: string; value: TeachersIconName }> = [
  { label: "Award", value: "award" },
  { label: "Briefcase", value: "briefcase" },
  { label: "Graduation Cap", value: "graduation-cap" },
  { label: "Headphones", value: "headphones" },
  { label: "Shield", value: "shield" },
  { label: "Sparkles", value: "sparkles" },
  { label: "Users", value: "users" },
];

export const TEACHERS_FONT_FAMILY_OPTIONS = [
  { label: "Serif", value: "serif" },
  { label: "Sans", value: "sans" },
];

export const TEACHERS_FONT_STYLE_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "Italic", value: "italic" },
];

export const TEACHERS_FONT_WEIGHT_OPTIONS = [
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
];

export const TEACHERS_ICON_MAP: Record<TeachersIconName, LucideIcon> = {
  award: Award,
  briefcase: BriefcaseBusiness,
  "graduation-cap": GraduationCap,
  headphones: Headphones,
  shield: ShieldCheck,
  sparkles: Sparkles,
  users: Users,
};

function mergeDeep<T>(defaults: T, overrides?: unknown): T {
  if (Array.isArray(defaults)) {
    return (Array.isArray(overrides) ? overrides : defaults).map((item) =>
      typeof item === "object" && item !== null ? clone(item) : item,
    ) as T;
  }

  if (typeof defaults !== "object" || defaults === null) {
    return (overrides === undefined || overrides === null ? defaults : overrides) as T;
  }

  const base = clone(defaults) as Record<string, unknown>;
  const source =
    overrides && typeof overrides === "object" && !Array.isArray(overrides)
      ? (overrides as Record<string, unknown>)
      : {};

  for (const [key, value] of Object.entries(base)) {
    base[key] = mergeDeep(value, source[key]);
  }

  for (const [key, value] of Object.entries(source)) {
    if (!(key in base) && value !== undefined) {
      base[key] = clone(value);
    }
  }

  return base as T;
}

export function normalizeTeachersPage(
  rawTeachersPage: unknown,
  siteName?: string,
): TeachersPageSettings {
  const normalized = mergeDeep(TEACHERS_PAGE_DEFAULTS, rawTeachersPage);
  const rosterName = siteName?.trim() ? `${siteName.trim()} faculty` : "Institutional faculty";

  if (!normalized.spotlight.focus_fallback.trim()) {
    normalized.spotlight.focus_fallback = rosterName;
  }

  normalized.principles.items = normalized.principles.items.map((item, index) => ({
    id: item.id || `teachers-principle-${index + 1}`,
    title: item.title || "",
    description: item.description || "",
    icon:
      item.icon ||
      TEACHERS_PAGE_DEFAULTS.principles.items[index]?.icon ||
      TEACHERS_PAGE_DEFAULTS.principles.items[0].icon,
  }));

  return normalized;
}

export function getTeachersFontFamilyValue(fontFamily: FontChoice) {
  return fontFamily === "serif"
    ? "var(--font-serif, Playfair Display), serif"
    : "var(--font-sans, Inter), sans-serif";
}

export function getTeachersTextStyle(style: TeachersTextStyle) {
  return {
    color: style.color,
    fontSize: style.size,
    fontStyle: style.font_style,
    fontWeight: style.font_weight,
    fontFamily: getTeachersFontFamilyValue(style.font_family),
  };
}
