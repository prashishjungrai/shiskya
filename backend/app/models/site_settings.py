from copy import deepcopy
from datetime import datetime, timezone
from typing import Optional, Dict, Any, Mapping
from pydantic import BaseModel, Field, model_validator
from beanie import Document

DEFAULT_PRIMARY_COLORS = {
    "primary": "#0a2540",
    "secondary": "#111827",
    "accent": "#3b82f6",
    "accent_soft": "rgba(10, 37, 64, 0.1)",
    "background": "#ffffff",
    "text": "#0a2540",
}

DEFAULT_UI_CUSTOMIZATION = {
    "fonts": {
        "serif": "Playfair Display",
        "sans": "Inter",
        "base_size": "16px",
        "heading_scale": "1.2",
    },
    "navbar": {
        "height": "80px",
        "is_sticky": True,
        "background_opacity": "0.8",
        "style": "glass",
    },
    "instructors": {
        "photo_size": "128px",
        "photo_shape": "rounded-[40px]",
        "show_bio": True,
        "card_bg": "#fcfcfc",
    },
}

DEFAULT_HERO_SECTION = {
    "title": "The Elite Academy",
    "subtitle": "Bespoke Academic Leadership in Nepal",
    "cta_text": "Explore Curriculum",
    "cta_link": "/courses",
    "background_image": "",
}

