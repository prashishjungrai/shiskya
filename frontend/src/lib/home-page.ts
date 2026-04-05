import {
  BookOpen,
  BriefcaseBusiness,
  Clock3,
  GraduationCap,
  Headphones,
  MapPin,
  PhoneCall,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  type LucideIcon,
} from "lucide-react";
import type {
  FontChoice,
  FontStyleChoice,
  FontWeightChoice,
  HomeIconName,
  HomeMetricCard,
  HomeMetricSource,
  HomePageSettings,
  HomeTextStyle,
} from "@/lib/types";

const DEFAULT_TEXT_STYLE = (
  color: string,
  size: string,
  fontFamily: FontChoice,
  fontStyle: FontStyleChoice,
  fontWeight: FontWeightChoice,
): HomeTextStyle => ({
  color,
  size,
  font_family: fontFamily,
  font_style: fontStyle,
  font_weight: fontWeight,
});

export const HOME_PAGE_DEFAULTS: HomePageSettings = {
  command_bar: {
    admissions_label: "Admissions Desk",
    search_label: "Universal Search",
    search_placeholder: "Search programs, mentors, durations, outcomes, or admissions help",
    shortcut_hint: "/",
    fast_response_label: "Fast Response",
    fast_response_description:
      "Share your goals with our team and get matched to the right program faster.",
    fast_response_button_label: "Send Inquiry",
    fast_response_button_link: "/contact",
    no_result_description:
      "Press Enter to open the program explorer and continue browsing the catalogue with your current search term.",
    search_results_suffix: "matching results",
    quick_jump_label: "Quick jumps and trending categories",
    popular_searches_label: "Popular searches",
    popular_lanes_label: "Popular lanes",
    quick_actions: [
      {
        id: "browse-programs",
        title: "Browse every program",
        description: "Jump into the full course explorer directly from the homepage.",
        href: "#course-explorer",
        meta: "Catalogue",
      },
      {
        id: "meet-faculty",
        title: "Meet the teaching faculty",
        description: "Review mentors and instructors shaping the learning experience.",
        href: "#faculty-showcase",
        meta: "Faculty",
      },
      {
        id: "contact-admissions",
        title: "Contact admissions",
        description: "Open the inquiry page and talk to the admissions desk.",
        href: "/contact",
        meta: "Admissions",
      },
      {
        id: "read-proof",
        title: "Read student success stories",
        description: "Open the proof section and review visible student outcomes.",
        href: "#student-proof",
        meta: "Proof",
      },
    ],
    style: {
      panel_background: "rgba(255,255,255,0.08)",
      panel_border_color: "rgba(255,255,255,0.10)",
      card_background: "rgba(0,0,0,0.15)",
      card_border_color: "rgba(255,255,255,0.10)",
      search_panel_background: "#ffffff",
      search_panel_border_color: "rgba(255,255,255,0.12)",
      search_input_background: "#ffffff",
      search_input_border_color: "rgba(255,255,255,0.12)",
      search_hint_background: "#ffffff",
      search_hint_border_color: "#e2e8f0",
      quick_action_panel_background: "#f8fafc",
      quick_action_panel_border_color: "#f1f5f9",
      popular_chip_background: "rgba(255,255,255,0.08)",
      popular_chip_border_color: "rgba(255,255,255,0.10)",
      label: DEFAULT_TEXT_STYLE("rgba(255,255,255,0.45)", "10px", "sans", "normal", "700"),
      body: DEFAULT_TEXT_STYLE("#ffffff", "16px", "sans", "normal", "600"),
      search_label: DEFAULT_TEXT_STYLE("#94a3b8", "10px", "sans", "normal", "700"),
      search_input: DEFAULT_TEXT_STYLE("#0f172a", "14px", "sans", "normal", "500"),
      search_hint: DEFAULT_TEXT_STYLE("#64748b", "10px", "sans", "normal", "700"),
      action_title: DEFAULT_TEXT_STYLE("#0f172a", "14px", "sans", "normal", "600"),
      action_body: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
      action_meta: DEFAULT_TEXT_STYLE("#94a3b8", "12px", "sans", "normal", "500"),
      popular_label: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.40)",
        "10px",
        "sans",
        "normal",
        "700",
      ),
      popular_chip_text: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.80)",
        "12px",
        "sans",
        "normal",
        "600",
      ),
      button: {
        background: "#ffffff",
        text_color: "#020617",
        border_color: "#ffffff",
      },
    },
  },
  hero: {
    badge_text: "Premium learning experience",
    title: "The Elite Academy",
    description: "Bespoke academic leadership in Nepal",
    primary_cta_label: "Explore curriculum",
    primary_cta_link: "/courses",
    secondary_cta_label: "Speak with admissions",
    secondary_cta_link: "/contact",
    social_proof_text:
      "Learn with practitioners, get closer to industry-ready outcomes, and access a faster admissions route from the homepage itself.",
    visual_badge_text: "Live institute snapshot",
    background_image: "",
    banner_fallback_prefix: "Spotlight",
    stat_pills: [
      {
        id: "hero-programs",
        label: "active programs",
        description: "",
        icon: "book-open",
        source: "courses_count",
        prefix: "",
        suffix: "+",
        fallback_value: "0",
      },
      {
        id: "hero-mentors",
        label: "mentors",
        description: "",
        icon: "users",
        source: "teachers_count",
        prefix: "",
        suffix: "+",
        fallback_value: "0",
      },
      {
        id: "hero-rating",
        label: "student rating",
        description: "",
        icon: "star",
        source: "rating",
        prefix: "",
        suffix: "/5",
        fallback_value: "4.9",
      },
    ],
    snapshot_cards: [
      {
        id: "snapshot-programs",
        label: "Programs",
        description: "",
        icon: "briefcase",
        source: "courses_count",
        prefix: "",
        suffix: "+",
        fallback_value: "0",
      },
      {
        id: "snapshot-mentors",
        label: "Mentors",
        description: "",
        icon: "graduation-cap",
        source: "teachers_count",
        prefix: "",
        suffix: "+",
        fallback_value: "0",
      },
      {
        id: "snapshot-hotline",
        label: "Hotline",
        description: "",
        icon: "phone",
        source: "primary_phone",
        prefix: "",
        suffix: "",
        fallback_value: "Contact us",
      },
    ],
    style: {
      badge: {
        text_color: "#ffffff",
        background: "rgba(255,255,255,0.10)",
        border_color: "rgba(255,255,255,0.10)",
      },
      heading: DEFAULT_TEXT_STYLE("#ffffff", "clamp(3rem, 8vw, 5.5rem)", "serif", "normal", "700"),
      description: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.72)",
        "1.25rem",
        "sans",
        "normal",
        "500",
      ),
      stat_pill_background: "rgba(255,255,255,0.08)",
      stat_pill_border_color: "rgba(255,255,255,0.10)",
      stat_pill_text: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.85)",
        "14px",
        "sans",
        "normal",
        "500",
      ),
      social_panel_background: "rgba(255,255,255,0.06)",
      social_panel_border_color: "rgba(255,255,255,0.10)",
      social_text: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.78)",
        "14px",
        "sans",
        "normal",
        "500",
      ),
      primary_button: {
        background:
          "linear-gradient(135deg, color-mix(in srgb, white 78%, var(--color-accent) 22%) 0%, white 100%)",
        text_color: "#020617",
        border_color: "transparent",
      },
      secondary_button: {
        background: "rgba(255,255,255,0.08)",
        text_color: "#ffffff",
        border_color: "rgba(255,255,255,0.15)",
      },
      visual_panel_background: "rgba(255,255,255,0.08)",
      visual_panel_border_color: "rgba(255,255,255,0.10)",
      visual_badge: {
        text_color: "rgba(255,255,255,0.80)",
        background: "rgba(0,0,0,0.25)",
        border_color: "rgba(255,255,255,0.15)",
      },
      overlay_card_background: "rgba(0,0,0,0.30)",
      overlay_card_border_color: "rgba(255,255,255,0.12)",
      overlay_label: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.70)",
        "10px",
        "sans",
        "normal",
        "700",
      ),
      overlay_value: DEFAULT_TEXT_STYLE("#ffffff", "16px", "sans", "normal", "600"),
      banner_tab_active_background: "#ffffff",
      banner_tab_active_text_color: "#020617",
      banner_tab_active_border_color: "rgba(255,255,255,0.20)",
      banner_tab_background: "rgba(255,255,255,0.08)",
      banner_tab_text_color: "rgba(255,255,255,0.74)",
      banner_tab_border_color: "rgba(255,255,255,0.10)",
    },
  },
  metrics_rail: {
    items: [
      {
        id: "rail-programs",
        label: "Programs Live",
        description: "Career-focused learning tracks",
        icon: "book-open",
        source: "courses_count",
        prefix: "",
        suffix: "+",
        fallback_value: "0",
      },
      {
        id: "rail-faculty",
        label: "Teaching Faculty",
        description: "Experts guiding every intake",
        icon: "users",
        source: "teachers_count",
        prefix: "",
        suffix: "+",
        fallback_value: "0",
      },
      {
        id: "rail-rating",
        label: "Student Rating",
        description: "Visible outcomes and student proof",
        icon: "star",
        source: "rating",
        prefix: "",
        suffix: "/5",
        fallback_value: "4.9",
      },
      {
        id: "rail-hours",
        label: "Admissions Window",
        description: "Fast response support",
        icon: "shield",
        source: "hours",
        prefix: "",
        suffix: "",
        fallback_value: "Open six days a week",
      },
    ],
    style: {
      panel_background: "rgba(255,255,255,0.88)",
      panel_border_color: "rgba(226,232,240,0.70)",
      card_background: "rgba(248,250,252,0.80)",
      card_border_color: "rgba(226,232,240,0.70)",
      label: DEFAULT_TEXT_STYLE("#94a3b8", "10px", "sans", "normal", "700"),
      value: DEFAULT_TEXT_STYLE("#020617", "1.5rem", "sans", "normal", "600"),
      body: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
    },
  },
  course_explorer: {
    badge_text: "Program explorer",
    heading: "Find the right path, not just a random course card.",
    description:
      "Explore the catalogue by lane, duration, and fit. The homepage search is wired into this section, so users can narrow the grid before they ever leave the landing page.",
    open_catalogue_label: "Open full catalogue",
    all_programs_label: "All Programs",
    results_prefix: "Showing",
    results_suffix: "matching programs",
    clear_search_label: "Clear",
    empty_title: "No program matches the current search or category.",
    empty_description:
      "Clear the search query or switch back to “All Programs” to reopen the catalogue.",
    duration_label: "Duration",
    fee_label: "Fee",
    featured_cta_label: "View program detail",
    card_duration_fallback: "Flexible",
    card_description_fallback: "A premium institute program with applied learning support.",
    card_cta_label: "Learn more",
    category_fallback_label: "Featured Program",
    style: {
      badge: {
        text_color: "#64748b",
        background: "#ffffff",
        border_color: "#e2e8f0",
      },
      heading: DEFAULT_TEXT_STYLE(
        "#020617",
        "clamp(2.5rem, 6vw, 3.75rem)",
        "serif",
        "normal",
        "700",
      ),
      description: DEFAULT_TEXT_STYLE("#64748b", "1.125rem", "sans", "normal", "500"),
      action_button: {
        background: "#ffffff",
        text_color: "#020617",
        border_color: "#e2e8f0",
      },
      filter_active_background: "#020617",
      filter_active_border_color: "#020617",
      filter_active_text_color: "#ffffff",
      filter_background: "#ffffff",
      filter_border_color: "#e2e8f0",
      filter_text: DEFAULT_TEXT_STYLE("#475569", "14px", "sans", "normal", "600"),
      results_badge_background: "#f8fafc",
      results_badge_border_color: "#e2e8f0",
      results_text: DEFAULT_TEXT_STYLE("#334155", "14px", "sans", "normal", "500"),
      clear_button_background: "#ffffff",
      clear_button_border_color: "#e2e8f0",
      clear_button_text: DEFAULT_TEXT_STYLE("#475569", "14px", "sans", "normal", "500"),
      empty_title: DEFAULT_TEXT_STYLE("#020617", "1.125rem", "sans", "normal", "600"),
      empty_body: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
    },
  },
  faculty_showcase: {
    badge_text: "Mentor-led learning",
    heading: "Learn from people who teach the craft, not just the syllabus.",
    description:
      "Faculty, support availability, and the tone of the learning experience should be visible from the homepage. This section makes that commitment explicit.",
    button_label: "Explore faculty",
    button_link: "/teachers",
    roster_subject_fallback: "Instructor",
    roster_bio_fallback: "Mentor profile available on the faculty directory.",
    highlight_cards: [
      {
        id: "faculty-mentors",
        label: "Active mentors",
        description: "Visible faculty profiles build trust before a student clicks deeper.",
        icon: "users",
        source: "teachers_count",
        prefix: "",
        suffix: "+",
        fallback_value: "0",
      },
      {
        id: "faculty-hours",
        label: "Support hours",
        description: "Admissions and support stay clear and reachable from the first screen.",
        icon: "headphones",
        source: "hours",
        prefix: "",
        suffix: "",
        fallback_value: "Extended support hours",
      },
      {
        id: "faculty-rating",
        label: "Public satisfaction",
        description:
          "Student voices are integrated into the homepage flow instead of hidden away.",
        icon: "star",
        source: "rating",
        prefix: "",
        suffix: "/5",
        fallback_value: "4.9",
      },
      {
        id: "faculty-campus",
        label: "Campus",
        description: "Location context and on-ground identity make the brand feel real.",
        icon: "map-pin",
        source: "address",
        prefix: "",
        suffix: "",
        fallback_value: "Institutional campus",
      },
    ],
    style: {
      feature_panel_background: "#020617",
      feature_panel_border_color: "#1e293b",
      badge: {
        text_color: "rgba(255,255,255,0.72)",
        background: "rgba(255,255,255,0.08)",
        border_color: "rgba(255,255,255,0.10)",
      },
      heading: DEFAULT_TEXT_STYLE(
        "#ffffff",
        "clamp(2.5rem, 5vw, 3rem)",
        "serif",
        "normal",
        "700",
      ),
      description: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.72)",
        "16px",
        "sans",
        "normal",
        "500",
      ),
      highlight_card_background: "rgba(255,255,255,0.08)",
      highlight_card_border_color: "rgba(255,255,255,0.10)",
      highlight_label: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.45)",
        "10px",
        "sans",
        "normal",
        "700",
      ),
      highlight_value: DEFAULT_TEXT_STYLE("#ffffff", "16px", "sans", "normal", "600"),
      highlight_body: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.62)",
        "14px",
        "sans",
        "normal",
        "500",
      ),
      button: {
        background: "#ffffff",
        text_color: "#020617",
        border_color: "#ffffff",
      },
      roster_card_background: "#ffffff",
      roster_card_border_color: "#e2e8f0",
      roster_subject: DEFAULT_TEXT_STYLE("#94a3b8", "10px", "sans", "normal", "700"),
      roster_name: DEFAULT_TEXT_STYLE("#020617", "1.5rem", "serif", "normal", "600"),
      roster_qualification: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
      roster_body: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
    },
  },
  proof_section: {
    badge_text: "Student proof",
    heading: "Trusted because the outcomes feel real, not inflated.",
    description:
      "The homepage should answer the questions a serious student has immediately: what can I learn here, who teaches it, and what proof exists that people benefit.",
    testimonial_course_fallback: "Student story",
    metrics: [
      {
        id: "proof-rating",
        label: "Public rating",
        description: "Average rating based on visible testimonials.",
        icon: "star",
        source: "rating",
        prefix: "",
        suffix: "/5",
        fallback_value: "4.9",
      },
      {
        id: "proof-programs",
        label: "Programs visible",
        description: "A strong catalogue is surfaced directly from the landing page.",
        icon: "book-open",
        source: "courses_count",
        prefix: "",
        suffix: "+",
        fallback_value: "0",
      },
      {
        id: "proof-mentors",
        label: "Mentors available",
        description: "Faculty visibility supports credibility before enquiry.",
        icon: "users",
        source: "teachers_count",
        prefix: "",
        suffix: "+",
        fallback_value: "0",
      },
    ],
    style: {
      section_background:
        "linear-gradient(180deg, #081224 0%, color-mix(in srgb, var(--color-primary) 82%, #081224 18%) 100%)",
      feature_panel_background: "rgba(255,255,255,0.08)",
      feature_panel_border_color: "rgba(255,255,255,0.10)",
      badge: {
        text_color: "rgba(255,255,255,0.72)",
        background: "rgba(255,255,255,0.08)",
        border_color: "rgba(255,255,255,0.10)",
      },
      heading: DEFAULT_TEXT_STYLE(
        "#ffffff",
        "clamp(2.5rem, 5vw, 3rem)",
        "serif",
        "normal",
        "700",
      ),
      description: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.72)",
        "16px",
        "sans",
        "normal",
        "500",
      ),
      metric_card_background: "rgba(0,0,0,0.18)",
      metric_card_border_color: "rgba(255,255,255,0.10)",
      metric_label: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.45)",
        "10px",
        "sans",
        "normal",
        "700",
      ),
      metric_value: DEFAULT_TEXT_STYLE("#ffffff", "3rem", "sans", "normal", "600"),
      metric_body: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.60)",
        "14px",
        "sans",
        "normal",
        "500",
      ),
      testimonial_card_background: "#ffffff",
      testimonial_card_border_color: "rgba(255,255,255,0.10)",
      testimonial_body: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
      testimonial_name: DEFAULT_TEXT_STYLE("#020617", "16px", "sans", "normal", "600"),
      testimonial_course: DEFAULT_TEXT_STYLE("#64748b", "14px", "sans", "normal", "500"),
    },
  },
  cta_section: {
    badge_text: "Admission ready",
    heading: "Bring your goals. We’ll help you choose the right next move.",
    description:
      "A premium homepage should convert attention into clarity. This closing band makes the next step obvious without forcing users to hunt through the site.",
    primary_cta_label: "Start your inquiry",
    primary_cta_link: "/contact",
    secondary_cta_label: "Browse programs",
    secondary_cta_link: "/courses",
    info_cards: [
      {
        id: "cta-hotline",
        label: "Admissions Hotline",
        description: "",
        icon: "phone",
        source: "primary_phone",
        prefix: "",
        suffix: "",
        fallback_value: "Available on request",
      },
      {
        id: "cta-hours",
        label: "Support Hours",
        description: "",
        icon: "clock",
        source: "hours",
        prefix: "",
        suffix: "",
        fallback_value: "Open six days a week",
      },
      {
        id: "cta-campus",
        label: "Campus",
        description: "",
        icon: "map-pin",
        source: "address",
        prefix: "",
        suffix: "",
        fallback_value: "Institutional location available",
      },
    ],
    style: {
      outer_panel_background: "#ffffff",
      outer_panel_border_color: "#e2e8f0",
      feature_panel_background:
        "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 48%, var(--color-primary) 52%) 100%)",
      badge: {
        text_color: "rgba(255,255,255,0.55)",
        background: "transparent",
        border_color: "transparent",
      },
      heading: DEFAULT_TEXT_STYLE(
        "#ffffff",
        "clamp(2.5rem, 5vw, 3rem)",
        "serif",
        "normal",
        "700",
      ),
      description: DEFAULT_TEXT_STYLE(
        "rgba(255,255,255,0.76)",
        "16px",
        "sans",
        "normal",
        "500",
      ),
      primary_button: {
        background: "#ffffff",
        text_color: "#020617",
        border_color: "#ffffff",
      },
      secondary_button: {
        background: "rgba(255,255,255,0.08)",
        text_color: "#ffffff",
        border_color: "rgba(255,255,255,0.15)",
      },
      info_card_background: "#f8fafc",
      info_card_border_color: "#e2e8f0",
      info_label: DEFAULT_TEXT_STYLE("#94a3b8", "10px", "sans", "normal", "700"),
      info_value: DEFAULT_TEXT_STYLE("#020617", "14px", "sans", "normal", "600"),
    },
  },
  visibility: {
    command_bar: true,
    hero: true,
    hero_social_proof: true,
    hero_snapshot: true,
    hero_banner_tabs: true,
    metrics_rail: true,
    course_explorer: true,
    faculty_showcase: true,
    proof_section: true,
    cta_section: true,
  },
};

