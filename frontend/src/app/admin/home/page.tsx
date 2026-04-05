"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  BellRing,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  MessageSquare,
  Plus,
  Trash2,
  Users,
} from "lucide-react";
import HomepagePreview from "@/components/admin/HomepagePreview";
import LivePreviewPanel from "@/components/admin/LivePreviewPanel";
import ImageUpload from "@/components/ImageUpload";
import {
  EditorPanel,
  PublishingToolbar,
  PublicPreviewLink,
  SaveButton,
  SelectField,
  ShortcutCard,
  TextAreaField,
  TextField,
} from "@/components/admin/EditorToolkit";
import { PreviewSyncProvider, usePreviewSync } from "@/components/admin/PreviewSyncContext";
import api from "@/lib/api";
import {
  HOME_FONT_FAMILY_OPTIONS,
  HOME_FONT_STYLE_OPTIONS,
  HOME_FONT_WEIGHT_OPTIONS,
  HOME_ICON_OPTIONS,
  HOME_METRIC_SOURCE_OPTIONS,
  normalizeHomePage,
} from "@/lib/home-page";
import useSiteSettingsEditor from "@/lib/use-site-settings-editor";
import type {
  Banner,
  Course,
  HomeBadgeStyle,
  HomeButtonStyle,
  HomeMetricCard,
  HomePageSettings,
  HomeQuickActionItem,
  HomeTextStyle,
  Notice,
  Teacher,
  Testimonial,
} from "@/lib/types";

type HomeMetrics = {
  banners: { total: number; live: number };
  courses: { total: number; live: number };
  teachers: { total: number; live: number };
  testimonials: { total: number; live: number };
  notices: { total: number; live: number };
};

const emptyMetrics: HomeMetrics = {
  banners: { total: 0, live: 0 },
  courses: { total: 0, live: 0 },
  teachers: { total: 0, live: 0 },
  testimonials: { total: 0, live: 0 },
  notices: { total: 0, live: 0 },
};

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

function getByPath(target: Record<string, unknown>, path: string) {
  return path.split(".").reduce<unknown>((value, key) => {
    if (value === null || value === undefined) return undefined;
    if (Array.isArray(value) && /^\d+$/.test(key)) {
      return value[Number(key)];
    }
    if (typeof value === "object") {
      return (value as Record<string, unknown>)[key];
    }
    return undefined;
  }, target);
}

function legacyHeroFromHomePage(homePage: HomePageSettings) {
  return {
    title: homePage.hero.title,
    subtitle: homePage.hero.description,
    cta_text: homePage.hero.primary_cta_label,
    cta_link: homePage.hero.primary_cta_link,
    background_image: homePage.hero.background_image,
  };
}

function createMetricCard(
  idPrefix: string,
  defaults: Partial<HomeMetricCard> = {},
): HomeMetricCard {
  return {
    id: `${idPrefix}-${Date.now()}`,
    label: "",
    description: "",
    icon: "star",
    source: "courses_count",
    prefix: "",
    suffix: "",
    fallback_value: "",
    ...defaults,
  };
}

function createQuickAction(): HomeQuickActionItem {
  return {
    id: `quick-action-${Date.now()}`,
    title: "",
    description: "",
    href: "#course-explorer",
    meta: "",
  };
}

function ToggleField({
  label,
  checked,
  onChange,
  description,
  previewTarget,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
  description?: string;
  previewTarget?: string;
}) {
  const { focusPreviewSection } = usePreviewSync();

  const handlePreviewFocus = () => {
    if (previewTarget) {
      focusPreviewSection(previewTarget);
    }
  };

  return (
    <label
      onPointerDownCapture={handlePreviewFocus}
      onFocusCapture={handlePreviewFocus}
      className="flex items-start justify-between gap-4 rounded-2xl border border-primary/10 bg-primary/[0.03] px-5 py-4"
    >
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
  updateHome,
  previewTarget,
}: {
  title: string;
  value: HomeTextStyle;
  path: string;
  updateHome: (path: string, value: unknown) => void;
  previewTarget?: string;
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
          onChange={(next) => updateHome(`${path}.size`, next)}
          placeholder="32px"
          previewTarget={previewTarget}
        />
        <TextField
          label="Text Color"
          value={value.color}
          onChange={(next) => updateHome(`${path}.color`, next)}
          placeholder="#020617"
          previewTarget={previewTarget}
        />
        <SelectField
          label="Font Family"
          value={value.font_family}
          onChange={(next) => updateHome(`${path}.font_family`, next)}
          options={HOME_FONT_FAMILY_OPTIONS}
          previewTarget={previewTarget}
        />
        <SelectField
          label="Font Style"
          value={value.font_style}
          onChange={(next) => updateHome(`${path}.font_style`, next)}
          options={HOME_FONT_STYLE_OPTIONS}
          previewTarget={previewTarget}
        />
        <SelectField
          label="Font Weight"
          value={value.font_weight}
          onChange={(next) => updateHome(`${path}.font_weight`, next)}
          options={HOME_FONT_WEIGHT_OPTIONS}
          previewTarget={previewTarget}
        />
      </div>
    </div>
  );
}

function BadgeFields({
  title,
  value,
  path,
  updateHome,
  previewTarget,
}: {
  title: string;
  value: HomeBadgeStyle;
  path: string;
  updateHome: (path: string, value: unknown) => void;
  previewTarget?: string;
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
          onChange={(next) => updateHome(`${path}.text_color`, next)}
          placeholder="#ffffff"
          previewTarget={previewTarget}
        />
        <TextField
          label="Background"
          value={value.background}
          onChange={(next) => updateHome(`${path}.background`, next)}
          placeholder="rgba(255,255,255,0.1)"
          previewTarget={previewTarget}
        />
        <TextField
          label="Border Color"
          value={value.border_color}
          onChange={(next) => updateHome(`${path}.border_color`, next)}
          placeholder="rgba(255,255,255,0.1)"
          previewTarget={previewTarget}
        />
      </div>
    </div>
  );
}

function ButtonFields({
  title,
  value,
  path,
  updateHome,
  previewTarget,
}: {
  title: string;
  value: HomeButtonStyle;
  path: string;
  updateHome: (path: string, value: unknown) => void;
  previewTarget?: string;
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
          onChange={(next) => updateHome(`${path}.background`, next)}
          placeholder="#ffffff"
          previewTarget={previewTarget}
        />
        <TextField
          label="Text Color"
          value={value.text_color}
          onChange={(next) => updateHome(`${path}.text_color`, next)}
          placeholder="#020617"
          previewTarget={previewTarget}
        />
        <TextField
          label="Border Color"
          value={value.border_color}
          onChange={(next) => updateHome(`${path}.border_color`, next)}
          placeholder="#ffffff"
          previewTarget={previewTarget}
        />
      </div>
    </div>
  );
}

