"use client";

import { ReactNode } from "react";
import {
  Layout,
  MousePointer2,
  Palette,
  RefreshCw,
  Save,
  Type,
  UserSquare,
  type LucideIcon,
} from "lucide-react";
import { SiteSettings } from "@/lib/types";
import { usePreviewSync } from "@/components/admin/PreviewSyncContext";

type ThemeEditorProps = {
  settings: SiteSettings;
  saving: boolean;
  onSave: () => Promise<boolean>;
  updateNested: (path: string, value: unknown) => void;
};

export default function ThemeEditor({
  settings,
  saving,
  onSave,
  updateNested,
}: ThemeEditorProps) {
  const fonts = settings.ui_customization?.fonts || {
    serif: "Playfair Display",
    sans: "Inter",
    base_size: "16px",
    heading_scale: "1.2",
  };

  const navbar = settings.ui_customization?.navbar || {
    height: "80px",
    is_sticky: true,
    background_opacity: "0.8",
    style: "glass",
  };

  const instructors = settings.ui_customization?.instructors || {
    photo_size: "128px",
    photo_shape: "24px",
    show_bio: true,
    card_bg: "#fcfcfc",
  };

  return (
    <div className="max-w-5xl space-y-10">
      <header className="flex items-center justify-between gap-6">
        <div>
          <h3 className="mb-2 text-2xl font-serif font-bold italic text-primary">
            Aesthetic Governance
          </h3>
          <p className="text-sm font-light uppercase tracking-widest text-primary/40">
            Global theme configuration portfolio
          </p>
        </div>
        <button
          type="button"
          onClick={async () => {
            await onSave();
          }}
          disabled={saving}
          className="group flex items-center gap-3 rounded-2xl bg-accent px-8 py-4 font-bold text-primary shadow-premium transition-all hover:bg-white disabled:opacity-50"
        >
          {saving ? (
            <RefreshCw className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4 transition-transform group-hover:scale-110" />
          )}
          {saving ? "Saving draft..." : "Save Theme Draft"}
        </button>
      </header>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <Section icon={Type} title="Typography Engine" previewTarget="home-hero">
          <Field
            label="Serif Font (Headings)"
            value={fonts.serif}
            onChange={(value) => updateNested("ui_customization.fonts.serif", value)}
            placeholder="e.g. Playfair Display"
          />
          <Field
            label="Sans Font (Body)"
            value={fonts.sans}
            onChange={(value) => updateNested("ui_customization.fonts.sans", value)}
            placeholder="e.g. Inter"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Base Size"
              value={fonts.base_size}
              onChange={(value) => updateNested("ui_customization.fonts.base_size", value)}
            />
            <Field
              label="Heading Scale"
              value={fonts.heading_scale}
              onChange={(value) => updateNested("ui_customization.fonts.heading_scale", value)}
            />
          </div>
        </Section>

        <Section icon={Palette} title="Chromatic Spectrum" previewTarget="home-hero">
          <div className="grid grid-cols-2 gap-4">
            <ColorField
              label="Primary Core"
              value={settings.primary_colors.primary}
              onChange={(value) => updateNested("primary_colors.primary", value)}
            />
            <ColorField
              label="Metallic Accent"
              value={settings.primary_colors.accent}
              onChange={(value) => updateNested("primary_colors.accent", value)}
            />
          </div>
          <ColorField
            label="Institutional Background"
            value={settings.primary_colors.background}
            onChange={(value) => updateNested("primary_colors.background", value)}
          />
          <ColorField
            label="Text Luminescence"
            value={settings.primary_colors.text}
            onChange={(value) => updateNested("primary_colors.text", value)}
          />
        </Section>

        <Section icon={Layout} title="Spatial Architecture" previewTarget="site-navbar">
          <Field
            label="Navbar Institutional Height"
            value={navbar.height}
            onChange={(value) => updateNested("ui_customization.navbar.height", value)}
          />
          <div className="space-y-4 border-t border-primary/5 pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/30">
              Navigation Behavior
            </p>
            <select
              value={navbar.style}
              onChange={(event) =>
                updateNested("ui_customization.navbar.style", event.target.value)
              }
              className="w-full rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs font-semibold outline-none focus:border-accent"
            >
              <option value="glass">Glassmorphic (Elite Default)</option>
              <option value="solid">Institutional Solid</option>
              <option value="minimal">Minimalist Floating</option>
            </select>
          </div>
        </Section>

        <Section
          icon={UserSquare}
          title="Faculty Presentation"
          previewTarget="faculty-showcase"
        >
          <Field
            label="Instructor Photo Dimension"
            value={instructors.photo_size}
            onChange={(value) => updateNested("ui_customization.instructors.photo_size", value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="ml-2 text-[10px] font-bold uppercase tracking-widest text-primary/40">
                Frame Geometry
              </label>
              <select
                value={instructors.photo_shape}
                onChange={(event) =>
                  updateNested("ui_customization.instructors.photo_shape", event.target.value)
                }
                className="w-full rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs font-semibold outline-none focus:border-accent"
              >
                <option value="9999px">Orbital (Circle)</option>
                <option value="24px">Soft Institutional (Rounded)</option>
                <option value="0px">Geometric (Square)</option>
              </select>
            </div>
            <ColorField
              label="Card Genesis BG"
              value={instructors.card_bg}
              onChange={(value) => updateNested("ui_customization.instructors.card_bg", value)}
            />
          </div>
        </Section>
      </div>

      <div className="flex items-center justify-between rounded-[40px] border border-primary/5 bg-primary/5 p-10">
        <div className="flex items-center gap-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent/20 text-accent">
            <MousePointer2 className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-lg font-serif font-bold italic text-primary">
              Live Preview Connected
            </h4>
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/40">
              The preview on this page updates while you edit. Save when the draft is ready.
            </p>
          </div>
        </div>
        <p className="text-[10px] font-bold italic text-primary/20">
          &ldquo;Design is the silent ambassador of your institution.&rdquo;
        </p>
      </div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  children,
  previewTarget,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  previewTarget?: string;
}) {
  const { focusPreviewSection } = usePreviewSync();

  const handlePreviewFocus = () => {
    if (previewTarget) {
      focusPreviewSection(previewTarget);
    }
  };

  return (
    <div
      onPointerDownCapture={handlePreviewFocus}
      onFocusCapture={handlePreviewFocus}
      className="space-y-8 rounded-[40px] border border-primary/5 bg-white p-10 shadow-premium"
    >
      <div className="mb-2 flex items-center gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary/30">
          <Icon className="h-5 w-5" />
        </div>
        <h4 className="text-lg font-serif font-bold text-primary">{title}</h4>
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="space-y-2">
      <label className="ml-2 block text-[10px] font-bold uppercase tracking-widest text-primary/40">
        {label}
      </label>
      <input
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-primary/10 bg-primary/5 p-4 text-xs font-semibold outline-none transition-colors focus:border-accent"
      />
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <label className="ml-2 block text-[10px] font-bold uppercase tracking-widest text-primary/40">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-12 w-16 cursor-pointer rounded-xl border-none bg-transparent"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 rounded-xl border border-primary/10 bg-primary/5 px-4 font-mono text-[10px] outline-none focus:border-accent"
        />
      </div>
    </div>
  );
}
