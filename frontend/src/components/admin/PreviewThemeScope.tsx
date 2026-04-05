"use client";

import { CSSProperties, ReactNode, useEffect } from "react";
import { SiteSettings } from "@/lib/types";

type Props = {
  settings: SiteSettings;
  children: ReactNode;
};

function withFallbackFont(font: string | undefined, fallback: string) {
  const family = font?.trim();
  if (!family) return fallback;
  return `"${family.replace(/"/g, '\\"')}", ${fallback}`;
}

function buildGoogleFontsHref(settings: SiteSettings) {
  const families = [
    settings.ui_customization?.fonts?.serif,
    settings.ui_customization?.fonts?.sans,
  ]
    .filter(Boolean)
    .map((font) => font!.trim().replace(/\s+/g, "+"))
    .filter((font, index, all) => all.indexOf(font) === index);

  if (families.length === 0) return null;

  return `https://fonts.googleapis.com/css2?${families
    .map((family) => `family=${family}:wght@300;400;500;600;700;800;900`)
    .join("&")}&display=swap`;
}

export default function PreviewThemeScope({ settings, children }: Props) {
  const fonts = settings.ui_customization?.fonts;
  const navbar = settings.ui_customization?.navbar;
  const instructors = settings.ui_customization?.instructors;
  const colors = settings.primary_colors;

  useEffect(() => {
    const href = buildGoogleFontsHref(settings);
    if (!href) return;

    let link = document.getElementById("admin-preview-google-fonts") as HTMLLinkElement | null;

    if (!link) {
      link = document.createElement("link");
      link.id = "admin-preview-google-fonts";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }

    link.href = href;
  }, [settings]);

  const style = {
    "--primary": colors?.primary || "#1a1a2e",
    "--secondary": colors?.secondary || "#d4af37",
    "--accent": colors?.accent || "#d4af37",
    "--accent-soft": colors?.accent_soft || "rgba(212, 175, 55, 0.1)",
    "--background": colors?.background || "#ffffff",
    "--text": colors?.text || "#1a1a2e",
    "--color-primary": colors?.primary || "#1a1a2e",
    "--color-secondary": colors?.secondary || "#d4af37",
    "--color-accent": colors?.accent || "#d4af37",
    "--color-bg": colors?.background || "#ffffff",
    "--color-text": colors?.text || "#1a1a2e",
    "--font-serif-dynamic": withFallbackFont(fonts?.serif, "serif"),
    "--font-sans-dynamic": withFallbackFont(fonts?.sans, "sans-serif"),
    "--font-size-base": fonts?.base_size || "16px",
    "--heading-scale": fonts?.heading_scale || "1.2",
    "--font-serif": fonts?.serif || "Playfair Display",
    "--font-sans": fonts?.sans || "Inter",
    "--font-base-size": fonts?.base_size || "16px",
    "--font-heading-scale": fonts?.heading_scale || "1.2",
    "--navbar-height": navbar?.height || "80px",
    "--navbar-opacity": navbar?.background_opacity || "0.8",
    "--instructor-photo-size": instructors?.photo_size || "128px",
    "--instructor-photo-shape": instructors?.photo_shape || "24px",
    "--instructor-card-bg": instructors?.card_bg || "#fcfcfc",
  } as CSSProperties;

  return (
    <div className="admin-preview-scope" style={style}>
      {children}
      <style jsx>{`
        .admin-preview-scope {
          font-size: var(--font-base-size, 16px);
          color: var(--color-text, #1a1a2e);
          background: var(--color-bg, #ffffff);
        }

        .admin-preview-scope .font-serif {
          font-family: var(--font-serif-dynamic, var(--font-serif, serif)) !important;
        }

        .admin-preview-scope .font-sans {
          font-family: var(--font-sans-dynamic, var(--font-sans, sans-serif)) !important;
        }
      `}</style>
    </div>
  );
}