DEFAULT_ABOUT_PAGE = {
    "hero": {
        "badge_text": "Institutional story",
        "heading": "A stronger institution page for a stronger first impression.",
        "description": "The about page should explain what the institution believes, how it works, and why students should trust it. This version is built to do that clearly.",
        "primary_cta_label": "Speak with admissions",
        "primary_cta_link": "/contact",
        "secondary_cta_label": "Explore programs",
        "secondary_cta_link": "/courses",
        "quote_title": "",
        "quote_body": "",
    },
    "narrative": {
        "badge_text": "Institutional narrative",
        "heading": "Why the institute exists and how it serves ambitious students.",
        "content": "Our institution was founded on a simple principle: to provide unparalleled education that empowers students. Through rigorous curriculum, expert faculty, and a supportive environment, we have built a reputation for producing leaders and innovators.",
    },
    "mission": {
        "title": "Our Mission",
        "content": "To democratize access to premium education and equip every student with the tools they need to achieve extraordinary success.",
        "icon": "target",
    },
    "vision": {
        "title": "Our Vision",
        "content": "To become the global standard for educational excellence, constantly innovating how knowledge is consumed and applied.",
        "icon": "compass",
    },
    "principles": {
        "items": [
            {
                "id": "clarity-over-noise",
                "title": "Clarity over noise",
                "description": "Students should understand the institute quickly: what it believes, what it offers, and how it supports progress.",
                "icon": "shield",
            },
            {
                "id": "mentor-led-culture",
                "title": "Mentor-led culture",
                "description": "Faculty visibility and guidance are treated as part of the product, not hidden behind generic marketing lines.",
                "icon": "users",
            },
            {
                "id": "outcome-orientation",
                "title": "Outcome orientation",
                "description": "The narrative is positioned around meaningful next steps instead of vague promises.",
                "icon": "briefcase",
            },
        ],
    },
    "stats_band": {
        "badge_text": "Institutional momentum",
        "heading": "Numbers matter when they support a believable story.",
        "description": "These headline figures are part of the institution narrative and are editable from admin, so the public page and the admin preview stay aligned.",
        "stats": [
            {"id": "years-of-excellence", "value": "10+", "label": "Years of Excellence"},
            {"id": "global-awards-won", "value": "50+", "label": "Global Awards Won"},
            {"id": "student-success-rate", "value": "99%", "label": "Student Success Rate"},
        ],
    },
    "final_cta": {
        "badge_text": "Ready to move?",
        "heading": "See the programs, meet the mentors, and start the conversation.",
        "description": "The about page should push people toward the next step with confidence instead of ending as a dead informational page.",
        "primary_cta_label": "Explore programs",
        "primary_cta_link": "/courses",
        "secondary_cta_label": "Contact admissions",
        "secondary_cta_link": "/contact",
    },
    "visibility": {
        "hero": True,
        "hero_quote_card": True,
        "hero_stats": True,
        "narrative": True,
        "mission": True,
        "vision": True,
        "principles": True,
        "stats_band": True,
        "final_cta": True,
    },
    "styles": {
        "hero": {
            "section_background": "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 90%, #050816 10%) 0%, #0b1528 48%, #101828 100%)",
            "panel_background": "rgba(255,255,255,0.08)",
            "panel_border_color": "rgba(255,255,255,0.10)",
            "quote_panel_background": "rgba(0,0,0,0.18)",
            "quote_panel_border_color": "rgba(255,255,255,0.10)",
            "badge": {
                "text_color": "rgba(255,255,255,0.78)",
                "background": "rgba(255,255,255,0.10)",
                "border_color": "rgba(255,255,255,0.10)",
            },
            "heading": {
                "color": "#ffffff",
                "size": "clamp(3rem, 7vw, 5.5rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "description": {
                "color": "rgba(255,255,255,0.72)",
                "size": "1.125rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "quote_title": {
                "color": "#ffffff",
                "size": "1.875rem",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "600",
            },
            "quote_body": {
                "color": "rgba(255,255,255,0.72)",
                "size": "1rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "primary_button": {
                "background": "#ffffff",
                "text_color": "#0f172a",
                "border_color": "#ffffff",
            },
            "secondary_button": {
                "background": "rgba(255,255,255,0.08)",
                "text_color": "#ffffff",
                "border_color": "rgba(255,255,255,0.15)",
            },
        },
        "narrative": {
            "panel_background": "#ffffff",
            "panel_border_color": "#e2e8f0",
            "badge": {
                "text_color": "#94a3b8",
                "background": "transparent",
                "border_color": "transparent",
            },
            "heading": {
                "color": "#020617",
                "size": "clamp(2.5rem, 5vw, 3.75rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "body": {
                "color": "#475569",
                "size": "1rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
        "mission": {
            "panel_background": "#ffffff",
            "panel_border_color": "#e2e8f0",
            "icon_background": "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, var(--color-primary) 45%) 100%)",
            "heading": {
                "color": "#020617",
                "size": "1.875rem",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "600",
            },
            "body": {
                "color": "#475569",
                "size": "1rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
        "vision": {
            "panel_background": "#ffffff",
            "panel_border_color": "#e2e8f0",
            "icon_background": "linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 58%, var(--color-primary) 42%) 0%, var(--color-primary) 100%)",
            "heading": {
                "color": "#020617",
                "size": "1.875rem",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "600",
            },
            "body": {
                "color": "#475569",
                "size": "1rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
        "principles": {
            "panel_background": "#ffffff",
            "panel_border_color": "#e2e8f0",
            "icon_background": "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, var(--color-primary) 45%) 100%)",
            "heading": {
                "color": "#020617",
                "size": "1.5rem",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "600",
            },
            "body": {
                "color": "#64748b",
                "size": "0.875rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
        "stats_band": {
            "section_background": "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 48%, var(--color-primary) 52%) 100%)",
            "badge": {
                "text_color": "rgba(255,255,255,0.45)",
                "background": "transparent",
                "border_color": "transparent",
            },
            "heading": {
                "color": "#ffffff",
                "size": "clamp(2.5rem, 5vw, 3.75rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "body": {
                "color": "rgba(255,255,255,0.72)",
                "size": "1rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "stat_panel_background": "rgba(255,255,255,0.10)",
            "stat_panel_border_color": "rgba(255,255,255,0.10)",
            "stat_value": {
                "color": "#ffffff",
                "size": "3rem",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "stat_label": {
                "color": "rgba(255,255,255,0.58)",
                "size": "0.6875rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
        },
        "final_cta": {
            "panel_background": "#ffffff",
            "panel_border_color": "#e2e8f0",
            "badge": {
                "text_color": "#94a3b8",
                "background": "transparent",
                "border_color": "transparent",
            },
            "heading": {
                "color": "#020617",
                "size": "clamp(2.5rem, 5vw, 3.75rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "body": {
                "color": "#475569",
                "size": "1rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "primary_button": {
                "background": "#020617",
                "text_color": "#ffffff",
                "border_color": "#020617",
            },
            "secondary_button": {
                "background": "#ffffff",
                "text_color": "#0f172a",
                "border_color": "#e2e8f0",
            },
        },
    },
}

DEFAULT_TEACHERS_PAGE = {
    "hero": {
        "badge_text": "Faculty collective",
        "heading": "Learn from mentors who make the institute believable.",
        "description": "A premium faculty page should feel like a credibility layer. Search by subject, review mentor profiles, and understand who is shaping the learning experience.",
        "search_label": "Search faculty",
        "search_placeholder": "Search by mentor name, subject, qualification, or bio",
        "faculty_metric_label": "Faculty",
        "faculty_metric_value": "",
        "subjects_metric_label": "Subjects",
        "subjects_metric_value": "",
        "mentorship_metric_label": "Mentor-led",
        "mentorship_metric_value": "1:1",
        "style": {
            "section_background": "linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 88%, #050816 12%) 0%, #0b1528 44%, #101828 100%)",
            "search_panel_background": "rgba(255,255,255,0.08)",
            "search_panel_border_color": "rgba(255,255,255,0.10)",
            "search_input_background": "#ffffff",
            "search_input_border_color": "rgba(255,255,255,0.10)",
            "search_icon_background": "#020617",
            "search_icon_color": "#ffffff",
            "metric_panel_background": "rgba(0,0,0,0.15)",
            "metric_panel_border_color": "rgba(255,255,255,0.10)",
            "badge": {
                "text_color": "rgba(255,255,255,0.78)",
                "background": "rgba(255,255,255,0.10)",
                "border_color": "rgba(255,255,255,0.10)",
            },
            "heading": {
                "color": "#ffffff",
                "size": "clamp(3rem, 7vw, 5.5rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "description": {
                "color": "rgba(255,255,255,0.72)",
                "size": "1.125rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "search_label": {
                "color": "#94a3b8",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "search_input": {
                "color": "#0f172a",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "metric_label": {
                "color": "rgba(255,255,255,0.45)",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "metric_value": {
                "color": "#ffffff",
                "size": "1.5rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
        },
    },
    "filter_bar": {
        "all_subjects_label": "All Faculty",
        "clear_search_label": "Clear search",
        "results_prefix": "Showing",
        "results_suffix": "mentors",
        "style": {
            "panel_background": "rgba(255,255,255,0.88)",
            "panel_border_color": "rgba(226,232,240,0.8)",
            "chip_background": "#ffffff",
            "chip_border_color": "#e2e8f0",
            "chip_active_background": "#020617",
            "chip_active_border_color": "#020617",
            "chip_active_text_color": "#ffffff",
            "results_background": "#f8fafc",
            "results_border_color": "#e2e8f0",
            "clear_button_background": "#ffffff",
            "clear_button_border_color": "#e2e8f0",
            "chip_text": {
                "color": "#475569",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "results_text": {
                "color": "#334155",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "clear_text": {
                "color": "#475569",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
    },
    "spotlight": {
        "badge_text": "Faculty spotlight",
        "bio_fallback": "Experienced faculty profile with a clear teaching identity and subject focus.",
        "focus_label": "Focus area",
        "focus_fallback": "Institutional faculty",
        "role_label": "Role",
        "role_value": "Mentor-led learning",
        "empty_title": "No mentor matches the current search.",
        "empty_description": "Try another subject or clear the query to reopen the full faculty roster.",
        "style": {
            "panel_background": "#ffffff",
            "panel_border_color": "#e2e8f0",
            "content_background": "#020617",
            "content_border_color": "rgba(255,255,255,0.10)",
            "meta_panel_background": "rgba(255,255,255,0.08)",
            "meta_panel_border_color": "rgba(255,255,255,0.10)",
            "badge": {
                "text_color": "rgba(255,255,255,0.75)",
                "background": "rgba(255,255,255,0.10)",
                "border_color": "rgba(255,255,255,0.10)",
            },
            "name": {
                "color": "#ffffff",
                "size": "clamp(2rem, 4vw, 2.5rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "qualification": {
                "color": "rgba(255,255,255,0.62)",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "body": {
                "color": "rgba(255,255,255,0.72)",
                "size": "16px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "meta_label": {
                "color": "rgba(255,255,255,0.45)",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "meta_value": {
                "color": "#ffffff",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "empty_title": {
                "color": "#0f172a",
                "size": "1.25rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "empty_body": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
    },
    "roster": {
        "fallback_bio": "Dedicated faculty profile available in the institutional roster.",
        "style": {
            "panel_background": "#ffffff",
            "panel_border_color": "#e2e8f0",
            "subject": {
                "color": "#94a3b8",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "name": {
                "color": "#020617",
                "size": "1.5rem",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "600",
            },
            "qualification": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "body": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
    },
    "principles": {
        "items": [
            {
                "id": "visible-teaching-identity",
                "title": "Visible teaching identity",
                "description": "Every mentor card now gives a faster read on subject, qualification, and teaching context.",
                "icon": "sparkles",
            },
            {
                "id": "trust-before-inquiry",
                "title": "Trust before inquiry",
                "description": "The faculty page is designed to reduce uncertainty before a student reaches admissions.",
                "icon": "shield",
            },
            {
                "id": "mentor-led-culture",
                "title": "Mentor-led culture",
                "description": "The page positions faculty as a core part of the value proposition, not an afterthought.",
                "icon": "headphones",
            },
        ],
        "style": {
            "panel_background": "#ffffff",
            "panel_border_color": "#e2e8f0",
            "icon_background": "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 55%, var(--color-primary) 45%) 100%)",
            "heading": {
                "color": "#020617",
                "size": "1.5rem",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "600",
            },
            "body": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
    },
    "cta": {
        "badge_text": "Need a recommendation?",
        "heading": "Ask admissions which mentor path fits your next move.",
        "description": "When users can see the faculty clearly, the next natural step is guided matching.",
        "button_label": "Contact admissions",
        "button_link": "/contact",
        "style": {
            "panel_background": "#020617",
            "panel_border_color": "#0f172a",
            "badge": {
                "text_color": "rgba(255,255,255,0.45)",
                "background": "transparent",
                "border_color": "transparent",
            },
            "heading": {
                "color": "#ffffff",
                "size": "clamp(2rem, 4vw, 2.75rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "body": {
                "color": "rgba(255,255,255,0.68)",
                "size": "16px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "button": {
                "background": "#ffffff",
                "text_color": "#020617",
                "border_color": "#ffffff",
            },
        },
    },
    "visibility": {
        "hero": True,
        "filter_bar": True,
        "spotlight": True,
        "principles": True,
        "cta": True,
    },
}

DEFAULT_HOME_PAGE = {
    "command_bar": {
        "admissions_label": "Admissions Desk",
        "search_label": "Universal Search",
        "search_placeholder": "Search programs, mentors, durations, outcomes, or admissions help",
        "shortcut_hint": "/",
        "fast_response_label": "Fast Response",
        "fast_response_description": "Share your goals with our team and get matched to the right program faster.",
        "fast_response_button_label": "Send Inquiry",
        "fast_response_button_link": "/contact",
        "no_result_description": "Press Enter to open the program explorer and continue browsing the catalogue with your current search term.",
        "search_results_suffix": "matching results",
        "quick_jump_label": "Quick jumps and trending categories",
        "popular_searches_label": "Popular searches",
        "popular_lanes_label": "Popular lanes",
        "quick_actions": [
            {
                "id": "browse-programs",
                "title": "Browse every program",
                "description": "Jump into the full course explorer directly from the homepage.",
                "href": "#course-explorer",
                "meta": "Catalogue",
            },
            {
                "id": "meet-faculty",
                "title": "Meet the teaching faculty",
                "description": "Review mentors and instructors shaping the learning experience.",
                "href": "#faculty-showcase",
                "meta": "Faculty",
            },
            {
                "id": "contact-admissions",
                "title": "Contact admissions",
                "description": "Open the inquiry page and talk to the admissions desk.",
                "href": "/contact",
                "meta": "Admissions",
            },
            {
                "id": "read-proof",
                "title": "Read student success stories",
                "description": "Open the proof section and review visible student outcomes.",
                "href": "#student-proof",
                "meta": "Proof",
            },
        ],
        "style": {
            "panel_background": "rgba(255,255,255,0.08)",
            "panel_border_color": "rgba(255,255,255,0.10)",
            "card_background": "rgba(0,0,0,0.15)",
            "card_border_color": "rgba(255,255,255,0.10)",
            "search_panel_background": "#ffffff",
            "search_panel_border_color": "rgba(255,255,255,0.12)",
            "search_input_background": "#ffffff",
            "search_input_border_color": "rgba(255,255,255,0.12)",
            "search_hint_background": "#ffffff",
            "search_hint_border_color": "#e2e8f0",
            "quick_action_panel_background": "#f8fafc",
            "quick_action_panel_border_color": "#f1f5f9",
            "popular_chip_background": "rgba(255,255,255,0.08)",
            "popular_chip_border_color": "rgba(255,255,255,0.10)",
            "label": {
                "color": "rgba(255,255,255,0.45)",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "body": {
                "color": "#ffffff",
                "size": "16px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "search_label": {
                "color": "#94a3b8",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "search_input": {
                "color": "#0f172a",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "search_hint": {
                "color": "#64748b",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "action_title": {
                "color": "#0f172a",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "action_body": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "action_meta": {
                "color": "#94a3b8",
                "size": "12px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "popular_label": {
                "color": "rgba(255,255,255,0.40)",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "popular_chip_text": {
                "color": "rgba(255,255,255,0.80)",
                "size": "12px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "button": {
                "background": "#ffffff",
                "text_color": "#020617",
                "border_color": "#ffffff",
            },
        },
    },
    "hero": {
        "badge_text": "Premium learning experience",
        "title": DEFAULT_HERO_SECTION["title"],
        "description": DEFAULT_HERO_SECTION["subtitle"],
        "primary_cta_label": DEFAULT_HERO_SECTION["cta_text"],
        "primary_cta_link": DEFAULT_HERO_SECTION["cta_link"],
        "secondary_cta_label": "Speak with admissions",
        "secondary_cta_link": "/contact",
        "social_proof_text": "Learn with practitioners, get closer to industry-ready outcomes, and access a faster admissions route from the homepage itself.",
        "visual_badge_text": "Live institute snapshot",
        "background_image": DEFAULT_HERO_SECTION["background_image"],
        "banner_fallback_prefix": "Spotlight",
        "stat_pills": [
            {
                "id": "hero-programs",
                "label": "active programs",
                "description": "",
                "icon": "book-open",
                "source": "courses_count",
                "prefix": "",
                "suffix": "+",
                "fallback_value": "0",
            },
            {
                "id": "hero-mentors",
                "label": "mentors",
                "description": "",
                "icon": "users",
                "source": "teachers_count",
                "prefix": "",
                "suffix": "+",
                "fallback_value": "0",
            },
            {
                "id": "hero-rating",
                "label": "student rating",
                "description": "",
                "icon": "star",
                "source": "rating",
                "prefix": "",
                "suffix": "/5",
                "fallback_value": "4.9",
            },
        ],
        "snapshot_cards": [
            {
                "id": "snapshot-programs",
                "label": "Programs",
                "description": "",
                "icon": "briefcase",
                "source": "courses_count",
                "prefix": "",
                "suffix": "+",
                "fallback_value": "0",
            },
            {
                "id": "snapshot-mentors",
                "label": "Mentors",
                "description": "",
                "icon": "graduation-cap",
                "source": "teachers_count",
                "prefix": "",
                "suffix": "+",
                "fallback_value": "0",
            },
            {
                "id": "snapshot-hotline",
                "label": "Hotline",
                "description": "",
                "icon": "phone",
                "source": "primary_phone",
                "prefix": "",
                "suffix": "",
                "fallback_value": "Contact us",
            },
        ],
        "style": {
            "badge": {
                "text_color": "#ffffff",
                "background": "rgba(255,255,255,0.10)",
                "border_color": "rgba(255,255,255,0.10)",
            },
            "heading": {
                "color": "#ffffff",
                "size": "clamp(3rem, 8vw, 5.5rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "description": {
                "color": "rgba(255,255,255,0.72)",
                "size": "1.25rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "stat_pill_background": "rgba(255,255,255,0.08)",
            "stat_pill_border_color": "rgba(255,255,255,0.10)",
            "stat_pill_text": {
                "color": "rgba(255,255,255,0.85)",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "social_panel_background": "rgba(255,255,255,0.06)",
            "social_panel_border_color": "rgba(255,255,255,0.10)",
            "social_text": {
                "color": "rgba(255,255,255,0.78)",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "primary_button": {
                "background": "linear-gradient(135deg, color-mix(in srgb, white 78%, var(--color-accent) 22%) 0%, white 100%)",
                "text_color": "#020617",
                "border_color": "transparent",
            },
            "secondary_button": {
                "background": "rgba(255,255,255,0.08)",
                "text_color": "#ffffff",
                "border_color": "rgba(255,255,255,0.15)",
            },
            "visual_panel_background": "rgba(255,255,255,0.08)",
            "visual_panel_border_color": "rgba(255,255,255,0.10)",
            "visual_badge": {
                "text_color": "rgba(255,255,255,0.80)",
                "background": "rgba(0,0,0,0.25)",
                "border_color": "rgba(255,255,255,0.15)",
            },
            "overlay_card_background": "rgba(0,0,0,0.30)",
            "overlay_card_border_color": "rgba(255,255,255,0.12)",
            "overlay_label": {
                "color": "rgba(255,255,255,0.70)",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "overlay_value": {
                "color": "#ffffff",
                "size": "16px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "banner_tab_active_background": "#ffffff",
            "banner_tab_active_text_color": "#020617",
            "banner_tab_active_border_color": "rgba(255,255,255,0.20)",
            "banner_tab_background": "rgba(255,255,255,0.08)",
            "banner_tab_text_color": "rgba(255,255,255,0.74)",
            "banner_tab_border_color": "rgba(255,255,255,0.10)",
        },
    },
    "metrics_rail": {
        "items": [
            {
                "id": "rail-programs",
                "label": "Programs Live",
                "description": "Career-focused learning tracks",
                "icon": "book-open",
                "source": "courses_count",
                "prefix": "",
                "suffix": "+",
                "fallback_value": "0",
            },
            {
                "id": "rail-faculty",
                "label": "Teaching Faculty",
                "description": "Experts guiding every intake",
                "icon": "users",
                "source": "teachers_count",
                "prefix": "",
                "suffix": "+",
                "fallback_value": "0",
            },
            {
                "id": "rail-rating",
                "label": "Student Rating",
                "description": "Visible outcomes and student proof",
                "icon": "star",
                "source": "rating",
                "prefix": "",
                "suffix": "/5",
                "fallback_value": "4.9",
            },
            {
                "id": "rail-hours",
                "label": "Admissions Window",
                "description": "Fast response support",
                "icon": "shield",
                "source": "hours",
                "prefix": "",
                "suffix": "",
                "fallback_value": "Open six days a week",
            },
        ],
        "style": {
            "panel_background": "rgba(255,255,255,0.88)",
            "panel_border_color": "rgba(226,232,240,0.70)",
            "card_background": "rgba(248,250,252,0.80)",
            "card_border_color": "rgba(226,232,240,0.70)",
            "label": {
                "color": "#94a3b8",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "value": {
                "color": "#020617",
                "size": "1.5rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "body": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
    },
    "course_explorer": {
        "badge_text": "Program explorer",
        "heading": "Find the right path, not just a random course card.",
        "description": "Explore the catalogue by lane, duration, and fit. The homepage search is wired into this section, so users can narrow the grid before they ever leave the landing page.",
        "open_catalogue_label": "Open full catalogue",
        "all_programs_label": "All Programs",
        "results_prefix": "Showing",
        "results_suffix": "matching programs",
        "clear_search_label": "Clear",
        "empty_title": "No program matches the current search or category.",
        "empty_description": "Clear the search query or switch back to “All Programs” to reopen the catalogue.",
        "duration_label": "Duration",
        "fee_label": "Fee",
        "featured_cta_label": "View program detail",
        "card_duration_fallback": "Flexible",
        "card_description_fallback": "A premium institute program with applied learning support.",
        "card_cta_label": "Learn more",
        "category_fallback_label": "Featured Program",
        "style": {
            "badge": {
                "text_color": "#64748b",
                "background": "#ffffff",
                "border_color": "#e2e8f0",
            },
            "heading": {
                "color": "#020617",
                "size": "clamp(2.5rem, 6vw, 3.75rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "description": {
                "color": "#64748b",
                "size": "1.125rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "action_button": {
                "background": "#ffffff",
                "text_color": "#020617",
                "border_color": "#e2e8f0",
            },
            "filter_active_background": "#020617",
            "filter_active_border_color": "#020617",
            "filter_active_text_color": "#ffffff",
            "filter_background": "#ffffff",
            "filter_border_color": "#e2e8f0",
            "filter_text": {
                "color": "#475569",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "results_badge_background": "#f8fafc",
            "results_badge_border_color": "#e2e8f0",
            "results_text": {
                "color": "#334155",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "clear_button_background": "#ffffff",
            "clear_button_border_color": "#e2e8f0",
            "clear_button_text": {
                "color": "#475569",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "empty_title": {
                "color": "#020617",
                "size": "1.125rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "empty_body": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
    },
    "faculty_showcase": {
        "badge_text": "Mentor-led learning",
        "heading": "Learn from people who teach the craft, not just the syllabus.",
        "description": "Faculty, support availability, and the tone of the learning experience should be visible from the homepage. This section makes that commitment explicit.",
        "button_label": "Explore faculty",
        "button_link": "/teachers",
        "roster_subject_fallback": "Instructor",
        "roster_bio_fallback": "Mentor profile available on the faculty directory.",
        "highlight_cards": [
            {
                "id": "faculty-mentors",
                "label": "Active mentors",
                "description": "Visible faculty profiles build trust before a student clicks deeper.",
                "icon": "users",
                "source": "teachers_count",
                "prefix": "",
                "suffix": "+",
                "fallback_value": "0",
            },
            {
                "id": "faculty-hours",
                "label": "Support hours",
                "description": "Admissions and support stay clear and reachable from the first screen.",
                "icon": "headphones",
                "source": "hours",
                "prefix": "",
                "suffix": "",
                "fallback_value": "Extended support hours",
            },
            {
                "id": "faculty-rating",
                "label": "Public satisfaction",
                "description": "Student voices are integrated into the homepage flow instead of hidden away.",
                "icon": "star",
                "source": "rating",
                "prefix": "",
                "suffix": "/5",
                "fallback_value": "4.9",
            },
            {
                "id": "faculty-campus",
                "label": "Campus",
                "description": "Location context and on-ground identity make the brand feel real.",
                "icon": "map-pin",
                "source": "address",
                "prefix": "",
                "suffix": "",
                "fallback_value": "Institutional campus",
            },
        ],
        "style": {
            "feature_panel_background": "#020617",
            "feature_panel_border_color": "#1e293b",
            "badge": {
                "text_color": "rgba(255,255,255,0.72)",
                "background": "rgba(255,255,255,0.08)",
                "border_color": "rgba(255,255,255,0.10)",
            },
            "heading": {
                "color": "#ffffff",
                "size": "clamp(2.5rem, 5vw, 3rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "description": {
                "color": "rgba(255,255,255,0.72)",
                "size": "16px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "highlight_card_background": "rgba(255,255,255,0.08)",
            "highlight_card_border_color": "rgba(255,255,255,0.10)",
            "highlight_label": {
                "color": "rgba(255,255,255,0.45)",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "highlight_value": {
                "color": "#ffffff",
                "size": "16px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "highlight_body": {
                "color": "rgba(255,255,255,0.62)",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "button": {
                "background": "#ffffff",
                "text_color": "#020617",
                "border_color": "#ffffff",
            },
            "roster_card_background": "#ffffff",
            "roster_card_border_color": "#e2e8f0",
            "roster_subject": {
                "color": "#94a3b8",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "roster_name": {
                "color": "#020617",
                "size": "1.5rem",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "600",
            },
            "roster_qualification": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "roster_body": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
    },
    "proof_section": {
        "badge_text": "Student proof",
        "heading": "Trusted because the outcomes feel real, not inflated.",
        "description": "The homepage should answer the questions a serious student has immediately: what can I learn here, who teaches it, and what proof exists that people benefit.",
        "testimonial_course_fallback": "Student story",
        "metrics": [
            {
                "id": "proof-rating",
                "label": "Public rating",
                "description": "Average rating based on visible testimonials.",
                "icon": "star",
                "source": "rating",
                "prefix": "",
                "suffix": "/5",
                "fallback_value": "4.9",
            },
            {
                "id": "proof-programs",
                "label": "Programs visible",
                "description": "A strong catalogue is surfaced directly from the landing page.",
                "icon": "book-open",
                "source": "courses_count",
                "prefix": "",
                "suffix": "+",
                "fallback_value": "0",
            },
            {
                "id": "proof-mentors",
                "label": "Mentors available",
                "description": "Faculty visibility supports credibility before enquiry.",
                "icon": "users",
                "source": "teachers_count",
                "prefix": "",
                "suffix": "+",
                "fallback_value": "0",
            },
        ],
        "style": {
            "section_background": "linear-gradient(180deg, #081224 0%, color-mix(in srgb, var(--color-primary) 82%, #081224 18%) 100%)",
            "feature_panel_background": "rgba(255,255,255,0.08)",
            "feature_panel_border_color": "rgba(255,255,255,0.10)",
            "badge": {
                "text_color": "rgba(255,255,255,0.72)",
                "background": "rgba(255,255,255,0.08)",
                "border_color": "rgba(255,255,255,0.10)",
            },
            "heading": {
                "color": "#ffffff",
                "size": "clamp(2.5rem, 5vw, 3rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "description": {
                "color": "rgba(255,255,255,0.72)",
                "size": "16px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "metric_card_background": "rgba(0,0,0,0.18)",
            "metric_card_border_color": "rgba(255,255,255,0.10)",
            "metric_label": {
                "color": "rgba(255,255,255,0.45)",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "metric_value": {
                "color": "#ffffff",
                "size": "3rem",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "metric_body": {
                "color": "rgba(255,255,255,0.60)",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "testimonial_card_background": "#ffffff",
            "testimonial_card_border_color": "rgba(255,255,255,0.10)",
            "testimonial_body": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "testimonial_name": {
                "color": "#020617",
                "size": "16px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
            "testimonial_course": {
                "color": "#64748b",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
        },
    },
    "cta_section": {
        "badge_text": "Admission ready",
        "heading": "Bring your goals. We’ll help you choose the right next move.",
        "description": "A premium homepage should convert attention into clarity. This closing band makes the next step obvious without forcing users to hunt through the site.",
        "primary_cta_label": "Start your inquiry",
        "primary_cta_link": "/contact",
        "secondary_cta_label": "Browse programs",
        "secondary_cta_link": "/courses",
        "info_cards": [
            {
                "id": "cta-hotline",
                "label": "Admissions Hotline",
                "description": "",
                "icon": "phone",
                "source": "primary_phone",
                "prefix": "",
                "suffix": "",
                "fallback_value": "Available on request",
            },
            {
                "id": "cta-hours",
                "label": "Support Hours",
                "description": "",
                "icon": "clock",
                "source": "hours",
                "prefix": "",
                "suffix": "",
                "fallback_value": "Open six days a week",
            },
            {
                "id": "cta-campus",
                "label": "Campus",
                "description": "",
                "icon": "map-pin",
                "source": "address",
                "prefix": "",
                "suffix": "",
                "fallback_value": "Institutional location available",
            },
        ],
        "style": {
            "outer_panel_background": "#ffffff",
            "outer_panel_border_color": "#e2e8f0",
            "feature_panel_background": "linear-gradient(135deg, var(--color-primary) 0%, color-mix(in srgb, var(--color-accent) 48%, var(--color-primary) 52%) 100%)",
            "badge": {
                "text_color": "rgba(255,255,255,0.55)",
                "background": "transparent",
                "border_color": "transparent",
            },
            "heading": {
                "color": "#ffffff",
                "size": "clamp(2.5rem, 5vw, 3rem)",
                "font_family": "serif",
                "font_style": "normal",
                "font_weight": "700",
            },
            "description": {
                "color": "rgba(255,255,255,0.76)",
                "size": "16px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "500",
            },
            "primary_button": {
                "background": "#ffffff",
                "text_color": "#020617",
                "border_color": "#ffffff",
            },
            "secondary_button": {
                "background": "rgba(255,255,255,0.08)",
                "text_color": "#ffffff",
                "border_color": "rgba(255,255,255,0.15)",
            },
            "info_card_background": "#f8fafc",
            "info_card_border_color": "#e2e8f0",
            "info_label": {
                "color": "#94a3b8",
                "size": "10px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "700",
            },
            "info_value": {
                "color": "#020617",
                "size": "14px",
                "font_family": "sans",
                "font_style": "normal",
                "font_weight": "600",
            },
        },
    },
    "visibility": {
        "command_bar": True,
        "hero": True,
        "hero_social_proof": True,
        "hero_snapshot": True,
        "hero_banner_tabs": True,
        "metrics_rail": True,
        "course_explorer": True,
        "faculty_showcase": True,
        "proof_section": True,
        "cta_section": True,
    },
}

DEFAULT_FOOTER_CONTENT = {
    "description": "Empowering Nepal's next generation through world-class academic leadership.",
    "copyright": "© 2026 The Elite Academy",
}

DEFAULT_CONTACT_INFO = {
    "address": "Durbar Marg Executive Plaza, Kathmandu",
    "phone": ["+977 1-4XXXXXX"],
    "email": "admissions@tuitionhub.edu",
    "website": "www.eliteacademy.edu",
    "map_embed": "",
    "hours": "Sun-Fri 6AM-6PM",
}

DEFAULT_CONTACT_PAGE = {
    "left_panel": {
        "badge_text": "Connect",
        "title_prefix": "Start your",
        "title_highlight": "journey.",
        "description": "Our admissions team is available to assist you with program selection, enrollment, and academic counseling.",
        "campus_title": "Our Campus",
        "phone_title": "Direct Line",
        "email_title": "Electronic Mail",
        "website_title": "Website",
        "website_link_text": "Visit official website",
        "hours_title": "Operating Hours",
        "visible_items": {
            "campus": True,
            "phone": True,
            "email": True,
            "website": True,
            "hours": True,
        },
    },
    "form_panel": {
        "title": "Send Inquiry",
        "subtitle": "We aim to respond within 24 hours.",
        "name_label": "Full Name *",
        "name_placeholder": "e.g. Ram Sharma",
        "email_label": "Email Address *",
        "email_placeholder": "you@domain.com",
        "phone_label": "Phone Number",
        "phone_placeholder": "+977 98XXXXXXXX",
        "message_label": "How can we help? *",
        "message_placeholder": "Tell us about your educational background and what you're looking for...",
        "submit_label": "Submit Inquiry",
        "submitting_label": "Transmitting...",
        "success_message": "Message dispatched. A counselor will reach out soon.",
        "error_message": "Failed to transmit. Please verify your connection.",
        "field_visibility": {
            "email": True,
            "phone": True,
        },
        "custom_fields": [],
    },
    "form_styles": {
        "panel_background": "#ffffff",
        "title_color": "#0f172a",
        "title_size": "32px",
        "title_font_family": "serif",
        "title_font_style": "normal",
        "subtitle_color": "#64748b",
        "subtitle_size": "16px",
        "subtitle_font_style": "normal",
        "label_color": "#94a3b8",
        "label_size": "10px",
        "label_font_style": "normal",
        "input_background": "#f8fafc",
        "input_border_color": "#e2e8f0",
        "input_text_color": "#0f172a",
        "input_placeholder_color": "#cbd5e1",
        "input_font_size": "16px",
        "input_font_style": "normal",
        "button_background": "#0f172a",
        "button_hover_background": "#3b82f6",
        "button_text_color": "#ffffff",
        "button_font_size": "18px",
        "button_font_family": "sans",
        "button_font_style": "normal",
    },
    "map_section": {
        "title": "Visit us on the map",
        "description": "Use the map below to find our campus quickly.",
    },
}

DEFAULT_SOCIAL_LINKS = {
    "facebook": "",
    "instagram": "",
    "youtube": "",
    "tiktok": "",
}

DEFAULT_META_SEO = {
    "title": "The Elite Academy - Premium Tuition",
    "description": "Bespoke coaching for +2 and Engineering board exams in Nepal.",
    "keywords": "tuition, coaching, nepal, +2, engineering, elite academy",
}

SITE_SETTINGS_SNAPSHOT_FIELDS = (
    "site_name",
    "logo_url",
    "primary_colors",
    "font_family",
    "ui_customization",
    "hero_section",
    "about_content",
    "home_page",
    "about_page",
    "teachers_page",
    "footer_content",
    "contact_info",
    "contact_page",
    "social_links",
    "meta_seo",
)


def _deep_merge(default: Any, value: Any) -> Any:
    if not isinstance(default, dict):
        return deepcopy(default if value is None else value)

    if not isinstance(value, dict):
        return deepcopy(default)

    merged = deepcopy(default)
    for key, default_value in default.items():
        if key in value:
            merged[key] = _deep_merge(default_value, value[key])
    for key, custom_value in value.items():
        if key not in merged and custom_value is not None:
            merged[key] = deepcopy(custom_value)
    return merged


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


def normalize_site_settings_data(data: Any) -> Dict[str, Any]:
    normalized = dict(data or {})
    normalized["primary_colors"] = _deep_merge(
        DEFAULT_PRIMARY_COLORS, normalized.get("primary_colors")
    )
    normalized["ui_customization"] = _deep_merge(
        DEFAULT_UI_CUSTOMIZATION, normalized.get("ui_customization")
    )
    normalized["hero_section"] = _deep_merge(
        DEFAULT_HERO_SECTION, normalized.get("hero_section")
    )
    normalized["home_page"] = _deep_merge(
        DEFAULT_HOME_PAGE, normalized.get("home_page")
    )
    normalized["about_page"] = _deep_merge(
        DEFAULT_ABOUT_PAGE, normalized.get("about_page")
    )
    home_page = normalized["home_page"]
    legacy_home_hero = normalized["hero_section"]
    normalized["teachers_page"] = _deep_merge(
        DEFAULT_TEACHERS_PAGE, normalized.get("teachers_page")
    )
    about_page = normalized["about_page"]
    legacy_story = normalized.get("about_content") or DEFAULT_ABOUT_PAGE["narrative"]["content"]
    legacy_stats = about_page.get("stats") if isinstance(about_page.get("stats"), list) else None

    if not about_page["hero"].get("quote_title"):
        about_page["hero"]["quote_title"] = normalized.get("site_name") or "Tuition Institute"
    if not about_page["hero"].get("quote_body"):
        about_page["hero"]["quote_body"] = legacy_story
    if not about_page["narrative"].get("content"):
        about_page["narrative"]["content"] = legacy_story
    if not about_page["stats_band"].get("stats"):
        about_page["stats_band"]["stats"] = deepcopy(
            legacy_stats or DEFAULT_ABOUT_PAGE["stats_band"]["stats"]
        )
    if not home_page["hero"].get("title"):
        home_page["hero"]["title"] = legacy_home_hero.get("title") or DEFAULT_HOME_PAGE["hero"]["title"]
    if not home_page["hero"].get("description"):
        home_page["hero"]["description"] = (
            legacy_home_hero.get("subtitle") or DEFAULT_HOME_PAGE["hero"]["description"]
        )
    if not home_page["hero"].get("primary_cta_label"):
        home_page["hero"]["primary_cta_label"] = (
            legacy_home_hero.get("cta_text") or DEFAULT_HOME_PAGE["hero"]["primary_cta_label"]
        )
    if not home_page["hero"].get("primary_cta_link"):
        home_page["hero"]["primary_cta_link"] = (
            legacy_home_hero.get("cta_link") or DEFAULT_HOME_PAGE["hero"]["primary_cta_link"]
        )
    if not home_page["hero"].get("background_image"):
        home_page["hero"]["background_image"] = legacy_home_hero.get("background_image") or ""
    normalized["footer_content"] = _deep_merge(
        DEFAULT_FOOTER_CONTENT, normalized.get("footer_content")
    )
    normalized["contact_info"] = _deep_merge(
        DEFAULT_CONTACT_INFO, normalized.get("contact_info")
    )
    normalized["contact_page"] = _deep_merge(
        DEFAULT_CONTACT_PAGE, normalized.get("contact_page")
    )
    normalized["social_links"] = _deep_merge(
        DEFAULT_SOCIAL_LINKS, normalized.get("social_links")
    )
    normalized["meta_seo"] = _deep_merge(DEFAULT_META_SEO, normalized.get("meta_seo"))
    return normalized


def extract_site_settings_payload(source: Any) -> Dict[str, Any]:
    if isinstance(source, Mapping):
        raw = dict(source)
    elif hasattr(source, "model_dump"):
        raw = source.model_dump()
    else:
        raise TypeError("Unsupported site settings source")

    normalized = normalize_site_settings_data(raw)
    return {
        field: deepcopy(normalized.get(field))
        for field in SITE_SETTINGS_SNAPSHOT_FIELDS
    }


def apply_site_settings_payload(document: Any, payload: Dict[str, Any]) -> None:
    for field in SITE_SETTINGS_SNAPSHOT_FIELDS:
        setattr(document, field, deepcopy(payload[field]))


def site_settings_payloads_equal(left: Any, right: Any) -> bool:
    return extract_site_settings_payload(left) == extract_site_settings_payload(right)


class SiteSettingsBase(BaseModel):
    site_name: str = "Tuition Institute"
    logo_url: Optional[str] = None
    primary_colors: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_PRIMARY_COLORS))
    font_family: str = "Inter"
    ui_customization: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_UI_CUSTOMIZATION))
    hero_section: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_HERO_SECTION))
    about_content: str = "Welcome to the elite era of education."
    home_page: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_HOME_PAGE))
    about_page: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_ABOUT_PAGE))
    teachers_page: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_TEACHERS_PAGE))
    footer_content: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_FOOTER_CONTENT))
    contact_info: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_CONTACT_INFO))
    contact_page: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_CONTACT_PAGE))
    social_links: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_SOCIAL_LINKS))
    meta_seo: Dict[str, Any] = Field(default_factory=lambda: deepcopy(DEFAULT_META_SEO))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    @model_validator(mode="before")
    @classmethod
    def normalize_nested_defaults(cls, data: Any) -> Any:
        if not isinstance(data, dict):
            return data

        return normalize_site_settings_data(data)


class SiteSettings(SiteSettingsBase, Document):
    updated_at: datetime = Field(default_factory=utc_now)

    class Settings:
        name = "site_settings"


class SiteSettingsDraft(SiteSettingsBase, Document):
    source_updated_at: Optional[datetime] = None
    updated_at: datetime = Field(default_factory=utc_now)

    class Settings:
        name = "site_settings_drafts"


class SiteSettingsRevision(SiteSettingsBase, Document):
    published_at: datetime = Field(default_factory=utc_now)
    published_by: Optional[str] = None
    source_updated_at: Optional[datetime] = None

    class Settings:
        name = "site_settings_revisions"
