import {
  BriefcaseBusiness,
  Compass,
  Quote,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  type LucideIcon,
} from "lucide-react";
import type {
  AboutIconName,
  AboutPageSettings,
  AboutTextStyle,
  FontChoice,
  FontStyleChoice,
  FontWeightChoice,
} from "@/lib/types";

const DEFAULT_TEXT_STYLE = (
  color: string,
  size: string,
  fontFamily: FontChoice,
  fontStyle: FontStyleChoice,
  fontWeight: FontWeightChoice,
): AboutTextStyle => ({
  color,
  size,
  font_family: fontFamily,
  font_style: fontStyle,
  font_weight: fontWeight,
});

export const ABOUT_PAGE_DEFAULTS: AboutPageSettings = {
  hero: {
    badge_text: "Institutional story",
    heading: "A stronger institution page for a stronger first impression.",
    description:
      "The about page should explain what the institution believes, how it works, and why students should trust it. This version is built to do that clearly.",
    primary_cta_label: "Speak with admissions",
    primary_cta_link: "/contact",
    secondary_cta_label: "Explore programs",
    secondary_cta_link: "/courses",
    quote_title: "",
    quote_body: "",
    style: {
      section_background:
        "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 90%, #050816 10%) 0%, #0b1528 48%, #101828 100%)",
      panel_background: "rgba(255,255,255,0.08)",
      panel_border_color: "rgba(255,255,255,0.10)",
      quote_panel_background: "rgba(0,0,0,0.18)",
      quote_panel_border_color: "rgba(255,255,255,0.10)",
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
      quote_title: DEFAULT_TEXT_STYLE("#ffffff", "1.875rem", "serif", "normal", "600"),
      quote_body: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.72)",
        "1rem",
        "sans",
        "normal",
        "500",
      ),
      primary_button: {
        background: "#ffffff",
        text_color: "#0f172a",
        border_color: "#ffffff",
      },
      secondary_button: {
        background: "rgba(255,255,255,0.08)",
        text_color: "#ffffff",
        border_color: "rgba(255,255,255,0.15)",
      },
    },
  },
  narrative: {
    badge_text: "Institutional narrative",
    heading: "Why the institute exists and how it serves ambitious students.",
    content:
      "Our institution was founded on a simple principle: to provide unparalleled education that empowers students. Through rigorous curriculum, expert faculty, and a supportive environment, we have built a reputation for producing leaders and innovators.",
    style: {
      panel_background: "#ffffff",
      panel_border_color: "#e2e8f0",
      badge: {
        text_color: "#94a3b8",
        background: "transparent",
        border_color: "transparent",
      },
      heading: DEFAULT_TEXT_STYLE(
        "#020617",
        "clamp(2.5rem, 5vw, 3.75rem)",
        "serif",
        "normal",
        "700",
      ),
      body: DEFAULT_TEXT_STYLE("#475569", "1rem", "sans", "normal", "500"),
    },
  },
  mission: {
    title: "Our Mission",
    content:
      "To democratize access to premium education and equip every student with the tools they need to achieve extraordinary success.",
    icon: "target",
    style: {
      panel_background: "#ffffff",
      panel_border_color: "#e2e8f0",
      icon_background:
        "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, var(--color-primary) 45%) 100%)",
      heading: DEFAULT_TEXT_STYLE("#020617", "1.875rem", "serif", "normal", "600"),
      body: DEFAULT_TEXT_STYLE("#475569", "1rem", "sans", "normal", "500"),
    },
  },
  vision: {
    title: "Our Vision",
    content:
      "To become the global standard for educational excellence, constantly innovating how knowledge is consumed and applied.",
    icon: "compass",
    style: {
      panel_background: "#ffffff",
      panel_border_color: "#e2e8f0",
      icon_background:
        "linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 58%, var(--color-primary) 42%) 0%, var(--color-primary) 100%)",
      heading: DEFAULT_TEXT_STYLE("#020617", "1.875rem", "serif", "normal", "600"),
      body: DEFAULT_TEXT_STYLE("#475569", "1rem", "sans", "normal", "500"),
    },
  },
  principles: {
    items: [
      {
        id: "clarity-over-noise",
        title: "Clarity over noise",
        description:
          "Students should understand the institute quickly: what it believes, what it offers, and how it supports progress.",
        icon: "shield",
      },
      {
        id: "mentor-led-culture",
        title: "Mentor-led culture",
        description:
          "Faculty visibility and guidance are treated as part of the product, not hidden behind generic marketing lines.",
        icon: "users",
      },
      {
        id: "outcome-orientation",
        title: "Outcome orientation",
        description:
          "The narrative is positioned around meaningful next steps instead of vague promises.",
        icon: "briefcase",
      },
    ],
    style: {
      panel_background: "#ffffff",
      panel_border_color: "#e2e8f0",
      icon_background:
        "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, var(--color-primary) 45%) 100%)",
      heading: DEFAULT_TEXT_STYLE("#020617", "1.5rem", "serif", "normal", "600"),
      body: DEFAULT_TEXT_STYLE("#64748b", "0.875rem", "sans", "normal", "500"),
    },
  },
  stats_band: {
    badge_text: "Institutional momentum",
    heading: "Numbers matter when they support a believable story.",
    description:
      "These headline figures are part of the institution narrative and are editable from admin, so the public page and the admin preview stay aligned.",
    stats: [
      { id: "years-of-excellence", value: "10+", label: "Years of Excellence" },
      { id: "global-awards-won", value: "50+", label: "Global Awards Won" },
      { id: "student-success-rate", value: "99%", label: "Student Success Rate" },
    ],
    style: {
      section_background:
        "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 48%, var(--color-primary) 52%) 100%)",
      badge: {
        text_color: "rgba(255,255,255,0.45)",
        background: "transparent",
        border_color: "transparent",
      },
      heading: DEFAULT_TEXT_STYLE(
        "#ffffff",
        "clamp(2.5rem, 5vw, 3.75rem)",
        "serif",
        "normal",
        "700",
      ),
      body: DEFAULT_TEXT_STYLE("rgba(255,255,255,0.72)", "1rem", "sans", "normal", "500"),
      stat_panel_background: "rgba(255,255,255,0.10)",
      stat_panel_border_color: "rgba(255,255,255,0.10)",
      stat_value: DEFAULT_TEXT_STYLE("#ffffff", "3rem", "serif", "normal", "700"),
      stat_label: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.58)",
        "0.6875rem",
        "sans",
        "normal",
        "700",
      ),
    },
  },
  final_cta: {
    badge_text: "Ready to move?",
    heading: "See the programs, meet the mentors, and start the conversation.",
    description:
      "The about page should push people toward the next step with confidence instead of ending as a dead informational page.",
    primary_cta_label: "Explore programs",
    primary_cta_link: "/courses",
    secondary_cta_label: "Contact admissions",
    secondary_cta_link: "/contact",
    style: {
      panel_background: "#ffffff",
      panel_border_color: "#e2e8f0",
      badge: {
        text_color: "#94a3b8",
        background: "transparent",
        border_color: "transparent",
      },
      heading: DEFAULT_TEXT_STYLE(
        "#020617",
        "clamp(2.5rem, 5vw, 3.75rem)",
        "serif",
        "normal",
        "700",
      ),
      body: DEFAULT_TEXT_STYLE("#475569", "1rem", "sans", "normal", "500"),
      primary_button: {
        background: "#020617",
        text_color: "#ffffff",
        border_color: "#020617",
      },
      secondary_button: {
        background: "#ffffff",
        text_color: "#0f172a",
        border_color: "#e2e8f0",
      },
    },
  },
  visibility: {
    hero: true,
    hero_quote_card: true,
    hero_stats: true,
    narrative: true,
    mission: true,
    vision: true,
    principles: true,
    stats_band: true,
    final_cta: true,
  },
  stats: [
    { value: "10+", label: "Years of Excellence" },
    { value: "50+", label: "Global Awards Won" },
    { value: "99%", label: "Student Success Rate" },
  ],
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const ABOUT_ICON_OPTIONS: Array<{ label: string; value: AboutIconName }> = [
  { label: "Sparkles", value: "sparkles" },
  { label: "Quote", value: "quote" },
  { label: "Target", value: "target" },
  { label: "Compass", value: "compass" },
  { label: "Shield", value: "shield" },
  { label: "Users", value: "users" },
  { label: "Briefcase", value: "briefcase" },
];