function QuickActionsEditor({
  items,
  path,
  updateHome,
  addItem,
  removeItem,
  moveItem,
  previewTarget,
}: {
  items: HomeQuickActionItem[];
  path: string;
  updateHome: (path: string, value: unknown) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  moveItem: (index: number, direction: -1 | 1) => void;
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
      className="space-y-5 rounded-[30px] border border-primary/10 bg-primary/[0.02] p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-semibold text-primary">Quick Actions</h4>
          <p className="mt-1 text-sm text-primary/45">
            These items appear in search-open state before the user starts typing.
          </p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-full border border-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/[0.04]"
        >
          <Plus className="h-4 w-4" /> Add action
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="space-y-5 rounded-[26px] border border-primary/10 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">Action {index + 1}</p>
                <p className="mt-1 text-xs text-primary/40">
                  Used by the homepage command menu.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="rounded-full border border-primary/10 p-2 text-primary transition-colors hover:bg-primary/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move action up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="rounded-full border border-primary/10 p-2 text-primary transition-colors hover:bg-primary/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move action down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="rounded-full border border-primary/10 p-2 text-primary transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove action"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Title"
                value={item.title}
                onChange={(next) => updateHome(`${path}.${index}.title`, next)}
                placeholder="Browse every program"
              />
              <TextField
                label="Meta"
                value={item.meta}
                onChange={(next) => updateHome(`${path}.${index}.meta`, next)}
                placeholder="Catalogue"
              />
              <TextField
                label="Target Link"
                value={item.href}
                onChange={(next) => updateHome(`${path}.${index}.href`, next)}
                placeholder="#course-explorer"
              />
            </div>
            <TextAreaField
              label="Description"
              value={item.description}
              onChange={(next) => updateHome(`${path}.${index}.description`, next)}
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function MetricCardsEditor({
  title,
  description,
  items,
  path,
  updateHome,
  addItem,
  removeItem,
  moveItem,
  previewTarget,
}: {
  title: string;
  description: string;
  items: HomeMetricCard[];
  path: string;
  updateHome: (path: string, value: unknown) => void;
  addItem: () => void;
  removeItem: (index: number) => void;
  moveItem: (index: number, direction: -1 | 1) => void;
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
      className="space-y-5 rounded-[30px] border border-primary/10 bg-primary/[0.02] p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h4 className="text-xl font-semibold text-primary">{title}</h4>
          <p className="mt-1 text-sm text-primary/45">{description}</p>
        </div>
        <button
          type="button"
          onClick={addItem}
          className="inline-flex items-center gap-2 rounded-full border border-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary/[0.04]"
        >
          <Plus className="h-4 w-4" /> Add card
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="space-y-5 rounded-[26px] border border-primary/10 bg-white p-5"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-primary">{title} {index + 1}</p>
                <p className="mt-1 text-xs text-primary/40">
                  Configure icon, source, fallback, and text for this card.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => moveItem(index, -1)}
                  disabled={index === 0}
                  className="rounded-full border border-primary/10 p-2 text-primary transition-colors hover:bg-primary/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move card up"
                >
                  <ChevronUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => moveItem(index, 1)}
                  disabled={index === items.length - 1}
                  className="rounded-full border border-primary/10 p-2 text-primary transition-colors hover:bg-primary/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move card down"
                >
                  <ChevronDown className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="rounded-full border border-primary/10 p-2 text-primary transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                  aria-label="Remove card"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <TextField
                label="Label"
                value={item.label}
                onChange={(next) => updateHome(`${path}.${index}.label`, next)}
                placeholder="Programs"
              />
              <SelectField
                label="Icon"
                value={item.icon}
                onChange={(next) => updateHome(`${path}.${index}.icon`, next)}
                options={HOME_ICON_OPTIONS}
              />
              <SelectField
                label="Data Source"
                value={item.source}
                onChange={(next) => updateHome(`${path}.${index}.source`, next)}
                options={HOME_METRIC_SOURCE_OPTIONS}
              />
              <TextField
                label="Fallback Value"
                value={item.fallback_value}
                onChange={(next) => updateHome(`${path}.${index}.fallback_value`, next)}
                placeholder="0"
              />
              <TextField
                label="Prefix"
                value={item.prefix}
                onChange={(next) => updateHome(`${path}.${index}.prefix`, next)}
                placeholder=""
              />
              <TextField
                label="Suffix"
                value={item.suffix}
                onChange={(next) => updateHome(`${path}.${index}.suffix`, next)}
                placeholder="+"
              />
            </div>
            <TextAreaField
              label="Description"
              value={item.description}
              onChange={(next) => updateHome(`${path}.${index}.description`, next)}
              rows={3}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function HomeEditorGroup({
  title,
  description,
  children,
  defaultOpen = false,
  tone = "default",
  previewTarget,
}: {
  title: string;
  description: string;
  children: ReactNode;
  defaultOpen?: boolean;
  tone?: "default" | "advanced";
  previewTarget?: string;
}) {
  const [open, setOpen] = useState(defaultOpen);
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
      className={`rounded-[30px] border ${
        tone === "advanced"
          ? "border-dashed border-primary/12 bg-primary/[0.015]"
          : "border-primary/10 bg-primary/[0.02]"
      } p-6`}
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-xl font-semibold text-primary">{title}</h4>
            <span
              className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${
                tone === "advanced"
                  ? "border border-primary/10 bg-white text-primary/55"
                  : "bg-primary text-white"
              }`}
            >
              {tone === "advanced" ? "Advanced" : "Essential"}
            </span>
          </div>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary/45">{description}</p>
        </div>
        <span className="rounded-full border border-primary/10 bg-white p-2 text-primary/55">
          {open ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </span>
      </button>

      {open ? <div className="mt-6 border-t border-primary/8 pt-6">{children}</div> : null}
    </div>
  );
}

export default function HomeEditorPage() {
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
  const [metrics, setMetrics] = useState<HomeMetrics>(emptyMetrics);
  const [previewBanners, setPreviewBanners] = useState<Banner[]>([]);
  const [previewCourses, setPreviewCourses] = useState<Course[]>([]);
  const [previewTeachers, setPreviewTeachers] = useState<Teacher[]>([]);
  const [previewTestimonials, setPreviewTestimonials] = useState<Testimonial[]>([]);

  const homePage = useMemo(
    () => normalizeHomePage(settings?.home_page, settings?.hero_section),
    [settings?.hero_section, settings?.home_page],
  );

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const [banners, courses, teachers, testimonials, notices] = await Promise.all([
          api.get("/admin/banners"),
          api.get("/admin/courses"),
          api.get("/admin/teachers"),
          api.get("/admin/testimonials"),
          api.get("/admin/notices"),
        ]);

        const bannerItems = banners.data as Banner[];
        const courseItems = courses.data as Course[];
        const teacherItems = teachers.data as Teacher[];
        const testimonialItems = testimonials.data as Testimonial[];
        const noticeItems = notices.data as Notice[];

        setPreviewBanners(bannerItems.filter((item) => item.is_active));
        setPreviewCourses(courseItems.filter((item) => item.is_active));
        setPreviewTeachers(teacherItems.filter((item) => item.is_active));
        setPreviewTestimonials(testimonialItems.filter((item) => item.is_active));

        setMetrics({
          banners: {
            total: bannerItems.length,
            live: bannerItems.filter((item) => item.is_active).length,
          },
          courses: {
            total: courseItems.length,
            live: courseItems.filter((item) => item.is_active).length,
          },
          teachers: {
            total: teacherItems.length,
            live: teacherItems.filter((item) => item.is_active).length,
          },
          testimonials: {
            total: testimonialItems.length,
            live: testimonialItems.filter((item) => item.is_active).length,
          },
          notices: {
            total: noticeItems.length,
            live: noticeItems.filter((item) => item.is_active).length,
          },
        });
      } catch (error) {
        console.error("Failed to load homepage metrics", error);
      }
    };

    void loadMetrics();
  }, []);

  const replaceHomePage = (nextHomePage: HomePageSettings) => {
    setSettings((current) =>
      current
        ? {
            ...current,
            home_page: nextHomePage,
            hero_section: legacyHeroFromHomePage(nextHomePage),
          }
        : current,
    );
  };

  const updateHome = (path: string, value: unknown) => {
    setSettings((current) => {
      if (!current) return current;

      const nextHomePage = clone(normalizeHomePage(current.home_page, current.hero_section));
      setByPath(nextHomePage as unknown as Record<string, unknown>, path, value);

      return {
        ...current,
        home_page: nextHomePage,
        hero_section: legacyHeroFromHomePage(nextHomePage),
      };
    });
  };

  const updateCollection = (path: string, mutate: (items: unknown[]) => void) => {
    setSettings((current) => {
      if (!current) return current;

      const nextHomePage = clone(normalizeHomePage(current.home_page, current.hero_section));
      const collection = getByPath(nextHomePage as unknown as Record<string, unknown>, path);

      if (!Array.isArray(collection)) {
        return current;
      }

      mutate(collection);

      return {
        ...current,
        home_page: nextHomePage,
        hero_section: legacyHeroFromHomePage(nextHomePage),
      };
    });
  };

  const addMetricCard = (path: string, defaults: Partial<HomeMetricCard> = {}) => {
    updateCollection(path, (items) => {
      items.push(createMetricCard(path.replace(/\./g, "-"), defaults));
    });
  };

  const removeCollectionItem = (path: string, index: number) => {
    updateCollection(path, (items) => {
      items.splice(index, 1);
    });
  };

  const moveCollectionItem = (path: string, index: number, direction: -1 | 1) => {
    updateCollection(path, (items) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= items.length) {
        return;
      }

      const [item] = items.splice(index, 1);
      items.splice(nextIndex, 0, item);
    });
  };

  const addQuickAction = () => {
    updateCollection("command_bar.quick_actions", (items) => {
      items.push(createQuickAction());
    });
  };

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return (
    <PreviewSyncProvider>
      <div className="space-y-10">
      <header className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/25">
            Public Page Editor
          </p>
          <h2 className="mt-3 text-4xl font-serif font-bold tracking-tight text-primary">
            Home Page
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary/45">
            Control the homepage section by section: command bar, hero, metrics rail, program
            explorer, faculty, proof, and final CTA. The preview uses the same public homepage
            component the user sees.
          </p>
        </div>
        <PublicPreviewLink href="/" label="Preview homepage" />
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

      <div className="grid gap-8 xl:grid-cols-[minmax(26rem,0.95fr)_minmax(42rem,1.05fr)]">
        <form
          className="space-y-8"
          onSubmit={async (event) => {
            event.preventDefault();
            replaceHomePage(homePage);
            await saveSettings({
              successTitle: "Homepage draft updated",
              successDescription:
                "The homepage structure and styling are saved to draft. Publish when approved.",
            });
          }}
        >
          <EditorPanel
            previewTarget="home-hero"
            title="Visibility"
            description="Turn homepage sections on or off without deleting their content."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ToggleField
                label="Search Strip"
                checked={homePage.visibility.command_bar}
                onChange={(next) => updateHome("visibility.command_bar", next)}
                description="Show the admissions and universal search strip at the top."
                previewTarget="home-command-bar|home-hero"
              />
              <ToggleField
                label="Hero Copy"
                checked={homePage.visibility.hero}
                onChange={(next) => updateHome("visibility.hero", next)}
                description="Main headline, description, and action buttons."
                previewTarget="home-hero-copy|home-hero"
              />
              <ToggleField
                label="Trust Line"
                checked={homePage.visibility.hero_social_proof}
                onChange={(next) => updateHome("visibility.hero_social_proof", next)}
                description="The short proof message beneath the hero actions."
                previewTarget="home-hero-trust|home-hero-copy|home-hero"
              />
              <ToggleField
                label="Hero Image Frame"
                checked={homePage.visibility.hero_snapshot}
                onChange={(next) => updateHome("visibility.hero_snapshot", next)}
                description="The visual side of the hero with image and overlay cards."
                previewTarget="home-hero-visual|home-hero"
              />
              <ToggleField
                label="Banner Selector"
                checked={homePage.visibility.hero_banner_tabs}
                onChange={(next) => updateHome("visibility.hero_banner_tabs", next)}
                description="The small banner navigation tabs inside the hero."
                previewTarget="home-hero-tabs|home-hero-visual|home-hero"
              />
              <ToggleField
                label="Metrics Rail"
                checked={homePage.visibility.metrics_rail}
                onChange={(next) => updateHome("visibility.metrics_rail", next)}
                description="The proof cards immediately below the hero."
                previewTarget="home-metrics-rail|home-hero"
              />
              <ToggleField
                label="Programs Section"
                checked={homePage.visibility.course_explorer}
                onChange={(next) => updateHome("visibility.course_explorer", next)}
                description="Featured course explorer and program cards."
                previewTarget="course-explorer|home-metrics-rail"
              />
              <ToggleField
                label="Faculty Section"
                checked={homePage.visibility.faculty_showcase}
                onChange={(next) => updateHome("visibility.faculty_showcase", next)}
                description="Mentor-led learning and teacher showcase."
                previewTarget="faculty-showcase|course-explorer"
              />
              <ToggleField
                label="Student Stories"
                checked={homePage.visibility.proof_section}
                onChange={(next) => updateHome("visibility.proof_section", next)}
                description="Testimonials and trust-based proof section."
                previewTarget="student-proof|faculty-showcase"
              />
              <ToggleField
                label="Final Action Band"
                checked={homePage.visibility.cta_section}
                onChange={(next) => updateHome("visibility.cta_section", next)}
                description="Closing admission call-to-action block."
                previewTarget="home-final-cta|student-proof"
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="home-command-bar|home-hero"
            title="Command Bar"
            description="Configure the top universal-search strip, its helper text, and the quick actions shown before search results."
          >
            <div className="space-y-6">
              <HomeEditorGroup
                title="Content"
                description="Edit the search strip copy and the fast-response call to action. Low-value technical labels are hidden from the main editing flow."
                defaultOpen
                previewTarget="home-command-search|home-command-bar|home-hero"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <TextField
                    label="Admissions Label"
                    value={homePage.command_bar.admissions_label}
                    onChange={(next) => updateHome("command_bar.admissions_label", next)}
                    placeholder="Admissions Desk"
                    previewTarget="home-command-hotline|home-command-bar|home-hero"
                  />
                  <TextField
                    label="Search Label"
                    value={homePage.command_bar.search_label}
                    onChange={(next) => updateHome("command_bar.search_label", next)}
                    placeholder="Universal Search"
                    previewTarget="home-command-search|home-command-bar|home-hero"
                  />
                  <TextField
                    label="Search Placeholder"
                    value={homePage.command_bar.search_placeholder}
                    onChange={(next) => updateHome("command_bar.search_placeholder", next)}
                    placeholder="Search programs, mentors, outcomes..."
                    previewTarget="home-command-search|home-command-bar|home-hero"
                  />
                  <TextField
                    label="Quick Jump Label"
                    value={homePage.command_bar.quick_jump_label}
                    onChange={(next) => updateHome("command_bar.quick_jump_label", next)}
                    placeholder="Quick jumps and trending categories"
                    previewTarget="home-command-results|home-command-search|home-command-bar|home-hero"
                  />
                  <TextField
                    label="Fast Response Label"
                    value={homePage.command_bar.fast_response_label}
                    onChange={(next) => updateHome("command_bar.fast_response_label", next)}
                    placeholder="Fast Response"
                    previewTarget="home-command-fast-response|home-command-bar|home-hero"
                  />
                  <TextField
                    label="Fast Response Button"
                    value={homePage.command_bar.fast_response_button_label}
                    onChange={(next) =>
                      updateHome("command_bar.fast_response_button_label", next)
                    }
                    placeholder="Send Inquiry"
                    previewTarget="home-command-fast-response|home-command-bar|home-hero"
                  />
                  <TextField
                    label="Fast Response Link"
                    value={homePage.command_bar.fast_response_button_link}
                    onChange={(next) =>
                      updateHome("command_bar.fast_response_button_link", next)
                    }
                    placeholder="/contact"
                    previewTarget="home-command-fast-response|home-command-bar|home-hero"
                  />
                </div>

                <div className="mt-6 grid gap-6">
                  <TextAreaField
                    label="Fast Response Description"
                    value={homePage.command_bar.fast_response_description}
                    onChange={(next) => updateHome("command_bar.fast_response_description", next)}
                    rows={4}
                    previewTarget="home-command-fast-response|home-command-bar|home-hero"
                  />
                </div>
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Quick Actions"
                description="Manage the command links shown when the search strip is opened."
                defaultOpen
                previewTarget="home-command-results|home-command-search|home-command-bar|home-hero"
              >
                <QuickActionsEditor
                  items={homePage.command_bar.quick_actions}
                  path="command_bar.quick_actions"
                  updateHome={updateHome}
                  addItem={addQuickAction}
                  removeItem={(index) => removeCollectionItem("command_bar.quick_actions", index)}
                  moveItem={(index, direction) =>
                    moveCollectionItem("command_bar.quick_actions", index, direction)
                  }
                  previewTarget="home-command-results|home-command-search|home-command-bar|home-hero"
                />
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Advanced Style"
                description="Use this only when the search strip needs visual adjustment. Routine copy editing should not require these controls."
                tone="advanced"
                previewTarget="home-command-bar|home-hero"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Strip Background"
                    value={homePage.command_bar.style.panel_background}
                    onChange={(next) => updateHome("command_bar.style.panel_background", next)}
                    placeholder="rgba(255,255,255,0.08)"
                    previewTarget="home-command-bar|home-hero"
                  />
                  <TextField
                    label="Strip Border"
                    value={homePage.command_bar.style.panel_border_color}
                    onChange={(next) => updateHome("command_bar.style.panel_border_color", next)}
                    placeholder="rgba(255,255,255,0.10)"
                    previewTarget="home-command-bar|home-hero"
                  />
                  <TextField
                    label="Side Card Background"
                    value={homePage.command_bar.style.card_background}
                    onChange={(next) => updateHome("command_bar.style.card_background", next)}
                    placeholder="rgba(0,0,0,0.15)"
                    previewTarget="home-command-hotline|home-command-fast-response|home-command-bar|home-hero"
                  />
                  <TextField
                    label="Search Surface Background"
                    value={homePage.command_bar.style.search_panel_background}
                    onChange={(next) =>
                      updateHome("command_bar.style.search_panel_background", next)
                    }
                    placeholder="#ffffff"
                    previewTarget="home-command-search|home-command-bar|home-hero"
                  />
                  <TextField
                    label="Search Input Background"
                    value={homePage.command_bar.style.search_input_background}
                    onChange={(next) =>
                      updateHome("command_bar.style.search_input_background", next)
                    }
                    placeholder="#ffffff"
                    previewTarget="home-command-search|home-command-bar|home-hero"
                  />
                  <TextField
                    label="Quick Action Background"
                    value={homePage.command_bar.style.quick_action_panel_background}
                    onChange={(next) =>
                      updateHome("command_bar.style.quick_action_panel_background", next)
                    }
                    placeholder="#f8fafc"
                    previewTarget="home-command-results|home-command-search|home-command-bar|home-hero"
                  />
                </div>

                <div className="mt-6 space-y-5">
                  <TypographyFields
                    title="Admissions Text"
                    value={homePage.command_bar.style.body}
                    path="command_bar.style.body"
                    updateHome={updateHome}
                    previewTarget="home-command-hotline|home-command-fast-response|home-command-bar|home-hero"
                  />
                  <TypographyFields
                    title="Search Input"
                    value={homePage.command_bar.style.search_input}
                    path="command_bar.style.search_input"
                    updateHome={updateHome}
                    previewTarget="home-command-search|home-command-bar|home-hero"
                  />
                  <TypographyFields
                    title="Quick Action Title"
                    value={homePage.command_bar.style.action_title}
                    path="command_bar.style.action_title"
                    updateHome={updateHome}
                    previewTarget="home-command-results|home-command-search|home-command-bar|home-hero"
                  />
                  <TypographyFields
                    title="Quick Action Description"
                    value={homePage.command_bar.style.action_body}
                    path="command_bar.style.action_body"
                    updateHome={updateHome}
                    previewTarget="home-command-results|home-command-search|home-command-bar|home-hero"
                  />
                  <ButtonFields
                    title="Fast Response Button"
                    value={homePage.command_bar.style.button}
                    path="command_bar.style.button"
                    updateHome={updateHome}
                    previewTarget="home-command-fast-response|home-command-bar|home-hero"
                  />
                  <div className="grid gap-6 md:grid-cols-2">
                    <TextField
                      label="No Result Description"
                      value={homePage.command_bar.no_result_description}
                      onChange={(next) =>
                        updateHome("command_bar.no_result_description", next)
                      }
                      placeholder="Explain what happens if nothing matches."
                      previewTarget="home-command-results|home-command-search|home-command-bar|home-hero"
                    />
                    <TextField
                      label="Shortcut Hint"
                      value={homePage.command_bar.shortcut_hint}
                      onChange={(next) => updateHome("command_bar.shortcut_hint", next)}
                      placeholder="/"
                      previewTarget="home-command-search|home-command-bar|home-hero"
                    />
                  </div>
                </div>
              </HomeEditorGroup>
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="home-hero-copy|home-hero"
            title="Hero"
            description="Manage the homepage hero copy, CTA buttons, social proof strip, visual card, and background image."
          >
            <div className="space-y-6">
              <HomeEditorGroup
                title="Content"
                description="Edit the main hero message, action buttons, proof line, and background image."
                defaultOpen
                previewTarget="home-hero-copy"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <TextField
                    label="Badge Text"
                    value={homePage.hero.badge_text}
                    onChange={(next) => updateHome("hero.badge_text", next)}
                    placeholder="Premium learning experience"
                    previewTarget="home-hero-copy|home-hero"
                  />
                  <TextField
                    label="Visual Badge Text"
                    value={homePage.hero.visual_badge_text}
                    onChange={(next) => updateHome("hero.visual_badge_text", next)}
                    placeholder="Live institute snapshot"
                    previewTarget="home-hero-visual|home-hero"
                  />
                  <TextField
                    label="Primary CTA Label"
                    value={homePage.hero.primary_cta_label}
                    onChange={(next) => updateHome("hero.primary_cta_label", next)}
                    placeholder="Explore curriculum"
                    previewTarget="home-hero-copy|home-hero"
                  />
                  <TextField
                    label="Primary CTA Link"
                    value={homePage.hero.primary_cta_link}
                    onChange={(next) => updateHome("hero.primary_cta_link", next)}
                    placeholder="/courses"
                    previewTarget="home-hero-copy|home-hero"
                  />
                  <TextField
                    label="Secondary CTA Label"
                    value={homePage.hero.secondary_cta_label}
                    onChange={(next) => updateHome("hero.secondary_cta_label", next)}
                    placeholder="Speak with admissions"
                    previewTarget="home-hero-copy|home-hero"
                  />
                  <TextField
                    label="Secondary CTA Link"
                    value={homePage.hero.secondary_cta_link}
                    onChange={(next) => updateHome("hero.secondary_cta_link", next)}
                    placeholder="/contact"
                    previewTarget="home-hero-copy|home-hero"
                  />
                </div>

                <div className="mt-6 grid gap-6">
                  <TextAreaField
                    label="Hero Heading"
                    value={homePage.hero.title}
                    onChange={(next) => updateHome("hero.title", next)}
                    rows={4}
                    previewTarget="home-hero-copy|home-hero"
                  />
                  <TextAreaField
                    label="Hero Description"
                    value={homePage.hero.description}
                    onChange={(next) => updateHome("hero.description", next)}
                    rows={4}
                    previewTarget="home-hero-copy|home-hero"
                  />
                  <TextAreaField
                    label="Trust Line"
                    value={homePage.hero.social_proof_text}
                    onChange={(next) => updateHome("hero.social_proof_text", next)}
                    rows={4}
                    previewTarget="home-hero-trust|home-hero-copy|home-hero"
                  />
                </div>

                <div className="mt-6 space-y-2">
                  <label className="ml-2 block text-[10px] font-bold uppercase tracking-widest text-primary/40">
                    Hero Background
                  </label>
                  <ImageUpload
                    value={homePage.hero.background_image}
                    onChange={(value) => updateHome("hero.background_image", value)}
                    label="Upload hero background"
                    className="max-w-full"
                    previewTarget="home-hero-visual|home-hero"
                  />
                </div>
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Hero Signals"
                description="Manage the small proof chips and the overlay cards inside the hero visual."
                defaultOpen
                previewTarget="home-hero-visual|home-hero"
              >
                <div className="space-y-6">
                  <MetricCardsEditor
                    title="Hero Stat Pills"
                    description="Short chips below the hero description."
                    items={homePage.hero.stat_pills}
                    path="hero.stat_pills"
                    updateHome={updateHome}
                    addItem={() => addMetricCard("hero.stat_pills")}
                    removeItem={(index) => removeCollectionItem("hero.stat_pills", index)}
                    moveItem={(index, direction) =>
                      moveCollectionItem("hero.stat_pills", index, direction)
                    }
                    previewTarget="home-hero-pills"
                  />

                  <MetricCardsEditor
                    title="Hero Snapshot Cards"
                    description="Overlay cards inside the visual hero frame."
                    items={homePage.hero.snapshot_cards}
                    path="hero.snapshot_cards"
                    updateHome={updateHome}
                    addItem={() =>
                      addMetricCard("hero.snapshot_cards", {
                        source: "primary_phone",
                        icon: "phone",
                      })
                    }
                    removeItem={(index) => removeCollectionItem("hero.snapshot_cards", index)}
                    moveItem={(index, direction) =>
                      moveCollectionItem("hero.snapshot_cards", index, direction)
                    }
                    previewTarget="home-hero-visual|home-hero"
                  />
                </div>
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Advanced Style"
                description="Visual fine-tuning for the hero. These controls are intentionally collapsed because they are not needed for normal copy editing."
                tone="advanced"
                previewTarget="home-hero-copy|home-hero"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Stat Pill Background"
                    value={homePage.hero.style.stat_pill_background}
                    onChange={(next) => updateHome("hero.style.stat_pill_background", next)}
                    placeholder="rgba(255,255,255,0.08)"
                    previewTarget="home-hero-pills|home-hero-copy|home-hero"
                  />
                  <TextField
                    label="Stat Pill Border"
                    value={homePage.hero.style.stat_pill_border_color}
                    onChange={(next) => updateHome("hero.style.stat_pill_border_color", next)}
                    placeholder="rgba(255,255,255,0.10)"
                    previewTarget="home-hero-pills|home-hero-copy|home-hero"
                  />
                  <TextField
                    label="Trust Panel Background"
                    value={homePage.hero.style.social_panel_background}
                    onChange={(next) => updateHome("hero.style.social_panel_background", next)}
                    placeholder="rgba(255,255,255,0.06)"
                    previewTarget="home-hero-trust|home-hero-copy|home-hero"
                  />
                  <TextField
                    label="Trust Panel Border"
                    value={homePage.hero.style.social_panel_border_color}
                    onChange={(next) => updateHome("hero.style.social_panel_border_color", next)}
                    placeholder="rgba(255,255,255,0.10)"
                    previewTarget="home-hero-trust|home-hero-copy|home-hero"
                  />
                  <TextField
                    label="Visual Panel Background"
                    value={homePage.hero.style.visual_panel_background}
                    onChange={(next) => updateHome("hero.style.visual_panel_background", next)}
                    placeholder="rgba(255,255,255,0.08)"
                    previewTarget="home-hero-visual|home-hero"
                  />
                  <TextField
                    label="Visual Panel Border"
                    value={homePage.hero.style.visual_panel_border_color}
                    onChange={(next) => updateHome("hero.style.visual_panel_border_color", next)}
                    placeholder="rgba(255,255,255,0.10)"
                    previewTarget="home-hero-visual|home-hero"
                  />
                  <TextField
                    label="Overlay Card Background"
                    value={homePage.hero.style.overlay_card_background}
                    onChange={(next) => updateHome("hero.style.overlay_card_background", next)}
                    placeholder="rgba(0,0,0,0.30)"
                    previewTarget="home-hero-visual|home-hero"
                  />
                  <TextField
                    label="Overlay Card Border"
                    value={homePage.hero.style.overlay_card_border_color}
                    onChange={(next) => updateHome("hero.style.overlay_card_border_color", next)}
                    placeholder="rgba(255,255,255,0.12)"
                    previewTarget="home-hero-visual|home-hero"
                  />
                </div>

                <div className="mt-6 space-y-5">
                  <BadgeFields
                    title="Hero Badge Style"
                    value={homePage.hero.style.badge}
                    path="hero.style.badge"
                    updateHome={updateHome}
                    previewTarget="home-hero-copy|home-hero"
                  />
                  <BadgeFields
                    title="Visual Badge Style"
                    value={homePage.hero.style.visual_badge}
                    path="hero.style.visual_badge"
                    updateHome={updateHome}
                    previewTarget="home-hero-visual|home-hero"
                  />
                  <TypographyFields
                    title="Hero Heading Style"
                    value={homePage.hero.style.heading}
                    path="hero.style.heading"
                    updateHome={updateHome}
                    previewTarget="home-hero-copy|home-hero"
                  />
                  <TypographyFields
                    title="Hero Description Style"
                    value={homePage.hero.style.description}
                    path="hero.style.description"
                    updateHome={updateHome}
                    previewTarget="home-hero-copy|home-hero"
                  />
                  <TypographyFields
                    title="Trust Line Style"
                    value={homePage.hero.style.social_text}
                    path="hero.style.social_text"
                    updateHome={updateHome}
                    previewTarget="home-hero-trust|home-hero-copy|home-hero"
                  />
                  <TypographyFields
                    title="Hero Signal Text"
                    value={homePage.hero.style.stat_pill_text}
                    path="hero.style.stat_pill_text"
                    updateHome={updateHome}
                    previewTarget="home-hero-pills|home-hero-copy|home-hero"
                  />
                  <ButtonFields
                    title="Primary Hero Button"
                    value={homePage.hero.style.primary_button}
                    path="hero.style.primary_button"
                    updateHome={updateHome}
                    previewTarget="home-hero-copy|home-hero"
                  />
                  <ButtonFields
                    title="Secondary Hero Button"
                    value={homePage.hero.style.secondary_button}
                    path="hero.style.secondary_button"
                    updateHome={updateHome}
                    previewTarget="home-hero-copy|home-hero"
                  />
                </div>
              </HomeEditorGroup>
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="home-metrics-rail"
            title="Metrics Rail"
            description="These cards sit below the hero and surface institute proof at a glance."
          >
            <div className="space-y-6">
              <HomeEditorGroup
                title="Cards"
                description="Manage the cards shown below the hero."
                defaultOpen
                previewTarget="home-metrics-rail"
              >
                <MetricCardsEditor
                  title="Metrics Rail Cards"
                  description="Add, remove, and reorder the cards shown below the hero."
                  items={homePage.metrics_rail.items}
                  path="metrics_rail.items"
                  updateHome={updateHome}
                  addItem={() => addMetricCard("metrics_rail.items")}
                  removeItem={(index) => removeCollectionItem("metrics_rail.items", index)}
                  moveItem={(index, direction) =>
                    moveCollectionItem("metrics_rail.items", index, direction)
                  }
                  previewTarget="home-metrics-rail"
                />
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Advanced Style"
                description="Use this only if the proof cards need visual adjustment."
                tone="advanced"
                previewTarget="home-metrics-rail"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Panel Background"
                    value={homePage.metrics_rail.style.panel_background}
                    onChange={(next) => updateHome("metrics_rail.style.panel_background", next)}
                    placeholder="rgba(255,255,255,0.88)"
                    previewTarget="home-metrics-rail|home-hero"
                  />
                  <TextField
                    label="Panel Border"
                    value={homePage.metrics_rail.style.panel_border_color}
                    onChange={(next) => updateHome("metrics_rail.style.panel_border_color", next)}
                    placeholder="rgba(226,232,240,0.70)"
                    previewTarget="home-metrics-rail|home-hero"
                  />
                  <TextField
                    label="Card Background"
                    value={homePage.metrics_rail.style.card_background}
                    onChange={(next) => updateHome("metrics_rail.style.card_background", next)}
                    placeholder="rgba(248,250,252,0.80)"
                    previewTarget="home-metrics-rail|home-hero"
                  />
                  <TextField
                    label="Card Border"
                    value={homePage.metrics_rail.style.card_border_color}
                    onChange={(next) => updateHome("metrics_rail.style.card_border_color", next)}
                    placeholder="rgba(226,232,240,0.70)"
                    previewTarget="home-metrics-rail|home-hero"
                  />
                </div>

                <div className="mt-6 space-y-5">
                  <TypographyFields
                    title="Metric Value Style"
                    value={homePage.metrics_rail.style.value}
                    path="metrics_rail.style.value"
                    updateHome={updateHome}
                    previewTarget="home-metrics-rail|home-hero"
                  />
                  <TypographyFields
                    title="Metric Description Style"
                    value={homePage.metrics_rail.style.body}
                    path="metrics_rail.style.body"
                    updateHome={updateHome}
                    previewTarget="home-metrics-rail|home-hero"
                  />
                </div>
              </HomeEditorGroup>
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="course-explorer"
            title="Course Explorer"
            description="Manage the section that introduces the program catalogue, filters, and featured course layout."
          >
            <div className="space-y-6">
              <HomeEditorGroup
                title="Content"
                description="Edit the main course section copy, filter labels, and fallback content."
                defaultOpen
                previewTarget="course-explorer-copy|course-explorer"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <TextField
                    label="Badge Text"
                    value={homePage.course_explorer.badge_text}
                    onChange={(next) => updateHome("course_explorer.badge_text", next)}
                    placeholder="Program explorer"
                    previewTarget="course-explorer-copy|course-explorer"
                  />
                  <TextField
                    label="Open Catalogue Label"
                    value={homePage.course_explorer.open_catalogue_label}
                    onChange={(next) =>
                      updateHome("course_explorer.open_catalogue_label", next)
                    }
                    placeholder="Open full catalogue"
                    previewTarget="course-explorer-copy|course-explorer"
                  />
                  <TextField
                    label="All Programs Label"
                    value={homePage.course_explorer.all_programs_label}
                    onChange={(next) =>
                      updateHome("course_explorer.all_programs_label", next)
                    }
                    placeholder="All Programs"
                    previewTarget="course-explorer-filters|course-explorer"
                  />
                  <TextField
                    label="Duration Label"
                    value={homePage.course_explorer.duration_label}
                    onChange={(next) => updateHome("course_explorer.duration_label", next)}
                    placeholder="Duration"
                    previewTarget="course-explorer-featured|course-explorer"
                  />
                  <TextField
                    label="Fee Label"
                    value={homePage.course_explorer.fee_label}
                    onChange={(next) => updateHome("course_explorer.fee_label", next)}
                    placeholder="Fee"
                    previewTarget="course-explorer-featured|course-explorer"
                  />
                  <TextField
                    label="Featured Button"
                    value={homePage.course_explorer.featured_cta_label}
                    onChange={(next) =>
                      updateHome("course_explorer.featured_cta_label", next)
                    }
                    placeholder="View program detail"
                    previewTarget="course-explorer-featured|course-explorer"
                  />
                  <TextField
                    label="Card Button"
                    value={homePage.course_explorer.card_cta_label}
                    onChange={(next) => updateHome("course_explorer.card_cta_label", next)}
                    placeholder="Learn more"
                    previewTarget="course-explorer-featured|course-explorer"
                  />
                </div>

                <div className="mt-6 grid gap-6">
                  <TextAreaField
                    label="Section Heading"
                    value={homePage.course_explorer.heading}
                    onChange={(next) => updateHome("course_explorer.heading", next)}
                    rows={4}
                    previewTarget="course-explorer-copy|course-explorer"
                  />
                  <TextAreaField
                    label="Section Description"
                    value={homePage.course_explorer.description}
                    onChange={(next) => updateHome("course_explorer.description", next)}
                    rows={4}
                    previewTarget="course-explorer-copy|course-explorer"
                  />
                  <TextAreaField
                    label="Empty State Title"
                    value={homePage.course_explorer.empty_title}
                    onChange={(next) => updateHome("course_explorer.empty_title", next)}
                    rows={3}
                    previewTarget="course-explorer-featured|course-explorer"
                  />
                  <TextAreaField
                    label="Empty State Description"
                    value={homePage.course_explorer.empty_description}
                    onChange={(next) => updateHome("course_explorer.empty_description", next)}
                    rows={4}
                    previewTarget="course-explorer-featured|course-explorer"
                  />
                </div>
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Advanced Style"
                description="Use this only when the program explorer needs visual fine-tuning."
                tone="advanced"
                previewTarget="course-explorer-copy|course-explorer"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Active Filter Background"
                    value={homePage.course_explorer.style.filter_active_background}
                    onChange={(next) =>
                      updateHome("course_explorer.style.filter_active_background", next)
                    }
                    placeholder="#020617"
                    previewTarget="course-explorer-filters|course-explorer"
                  />
                  <TextField
                    label="Active Filter Text"
                    value={homePage.course_explorer.style.filter_active_text_color}
                    onChange={(next) =>
                      updateHome("course_explorer.style.filter_active_text_color", next)
                    }
                    placeholder="#ffffff"
                    previewTarget="course-explorer-filters|course-explorer"
                  />
                  <TextField
                    label="Filter Background"
                    value={homePage.course_explorer.style.filter_background}
                    onChange={(next) =>
                      updateHome("course_explorer.style.filter_background", next)
                    }
                    placeholder="#ffffff"
                    previewTarget="course-explorer-filters|course-explorer"
                  />
                  <TextField
                    label="Filter Border"
                    value={homePage.course_explorer.style.filter_border_color}
                    onChange={(next) =>
                      updateHome("course_explorer.style.filter_border_color", next)
                    }
                    placeholder="#e2e8f0"
                    previewTarget="course-explorer-filters|course-explorer"
                  />
                </div>

                <div className="mt-6 space-y-5">
                  <BadgeFields
                    title="Explorer Badge Style"
                    value={homePage.course_explorer.style.badge}
                    path="course_explorer.style.badge"
                    updateHome={updateHome}
                    previewTarget="course-explorer-copy|course-explorer"
                  />
                  <TypographyFields
                    title="Explorer Heading Style"
                    value={homePage.course_explorer.style.heading}
                    path="course_explorer.style.heading"
                    updateHome={updateHome}
                    previewTarget="course-explorer-copy|course-explorer"
                  />
                  <TypographyFields
                    title="Explorer Description Style"
                    value={homePage.course_explorer.style.description}
                    path="course_explorer.style.description"
                    updateHome={updateHome}
                    previewTarget="course-explorer-copy|course-explorer"
                  />
                  <TypographyFields
                    title="Filter Text Style"
                    value={homePage.course_explorer.style.filter_text}
                    path="course_explorer.style.filter_text"
                    updateHome={updateHome}
                    previewTarget="course-explorer-filters|course-explorer"
                  />
                  <TypographyFields
                    title="Results Text Style"
                    value={homePage.course_explorer.style.results_text}
                    path="course_explorer.style.results_text"
                    updateHome={updateHome}
                    previewTarget="course-explorer-filters|course-explorer"
                  />
                  <ButtonFields
                    title="Open Catalogue Button"
                    value={homePage.course_explorer.style.action_button}
                    path="course_explorer.style.action_button"
                    updateHome={updateHome}
                    previewTarget="course-explorer-copy|course-explorer"
                  />
                  <div className="grid gap-6 md:grid-cols-2">
                    <TextField
                      label="Category Fallback"
                      value={homePage.course_explorer.category_fallback_label}
                      onChange={(next) =>
                        updateHome("course_explorer.category_fallback_label", next)
                      }
                      placeholder="Featured Program"
                      previewTarget="course-explorer-featured|course-explorer"
                    />
                    <TextField
                      label="Card Description Fallback"
                      value={homePage.course_explorer.card_description_fallback}
                      onChange={(next) =>
                        updateHome("course_explorer.card_description_fallback", next)
                      }
                      placeholder="Fallback course description"
                      previewTarget="course-explorer-featured|course-explorer"
                    />
                  </div>
                </div>
              </HomeEditorGroup>
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="faculty-showcase"
            title="Faculty Showcase"
            description="Control the section that introduces instructors and the faculty trust signals."
          >
            <div className="space-y-6">
              <HomeEditorGroup
                title="Content"
                description="Edit the mentor section copy and fallback text used when some teacher fields are empty."
                defaultOpen
                previewTarget="faculty-feature-copy|faculty-showcase"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <TextField
                    label="Badge Text"
                    value={homePage.faculty_showcase.badge_text}
                    onChange={(next) => updateHome("faculty_showcase.badge_text", next)}
                    placeholder="Mentor-led learning"
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                  <TextField
                    label="Button Label"
                    value={homePage.faculty_showcase.button_label}
                    onChange={(next) => updateHome("faculty_showcase.button_label", next)}
                    placeholder="Explore faculty"
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                  <TextField
                    label="Button Link"
                    value={homePage.faculty_showcase.button_link}
                    onChange={(next) => updateHome("faculty_showcase.button_link", next)}
                    placeholder="/teachers"
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                  <TextField
                    label="Subject Fallback"
                    value={homePage.faculty_showcase.roster_subject_fallback}
                    onChange={(next) =>
                      updateHome("faculty_showcase.roster_subject_fallback", next)
                    }
                    placeholder="Instructor"
                    previewTarget="faculty-roster-cards|faculty-showcase"
                  />
                </div>

                <div className="mt-6 grid gap-6">
                  <TextAreaField
                    label="Section Heading"
                    value={homePage.faculty_showcase.heading}
                    onChange={(next) => updateHome("faculty_showcase.heading", next)}
                    rows={4}
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                  <TextAreaField
                    label="Section Description"
                    value={homePage.faculty_showcase.description}
                    onChange={(next) => updateHome("faculty_showcase.description", next)}
                    rows={4}
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                  <TextAreaField
                    label="Bio Fallback"
                    value={homePage.faculty_showcase.roster_bio_fallback}
                    onChange={(next) =>
                      updateHome("faculty_showcase.roster_bio_fallback", next)
                    }
                    rows={4}
                    previewTarget="faculty-roster-cards|faculty-showcase"
                  />
                </div>
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Advanced Style"
                description="Use this only when the mentor section needs visual adjustment."
                tone="advanced"
                previewTarget="faculty-feature-copy|faculty-showcase"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Feature Panel Background"
                    value={homePage.faculty_showcase.style.feature_panel_background}
                    onChange={(next) =>
                      updateHome("faculty_showcase.style.feature_panel_background", next)
                    }
                    placeholder="#020617"
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                  <TextField
                    label="Feature Panel Border"
                    value={homePage.faculty_showcase.style.feature_panel_border_color}
                    onChange={(next) =>
                      updateHome("faculty_showcase.style.feature_panel_border_color", next)
                    }
                    placeholder="#1e293b"
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                  <TextField
                    label="Roster Card Background"
                    value={homePage.faculty_showcase.style.roster_card_background}
                    onChange={(next) =>
                      updateHome("faculty_showcase.style.roster_card_background", next)
                    }
                    placeholder="#ffffff"
                    previewTarget="faculty-roster-cards|faculty-showcase"
                  />
                  <TextField
                    label="Roster Card Border"
                    value={homePage.faculty_showcase.style.roster_card_border_color}
                    onChange={(next) =>
                      updateHome("faculty_showcase.style.roster_card_border_color", next)
                    }
                    placeholder="#e2e8f0"
                    previewTarget="faculty-roster-cards|faculty-showcase"
                  />
                </div>

                <div className="mt-6 space-y-5">
                  <BadgeFields
                    title="Faculty Badge Style"
                    value={homePage.faculty_showcase.style.badge}
                    path="faculty_showcase.style.badge"
                    updateHome={updateHome}
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                  <TypographyFields
                    title="Faculty Heading Style"
                    value={homePage.faculty_showcase.style.heading}
                    path="faculty_showcase.style.heading"
                    updateHome={updateHome}
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                  <TypographyFields
                    title="Faculty Description Style"
                    value={homePage.faculty_showcase.style.description}
                    path="faculty_showcase.style.description"
                    updateHome={updateHome}
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                  <TypographyFields
                    title="Roster Name Style"
                    value={homePage.faculty_showcase.style.roster_name}
                    path="faculty_showcase.style.roster_name"
                    updateHome={updateHome}
                    previewTarget="faculty-roster-cards|faculty-showcase"
                  />
                  <TypographyFields
                    title="Roster Body Style"
                    value={homePage.faculty_showcase.style.roster_body}
                    path="faculty_showcase.style.roster_body"
                    updateHome={updateHome}
                    previewTarget="faculty-roster-cards|faculty-showcase"
                  />
                  <ButtonFields
                    title="Faculty Button"
                    value={homePage.faculty_showcase.style.button}
                    path="faculty_showcase.style.button"
                    updateHome={updateHome}
                    previewTarget="faculty-feature-copy|faculty-showcase"
                  />
                </div>
              </HomeEditorGroup>
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="student-proof"
            title="Student Proof"
            description="Edit the testimonial feature panel and the supporting metrics band."
          >
            <div className="space-y-6">
              <HomeEditorGroup
                title="Content"
                description="Edit the testimonial section message and fallback label."
                defaultOpen
                previewTarget="student-proof-copy|student-proof"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <TextField
                    label="Badge Text"
                    value={homePage.proof_section.badge_text}
                    onChange={(next) => updateHome("proof_section.badge_text", next)}
                    placeholder="Student proof"
                    previewTarget="student-proof-copy|student-proof"
                  />
                  <TextField
                    label="Course Fallback"
                    value={homePage.proof_section.testimonial_course_fallback}
                    onChange={(next) =>
                      updateHome("proof_section.testimonial_course_fallback", next)
                    }
                    placeholder="Student story"
                    previewTarget="student-proof-stories|student-proof"
                  />
                </div>

                <div className="mt-6 grid gap-6">
                  <TextAreaField
                    label="Section Heading"
                    value={homePage.proof_section.heading}
                    onChange={(next) => updateHome("proof_section.heading", next)}
                    rows={4}
                    previewTarget="student-proof-copy|student-proof"
                  />
                  <TextAreaField
                    label="Section Description"
                    value={homePage.proof_section.description}
                    onChange={(next) => updateHome("proof_section.description", next)}
                    rows={4}
                    previewTarget="student-proof-copy|student-proof"
                  />
                </div>
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Proof Metrics"
                description="Manage the supporting credibility cards used in the proof section."
                defaultOpen
                previewTarget="student-proof-metrics"
              >
                <MetricCardsEditor
                  title="Proof Metrics"
                  description="These cards support the student proof section."
                  items={homePage.proof_section.metrics}
                  path="proof_section.metrics"
                  updateHome={updateHome}
                  addItem={() => addMetricCard("proof_section.metrics")}
                  removeItem={(index) => removeCollectionItem("proof_section.metrics", index)}
                  moveItem={(index, direction) =>
                    moveCollectionItem("proof_section.metrics", index, direction)
                  }
                  previewTarget="student-proof-metrics"
                />
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Advanced Style"
                description="Use this only when the testimonial section needs visual fine-tuning."
                tone="advanced"
                previewTarget="student-proof-copy|student-proof"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Section Background"
                    value={homePage.proof_section.style.section_background}
                    onChange={(next) =>
                      updateHome("proof_section.style.section_background", next)
                    }
                    placeholder="linear-gradient(...)"
                    previewTarget="student-proof"
                  />
                  <TextField
                    label="Feature Panel Background"
                    value={homePage.proof_section.style.feature_panel_background}
                    onChange={(next) =>
                      updateHome("proof_section.style.feature_panel_background", next)
                    }
                    placeholder="rgba(255,255,255,0.08)"
                    previewTarget="student-proof-copy|student-proof"
                  />
                  <TextField
                    label="Feature Panel Border"
                    value={homePage.proof_section.style.feature_panel_border_color}
                    onChange={(next) =>
                      updateHome("proof_section.style.feature_panel_border_color", next)
                    }
                    placeholder="rgba(255,255,255,0.10)"
                    previewTarget="student-proof-copy|student-proof"
                  />
                  <TextField
                    label="Metric Card Background"
                    value={homePage.proof_section.style.metric_card_background}
                    onChange={(next) =>
                      updateHome("proof_section.style.metric_card_background", next)
                    }
                    placeholder="rgba(0,0,0,0.18)"
                    previewTarget="student-proof-metrics|student-proof"
                  />
                  <TextField
                    label="Metric Card Border"
                    value={homePage.proof_section.style.metric_card_border_color}
                    onChange={(next) =>
                      updateHome("proof_section.style.metric_card_border_color", next)
                    }
                    placeholder="rgba(255,255,255,0.10)"
                    previewTarget="student-proof-metrics|student-proof"
                  />
                  <TextField
                    label="Story Card Background"
                    value={homePage.proof_section.style.testimonial_card_background}
                    onChange={(next) =>
                      updateHome("proof_section.style.testimonial_card_background", next)
                    }
                    placeholder="#ffffff"
                    previewTarget="student-proof-stories|student-proof"
                  />
                  <TextField
                    label="Story Card Border"
                    value={homePage.proof_section.style.testimonial_card_border_color}
                    onChange={(next) =>
                      updateHome("proof_section.style.testimonial_card_border_color", next)
                    }
                    placeholder="rgba(255,255,255,0.10)"
                    previewTarget="student-proof-stories|student-proof"
                  />
                </div>

                <div className="mt-6 space-y-5">
                  <BadgeFields
                    title="Proof Badge Style"
                    value={homePage.proof_section.style.badge}
                    path="proof_section.style.badge"
                    updateHome={updateHome}
                    previewTarget="student-proof-copy|student-proof"
                  />
                  <TypographyFields
                    title="Proof Heading Style"
                    value={homePage.proof_section.style.heading}
                    path="proof_section.style.heading"
                    updateHome={updateHome}
                    previewTarget="student-proof-copy|student-proof"
                  />
                  <TypographyFields
                    title="Proof Description Style"
                    value={homePage.proof_section.style.description}
                    path="proof_section.style.description"
                    updateHome={updateHome}
                    previewTarget="student-proof-copy|student-proof"
                  />
                  <TypographyFields
                    title="Testimonial Body Style"
                    value={homePage.proof_section.style.testimonial_body}
                    path="proof_section.style.testimonial_body"
                    updateHome={updateHome}
                    previewTarget="student-proof-stories|student-proof"
                  />
                  <TypographyFields
                    title="Testimonial Name Style"
                    value={homePage.proof_section.style.testimonial_name}
                    path="proof_section.style.testimonial_name"
                    updateHome={updateHome}
                    previewTarget="student-proof-stories|student-proof"
                  />
                  <TypographyFields
                    title="Testimonial Course Style"
                    value={homePage.proof_section.style.testimonial_course}
                    path="proof_section.style.testimonial_course"
                    updateHome={updateHome}
                    previewTarget="student-proof-stories|student-proof"
                  />
                </div>
              </HomeEditorGroup>
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="home-final-cta"
            title="Final CTA"
            description="The closing conversion band should make the next step obvious and easy to act on."
          >
            <div className="space-y-6">
              <HomeEditorGroup
                title="Content"
                description="Edit the closing call to action and its two buttons."
                defaultOpen
                previewTarget="home-final-cta-copy|home-final-cta"
              >
                <div className="grid gap-6 md:grid-cols-2">
                  <TextField
                    label="Badge Text"
                    value={homePage.cta_section.badge_text}
                    onChange={(next) => updateHome("cta_section.badge_text", next)}
                    placeholder="Admission ready"
                    previewTarget="home-final-cta-copy|home-final-cta"
                  />
                  <TextField
                    label="Primary CTA Label"
                    value={homePage.cta_section.primary_cta_label}
                    onChange={(next) => updateHome("cta_section.primary_cta_label", next)}
                    placeholder="Start your inquiry"
                    previewTarget="home-final-cta-buttons|home-final-cta-copy|home-final-cta"
                  />
                  <TextField
                    label="Primary CTA Link"
                    value={homePage.cta_section.primary_cta_link}
                    onChange={(next) => updateHome("cta_section.primary_cta_link", next)}
                    placeholder="/contact"
                    previewTarget="home-final-cta-buttons|home-final-cta-copy|home-final-cta"
                  />
                  <TextField
                    label="Secondary CTA Label"
                    value={homePage.cta_section.secondary_cta_label}
                    onChange={(next) => updateHome("cta_section.secondary_cta_label", next)}
                    placeholder="Browse programs"
                    previewTarget="home-final-cta-buttons|home-final-cta-copy|home-final-cta"
                  />
                  <TextField
                    label="Secondary CTA Link"
                    value={homePage.cta_section.secondary_cta_link}
                    onChange={(next) => updateHome("cta_section.secondary_cta_link", next)}
                    placeholder="/courses"
                    previewTarget="home-final-cta-buttons|home-final-cta-copy|home-final-cta"
                  />
                </div>

                <div className="mt-6 grid gap-6">
                  <TextAreaField
                    label="Section Heading"
                    value={homePage.cta_section.heading}
                    onChange={(next) => updateHome("cta_section.heading", next)}
                    rows={4}
                    previewTarget="home-final-cta-copy|home-final-cta"
                  />
                  <TextAreaField
                    label="Section Description"
                    value={homePage.cta_section.description}
                    onChange={(next) => updateHome("cta_section.description", next)}
                    rows={4}
                    previewTarget="home-final-cta-copy|home-final-cta"
                  />
                </div>
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Support Cards"
                description="These cards reinforce the closing CTA with contact and support details."
                defaultOpen
                previewTarget="home-final-cta-info"
              >
                <MetricCardsEditor
                  title="CTA Info Cards"
                  description="These cards reinforce the admissions CTA with contact and support details."
                  items={homePage.cta_section.info_cards}
                  path="cta_section.info_cards"
                  updateHome={updateHome}
                  addItem={() =>
                    addMetricCard("cta_section.info_cards", {
                      source: "primary_phone",
                      icon: "phone",
                    })
                  }
                  removeItem={(index) => removeCollectionItem("cta_section.info_cards", index)}
                  moveItem={(index, direction) =>
                    moveCollectionItem("cta_section.info_cards", index, direction)
                  }
                  previewTarget="home-final-cta-info"
                />
              </HomeEditorGroup>

              <HomeEditorGroup
                title="Advanced Style"
                description="Use this only when the final conversion block needs visual fine-tuning."
                tone="advanced"
                previewTarget="home-final-cta-copy|home-final-cta"
              >
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField
                    label="Outer Panel Background"
                    value={homePage.cta_section.style.outer_panel_background}
                    onChange={(next) =>
                      updateHome("cta_section.style.outer_panel_background", next)
                    }
                    placeholder="#ffffff"
                    previewTarget="home-final-cta"
                  />
                  <TextField
                    label="Outer Panel Border"
                    value={homePage.cta_section.style.outer_panel_border_color}
                    onChange={(next) =>
                      updateHome("cta_section.style.outer_panel_border_color", next)
                    }
                    placeholder="#e2e8f0"
                    previewTarget="home-final-cta"
                  />
                  <TextField
                    label="Feature Panel Background"
                    value={homePage.cta_section.style.feature_panel_background}
                    onChange={(next) =>
                      updateHome("cta_section.style.feature_panel_background", next)
                    }
                    placeholder="linear-gradient(...)"
                    previewTarget="home-final-cta-copy|home-final-cta"
                  />
                  <TextField
                    label="Info Card Background"
                    value={homePage.cta_section.style.info_card_background}
                    onChange={(next) =>
                      updateHome("cta_section.style.info_card_background", next)
                    }
                    placeholder="#f8fafc"
                    previewTarget="home-final-cta-info|home-final-cta"
                  />
                  <TextField
                    label="Info Card Border"
                    value={homePage.cta_section.style.info_card_border_color}
                    onChange={(next) =>
                      updateHome("cta_section.style.info_card_border_color", next)
                    }
                    placeholder="#e2e8f0"
                    previewTarget="home-final-cta-info|home-final-cta"
                  />
                </div>

                <div className="mt-6 space-y-5">
                  <BadgeFields
                    title="CTA Badge Style"
                    value={homePage.cta_section.style.badge}
                    path="cta_section.style.badge"
                    updateHome={updateHome}
                    previewTarget="home-final-cta-copy|home-final-cta"
                  />
                  <TypographyFields
                    title="CTA Heading Style"
                    value={homePage.cta_section.style.heading}
                    path="cta_section.style.heading"
                    updateHome={updateHome}
                    previewTarget="home-final-cta-copy|home-final-cta"
                  />
                  <TypographyFields
                    title="CTA Description Style"
                    value={homePage.cta_section.style.description}
                    path="cta_section.style.description"
                    updateHome={updateHome}
                    previewTarget="home-final-cta-copy|home-final-cta"
                  />
                  <ButtonFields
                    title="Primary CTA Button"
                    value={homePage.cta_section.style.primary_button}
                    path="cta_section.style.primary_button"
                    updateHome={updateHome}
                    previewTarget="home-final-cta-buttons|home-final-cta-copy|home-final-cta"
                  />
                  <ButtonFields
                    title="Secondary CTA Button"
                    value={homePage.cta_section.style.secondary_button}
                    path="cta_section.style.secondary_button"
                    updateHome={updateHome}
                    previewTarget="home-final-cta-buttons|home-final-cta-copy|home-final-cta"
                  />
                </div>
              </HomeEditorGroup>
            </div>
          </EditorPanel>

          <EditorPanel
            title="Related Content"
            description="Homepage sections still pull their live records from these editors."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ShortcutCard
                href="/admin/banners"
                title="Hero Banners"
                description="Rotating hero slides and media."
                statLabel="Live / total"
                statValue={`${metrics.banners.live}/${metrics.banners.total}`}
                linkLabel="Open banners"
              />
              <ShortcutCard
                href="/admin/courses"
                title="Programs"
                description="Programs shown in the explorer and homepage cards."
                statLabel="Live / total"
                statValue={`${metrics.courses.live}/${metrics.courses.total}`}
                linkLabel="Open courses"
              />
              <ShortcutCard
                href="/admin/teachers"
                title="Faculty"
                description="Teacher records used in the faculty showcase."
                statLabel="Live / total"
                statValue={`${metrics.teachers.live}/${metrics.teachers.total}`}
                linkLabel="Open teachers"
              />
              <ShortcutCard
                href="/admin/testimonials"
                title="Student Stories"
                description="Testimonials used in the proof section."
                statLabel="Live / total"
                statValue={`${metrics.testimonials.live}/${metrics.testimonials.total}`}
                linkLabel="Open testimonials"
              />
              <ShortcutCard
                href="/admin/notices"
                title="Alerts"
                description="Notices used for homepage academic alerts."
                statLabel="Live / total"
                statValue={`${metrics.notices.live}/${metrics.notices.total}`}
                linkLabel="Open notices"
              />
            </div>
          </EditorPanel>

          <SaveButton saving={saving} label="Save homepage draft" />
        </form>

        <div className="xl:sticky xl:top-6 xl:self-start">
          <LivePreviewPanel title="Homepage Preview" previewType="page">
            <HomepagePreview
              settings={settings}
              banners={previewBanners}
              courses={previewCourses}
              teachers={previewTeachers}
              testimonials={previewTestimonials}
            />
          </LivePreviewPanel>
        </div>
      </div>
      </div>
    </PreviewSyncProvider>
  );
}
