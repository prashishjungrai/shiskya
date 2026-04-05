"use client";

import { createContext, useContext, useEffect, useState } from "react";
import api from "@/lib/api";
import { SiteSettings } from "@/lib/types";

const ThemeContext = createContext<SiteSettings | null>(null);

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings | null;
  children: React.ReactNode;
}) {
  return <ThemeContext.Provider value={settings}>{children}</ThemeContext.Provider>;
}

export default function ThemeProvider({
  children,
  initialSettings = null,
}: {
  children: React.ReactNode;
  initialSettings?: SiteSettings | null;
}) {
  const [settings, setSettings] = useState<SiteSettings | null>(initialSettings);

  useEffect(() => {
    if (settings) {
      applyTheme(settings);
    }
  }, [settings]);

  useEffect(() => {
    if (initialSettings) {
      return;
    }

    api.get("/public/settings")
      .then(res => {
        setSettings(res.data);
      })
      .catch(console.error);
  }, [initialSettings]);

  return (
    <ThemeSettingsProvider settings={settings}>
      {children}
    </ThemeSettingsProvider>
  );
}

function applyTheme(s: SiteSettings) {
  const root = document.documentElement;

  // Colors
  root.style.setProperty("--color-primary", s.primary_colors.primary);
  root.style.setProperty("--color-secondary", s.primary_colors.secondary);
  root.style.setProperty("--color-accent", s.primary_colors.accent);
  root.style.setProperty("--color-bg", s.primary_colors.background);
  root.style.setProperty("--color-text", s.primary_colors.text);

  // Typography
  const fonts = s.ui_customization?.fonts;
  if (fonts) {
    root.style.setProperty("--font-serif", fonts.serif);
    root.style.setProperty("--font-sans", fonts.sans);
    root.style.setProperty("--font-base-size", fonts.base_size);
    root.style.setProperty("--font-heading-scale", fonts.heading_scale);
  }

  // Navbar
  const navbar = s.ui_customization?.navbar;
  if (navbar) {
    root.style.setProperty("--navbar-height", navbar.height);
    root.style.setProperty("--navbar-opacity", navbar.background_opacity);
  }

  // Instructor cards
  const instr = s.ui_customization?.instructors;
  if (instr) {
    root.style.setProperty("--instructor-photo-size", instr.photo_size);
    root.style.setProperty("--instructor-photo-shape", instr.photo_shape);
    root.style.setProperty("--instructor-card-bg", instr.card_bg);
  }

  // Load Google Fonts dynamically
  if (fonts) {
    const families = [fonts.serif, fonts.sans].filter(Boolean).map(f => f.replace(/ /g, "+")).join("&family=");
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = `https://fonts.googleapis.com/css2?family=${families}:wght@300;400;500;600;700;800;900&display=swap`;
    link.id = "dynamic-google-fonts";

    const existing = document.getElementById("dynamic-google-fonts");
    if (existing) existing.remove();
    document.head.appendChild(link);
  }
}