export const ABOUT_FONT_FAMILY_OPTIONS = [
  { label: "Serif", value: "serif" },
  { label: "Sans", value: "sans" },
];

export const ABOUT_FONT_STYLE_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "Italic", value: "italic" },
];

export const ABOUT_FONT_WEIGHT_OPTIONS = [
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
];

export const ABOUT_ICON_MAP: Record<AboutIconName, LucideIcon> = {
  sparkles: Sparkles,
  quote: Quote,
  target: Target,
  compass: Compass,
  shield: ShieldCheck,
  users: Users,
  briefcase: BriefcaseBusiness,
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

export function normalizeAboutPage(
  rawAboutPage: unknown,
  siteName: string,
  legacyAboutContent?: string,
): AboutPageSettings {
  const normalized = mergeDeep(ABOUT_PAGE_DEFAULTS, rawAboutPage) as AboutPageSettings & {
    stats?: Array<{ value?: string; label?: string }>;
  };

  const fallbackNarrative = legacyAboutContent?.trim() || ABOUT_PAGE_DEFAULTS.narrative.content;
  const legacyStats = Array.isArray((rawAboutPage as { stats?: unknown } | undefined)?.stats)
    ? (((rawAboutPage as { stats?: Array<{ value?: string; label?: string }> }).stats) || []).map(
        (item, index) => ({
          id: `legacy-stat-${index + 1}`,
          value: item?.value || "",
          label: item?.label || "",
        }),
      )
    : [];

  if (!normalized.hero.quote_title.trim()) {
    normalized.hero.quote_title = siteName || "Bidhya Kendra";
  }
  if (!normalized.hero.quote_body.trim()) {
    normalized.hero.quote_body = fallbackNarrative;
  }
  if (!normalized.narrative.content.trim()) {
    normalized.narrative.content = fallbackNarrative;
  }
  if (!normalized.stats_band.stats.length && legacyStats.length) {
    normalized.stats_band.stats = legacyStats;
  }

  normalized.principles.items = normalized.principles.items.map((item, index) => ({
    id: item.id || `principle-${index + 1}`,
    title: item.title || "",
    description: item.description || "",
    icon: item.icon || ABOUT_PAGE_DEFAULTS.principles.items[index]?.icon || "shield",
  }));
  normalized.stats_band.stats = normalized.stats_band.stats.map((item, index) => ({
    id: item.id || `stat-${index + 1}`,
    value: item.value || "",
    label: item.label || "",
  }));

  return normalized;
}

export function getFontFamilyValue(fontFamily: FontChoice) {
  return fontFamily === "serif"
    ? "var(--font-serif, Playfair Display), serif"
    : "var(--font-sans, Inter), sans-serif";
}

export function getTextStyle(style: AboutTextStyle) {
  return {
    color: style.color,
    fontSize: style.size,
    fontStyle: style.font_style,
    fontWeight: style.font_weight,
    fontFamily: getFontFamilyValue(style.font_family),
  };
}
