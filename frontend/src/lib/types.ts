export interface AdminUser {
  id: string;
  username: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  syllabus?: string;
  fee?: number;
  duration?: string;
  target_group?: string;
  image_url?: string;
  is_active: boolean;
  display_order: number;
  created_at?: string;
  updated_at?: string | null;
}

export interface Teacher {
  id: string;
  name: string;
  subject?: string;
  qualification?: string;
  bio?: string;
  photo_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Banner {
  id: string;
  title?: string | null;
  subtitle?: string | null;
  image_url?: string | null;
  link_url?: string | null;
  display_order: number;
  is_active: boolean;
  created_at?: string;
}

export interface Testimonial {
  id: string;
  student_name: string;
  course?: string | null;
  content: string;
  rating: number;
  is_active: boolean;
  created_at?: string;
}

export interface Notice {
  id: string;
  title: string;
  content?: string | null;
  is_pinned: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface ContactSubmission {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  message: string;
  extra_fields?: Array<{
    field_id: string;
    label: string;
    value: string;
  }>;
  is_read: boolean;
  created_at?: string;
}

export type FontChoice = "serif" | "sans";
export type FontStyleChoice = "normal" | "italic";
export type FontWeightChoice = "400" | "500" | "600" | "700" | "800";
export type AboutIconName =
  | "sparkles"
  | "quote"
  | "target"
  | "compass"
  | "shield"
  | "users"
  | "briefcase";

export interface AboutTextStyle {
  color: string;
  size: string;
  font_family: FontChoice;
  font_style: FontStyleChoice;
  font_weight: FontWeightChoice;
}

export interface AboutBadgeStyle {
  text_color: string;
  background: string;
  border_color: string;
}

export interface AboutButtonStyle {
  background: string;
  text_color: string;
  border_color: string;
}

export interface AboutHeroStyle {
  section_background: string;
  panel_background: string;
  panel_border_color: string;
  quote_panel_background: string;
  quote_panel_border_color: string;
  badge: AboutBadgeStyle;
  heading: AboutTextStyle;
  description: AboutTextStyle;
  quote_title: AboutTextStyle;
  quote_body: AboutTextStyle;
  primary_button: AboutButtonStyle;
  secondary_button: AboutButtonStyle;
}

export interface AboutSectionStyle {
  panel_background: string;
  panel_border_color: string;
  badge: AboutBadgeStyle;
  heading: AboutTextStyle;
  body: AboutTextStyle;
}

export interface AboutStatementStyle {
  panel_background: string;
  panel_border_color: string;
  icon_background: string;
  heading: AboutTextStyle;
  body: AboutTextStyle;
}

export interface AboutPrinciplesStyle {
  panel_background: string;
  panel_border_color: string;
  icon_background: string;
  heading: AboutTextStyle;
  body: AboutTextStyle;
}

export interface AboutStatsBandStyle {
  section_background: string;
  badge: AboutBadgeStyle;
  heading: AboutTextStyle;
  body: AboutTextStyle;
  stat_panel_background: string;
  stat_panel_border_color: string;
  stat_value: AboutTextStyle;
  stat_label: AboutTextStyle;
}

export interface AboutFinalCtaStyle {
  panel_background: string;
  panel_border_color: string;
  badge: AboutBadgeStyle;
  heading: AboutTextStyle;
  body: AboutTextStyle;
  primary_button: AboutButtonStyle;
  secondary_button: AboutButtonStyle;
}

export interface AboutHeroSettings {
  badge_text: string;
  heading: string;
  description: string;
  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;
  quote_title: string;
  quote_body: string;
  style: AboutHeroStyle;
}

export interface AboutNarrativeSettings {
  badge_text: string;
  heading: string;
  content: string;
  style: AboutSectionStyle;
}

export interface AboutStatementSettings {
  title: string;
  content: string;
  icon: AboutIconName;
  style: AboutStatementStyle;
}

export interface AboutPrincipleItem {
  id: string;
  title: string;
  description: string;
  icon: AboutIconName;
}

export interface AboutPrinciplesSettings {
  items: AboutPrincipleItem[];
  style: AboutPrinciplesStyle;
}

export interface AboutStatItem {
  id: string;
  value: string;
  label: string;
}

export interface AboutStatsBandSettings {
  badge_text: string;
  heading: string;
  description: string;
  stats: AboutStatItem[];
  style: AboutStatsBandStyle;
}

export interface AboutFinalCtaSettings {
  badge_text: string;
  heading: string;
  description: string;
  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;
  style: AboutFinalCtaStyle;
}

export interface AboutVisibilitySettings {
  hero: boolean;
  hero_quote_card: boolean;
  hero_stats: boolean;
  narrative: boolean;
  mission: boolean;
  vision: boolean;
  principles: boolean;
  stats_band: boolean;
  final_cta: boolean;
}

export interface AboutPageSettings {
  hero: AboutHeroSettings;
  narrative: AboutNarrativeSettings;
  mission: AboutStatementSettings;
  vision: AboutStatementSettings;
  principles: AboutPrinciplesSettings;
  stats_band: AboutStatsBandSettings;
  final_cta: AboutFinalCtaSettings;
  visibility: AboutVisibilitySettings;
  stats?: Array<{
    value: string;
    label: string;
  }>;
}

export type TeachersIconName =
  | "award"
  | "briefcase"
  | "graduation-cap"
  | "headphones"
  | "shield"
  | "sparkles"
  | "users";

export interface TeachersTextStyle {
  color: string;
  size: string;
  font_family: FontChoice;
  font_style: FontStyleChoice;
  font_weight: FontWeightChoice;
}

export interface TeachersBadgeStyle {
  text_color: string;
  background: string;
  border_color: string;
}

export interface TeachersButtonStyle {
  background: string;
  text_color: string;
  border_color: string;
}

export interface TeachersHeroStyle {
  section_background: string;
  search_panel_background: string;
  search_panel_border_color: string;
  search_input_background: string;
  search_input_border_color: string;
  search_icon_background: string;
  search_icon_color: string;
  metric_panel_background: string;
  metric_panel_border_color: string;
  badge: TeachersBadgeStyle;
  heading: TeachersTextStyle;
  description: TeachersTextStyle;
  search_label: TeachersTextStyle;
  search_input: TeachersTextStyle;
  metric_label: TeachersTextStyle;
  metric_value: TeachersTextStyle;
}

export interface TeachersFilterBarStyle {
  panel_background: string;
  panel_border_color: string;
  chip_background: string;
  chip_border_color: string;
  chip_active_background: string;
  chip_active_border_color: string;
  chip_active_text_color: string;
  results_background: string;
  results_border_color: string;
  clear_button_background: string;
  clear_button_border_color: string;
  chip_text: TeachersTextStyle;
  results_text: TeachersTextStyle;
  clear_text: TeachersTextStyle;
}

export interface TeachersSpotlightStyle {
  panel_background: string;
  panel_border_color: string;
  content_background: string;
  content_border_color: string;
  meta_panel_background: string;
  meta_panel_border_color: string;
  badge: TeachersBadgeStyle;
  name: TeachersTextStyle;
  qualification: TeachersTextStyle;
  body: TeachersTextStyle;
  meta_label: TeachersTextStyle;
  meta_value: TeachersTextStyle;
  empty_title: TeachersTextStyle;
  empty_body: TeachersTextStyle;
}

export interface TeachersRosterStyle {
  panel_background: string;
  panel_border_color: string;
  subject: TeachersTextStyle;
  name: TeachersTextStyle;
  qualification: TeachersTextStyle;
  body: TeachersTextStyle;
}

export interface TeachersPrinciplesStyle {
  panel_background: string;
  panel_border_color: string;
  icon_background: string;
  heading: TeachersTextStyle;
  body: TeachersTextStyle;
}

export interface TeachersCtaStyle {
  panel_background: string;
  panel_border_color: string;
  badge: TeachersBadgeStyle;
  heading: TeachersTextStyle;
  body: TeachersTextStyle;
  button: TeachersButtonStyle;
}

export interface TeachersHeroSettings {
  badge_text: string;
  heading: string;
  description: string;
  search_label: string;
  search_placeholder: string;
  faculty_metric_label: string;
  faculty_metric_value: string;
  subjects_metric_label: string;
  subjects_metric_value: string;
  mentorship_metric_label: string;
  mentorship_metric_value: string;
  style: TeachersHeroStyle;
}

export interface TeachersFilterBarSettings {
  all_subjects_label: string;
  clear_search_label: string;
  results_prefix: string;
  results_suffix: string;
  style: TeachersFilterBarStyle;
}

export interface TeachersSpotlightSettings {
  badge_text: string;
  bio_fallback: string;
  focus_label: string;
  focus_fallback: string;
  role_label: string;
  role_value: string;
  empty_title: string;
  empty_description: string;
  style: TeachersSpotlightStyle;
}

export interface TeachersRosterSettings {
  fallback_bio: string;
  style: TeachersRosterStyle;
}

export interface TeachersPrincipleItem {
  id: string;
  title: string;
  description: string;
  icon: TeachersIconName;
}

export interface TeachersPrinciplesSettings {
  items: TeachersPrincipleItem[];
  style: TeachersPrinciplesStyle;
}

export interface TeachersCtaSettings {
  badge_text: string;
  heading: string;
  description: string;
  button_label: string;
  button_link: string;
  style: TeachersCtaStyle;
}

export interface TeachersVisibilitySettings {
  hero: boolean;
  filter_bar: boolean;
  spotlight: boolean;
  principles: boolean;
  cta: boolean;
}

export interface TeachersPageSettings {
  hero: TeachersHeroSettings;
  filter_bar: TeachersFilterBarSettings;
  spotlight: TeachersSpotlightSettings;
  roster: TeachersRosterSettings;
  principles: TeachersPrinciplesSettings;
  cta: TeachersCtaSettings;
  visibility: TeachersVisibilitySettings;
}

export type HomeIconName =
  | "book-open"
  | "briefcase"
  | "clock"
  | "graduation-cap"
  | "headphones"
  | "map-pin"
  | "phone"
  | "search"
  | "shield"
  | "sparkles"
  | "star"
  | "users";

export type HomeMetricSource =
  | "courses_count"
  | "teachers_count"
  | "rating"
  | "testimonials_count"
  | "hours"
  | "primary_phone"
  | "address";

export interface HomeTextStyle {
  color: string;
  size: string;
  font_family: FontChoice;
  font_style: FontStyleChoice;
  font_weight: FontWeightChoice;
}

export interface HomeBadgeStyle {
  text_color: string;
  background: string;
  border_color: string;
}

export interface HomeButtonStyle {
  background: string;
  text_color: string;
  border_color: string;
}

export interface HomeQuickActionItem {
  id: string;
  title: string;
  description: string;
  href: string;
  meta: string;
}

export interface HomeMetricCard {
  id: string;
  label: string;
  description: string;
  icon: HomeIconName;
  source: HomeMetricSource;
  prefix: string;
  suffix: string;
  fallback_value: string;
}

export interface HomeCommandBarStyle {
  panel_background: string;
  panel_border_color: string;
  card_background: string;
  card_border_color: string;
  search_panel_background: string;
  search_panel_border_color: string;
  search_input_background: string;
  search_input_border_color: string;
  search_hint_background: string;
  search_hint_border_color: string;
  quick_action_panel_background: string;
  quick_action_panel_border_color: string;
  popular_chip_background: string;
  popular_chip_border_color: string;
  label: HomeTextStyle;
  body: HomeTextStyle;
  search_label: HomeTextStyle;
  search_input: HomeTextStyle;
  search_hint: HomeTextStyle;
  action_title: HomeTextStyle;
  action_body: HomeTextStyle;
  action_meta: HomeTextStyle;
  popular_label: HomeTextStyle;
  popular_chip_text: HomeTextStyle;
  button: HomeButtonStyle;
}

export interface HomeHeroStyle {
  badge: HomeBadgeStyle;
  heading: HomeTextStyle;
  description: HomeTextStyle;
  stat_pill_background: string;
  stat_pill_border_color: string;
  stat_pill_text: HomeTextStyle;
  social_panel_background: string;
  social_panel_border_color: string;
  social_text: HomeTextStyle;
  primary_button: HomeButtonStyle;
  secondary_button: HomeButtonStyle;
  visual_panel_background: string;
  visual_panel_border_color: string;
  visual_badge: HomeBadgeStyle;
  overlay_card_background: string;
  overlay_card_border_color: string;
  overlay_label: HomeTextStyle;
  overlay_value: HomeTextStyle;
  banner_tab_active_background: string;
  banner_tab_active_text_color: string;
  banner_tab_active_border_color: string;
  banner_tab_background: string;
  banner_tab_text_color: string;
  banner_tab_border_color: string;
}

export interface HomeMetricsRailStyle {
  panel_background: string;
  panel_border_color: string;
  card_background: string;
  card_border_color: string;
  label: HomeTextStyle;
  value: HomeTextStyle;
  body: HomeTextStyle;
}

export interface HomeCourseExplorerStyle {
  badge: HomeBadgeStyle;
  heading: HomeTextStyle;
  description: HomeTextStyle;
  action_button: HomeButtonStyle;
  filter_active_background: string;
  filter_active_border_color: string;
  filter_active_text_color: string;
  filter_background: string;
  filter_border_color: string;
  filter_text: HomeTextStyle;
  results_badge_background: string;
  results_badge_border_color: string;
  results_text: HomeTextStyle;
  clear_button_background: string;
  clear_button_border_color: string;
  clear_button_text: HomeTextStyle;
  empty_title: HomeTextStyle;
  empty_body: HomeTextStyle;
}

export interface HomeFacultyShowcaseStyle {
  feature_panel_background: string;
  feature_panel_border_color: string;
  badge: HomeBadgeStyle;
  heading: HomeTextStyle;
  description: HomeTextStyle;
  highlight_card_background: string;
  highlight_card_border_color: string;
  highlight_label: HomeTextStyle;
  highlight_value: HomeTextStyle;
  highlight_body: HomeTextStyle;
  button: HomeButtonStyle;
  roster_card_background: string;
  roster_card_border_color: string;
  roster_subject: HomeTextStyle;
  roster_name: HomeTextStyle;
  roster_qualification: HomeTextStyle;
  roster_body: HomeTextStyle;
}

export interface HomeProofSectionStyle {
  section_background: string;
  feature_panel_background: string;
  feature_panel_border_color: string;
  badge: HomeBadgeStyle;
  heading: HomeTextStyle;
  description: HomeTextStyle;
  metric_card_background: string;
  metric_card_border_color: string;
  metric_label: HomeTextStyle;
  metric_value: HomeTextStyle;
  metric_body: HomeTextStyle;
  testimonial_card_background: string;
  testimonial_card_border_color: string;
  testimonial_body: HomeTextStyle;
  testimonial_name: HomeTextStyle;
  testimonial_course: HomeTextStyle;
}

export interface HomeCtaSectionStyle {
  outer_panel_background: string;
  outer_panel_border_color: string;
  feature_panel_background: string;
  badge: HomeBadgeStyle;
  heading: HomeTextStyle;
  description: HomeTextStyle;
  primary_button: HomeButtonStyle;
  secondary_button: HomeButtonStyle;
  info_card_background: string;
  info_card_border_color: string;
  info_label: HomeTextStyle;
  info_value: HomeTextStyle;
}

export interface HomeCommandBarSettings {
  admissions_label: string;
  search_label: string;
  search_placeholder: string;
  shortcut_hint: string;
  fast_response_label: string;
  fast_response_description: string;
  fast_response_button_label: string;
  fast_response_button_link: string;
  no_result_description: string;
  search_results_suffix: string;
  quick_jump_label: string;
  popular_searches_label: string;
  popular_lanes_label: string;
  quick_actions: HomeQuickActionItem[];
  style: HomeCommandBarStyle;
}

export interface HomeHeroSettings {
  badge_text: string;
  title: string;
  description: string;
  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;
  social_proof_text: string;
  visual_badge_text: string;
  background_image: string;
  banner_fallback_prefix: string;
  stat_pills: HomeMetricCard[];
  snapshot_cards: HomeMetricCard[];
  style: HomeHeroStyle;
}

export interface HomeMetricsRailSettings {
  items: HomeMetricCard[];
  style: HomeMetricsRailStyle;
}

export interface HomeCourseExplorerSettings {
  badge_text: string;
  heading: string;
  description: string;
  open_catalogue_label: string;
  all_programs_label: string;
  results_prefix: string;
  results_suffix: string;
  clear_search_label: string;
  empty_title: string;
  empty_description: string;
  duration_label: string;
  fee_label: string;
  featured_cta_label: string;
  card_duration_fallback: string;
  card_description_fallback: string;
  card_cta_label: string;
  category_fallback_label: string;
  style: HomeCourseExplorerStyle;
}

export interface HomeFacultyShowcaseSettings {
  badge_text: string;
  heading: string;
  description: string;
  button_label: string;
  button_link: string;
  roster_subject_fallback: string;
  roster_bio_fallback: string;
  highlight_cards: HomeMetricCard[];
  style: HomeFacultyShowcaseStyle;
}

export interface HomeProofSectionSettings {
  badge_text: string;
  heading: string;
  description: string;
  testimonial_course_fallback: string;
  metrics: HomeMetricCard[];
  style: HomeProofSectionStyle;
}

export interface HomeCtaSectionSettings {
  badge_text: string;
  heading: string;
  description: string;
  primary_cta_label: string;
  primary_cta_link: string;
  secondary_cta_label: string;
  secondary_cta_link: string;
  info_cards: HomeMetricCard[];
  style: HomeCtaSectionStyle;
}

export interface HomeVisibilitySettings {
  command_bar: boolean;
  hero: boolean;
  hero_social_proof: boolean;
  hero_snapshot: boolean;
  hero_banner_tabs: boolean;
  metrics_rail: boolean;
  course_explorer: boolean;
  faculty_showcase: boolean;
  proof_section: boolean;
  cta_section: boolean;
}

export interface HomePageSettings {
  command_bar: HomeCommandBarSettings;
  hero: HomeHeroSettings;
  metrics_rail: HomeMetricsRailSettings;
  course_explorer: HomeCourseExplorerSettings;
  faculty_showcase: HomeFacultyShowcaseSettings;
  proof_section: HomeProofSectionSettings;
  cta_section: HomeCtaSectionSettings;
  visibility: HomeVisibilitySettings;
}

export interface SiteSettings {
  id: string;
  site_name: string;
  logo_url?: string;
  primary_colors: {
    primary: string;
    secondary: string;
    accent: string;
    accent_soft?: string;
    background: string;
    text: string;
  };
  font_family: string;
  ui_customization: {
    fonts: {
      serif: string;
      sans: string;
      base_size: string;
      heading_scale: string;
    };
    navbar: {
      height: string;
      is_sticky: boolean;
      background_opacity: string;
      style: string;
    };
    instructors: {
      photo_size: string;
      photo_shape: string;
      show_bio: boolean;
      card_bg: string;
    };
  };
  hero_section: {
    title: string;
    subtitle: string;
    cta_text: string;
    cta_link: string;
    background_image?: string;
  };
  about_content: string;
  home_page: HomePageSettings;
  about_page: AboutPageSettings;
  teachers_page: TeachersPageSettings;
  footer_content: {
    description: string;
    copyright: string;
  };
  contact_info: {
    address: string;
    phone: string[];
    email: string;
    website?: string;
    map_embed?: string;
    hours: string;
  };
  contact_page: {
    left_panel: {
      badge_text: string;
      title_prefix: string;
      title_highlight: string;
      description: string;
      campus_title: string;
      phone_title: string;
      email_title: string;
      website_title: string;
      website_link_text: string;
      hours_title: string;
      visible_items: {
        campus: boolean;
        phone: boolean;
        email: boolean;
        website: boolean;
        hours: boolean;
      };
    };
    form_panel: {
      title: string;
      subtitle: string;
      name_label: string;
      name_placeholder: string;
      email_label: string;
      email_placeholder: string;
      phone_label: string;
      phone_placeholder: string;
      message_label: string;
      message_placeholder: string;
      submit_label: string;
      submitting_label: string;
      success_message: string;
      error_message: string;
      field_visibility: {
        email: boolean;
        phone: boolean;
      };
      custom_fields: Array<{
        id: string;
        label: string;
        placeholder: string;
        type: "text" | "email" | "tel" | "textarea" | "select";
        required: boolean;
        is_visible: boolean;
        width: "half" | "full";
        options: string[];
      }>;
    };
    form_styles: {
      panel_background: string;
      title_color: string;
      title_size: string;
      title_font_family: "serif" | "sans";
      title_font_style: "normal" | "italic";
      subtitle_color: string;
      subtitle_size: string;
      subtitle_font_style: "normal" | "italic";
      label_color: string;
      label_size: string;
      label_font_style: "normal" | "italic";
      input_background: string;
      input_border_color: string;
      input_text_color: string;
      input_placeholder_color: string;
      input_font_size: string;
      input_font_style: "normal" | "italic";
      button_background: string;
      button_hover_background: string;
      button_text_color: string;
      button_font_size: string;
      button_font_family: "serif" | "sans";
      button_font_style: "normal" | "italic";
    };
    map_section: {
      title: string;
      description: string;
    };
  };
  social_links: {
    facebook?: string;
    instagram?: string;
    youtube?: string;
    tiktok?: string;
  };
  meta_seo: {
    title: string;
    description: string;
    keywords: string;
  };
  source_updated_at?: string | null;
  updated_at: string;
}

export interface SiteSettingsEditorState {
  draft: SiteSettings;
  published: SiteSettings;
  has_unpublished_changes: boolean;
  revision_count: number;
  last_published_at?: string | null;
}

export interface SiteSettingsRevision {
  id: string;
  site_name: string;
  logo_url?: string;
  primary_colors: SiteSettings["primary_colors"];
  font_family: string;
  ui_customization: SiteSettings["ui_customization"];
  hero_section: SiteSettings["hero_section"];
  about_content: string;
  home_page: SiteSettings["home_page"];
  about_page: SiteSettings["about_page"];
  teachers_page: SiteSettings["teachers_page"];
  footer_content: SiteSettings["footer_content"];
  contact_info: SiteSettings["contact_info"];
  contact_page: SiteSettings["contact_page"];
  social_links: SiteSettings["social_links"];
  meta_seo: SiteSettings["meta_seo"];
  published_at?: string | null;
  published_by?: string | null;
  source_updated_at?: string | null;
}