const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export const HOME_ICON_OPTIONS: Array<{ label: string; value: HomeIconName }> = [
  { label: "Book Open", value: "book-open" },
  { label: "Briefcase", value: "briefcase" },
  { label: "Clock", value: "clock" },
  { label: "Graduation Cap", value: "graduation-cap" },
  { label: "Headphones", value: "headphones" },
  { label: "Map Pin", value: "map-pin" },
  { label: "Phone", value: "phone" },
  { label: "Search", value: "search" },
  { label: "Shield", value: "shield" },
  { label: "Sparkles", value: "sparkles" },
  { label: "Star", value: "star" },
  { label: "Users", value: "users" },
];

export const HOME_METRIC_SOURCE_OPTIONS: Array<{ label: string; value: HomeMetricSource }> = [
  { label: "Courses Count", value: "courses_count" },
  { label: "Teachers Count", value: "teachers_count" },
  { label: "Average Rating", value: "rating" },
  { label: "Testimonials Count", value: "testimonials_count" },
  { label: "Support Hours", value: "hours" },
  { label: "Primary Phone", value: "primary_phone" },
  { label: "Address", value: "address" },
];

export const HOME_FONT_FAMILY_OPTIONS = [
  { label: "Serif", value: "serif" },
  { label: "Sans", value: "sans" },
];

