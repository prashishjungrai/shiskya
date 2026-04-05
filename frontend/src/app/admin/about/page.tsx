"use client";

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import PublicPagePreview from "@/components/admin/PublicPagePreview";
import AboutPageView from "@/components/public/AboutPageView";
import LivePreviewPanel from "@/components/admin/LivePreviewPanel";
import {
  EditorPanel,
  PublishingToolbar,
  PublicPreviewLink,
  SaveButton,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/EditorToolkit";
import { PreviewSyncProvider } from "@/components/admin/PreviewSyncContext";
import {
  ABOUT_FONT_FAMILY_OPTIONS,
  ABOUT_FONT_STYLE_OPTIONS,
  ABOUT_FONT_WEIGHT_OPTIONS,
  ABOUT_ICON_OPTIONS,
  normalizeAboutPage,
} from "@/lib/about-page";
import type {
  AboutBadgeStyle,
  AboutButtonStyle,
  AboutPageSettings,
  AboutTextStyle,
} from "@/lib/types";
import useSiteSettingsEditor from "@/lib/use-site-settings-editor";

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function setByPath(target: Record<string, unknown>, path: string, value: unknown) {
  const keys = path.split(".");
  let pointer: Record<string, unknown> = target;

  for (let index = 0; index < keys.length - 1; index += 1) {
    const key = keys[index];
    const nextKey = keys[index + 1];
    const currentValue = pointer[key];

    if (!currentValue || typeof currentValue !== "object") {
      pointer[key] = /^\d+$/.test(nextKey) ? [] : {};
    }

    pointer = pointer[key] as Record<string, unknown>;
  }

  pointer[keys[keys.length - 1]] = value;
}

function ToggleField({
  label,
  checked,
  onChange,
  description,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  description?: string;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-2xl border border-primary/10 bg-primary/[0.03] px-5 py-4">
      <div>
        <p className="text-sm font-semibold text-primary">{label}</p>
        {description ? <p className="mt-1 text-sm text-primary/45">{description}</p> : null}
      </div>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="mt-1 h-5 w-5 rounded accent-black"
      />
    </label>
  );
}

function TypographyFields({
  title,
  value,
  path,
  updateAbout,
}: {
  title: string;
  value: AboutTextStyle;
  path: string;
  updateAbout: (path: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4 rounded-[28px] border border-primary/10 bg-primary/[0.02] p-5">
      <div>
        <h4 className="text-lg font-semibold text-primary">{title}</h4>
        <p className="mt-1 text-sm text-primary/45">
          Control text color, size, family, style, and weight for this element.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <TextField
          label="Font Size"
          value={value.size}
          onChange={(next) => updateAbout(`${path}.size`, next)}
          placeholder="32px"
        />
        <TextField
          label="Text Color"
          value={value.color}
          onChange={(next) => updateAbout(`${path}.color`, next)}
          placeholder="#020617"
        />
        <SelectField
          label="Font Family"
          value={value.font_family}
          onChange={(next) => updateAbout(`${path}.font_family`, next)}
          options={ABOUT_FONT_FAMILY_OPTIONS}
        />
        <SelectField
          label="Font Style"
          value={value.font_style}
          onChange={(next) => updateAbout(`${path}.font_style`, next)}
          options={ABOUT_FONT_STYLE_OPTIONS}
        />
        <SelectField
          label="Font Weight"
          value={value.font_weight}
          onChange={(next) => updateAbout(`${path}.font_weight`, next)}
          options={ABOUT_FONT_WEIGHT_OPTIONS}
        />
      </div>
    </div>
  );
}

function BadgeFields({
  title,
  value,
  path,
  updateAbout,
}: {
  title: string;
  value: AboutBadgeStyle;
  path: string;
  updateAbout: (path: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4 rounded-[28px] border border-primary/10 bg-primary/[0.02] p-5">
      <div>
        <h4 className="text-lg font-semibold text-primary">{title}</h4>
        <p className="mt-1 text-sm text-primary/45">
          Configure badge foreground, background, and border color.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <TextField
          label="Text Color"
          value={value.text_color}
          onChange={(next) => updateAbout(`${path}.text_color`, next)}
          placeholder="rgba(255,255,255,0.78)"
        />
        <TextField
          label="Background"
          value={value.background}
          onChange={(next) => updateAbout(`${path}.background`, next)}
          placeholder="rgba(255,255,255,0.1)"
        />
        <TextField
          label="Border Color"
          value={value.border_color}
          onChange={(next) => updateAbout(`${path}.border_color`, next)}
          placeholder="rgba(255,255,255,0.1)"
        />
      </div>
    </div>
  );
}

function ButtonFields({
  title,
  value,
  path,
  updateAbout,
}: {
  title: string;
  value: AboutButtonStyle;
  path: string;
  updateAbout: (path: string, value: unknown) => void;
}) {
  return (
    <div className="space-y-4 rounded-[28px] border border-primary/10 bg-primary/[0.02] p-5">
      <div>
        <h4 className="text-lg font-semibold text-primary">{title}</h4>
        <p className="mt-1 text-sm text-primary/45">
          Control background, text color, and border color for this button.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <TextField
          label="Background"
          value={value.background}
          onChange={(next) => updateAbout(`${path}.background`, next)}
          placeholder="#ffffff"
        />
        <TextField
          label="Text Color"
          value={value.text_color}
          onChange={(next) => updateAbout(`${path}.text_color`, next)}
          placeholder="#ffffff"
        />
        <TextField
          label="Border Color"
          value={value.border_color}
          onChange={(next) => updateAbout(`${path}.border_color`, next)}
          placeholder="#ffffff"
        />
      </div>
    </div>
  );
}

export default function AboutEditorPage() {
  const {
    settings,
    setSettings,
    loading,
    saving,
    publishing,
    discarding,
    hasUnpublishedChanges,
    lastPublishedAt,
    revisionCount,
    saveSettings,
    publishSettings,
    discardDraft,
  } = useSiteSettingsEditor();

  const replaceAboutPage = (nextAboutPage: AboutPageSettings) => {
    setSettings((current) =>
      current
        ? {
            ...current,
            about_page: nextAboutPage,
            about_content: nextAboutPage.narrative.content,
          }
        : current,
    );
  };

  const updateAbout = (path: string, value: unknown) => {
    setSettings((current) => {
      if (!current) return current;

      const nextAboutPage = clone(
        normalizeAboutPage(current.about_page, current.site_name, current.about_content),
      );
      setByPath(nextAboutPage as unknown as Record<string, unknown>, path, value);

      return {
        ...current,
        about_page: nextAboutPage,
        about_content: nextAboutPage.narrative.content,
      };
    });
  };

  const addPrinciple = () => {
    setSettings((current) => {
      if (!current) return current;

      const nextAboutPage = clone(
        normalizeAboutPage(current.about_page, current.site_name, current.about_content),
      );
      nextAboutPage.principles.items.push({
        id: `principle-${Date.now()}`,
        title: "",
        description: "",
        icon: "shield",
      });

      return { ...current, about_page: nextAboutPage, about_content: nextAboutPage.narrative.content };
    });
  };

  const removePrinciple = (index: number) => {
    setSettings((current) => {
      if (!current) return current;

      const nextAboutPage = clone(
        normalizeAboutPage(current.about_page, current.site_name, current.about_content),
      );
      nextAboutPage.principles.items.splice(index, 1);

      return { ...current, about_page: nextAboutPage, about_content: nextAboutPage.narrative.content };
    });
  };

  const movePrinciple = (index: number, direction: -1 | 1) => {
    setSettings((current) => {
      if (!current) return current;

      const nextAboutPage = clone(
        normalizeAboutPage(current.about_page, current.site_name, current.about_content),
      );
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= nextAboutPage.principles.items.length) {
        return current;
      }

      const [item] = nextAboutPage.principles.items.splice(index, 1);
      nextAboutPage.principles.items.splice(nextIndex, 0, item);

      return { ...current, about_page: nextAboutPage, about_content: nextAboutPage.narrative.content };
    });
  };

  const addStat = () => {
    setSettings((current) => {
      if (!current) return current;

      const nextAboutPage = clone(
        normalizeAboutPage(current.about_page, current.site_name, current.about_content),
      );
      nextAboutPage.stats_band.stats.push({
        id: `stat-${Date.now()}`,
        value: "",
        label: "",
      });
      nextAboutPage.stats = nextAboutPage.stats_band.stats.map((item) => ({
        value: item.value,
        label: item.label,
      }));

      return { ...current, about_page: nextAboutPage, about_content: nextAboutPage.narrative.content };
    });
  };

  const removeStat = (index: number) => {
    setSettings((current) => {
      if (!current) return current;

      const nextAboutPage = clone(
        normalizeAboutPage(current.about_page, current.site_name, current.about_content),
      );
      nextAboutPage.stats_band.stats.splice(index, 1);
      nextAboutPage.stats = nextAboutPage.stats_band.stats.map((item) => ({
        value: item.value,
        label: item.label,
      }));

      return { ...current, about_page: nextAboutPage, about_content: nextAboutPage.narrative.content };
    });
  };

  const moveStat = (index: number, direction: -1 | 1) => {
    setSettings((current) => {
      if (!current) return current;

      const nextAboutPage = clone(
        normalizeAboutPage(current.about_page, current.site_name, current.about_content),
      );
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= nextAboutPage.stats_band.stats.length) {
        return current;
      }

      const [item] = nextAboutPage.stats_band.stats.splice(index, 1);
      nextAboutPage.stats_band.stats.splice(nextIndex, 0, item);
      nextAboutPage.stats = nextAboutPage.stats_band.stats.map((stat) => ({
        value: stat.value,
        label: stat.label,
      }));

      return { ...current, about_page: nextAboutPage, about_content: nextAboutPage.narrative.content };
    });
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const aboutPage = normalizeAboutPage(settings.about_page, settings.site_name, settings.about_content);

  return (
    <PreviewSyncProvider>
      <div className="space-y-10">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/25">
            Public Page Editor
          </p>
          <h2 className="mt-3 text-4xl font-serif font-bold tracking-tight text-primary">
            About Page
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary/45">
            Manage the about page section by section: hero, narrative, mission, vision,
            principles, stats band, and the final conversion block. The live preview uses the same
            public component the user sees.
          </p>
        </div>
        <PublicPreviewLink href="/about" label="Preview about page" />
      </header>

      <PublishingToolbar
        hasUnpublishedChanges={hasUnpublishedChanges}
        lastPublishedAt={lastPublishedAt}
        draftUpdatedAt={settings.updated_at}
        revisionCount={revisionCount}
        publishing={publishing}
        discarding={discarding}
        onPublish={publishSettings}
        onDiscard={discardDraft}
      />

      <div className="grid gap-8 xl:grid-cols-[minmax(25rem,0.95fr)_minmax(42rem,1.05fr)]">
        <form
          className="space-y-8"
          onSubmit={async (event) => {
            event.preventDefault();
            const nextAboutPage = clone(aboutPage);
            nextAboutPage.stats = nextAboutPage.stats_band.stats.map((item) => ({
              value: item.value,
              label: item.label,
            }));
            replaceAboutPage(nextAboutPage);
            await saveSettings({
              successTitle: "About draft updated",
              successDescription:
                "The full about-page structure is saved to draft. Publish when approved.",
            });
          }}
        >
          <EditorPanel
            previewTarget="about-hero"
            title="Visibility"
            description="Turn individual about-page sections on or off without deleting their content."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ToggleField
                label="Hero Section"
                checked={aboutPage.visibility.hero}
                onChange={(next) => updateAbout("visibility.hero", next)}
              />
              <ToggleField
                label="Hero Quote Card"
                checked={aboutPage.visibility.hero_quote_card}
                onChange={(next) => updateAbout("visibility.hero_quote_card", next)}
              />
              <ToggleField
                label="Hero Stats"
                checked={aboutPage.visibility.hero_stats}
                onChange={(next) => updateAbout("visibility.hero_stats", next)}
              />
              <ToggleField
                label="Narrative Section"
                checked={aboutPage.visibility.narrative}
                onChange={(next) => updateAbout("visibility.narrative", next)}
              />
              <ToggleField
                label="Mission Card"
                checked={aboutPage.visibility.mission}
                onChange={(next) => updateAbout("visibility.mission", next)}
              />
              <ToggleField
                label="Vision Card"
                checked={aboutPage.visibility.vision}
                onChange={(next) => updateAbout("visibility.vision", next)}
              />
              <ToggleField
                label="Principles Cards"
                checked={aboutPage.visibility.principles}
                onChange={(next) => updateAbout("visibility.principles", next)}
              />
              <ToggleField
                label="Stats Band"
                checked={aboutPage.visibility.stats_band}
                onChange={(next) => updateAbout("visibility.stats_band", next)}
              />
              <ToggleField
                label="Final CTA"
                checked={aboutPage.visibility.final_cta}
                onChange={(next) => updateAbout("visibility.final_cta", next)}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="about-hero"
            title="Hero"
            description="Control the top badge, main heading, supporting copy, CTA buttons, and the right-side quote card."
          >
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Badge Text"
                  value={aboutPage.hero.badge_text}
                  onChange={(next) => updateAbout("hero.badge_text", next)}
                  placeholder="Institutional story"
                />
                <TextField
                  label="Quote Card Title"
                  value={aboutPage.hero.quote_title}
                  onChange={(next) => updateAbout("hero.quote_title", next)}
                  placeholder={settings.site_name}
                />
              </div>

              <TextAreaField
                label="Hero Heading"
                value={aboutPage.hero.heading}
                onChange={(next) => updateAbout("hero.heading", next)}
                rows={4}
              />
              <TextAreaField
                label="Hero Description"
                value={aboutPage.hero.description}
                onChange={(next) => updateAbout("hero.description", next)}
                rows={4}
              />
              <TextAreaField
                label="Quote Card Body"
                value={aboutPage.hero.quote_body}
                onChange={(next) => updateAbout("hero.quote_body", next)}
                rows={5}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Primary CTA Label"
                  value={aboutPage.hero.primary_cta_label}
                  onChange={(next) => updateAbout("hero.primary_cta_label", next)}
                  placeholder="Speak with admissions"
                />
                <TextField
                  label="Primary CTA Link"
                  value={aboutPage.hero.primary_cta_link}
                  onChange={(next) => updateAbout("hero.primary_cta_link", next)}
                  placeholder="/contact"
                />
                <TextField
                  label="Secondary CTA Label"
                  value={aboutPage.hero.secondary_cta_label}
                  onChange={(next) => updateAbout("hero.secondary_cta_label", next)}
                  placeholder="Explore programs"
                />
                <TextField
                  label="Secondary CTA Link"
                  value={aboutPage.hero.secondary_cta_link}
                  onChange={(next) => updateAbout("hero.secondary_cta_link", next)}
                  placeholder="/courses"
                />
              </div>

              <TextField
                label="Section Background"
                value={aboutPage.hero.style.section_background}
                onChange={(next) => updateAbout("hero.style.section_background", next)}
                placeholder="CSS background value"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Panel Background"
                  value={aboutPage.hero.style.panel_background}
                  onChange={(next) => updateAbout("hero.style.panel_background", next)}
                  placeholder="rgba(255,255,255,0.08)"
                />
                <TextField
                  label="Panel Border"
                  value={aboutPage.hero.style.panel_border_color}
                  onChange={(next) => updateAbout("hero.style.panel_border_color", next)}
                  placeholder="rgba(255,255,255,0.1)"
                />
                <TextField
                  label="Quote Panel Background"
                  value={aboutPage.hero.style.quote_panel_background}
                  onChange={(next) => updateAbout("hero.style.quote_panel_background", next)}
                  placeholder="rgba(0,0,0,0.18)"
                />
                <TextField
                  label="Quote Panel Border"
                  value={aboutPage.hero.style.quote_panel_border_color}
                  onChange={(next) => updateAbout("hero.style.quote_panel_border_color", next)}
                  placeholder="rgba(255,255,255,0.1)"
                />
              </div>

              <BadgeFields
                title="Hero Badge Style"
                value={aboutPage.hero.style.badge}
                path="hero.style.badge"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Hero Heading Style"
                value={aboutPage.hero.style.heading}
                path="hero.style.heading"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Hero Description Style"
                value={aboutPage.hero.style.description}
                path="hero.style.description"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Quote Title Style"
                value={aboutPage.hero.style.quote_title}
                path="hero.style.quote_title"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Quote Body Style"
                value={aboutPage.hero.style.quote_body}
                path="hero.style.quote_body"
                updateAbout={updateAbout}
              />
              <ButtonFields
                title="Primary Hero Button"
                value={aboutPage.hero.style.primary_button}
                path="hero.style.primary_button"
                updateAbout={updateAbout}
              />
              <ButtonFields
                title="Secondary Hero Button"
                value={aboutPage.hero.style.secondary_button}
                path="hero.style.secondary_button"
                updateAbout={updateAbout}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="about-narrative"
            title="Narrative"
            description="This is the main institutional narrative section in the middle of the page."
          >
            <div className="space-y-6">
              <TextField
                label="Narrative Badge"
                value={aboutPage.narrative.badge_text}
                onChange={(next) => updateAbout("narrative.badge_text", next)}
                placeholder="Institutional narrative"
              />
              <TextAreaField
                label="Narrative Heading"
                value={aboutPage.narrative.heading}
                onChange={(next) => updateAbout("narrative.heading", next)}
                rows={4}
              />
              <TextAreaField
                label="Narrative Body"
                value={aboutPage.narrative.content}
                onChange={(next) => updateAbout("narrative.content", next)}
                rows={10}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Panel Background"
                  value={aboutPage.narrative.style.panel_background}
                  onChange={(next) => updateAbout("narrative.style.panel_background", next)}
                  placeholder="#ffffff"
                />
                <TextField
                  label="Panel Border"
                  value={aboutPage.narrative.style.panel_border_color}
                  onChange={(next) => updateAbout("narrative.style.panel_border_color", next)}
                  placeholder="#e2e8f0"
                />
              </div>
              <BadgeFields
                title="Narrative Badge Style"
                value={aboutPage.narrative.style.badge}
                path="narrative.style.badge"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Narrative Heading Style"
                value={aboutPage.narrative.style.heading}
                path="narrative.style.heading"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Narrative Body Style"
                value={aboutPage.narrative.style.body}
                path="narrative.style.body"
                updateAbout={updateAbout}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="about-mission"
            title="Mission and Vision"
            description="Each statement card has editable text, icon selection, and typography styling."
          >
            <div className="space-y-8">
              {[
                { key: "mission" as const, label: "Mission", value: aboutPage.mission },
                { key: "vision" as const, label: "Vision", value: aboutPage.vision },
              ].map((section) => (
                <div key={section.key} className="space-y-6 rounded-[30px] border border-primary/10 bg-primary/[0.02] p-6">
                  <div>
                    <h4 className="text-xl font-semibold text-primary">{section.label} Card</h4>
                    <p className="mt-1 text-sm text-primary/45">
                      Edit title, body, icon, and card styling.
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2">
                    <TextField
                      label={`${section.label} Title`}
                      value={section.value.title}
                      onChange={(next) => updateAbout(`${section.key}.title`, next)}
                      placeholder={section.label === "Mission" ? "Our Mission" : "Our Vision"}
                    />
                    <SelectField
                      label={`${section.label} Icon`}
                      value={section.value.icon}
                      onChange={(next) => updateAbout(`${section.key}.icon`, next)}
                      options={ABOUT_ICON_OPTIONS}
                    />
                  </div>
                  <TextAreaField
                    label={`${section.label} Content`}
                    value={section.value.content}
                    onChange={(next) => updateAbout(`${section.key}.content`, next)}
                    rows={5}
                  />
                  <div className="grid gap-4 md:grid-cols-3">
                    <TextField
                      label="Panel Background"
                      value={section.value.style.panel_background}
                      onChange={(next) => updateAbout(`${section.key}.style.panel_background`, next)}
                      placeholder="#ffffff"
                    />
                    <TextField
                      label="Panel Border"
                      value={section.value.style.panel_border_color}
                      onChange={(next) => updateAbout(`${section.key}.style.panel_border_color`, next)}
                      placeholder="#e2e8f0"
                    />
                    <TextField
                      label="Icon Background"
                      value={section.value.style.icon_background}
                      onChange={(next) => updateAbout(`${section.key}.style.icon_background`, next)}
                      placeholder="linear-gradient(...)"
                    />
                  </div>
                  <TypographyFields
                    title={`${section.label} Heading Style`}
                    value={section.value.style.heading}
                    path={`${section.key}.style.heading`}
                    updateAbout={updateAbout}
                  />
                  <TypographyFields
                    title={`${section.label} Body Style`}
                    value={section.value.style.body}
                    path={`${section.key}.style.body`}
                    updateAbout={updateAbout}
                  />
                </div>
              ))}
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="about-principles"
            title="Principles"
            description="These cards cover ideas like Clarity over noise and Outcome orientation. Add, reorder, or remove them as needed."
            action={
              <button
                type="button"
                onClick={addPrinciple}
                className="inline-flex items-center gap-2 rounded-full border border-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary transition hover:border-primary/20 hover:bg-primary hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Principle
              </button>
            }
          >
            <div className="space-y-6">
              {aboutPage.principles.items.map((item, index) => (
                <div key={item.id} className="space-y-6 rounded-[30px] border border-primary/10 bg-primary/[0.02] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <h4 className="text-lg font-semibold text-primary">Principle {index + 1}</h4>
                      <p className="mt-1 text-sm text-primary/45">
                        Manage the card title, description, and icon.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => movePrinciple(index, -1)}
                        disabled={index === 0}
                        className="rounded-xl border border-primary/10 p-2 text-primary transition hover:bg-primary hover:text-white disabled:opacity-40"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePrinciple(index, 1)}
                        disabled={index === aboutPage.principles.items.length - 1}
                        className="rounded-xl border border-primary/10 p-2 text-primary transition hover:bg-primary hover:text-white disabled:opacity-40"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePrinciple(index)}
                        className="rounded-xl border border-red-200 p-2 text-red-500 transition hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <TextField
                      label="Card Title"
                      value={item.title}
                      onChange={(next) => updateAbout(`principles.items.${index}.title`, next)}
                      placeholder="Clarity over noise"
                    />
                    <SelectField
                      label="Card Icon"
                      value={item.icon}
                      onChange={(next) => updateAbout(`principles.items.${index}.icon`, next)}
                      options={ABOUT_ICON_OPTIONS}
                    />
                  </div>
                  <TextAreaField
                    label="Card Description"
                    value={item.description}
                    onChange={(next) => updateAbout(`principles.items.${index}.description`, next)}
                    rows={4}
                  />
                </div>
              ))}

              <div className="grid gap-4 md:grid-cols-3">
                <TextField
                  label="Card Background"
                  value={aboutPage.principles.style.panel_background}
                  onChange={(next) => updateAbout("principles.style.panel_background", next)}
                  placeholder="#ffffff"
                />
                <TextField
                  label="Card Border"
                  value={aboutPage.principles.style.panel_border_color}
                  onChange={(next) => updateAbout("principles.style.panel_border_color", next)}
                  placeholder="#e2e8f0"
                />
                <TextField
                  label="Icon Background"
                  value={aboutPage.principles.style.icon_background}
                  onChange={(next) => updateAbout("principles.style.icon_background", next)}
                  placeholder="linear-gradient(...)"
                />
              </div>

              <TypographyFields
                title="Principle Heading Style"
                value={aboutPage.principles.style.heading}
                path="principles.style.heading"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Principle Body Style"
                value={aboutPage.principles.style.body}
                path="principles.style.body"
                updateAbout={updateAbout}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="about-stats-band"
            title="Stats Band"
            description="Control the momentum section badge, heading, paragraph, and each stat card."
            action={
              <button
                type="button"
                onClick={addStat}
                className="inline-flex items-center gap-2 rounded-full border border-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary transition hover:border-primary/20 hover:bg-primary hover:text-white"
              >
                <Plus className="h-3.5 w-3.5" />
                Add Stat
              </button>
            }
          >
            <div className="space-y-6">
              <TextField
                label="Badge Text"
                value={aboutPage.stats_band.badge_text}
                onChange={(next) => updateAbout("stats_band.badge_text", next)}
                placeholder="Institutional momentum"
              />
              <TextAreaField
                label="Heading"
                value={aboutPage.stats_band.heading}
                onChange={(next) => updateAbout("stats_band.heading", next)}
                rows={4}
              />
              <TextAreaField
                label="Description"
                value={aboutPage.stats_band.description}
                onChange={(next) => updateAbout("stats_band.description", next)}
                rows={4}
              />
              <TextField
                label="Section Background"
                value={aboutPage.stats_band.style.section_background}
                onChange={(next) => updateAbout("stats_band.style.section_background", next)}
                placeholder="linear-gradient(...)"
              />

              {aboutPage.stats_band.stats.map((stat, index) => (
                <div key={stat.id} className="space-y-4 rounded-[30px] border border-primary/10 bg-primary/[0.02] p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h4 className="text-lg font-semibold text-primary">Stat {index + 1}</h4>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => moveStat(index, -1)}
                        disabled={index === 0}
                        className="rounded-xl border border-primary/10 p-2 text-primary transition hover:bg-primary hover:text-white disabled:opacity-40"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStat(index, 1)}
                        disabled={index === aboutPage.stats_band.stats.length - 1}
                        className="rounded-xl border border-primary/10 p-2 text-primary transition hover:bg-primary hover:text-white disabled:opacity-40"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeStat(index)}
                        className="rounded-xl border border-red-200 p-2 text-red-500 transition hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="grid gap-4 md:grid-cols-[12rem_1fr]">
                    <TextField
                      label="Value"
                      value={stat.value}
                      onChange={(next) => updateAbout(`stats_band.stats.${index}.value`, next)}
                      placeholder="10+"
                    />
                    <TextField
                      label="Label"
                      value={stat.label}
                      onChange={(next) => updateAbout(`stats_band.stats.${index}.label`, next)}
                      placeholder="Years of Excellence"
                    />
                  </div>
                </div>
              ))}

              <BadgeFields
                title="Stats Badge Style"
                value={aboutPage.stats_band.style.badge}
                path="stats_band.style.badge"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Stats Heading Style"
                value={aboutPage.stats_band.style.heading}
                path="stats_band.style.heading"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Stats Description Style"
                value={aboutPage.stats_band.style.body}
                path="stats_band.style.body"
                updateAbout={updateAbout}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Stat Card Background"
                  value={aboutPage.stats_band.style.stat_panel_background}
                  onChange={(next) => updateAbout("stats_band.style.stat_panel_background", next)}
                  placeholder="rgba(255,255,255,0.1)"
                />
                <TextField
                  label="Stat Card Border"
                  value={aboutPage.stats_band.style.stat_panel_border_color}
                  onChange={(next) => updateAbout("stats_band.style.stat_panel_border_color", next)}
                  placeholder="rgba(255,255,255,0.1)"
                />
              </div>
              <TypographyFields
                title="Stat Value Style"
                value={aboutPage.stats_band.style.stat_value}
                path="stats_band.style.stat_value"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Stat Label Style"
                value={aboutPage.stats_band.style.stat_label}
                path="stats_band.style.stat_label"
                updateAbout={updateAbout}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="about-final-cta"
            title="Final CTA"
            description="Manage the closing badge, heading, supporting copy, and both conversion buttons."
          >
            <div className="space-y-6">
              <TextField
                label="Badge Text"
                value={aboutPage.final_cta.badge_text}
                onChange={(next) => updateAbout("final_cta.badge_text", next)}
                placeholder="Ready to move?"
              />
              <TextAreaField
                label="CTA Heading"
                value={aboutPage.final_cta.heading}
                onChange={(next) => updateAbout("final_cta.heading", next)}
                rows={4}
              />
              <TextAreaField
                label="CTA Description"
                value={aboutPage.final_cta.description}
                onChange={(next) => updateAbout("final_cta.description", next)}
                rows={4}
              />
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Primary CTA Label"
                  value={aboutPage.final_cta.primary_cta_label}
                  onChange={(next) => updateAbout("final_cta.primary_cta_label", next)}
                  placeholder="Explore programs"
                />
                <TextField
                  label="Primary CTA Link"
                  value={aboutPage.final_cta.primary_cta_link}
                  onChange={(next) => updateAbout("final_cta.primary_cta_link", next)}
                  placeholder="/courses"
                />
                <TextField
                  label="Secondary CTA Label"
                  value={aboutPage.final_cta.secondary_cta_label}
                  onChange={(next) => updateAbout("final_cta.secondary_cta_label", next)}
                  placeholder="Contact admissions"
                />
                <TextField
                  label="Secondary CTA Link"
                  value={aboutPage.final_cta.secondary_cta_link}
                  onChange={(next) => updateAbout("final_cta.secondary_cta_link", next)}
                  placeholder="/contact"
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Panel Background"
                  value={aboutPage.final_cta.style.panel_background}
                  onChange={(next) => updateAbout("final_cta.style.panel_background", next)}
                  placeholder="#ffffff"
                />
                <TextField
                  label="Panel Border"
                  value={aboutPage.final_cta.style.panel_border_color}
                  onChange={(next) => updateAbout("final_cta.style.panel_border_color", next)}
                  placeholder="#e2e8f0"
                />
              </div>
              <BadgeFields
                title="Final CTA Badge Style"
                value={aboutPage.final_cta.style.badge}
                path="final_cta.style.badge"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Final CTA Heading Style"
                value={aboutPage.final_cta.style.heading}
                path="final_cta.style.heading"
                updateAbout={updateAbout}
              />
              <TypographyFields
                title="Final CTA Body Style"
                value={aboutPage.final_cta.style.body}
                path="final_cta.style.body"
                updateAbout={updateAbout}
              />
              <ButtonFields
                title="Primary Final CTA Button"
                value={aboutPage.final_cta.style.primary_button}
                path="final_cta.style.primary_button"
                updateAbout={updateAbout}
              />
              <ButtonFields
                title="Secondary Final CTA Button"
                value={aboutPage.final_cta.style.secondary_button}
                path="final_cta.style.secondary_button"
                updateAbout={updateAbout}
              />
            </div>
          </EditorPanel>

          <div className="flex justify-end">
            <SaveButton saving={saving} label="Save about draft" />
          </div>
        </form>

        <div className="xl:sticky xl:top-24 xl:self-start">
          <LivePreviewPanel title="About Page Preview" previewType="page">
            <PublicPagePreview settings={settings} pathname="/about">
              <AboutPageView settings={settings} interactive={false} />
            </PublicPagePreview>
          </LivePreviewPanel>
        </div>
      </div>
      </div>
    </PreviewSyncProvider>
  );
}
