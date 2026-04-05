"use client";

import { SiteSettings } from "@/lib/types";

export default function DynamicStyles({ settings }: { settings: SiteSettings }) {
  if (!settings) return null;

  const { primary_colors, ui_customization } = settings;
  
  // Robust null safety and defaults
  const fonts = ui_customization?.fonts || {
    serif: "Playfair Display",
    sans: "Inter",
    base_size: "16px",
    heading_scale: "1.2"
  };
  
  const navbar = ui_customization?.navbar || {
    height: "80px",
    is_sticky: true,
    background_opacity: "0.8",
    style: "glass"
  };

  const instructors = ui_customization?.instructors || {
    photo_size: "128px",
    photo_shape: "rounded-[40px]",
    show_bio: true,
    card_bg: "#fcfcfc"
  };

  const colors = primary_colors || {
    primary: "#1a1a2e",
    secondary: "#d4af37",
    accent: "#d4af37",
    accent_soft: "rgba(212, 175, 55, 0.1)",
    background: "#ffffff",
    text: "#1a1a2e"
  };

  return (
    <style jsx global>{`
      :root {
        /* Colors */
        --primary: ${colors.primary};
        --secondary: ${colors.secondary};
        --accent: ${colors.accent};
        --accent-soft: ${colors.accent_soft || "rgba(212, 175, 55, 0.1)"};
        --background: ${colors.background};
        --text: ${colors.text};
        --color-primary: ${colors.primary};
        --color-secondary: ${colors.secondary};
        --color-accent: ${colors.accent};
        --color-bg: ${colors.background};
        --color-text: ${colors.text};

        /* Typography */
        --font-serif-dynamic: "${fonts.serif}", serif;
        --font-sans-dynamic: "${fonts.sans}", sans-serif;
        --font-size-base: ${fonts.base_size};
        --heading-scale: ${fonts.heading_scale};
        --font-serif: ${fonts.serif};
        --font-sans: ${fonts.sans};
        --font-base-size: ${fonts.base_size};
        --font-heading-scale: ${fonts.heading_scale};

        /* Component Metrics */
        --navbar-height: ${navbar.height};
        --navbar-opacity: ${navbar.background_opacity};
        --instructor-photo-size: ${instructors.photo_size};
        --instructor-photo-shape: ${instructors.photo_shape};
        --instructor-card-bg: ${instructors.card_bg};
      }

      /* Global Overrides */
      html {
        font-size: var(--font-base-size);
      }
      
      .font-serif {
        font-family: var(--font-serif-dynamic) !important;
      }
      
      .font-sans {
        font-family: var(--font-sans-dynamic) !important;
      }
    `}</style>
  );
}