export const HOME_FONT_STYLE_OPTIONS = [
  { label: "Normal", value: "normal" },
  { label: "Italic", value: "italic" },
];

export const HOME_FONT_WEIGHT_OPTIONS = [
  { label: "Regular", value: "400" },
  { label: "Medium", value: "500" },
  { label: "Semibold", value: "600" },
  { label: "Bold", value: "700" },
  { label: "Extra Bold", value: "800" },
];

export const HOME_ICON_MAP: Record<HomeIconName, LucideIcon> = {
  "book-open": BookOpen,
  briefcase: BriefcaseBusiness,
  clock: Clock3,
  "graduation-cap": GraduationCap,
  headphones: Headphones,
  "map-pin": MapPin,
  phone: PhoneCall,
  search: Search,
  shield: ShieldCheck,
  sparkles: Sparkles,
  star: Star,
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

function normalizeMetricCards(items: HomeMetricCard[], fallbackItems: HomeMetricCard[]) {
  return items.map((item, index) => ({
    id: item.id || `metric-${index + 1}`,
    label: item.label || "",
    description: item.description || "",
    icon: item.icon || fallbackItems[index]?.icon || fallbackItems[0]?.icon || "star",
    source: item.source || fallbackItems[index]?.source || "courses_count",
    prefix: item.prefix || "",
    suffix: item.suffix || "",
    fallback_value: item.fallback_value || "",
  }));
}

function normalizeQuickActions(
  items: HomePageSettings["command_bar"]["quick_actions"],
  fallbackItems: HomePageSettings["command_bar"]["quick_actions"],
) {
  return items.map((item, index) => ({
    id: item.id || `quick-action-${index + 1}`,
    title: item.title || "",
    description: item.description || "",
    href: item.href || fallbackItems[index]?.href || "/contact",
    meta: item.meta || "",
  }));
}

export function normalizeHomePage(
  rawHomePage: unknown,
  legacyHeroSection?: {
    title?: string;
    subtitle?: string;
    cta_text?: string;
    cta_link?: string;
    background_image?: string;
  } | null,
): HomePageSettings {
  const normalized = mergeDeep(HOME_PAGE_DEFAULTS, rawHomePage);

  if (!normalized.hero.title.trim()) {
    normalized.hero.title = legacyHeroSection?.title || HOME_PAGE_DEFAULTS.hero.title;
  }
  if (!normalized.hero.description.trim()) {
    normalized.hero.description =
      legacyHeroSection?.subtitle || HOME_PAGE_DEFAULTS.hero.description;
  }
  if (!normalized.hero.primary_cta_label.trim()) {
    normalized.hero.primary_cta_label =
      legacyHeroSection?.cta_text || HOME_PAGE_DEFAULTS.hero.primary_cta_label;
  }
  if (!normalized.hero.primary_cta_link.trim()) {
    normalized.hero.primary_cta_link =
      legacyHeroSection?.cta_link || HOME_PAGE_DEFAULTS.hero.primary_cta_link;
  }
  if (!normalized.hero.background_image.trim()) {
    normalized.hero.background_image = legacyHeroSection?.background_image || "";
  }

  normalized.command_bar.quick_actions = normalizeQuickActions(
    normalized.command_bar.quick_actions,
    HOME_PAGE_DEFAULTS.command_bar.quick_actions,
  );
  normalized.hero.stat_pills = normalizeMetricCards(
    normalized.hero.stat_pills,
    HOME_PAGE_DEFAULTS.hero.stat_pills,
  );
  normalized.hero.snapshot_cards = normalizeMetricCards(
    normalized.hero.snapshot_cards,
    HOME_PAGE_DEFAULTS.hero.snapshot_cards,
  );
  normalized.metrics_rail.items = normalizeMetricCards(
    normalized.metrics_rail.items,
    HOME_PAGE_DEFAULTS.metrics_rail.items,
  );
  normalized.faculty_showcase.highlight_cards = normalizeMetricCards(
    normalized.faculty_showcase.highlight_cards,
    HOME_PAGE_DEFAULTS.faculty_showcase.highlight_cards,
  );
  normalized.proof_section.metrics = normalizeMetricCards(
    normalized.proof_section.metrics,
    HOME_PAGE_DEFAULTS.proof_section.metrics,
  );
  normalized.cta_section.info_cards = normalizeMetricCards(
    normalized.cta_section.info_cards,
    HOME_PAGE_DEFAULTS.cta_section.info_cards,
  );

  return normalized;
}

export function getHomeFontFamilyValue(fontFamily: FontChoice) {
  return fontFamily === "serif"
    ? "var(--font-serif, Playfair Display), serif"
    : "var(--font-sans, Inter), sans-serif";
}

export function getHomeTextStyle(style: HomeTextStyle) {
  return {
    color: style.color,
    fontSize: style.size,
    fontStyle: style.font_style,
    fontWeight: style.font_weight,
    fontFamily: getHomeFontFamilyValue(style.font_family),
  };
}
