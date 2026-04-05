"use client";

import { ReactNode } from "react";
import { MotionConfig } from "framer-motion";
import PreviewThemeScope from "@/components/admin/PreviewThemeScope";
import { ThemeSettingsProvider } from "@/components/ThemeProvider";
import PublicSiteChrome from "@/components/public/PublicSiteChrome";
import { SiteSettings } from "@/lib/types";

type Props = {
  settings: SiteSettings;
  pathname: string;
  children: ReactNode;
};

export default function PublicPagePreview({ settings, pathname, children }: Props) {
  return (
    <PreviewThemeScope settings={settings}>
      <ThemeSettingsProvider settings={settings}>
        <MotionConfig reducedMotion="always">
          <div className="pointer-events-none select-none">
            <PublicSiteChrome pathnameOverride={pathname} embedded>
              {children}
            </PublicSiteChrome>
          </div>
        </MotionConfig>
      </ThemeSettingsProvider>
    </PreviewThemeScope>
  );
}
