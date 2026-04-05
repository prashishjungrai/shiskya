"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, ChevronUp, GraduationCap, Plus, Trash2, X } from "lucide-react";
import ImageUpload from "@/components/ImageUpload";
import LivePreviewPanel from "@/components/admin/LivePreviewPanel";
import PublicPagePreview from "@/components/admin/PublicPagePreview";
import TeacherCardPreview from "@/components/admin/TeacherCardPreview";
import TeachersDirectoryView from "@/components/public/TeachersDirectoryView";
import {
  EditorPanel,
  PublicPreviewLink,
  PublishingToolbar,
  SaveButton,
  SelectField,
  TextAreaField,
  TextField,
} from "@/components/admin/EditorToolkit";
import { PreviewSyncProvider } from "@/components/admin/PreviewSyncContext";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/ToastProvider";
import api from "@/lib/api";
import { getApiErrorMessage } from "@/lib/api-errors";
import { resolveMediaUrl } from "@/lib/media";
import {
  normalizeTeachersPage,
  TEACHERS_FONT_FAMILY_OPTIONS,
  TEACHERS_FONT_STYLE_OPTIONS,
  TEACHERS_FONT_WEIGHT_OPTIONS,
  TEACHERS_ICON_OPTIONS,
} from "@/lib/teachers-page";
import type {
  Teacher,
  TeachersBadgeStyle,
  TeachersButtonStyle,
  TeachersPageSettings,
  TeachersTextStyle,
} from "@/lib/types";
import useSiteSettingsEditor from "@/lib/use-site-settings-editor";

type TeacherFormData = {
  name: string;
  subject: string;
  qualification: string;
  bio: string;
  photo_url: string;
  is_active: boolean;
  display_order: number;
};

const emptyFormData: TeacherFormData = {
  name: "",
  subject: "",
  qualification: "",
  bio: "",
  photo_url: "",
  is_active: true,
  display_order: 0,
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
  updateTeachersPage,
}: {
  title: string;
  value: TeachersTextStyle;
  path: string;
  updateTeachersPage: (path: string, value: unknown) => void;
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
          onChange={(next) => updateTeachersPage(`${path}.size`, next)}
          placeholder="32px"
        />
        <TextField
          label="Text Color"
          value={value.color}
          onChange={(next) => updateTeachersPage(`${path}.color`, next)}
          placeholder="#020617"
        />
        <SelectField
          label="Font Family"
          value={value.font_family}
          onChange={(next) => updateTeachersPage(`${path}.font_family`, next)}
          options={TEACHERS_FONT_FAMILY_OPTIONS}
        />
        <SelectField
          label="Font Style"
          value={value.font_style}
          onChange={(next) => updateTeachersPage(`${path}.font_style`, next)}
          options={TEACHERS_FONT_STYLE_OPTIONS}
        />
        <SelectField
          label="Font Weight"
          value={value.font_weight}
          onChange={(next) => updateTeachersPage(`${path}.font_weight`, next)}
          options={TEACHERS_FONT_WEIGHT_OPTIONS}
        />
      </div>
    </div>
  );
}

function BadgeFields({
  title,
  value,
  path,
  updateTeachersPage,
}: {
  title: string;
  value: TeachersBadgeStyle;
  path: string;
  updateTeachersPage: (path: string, value: unknown) => void;
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
          onChange={(next) => updateTeachersPage(`${path}.text_color`, next)}
          placeholder="#ffffff"
        />
        <TextField
          label="Background"
          value={value.background}
          onChange={(next) => updateTeachersPage(`${path}.background`, next)}
          placeholder="rgba(255,255,255,0.08)"
        />
        <TextField
          label="Border Color"
          value={value.border_color}
          onChange={(next) => updateTeachersPage(`${path}.border_color`, next)}
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
  updateTeachersPage,
}: {
  title: string;
  value: TeachersButtonStyle;
  path: string;
  updateTeachersPage: (path: string, value: unknown) => void;
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
          onChange={(next) => updateTeachersPage(`${path}.background`, next)}
          placeholder="#ffffff"
        />
        <TextField
          label="Text Color"
          value={value.text_color}
          onChange={(next) => updateTeachersPage(`${path}.text_color`, next)}
          placeholder="#020617"
        />
        <TextField
          label="Border Color"
          value={value.border_color}
          onChange={(next) => updateTeachersPage(`${path}.border_color`, next)}
          placeholder="#ffffff"
        />
      </div>
    </div>
  );
}

function TeacherField({
  label,
  value,
  onChange,
  placeholder,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40">
        {label}
      </label>
      <input
        type="text"
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="input-premium"
        placeholder={placeholder}
      />
    </div>
  );
}

export default function TeachersPage() {
  const { showToast } = useToast();
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
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTeacher, setEditTeacher] = useState<Teacher | null>(null);
  const [savingTeacher, setSavingTeacher] = useState(false);
  const [deletingTeacher, setDeletingTeacher] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);
  const [formData, setFormData] = useState<TeacherFormData>(emptyFormData);

  const teachersPage = useMemo(
    () => normalizeTeachersPage(settings?.teachers_page, settings?.site_name),
    [settings?.site_name, settings?.teachers_page],
  );

  const fetchTeachers = async () => {
    try {
      const response = await api.get("/admin/teachers");
      setTeachers(response.data as Teacher[]);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Could not load instructors",
        description: getApiErrorMessage(error, "Refresh the page and try again."),
      });
    } finally {
      setTeachersLoading(false);
    }
  };

  useEffect(() => {
    void fetchTeachers();
  }, []);

  const replaceTeachersPage = (nextTeachersPage: TeachersPageSettings) => {
    setSettings((current) =>
      current
        ? {
            ...current,
            teachers_page: nextTeachersPage,
          }
        : current,
    );
  };

  const updateTeachersPage = (path: string, value: unknown) => {
    setSettings((current) => {
      if (!current) return current;

      const nextTeachersPage = clone(
        normalizeTeachersPage(current.teachers_page, current.site_name),
      );
      setByPath(nextTeachersPage as unknown as Record<string, unknown>, path, value);

      return {
        ...current,
        teachers_page: nextTeachersPage,
      };
    });
  };

  const addPrinciple = () => {
    setSettings((current) => {
      if (!current) return current;

      const nextTeachersPage = clone(
        normalizeTeachersPage(current.teachers_page, current.site_name),
      );
      nextTeachersPage.principles.items.push({
        id: `teachers-principle-${Date.now()}`,
        title: "",
        description: "",
        icon: "sparkles",
      });

      return { ...current, teachers_page: nextTeachersPage };
    });
  };

  const removePrinciple = (index: number) => {
    setSettings((current) => {
      if (!current) return current;

      const nextTeachersPage = clone(
        normalizeTeachersPage(current.teachers_page, current.site_name),
      );
      nextTeachersPage.principles.items.splice(index, 1);

      return { ...current, teachers_page: nextTeachersPage };
    });
  };

  const movePrinciple = (index: number, direction: -1 | 1) => {
    setSettings((current) => {
      if (!current) return current;

      const nextTeachersPage = clone(
        normalizeTeachersPage(current.teachers_page, current.site_name),
      );
      const nextIndex = index + direction;

      if (nextIndex < 0 || nextIndex >= nextTeachersPage.principles.items.length) {
        return current;
      }

      const [item] = nextTeachersPage.principles.items.splice(index, 1);
      nextTeachersPage.principles.items.splice(nextIndex, 0, item);

      return { ...current, teachers_page: nextTeachersPage };
    });
  };

  const openModal = (teacher?: Teacher) => {
    if (teacher) {
      setEditTeacher(teacher);
      setFormData({
        name: teacher.name,
        subject: teacher.subject || "",
        qualification: teacher.qualification || "",
        bio: teacher.bio || "",
        photo_url: teacher.photo_url || "",
        is_active: teacher.is_active,
        display_order: teacher.display_order || 0,
      });
    } else {
      setEditTeacher(null);
      setFormData(emptyFormData);
    }

    setIsModalOpen(true);
  };

  const handleTeacherSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setSavingTeacher(true);

    try {
      if (editTeacher) {
        await api.put(`/admin/teachers/${editTeacher.id}`, formData);
      } else {
        await api.post("/admin/teachers", formData);
      }

      await fetchTeachers();
      setIsModalOpen(false);
      showToast({
        variant: "success",
        title: editTeacher ? "Instructor updated" : "Instructor created",
        description: "The faculty profile has been saved successfully.",
      });
    } catch (error) {
      showToast({
        variant: "error",
        title: "Instructor save failed",
        description: getApiErrorMessage(error, "Review the form values and try again."),
      });
    } finally {
      setSavingTeacher(false);
    }
  };

  const handleTeacherDelete = async () => {
    if (!teacherToDelete) return;

    setDeletingTeacher(true);
    try {
      await api.delete(`/admin/teachers/${teacherToDelete.id}`);
      await fetchTeachers();
      showToast({
        variant: "success",
        title: "Instructor deleted",
        description: `"${teacherToDelete.name}" has been removed.`,
      });
      setTeacherToDelete(null);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Delete failed",
        description: getApiErrorMessage(error, "The instructor could not be deleted."),
      });
    } finally {
      setDeletingTeacher(false);
    }
  };

  if (loading || teachersLoading || !settings) {
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
            Instructors Page
          </h2>
          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary/45">
            Manage the instructors page section by section, then curate the faculty roster below.
            The live preview uses the same public component the user sees.
          </p>
        </div>
        <PublicPreviewLink href="/teachers" label="Preview instructors page" />
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
            replaceTeachersPage(clone(teachersPage));
            await saveSettings({
              successTitle: "Instructors draft updated",
              successDescription:
                "The full instructors-page structure is saved to draft. Publish when approved.",
            });
          }}
        >
          <EditorPanel
            previewTarget="teachers-hero"
            title="Visibility"
            description="Turn individual instructors-page sections on or off without deleting their content."
          >
            <div className="grid gap-4 md:grid-cols-2">
              <ToggleField
                label="Hero Section"
                checked={teachersPage.visibility.hero}
                onChange={(next) => updateTeachersPage("visibility.hero", next)}
              />
              <ToggleField
                label="Filter Bar"
                checked={teachersPage.visibility.filter_bar}
                onChange={(next) => updateTeachersPage("visibility.filter_bar", next)}
              />
              <ToggleField
                label="Spotlight Panel"
                checked={teachersPage.visibility.spotlight}
                onChange={(next) => updateTeachersPage("visibility.spotlight", next)}
              />
              <ToggleField
                label="Principles Cards"
                checked={teachersPage.visibility.principles}
                onChange={(next) => updateTeachersPage("visibility.principles", next)}
              />
              <ToggleField
                label="Final CTA"
                checked={teachersPage.visibility.cta}
                onChange={(next) => updateTeachersPage("visibility.cta", next)}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="teachers-hero"
            title="Hero"
            description="Control the opening badge, heading, description, search prompt, and metric labels shown at the top of the instructors page."
          >
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Badge Text"
                  value={teachersPage.hero.badge_text}
                  onChange={(next) => updateTeachersPage("hero.badge_text", next)}
                  placeholder="Faculty collective"
                />
                <TextField
                  label="Search Label"
                  value={teachersPage.hero.search_label}
                  onChange={(next) => updateTeachersPage("hero.search_label", next)}
                  placeholder="Search faculty"
                />
              </div>

              <TextAreaField
                label="Hero Heading"
                value={teachersPage.hero.heading}
                onChange={(next) => updateTeachersPage("hero.heading", next)}
                rows={4}
              />
              <TextAreaField
                label="Hero Description"
                value={teachersPage.hero.description}
                onChange={(next) => updateTeachersPage("hero.description", next)}
                rows={4}
              />
              <TextField
                label="Search Placeholder"
                value={teachersPage.hero.search_placeholder}
                onChange={(next) => updateTeachersPage("hero.search_placeholder", next)}
                placeholder="Search by mentor name, subject, qualification, or bio"
              />

              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Faculty Metric Label"
                  value={teachersPage.hero.faculty_metric_label}
                  onChange={(next) => updateTeachersPage("hero.faculty_metric_label", next)}
                  placeholder="Faculty"
                />
                <TextField
                  label="Faculty Metric Value Override"
                  value={teachersPage.hero.faculty_metric_value}
                  onChange={(next) => updateTeachersPage("hero.faculty_metric_value", next)}
                  placeholder="Leave blank for automatic count"
                />
                <TextField
                  label="Subjects Metric Label"
                  value={teachersPage.hero.subjects_metric_label}
                  onChange={(next) => updateTeachersPage("hero.subjects_metric_label", next)}
                  placeholder="Subjects"
                />
                <TextField
                  label="Subjects Metric Value Override"
                  value={teachersPage.hero.subjects_metric_value}
                  onChange={(next) => updateTeachersPage("hero.subjects_metric_value", next)}
                  placeholder="Leave blank for automatic count"
                />
                <TextField
                  label="Mentorship Metric Label"
                  value={teachersPage.hero.mentorship_metric_label}
                  onChange={(next) => updateTeachersPage("hero.mentorship_metric_label", next)}
                  placeholder="Mentor-led"
                />
                <TextField
                  label="Mentorship Metric Value"
                  value={teachersPage.hero.mentorship_metric_value}
                  onChange={(next) => updateTeachersPage("hero.mentorship_metric_value", next)}
                  placeholder="1:1"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Section Background"
                  value={teachersPage.hero.style.section_background}
                  onChange={(next) => updateTeachersPage("hero.style.section_background", next)}
                  placeholder="linear-gradient(...)"
                />
                <TextField
                  label="Search Panel Background"
                  value={teachersPage.hero.style.search_panel_background}
                  onChange={(next) =>
                    updateTeachersPage("hero.style.search_panel_background", next)
                  }
                />
                <TextField
                  label="Search Panel Border"
                  value={teachersPage.hero.style.search_panel_border_color}
                  onChange={(next) =>
                    updateTeachersPage("hero.style.search_panel_border_color", next)
                  }
                />
                <TextField
                  label="Search Input Background"
                  value={teachersPage.hero.style.search_input_background}
                  onChange={(next) =>
                    updateTeachersPage("hero.style.search_input_background", next)
                  }
                />
                <TextField
                  label="Search Input Border"
                  value={teachersPage.hero.style.search_input_border_color}
                  onChange={(next) =>
                    updateTeachersPage("hero.style.search_input_border_color", next)
                  }
                />
                <TextField
                  label="Search Icon Background"
                  value={teachersPage.hero.style.search_icon_background}
                  onChange={(next) =>
                    updateTeachersPage("hero.style.search_icon_background", next)
                  }
                />
                <TextField
                  label="Search Icon Color"
                  value={teachersPage.hero.style.search_icon_color}
                  onChange={(next) => updateTeachersPage("hero.style.search_icon_color", next)}
                />
                <TextField
                  label="Metric Card Background"
                  value={teachersPage.hero.style.metric_panel_background}
                  onChange={(next) =>
                    updateTeachersPage("hero.style.metric_panel_background", next)
                  }
                />
                <TextField
                  label="Metric Card Border"
                  value={teachersPage.hero.style.metric_panel_border_color}
                  onChange={(next) =>
                    updateTeachersPage("hero.style.metric_panel_border_color", next)
                  }
                />
              </div>

              <BadgeFields
                title="Badge Style"
                value={teachersPage.hero.style.badge}
                path="hero.style.badge"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Heading Typography"
                value={teachersPage.hero.style.heading}
                path="hero.style.heading"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Description Typography"
                value={teachersPage.hero.style.description}
                path="hero.style.description"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Search Label Typography"
                value={teachersPage.hero.style.search_label}
                path="hero.style.search_label"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Search Input Typography"
                value={teachersPage.hero.style.search_input}
                path="hero.style.search_input"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Metric Label Typography"
                value={teachersPage.hero.style.metric_label}
                path="hero.style.metric_label"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Metric Value Typography"
                value={teachersPage.hero.style.metric_value}
                path="hero.style.metric_value"
                updateTeachersPage={updateTeachersPage}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="teachers-filter-bar"
            title="Search and Filters"
            description="Customize subject filter labels, results copy, and the chip styling shown above the roster."
          >
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="All Subjects Label"
                  value={teachersPage.filter_bar.all_subjects_label}
                  onChange={(next) => updateTeachersPage("filter_bar.all_subjects_label", next)}
                  placeholder="All Faculty"
                />
                <TextField
                  label="Clear Search Label"
                  value={teachersPage.filter_bar.clear_search_label}
                  onChange={(next) => updateTeachersPage("filter_bar.clear_search_label", next)}
                  placeholder="Clear search"
                />
                <TextField
                  label="Results Prefix"
                  value={teachersPage.filter_bar.results_prefix}
                  onChange={(next) => updateTeachersPage("filter_bar.results_prefix", next)}
                  placeholder="Showing"
                />
                <TextField
                  label="Results Suffix"
                  value={teachersPage.filter_bar.results_suffix}
                  onChange={(next) => updateTeachersPage("filter_bar.results_suffix", next)}
                  placeholder="mentors"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Panel Background"
                  value={teachersPage.filter_bar.style.panel_background}
                  onChange={(next) => updateTeachersPage("filter_bar.style.panel_background", next)}
                />
                <TextField
                  label="Panel Border"
                  value={teachersPage.filter_bar.style.panel_border_color}
                  onChange={(next) =>
                    updateTeachersPage("filter_bar.style.panel_border_color", next)
                  }
                />
                <TextField
                  label="Chip Background"
                  value={teachersPage.filter_bar.style.chip_background}
                  onChange={(next) => updateTeachersPage("filter_bar.style.chip_background", next)}
                />
                <TextField
                  label="Chip Border"
                  value={teachersPage.filter_bar.style.chip_border_color}
                  onChange={(next) =>
                    updateTeachersPage("filter_bar.style.chip_border_color", next)
                  }
                />
                <TextField
                  label="Active Chip Background"
                  value={teachersPage.filter_bar.style.chip_active_background}
                  onChange={(next) =>
                    updateTeachersPage("filter_bar.style.chip_active_background", next)
                  }
                />
                <TextField
                  label="Active Chip Border"
                  value={teachersPage.filter_bar.style.chip_active_border_color}
                  onChange={(next) =>
                    updateTeachersPage("filter_bar.style.chip_active_border_color", next)
                  }
                />
                <TextField
                  label="Active Chip Text Color"
                  value={teachersPage.filter_bar.style.chip_active_text_color}
                  onChange={(next) =>
                    updateTeachersPage("filter_bar.style.chip_active_text_color", next)
                  }
                />
                <TextField
                  label="Results Badge Background"
                  value={teachersPage.filter_bar.style.results_background}
                  onChange={(next) =>
                    updateTeachersPage("filter_bar.style.results_background", next)
                  }
                />
                <TextField
                  label="Results Badge Border"
                  value={teachersPage.filter_bar.style.results_border_color}
                  onChange={(next) =>
                    updateTeachersPage("filter_bar.style.results_border_color", next)
                  }
                />
                <TextField
                  label="Clear Button Background"
                  value={teachersPage.filter_bar.style.clear_button_background}
                  onChange={(next) =>
                    updateTeachersPage("filter_bar.style.clear_button_background", next)
                  }
                />
                <TextField
                  label="Clear Button Border"
                  value={teachersPage.filter_bar.style.clear_button_border_color}
                  onChange={(next) =>
                    updateTeachersPage("filter_bar.style.clear_button_border_color", next)
                  }
                />
              </div>

              <TypographyFields
                title="Chip Typography"
                value={teachersPage.filter_bar.style.chip_text}
                path="filter_bar.style.chip_text"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Results Typography"
                value={teachersPage.filter_bar.style.results_text}
                path="filter_bar.style.results_text"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Clear Button Typography"
                value={teachersPage.filter_bar.style.clear_text}
                path="filter_bar.style.clear_text"
                updateTeachersPage={updateTeachersPage}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="teachers-spotlight"
            title="Spotlight"
            description="Configure the lead mentor panel, empty state messaging, and the supporting metadata labels."
          >
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Badge Text"
                  value={teachersPage.spotlight.badge_text}
                  onChange={(next) => updateTeachersPage("spotlight.badge_text", next)}
                  placeholder="Faculty spotlight"
                />
                <TextField
                  label="Role Value"
                  value={teachersPage.spotlight.role_value}
                  onChange={(next) => updateTeachersPage("spotlight.role_value", next)}
                  placeholder="Mentor-led learning"
                />
                <TextField
                  label="Focus Label"
                  value={teachersPage.spotlight.focus_label}
                  onChange={(next) => updateTeachersPage("spotlight.focus_label", next)}
                  placeholder="Focus area"
                />
                <TextField
                  label="Role Label"
                  value={teachersPage.spotlight.role_label}
                  onChange={(next) => updateTeachersPage("spotlight.role_label", next)}
                  placeholder="Role"
                />
                <TextField
                  label="Focus Fallback"
                  value={teachersPage.spotlight.focus_fallback}
                  onChange={(next) => updateTeachersPage("spotlight.focus_fallback", next)}
                  placeholder="Institutional faculty"
                />
                <TextField
                  label="Bio Fallback"
                  value={teachersPage.spotlight.bio_fallback}
                  onChange={(next) => updateTeachersPage("spotlight.bio_fallback", next)}
                  placeholder="Experienced faculty profile..."
                />
              </div>

              <TextField
                label="Empty State Title"
                value={teachersPage.spotlight.empty_title}
                onChange={(next) => updateTeachersPage("spotlight.empty_title", next)}
                placeholder="No mentor matches the current search."
              />
              <TextAreaField
                label="Empty State Description"
                value={teachersPage.spotlight.empty_description}
                onChange={(next) => updateTeachersPage("spotlight.empty_description", next)}
                rows={3}
              />

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Outer Panel Background"
                  value={teachersPage.spotlight.style.panel_background}
                  onChange={(next) => updateTeachersPage("spotlight.style.panel_background", next)}
                />
                <TextField
                  label="Outer Panel Border"
                  value={teachersPage.spotlight.style.panel_border_color}
                  onChange={(next) =>
                    updateTeachersPage("spotlight.style.panel_border_color", next)
                  }
                />
                <TextField
                  label="Content Panel Background"
                  value={teachersPage.spotlight.style.content_background}
                  onChange={(next) =>
                    updateTeachersPage("spotlight.style.content_background", next)
                  }
                />
                <TextField
                  label="Content Panel Border"
                  value={teachersPage.spotlight.style.content_border_color}
                  onChange={(next) =>
                    updateTeachersPage("spotlight.style.content_border_color", next)
                  }
                />
                <TextField
                  label="Meta Card Background"
                  value={teachersPage.spotlight.style.meta_panel_background}
                  onChange={(next) =>
                    updateTeachersPage("spotlight.style.meta_panel_background", next)
                  }
                />
                <TextField
                  label="Meta Card Border"
                  value={teachersPage.spotlight.style.meta_panel_border_color}
                  onChange={(next) =>
                    updateTeachersPage("spotlight.style.meta_panel_border_color", next)
                  }
                />
              </div>

              <BadgeFields
                title="Badge Style"
                value={teachersPage.spotlight.style.badge}
                path="spotlight.style.badge"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Name Typography"
                value={teachersPage.spotlight.style.name}
                path="spotlight.style.name"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Qualification Typography"
                value={teachersPage.spotlight.style.qualification}
                path="spotlight.style.qualification"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Biography Typography"
                value={teachersPage.spotlight.style.body}
                path="spotlight.style.body"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Meta Label Typography"
                value={teachersPage.spotlight.style.meta_label}
                path="spotlight.style.meta_label"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Meta Value Typography"
                value={teachersPage.spotlight.style.meta_value}
                path="spotlight.style.meta_value"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Empty State Title Typography"
                value={teachersPage.spotlight.style.empty_title}
                path="spotlight.style.empty_title"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Empty State Description Typography"
                value={teachersPage.spotlight.style.empty_body}
                path="spotlight.style.empty_body"
                updateTeachersPage={updateTeachersPage}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="teachers-roster"
            title="Roster Cards"
            description="Control the faculty card fallback copy and the typography used in the supporting roster cards."
          >
            <div className="space-y-6">
              <TextAreaField
                label="Card Bio Fallback"
                value={teachersPage.roster.fallback_bio}
                onChange={(next) => updateTeachersPage("roster.fallback_bio", next)}
                rows={3}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Card Background"
                  value={teachersPage.roster.style.panel_background}
                  onChange={(next) => updateTeachersPage("roster.style.panel_background", next)}
                />
                <TextField
                  label="Card Border"
                  value={teachersPage.roster.style.panel_border_color}
                  onChange={(next) => updateTeachersPage("roster.style.panel_border_color", next)}
                />
              </div>

              <TypographyFields
                title="Subject Typography"
                value={teachersPage.roster.style.subject}
                path="roster.style.subject"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Name Typography"
                value={teachersPage.roster.style.name}
                path="roster.style.name"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Qualification Typography"
                value={teachersPage.roster.style.qualification}
                path="roster.style.qualification"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Bio Typography"
                value={teachersPage.roster.style.body}
                path="roster.style.body"
                updateTeachersPage={updateTeachersPage}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="teachers-principles"
            title="Principles"
            description="Edit the trust-building cards shown below the roster and reorder them as needed."
            action={
              <button
                type="button"
                onClick={addPrinciple}
                className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition hover:bg-black"
              >
                <Plus className="h-4 w-4" />
                Add Principle
              </button>
            }
          >
            <div className="space-y-6">
              {teachersPage.principles.items.map((item, index) => (
                <div
                  key={item.id}
                  className="space-y-6 rounded-[30px] border border-primary/10 bg-primary/[0.02] p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-primary">
                        Principle {index + 1}
                      </p>
                      <p className="mt-1 text-sm text-primary/45">
                        Manage the title, description, icon, and display order.
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => movePrinciple(index, -1)}
                        disabled={index === 0}
                        className="rounded-xl border border-primary/10 bg-white p-2 text-primary transition hover:bg-primary hover:text-white disabled:opacity-30"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => movePrinciple(index, 1)}
                        disabled={index === teachersPage.principles.items.length - 1}
                        className="rounded-xl border border-primary/10 bg-white p-2 text-primary transition hover:bg-primary hover:text-white disabled:opacity-30"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removePrinciple(index)}
                        className="rounded-xl border border-primary/10 bg-white p-2 text-primary transition hover:bg-black hover:text-white"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid gap-6 md:grid-cols-2">
                    <TextField
                      label="Title"
                      value={item.title}
                      onChange={(next) => updateTeachersPage(`principles.items.${index}.title`, next)}
                      placeholder="Visible teaching identity"
                    />
                    <SelectField
                      label="Icon"
                      value={item.icon}
                      onChange={(next) => updateTeachersPage(`principles.items.${index}.icon`, next)}
                      options={TEACHERS_ICON_OPTIONS}
                    />
                  </div>
                  <TextAreaField
                    label="Description"
                    value={item.description}
                    onChange={(next) =>
                      updateTeachersPage(`principles.items.${index}.description`, next)
                    }
                    rows={3}
                  />
                </div>
              ))}

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Card Background"
                  value={teachersPage.principles.style.panel_background}
                  onChange={(next) =>
                    updateTeachersPage("principles.style.panel_background", next)
                  }
                />
                <TextField
                  label="Card Border"
                  value={teachersPage.principles.style.panel_border_color}
                  onChange={(next) =>
                    updateTeachersPage("principles.style.panel_border_color", next)
                  }
                />
                <TextField
                  label="Icon Background"
                  value={teachersPage.principles.style.icon_background}
                  onChange={(next) =>
                    updateTeachersPage("principles.style.icon_background", next)
                  }
                />
              </div>

              <TypographyFields
                title="Card Title Typography"
                value={teachersPage.principles.style.heading}
                path="principles.style.heading"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Card Description Typography"
                value={teachersPage.principles.style.body}
                path="principles.style.body"
                updateTeachersPage={updateTeachersPage}
              />
            </div>
          </EditorPanel>

          <EditorPanel
            previewTarget="teachers-cta"
            title="Final CTA"
            description="Configure the closing conversion block and button that push the visitor to the next action."
          >
            <div className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <TextField
                  label="Badge Text"
                  value={teachersPage.cta.badge_text}
                  onChange={(next) => updateTeachersPage("cta.badge_text", next)}
                  placeholder="Need a recommendation?"
                />
                <TextField
                  label="Button Label"
                  value={teachersPage.cta.button_label}
                  onChange={(next) => updateTeachersPage("cta.button_label", next)}
                  placeholder="Contact admissions"
                />
              </div>
              <TextAreaField
                label="CTA Heading"
                value={teachersPage.cta.heading}
                onChange={(next) => updateTeachersPage("cta.heading", next)}
                rows={3}
              />
              <TextAreaField
                label="CTA Description"
                value={teachersPage.cta.description}
                onChange={(next) => updateTeachersPage("cta.description", next)}
                rows={3}
              />
              <TextField
                label="Button Link"
                value={teachersPage.cta.button_link}
                onChange={(next) => updateTeachersPage("cta.button_link", next)}
                placeholder="/contact"
              />

              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Panel Background"
                  value={teachersPage.cta.style.panel_background}
                  onChange={(next) => updateTeachersPage("cta.style.panel_background", next)}
                />
                <TextField
                  label="Panel Border"
                  value={teachersPage.cta.style.panel_border_color}
                  onChange={(next) => updateTeachersPage("cta.style.panel_border_color", next)}
                />
              </div>

              <BadgeFields
                title="Badge Style"
                value={teachersPage.cta.style.badge}
                path="cta.style.badge"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Heading Typography"
                value={teachersPage.cta.style.heading}
                path="cta.style.heading"
                updateTeachersPage={updateTeachersPage}
              />
              <TypographyFields
                title="Description Typography"
                value={teachersPage.cta.style.body}
                path="cta.style.body"
                updateTeachersPage={updateTeachersPage}
              />
              <ButtonFields
                title="Button Style"
                value={teachersPage.cta.style.button}
                path="cta.style.button"
                updateTeachersPage={updateTeachersPage}
              />
            </div>
          </EditorPanel>

          <div className="flex justify-end">
            <SaveButton saving={saving} label="Save instructors page" />
          </div>
        </form>

        <LivePreviewPanel title="Instructors Page Preview" previewType="page">
          <PublicPagePreview settings={settings} pathname="/teachers">
            <TeachersDirectoryView
              teachers={teachers.filter((teacher) => teacher.is_active)}
              settings={teachersPage}
              siteName={settings.site_name}
              interactive={false}
            />
          </PublicPagePreview>
        </LivePreviewPanel>
      </div>

      <EditorPanel
        previewTarget="teachers-roster"
        title="Faculty Roster"
        description="Create, edit, delete, and reorder the individual instructor profiles shown inside the instructors page."
        action={
          <button
            type="button"
            onClick={() => openModal()}
            className="inline-flex items-center gap-3 rounded-2xl bg-primary px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800"
          >
            <Plus className="h-4 w-4" /> Add Instructor
          </button>
        }
      >
        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {teachers.map((teacher, index) => (
            <motion.div
              key={teacher.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="group cursor-pointer overflow-hidden rounded-[32px] border border-primary/5 bg-white transition-all duration-500 hover:shadow-premium"
              onClick={() => openModal(teacher)}
            >
              <div className="relative p-8">
                <div className="absolute right-4 top-4 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setTeacherToDelete(teacher);
                    }}
                    className="rounded-xl bg-white/90 p-2 text-primary/35 transition hover:bg-primary hover:text-white"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>

                <div className="mb-6 flex justify-center">
                  <div
                    className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-full text-3xl font-black text-white shadow-inner"
                    style={{
                      background: resolveMediaUrl(teacher.photo_url)
                        ? undefined
                        : "linear-gradient(135deg, var(--color-accent, #3b82f6), var(--color-primary, #1e1b4b))",
                    }}
                  >
                    {resolveMediaUrl(teacher.photo_url) ? (
                      <img
                        src={resolveMediaUrl(teacher.photo_url)}
                        alt={teacher.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      teacher.name.charAt(0)
                    )}
                  </div>
                </div>

                <div className="space-y-3 text-center">
                  <span
                    className={`inline-flex rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-widest ${
                      teacher.is_active
                        ? "bg-primary text-white"
                        : "bg-primary/[0.06] text-primary/55"
                    }`}
                  >
                    {teacher.is_active ? "Published" : "Hidden"}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight text-primary">{teacher.name}</h3>
                  {teacher.subject ? (
                    <p className="text-sm font-semibold text-primary/55">{teacher.subject}</p>
                  ) : null}
                  {teacher.qualification ? (
                    <p className="text-xs font-medium text-primary/30">{teacher.qualification}</p>
                  ) : null}
                  <p className="line-clamp-4 text-sm leading-relaxed text-primary/60">
                    {teacher.bio || teachersPage.roster.fallback_bio}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}

          {teachers.length === 0 ? (
            <div className="col-span-full rounded-[32px] border-2 border-dashed border-primary/10 py-20 text-center text-primary/20">
              <GraduationCap className="mx-auto mb-4 h-16 w-16" />
              <p className="text-lg font-serif italic">No instructor profiles created</p>
            </div>
          ) : null}
        </div>
      </EditorPanel>

      <AnimatePresence>
        {isModalOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="flex max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-[32px] bg-[#fcfcfc] shadow-2xl"
            >
              <div className="w-1/2 overflow-y-auto border-r border-primary/5 p-10">
                <div className="mb-8 flex items-center justify-between">
                  <h3 className="text-2xl font-serif font-bold text-primary">
                    {editTeacher ? "Edit Instructor" : "New Instructor"}
                  </h3>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-xl p-2 transition hover:bg-primary/5"
                  >
                    <X className="h-5 w-5 text-primary/40" />
                  </button>
                </div>

                <form onSubmit={handleTeacherSave} className="space-y-6">
                  <TeacherField
                    label="Instructor Name"
                    value={formData.name}
                    onChange={(value) => setFormData({ ...formData, name: value })}
                    required
                    placeholder="e.g. Ram Sharma"
                  />
                  <TeacherField
                    label="Subject"
                    value={formData.subject}
                    onChange={(value) => setFormData({ ...formData, subject: value })}
                    placeholder="e.g. Physics"
                  />
                  <TeacherField
                    label="Qualification"
                    value={formData.qualification}
                    onChange={(value) => setFormData({ ...formData, qualification: value })}
                    placeholder="e.g. M.Sc. in Physics"
                  />

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40">
                      Profile Photo
                    </label>
                    <ImageUpload
                      value={formData.photo_url}
                      onChange={(value) => setFormData({ ...formData, photo_url: value })}
                      label="Upload Instructor Photo"
                      className="max-w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-primary/40">
                      Biography
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(event) => setFormData({ ...formData, bio: event.target.value })}
                      className="input-premium min-h-[140px] py-4"
                      placeholder="Write a short introduction for this instructor"
                    />
                  </div>

                  <div className="flex items-center justify-between rounded-2xl bg-primary/5 p-4">
                    <label className="flex items-center gap-3 text-sm font-medium text-primary">
                      <input
                        type="checkbox"
                        checked={formData.is_active}
                        onChange={(event) =>
                          setFormData({ ...formData, is_active: event.target.checked })
                        }
                        className="h-5 w-5 rounded accent-accent"
                      />
                      Visible on site
                    </label>
                    <div className="flex items-center gap-2 text-xs text-primary/40">
                      Order:
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(event) =>
                          setFormData({
                            ...formData,
                            display_order: Number(event.target.value),
                          })
                        }
                        className="input-premium w-16 px-3 py-2 text-center"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={savingTeacher}
                    className="w-full rounded-2xl bg-primary py-5 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-xl transition-all hover:bg-accent hover:text-primary disabled:opacity-50"
                  >
                    {savingTeacher ? "Saving..." : "Save Instructor"}
                  </button>
                </form>
              </div>

              <div className="w-1/2 bg-slate-50">
                <LivePreviewPanel title="Instructor Card Preview">
                  <div className="p-6">
                    <TeacherCardPreview formData={formData} />
                  </div>
                </LivePreviewPanel>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <ConfirmDialog
        open={teacherToDelete !== null}
        title="Delete instructor"
        description={
          teacherToDelete
            ? `Delete "${teacherToDelete.name}" from the instructors roster?`
            : "Delete this instructor?"
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        confirmTone="danger"
        loading={deletingTeacher}
        onConfirm={handleTeacherDelete}
        onClose={() => {
          if (!deletingTeacher) {
            setTeacherToDelete(null);
          }
        }}
      />

      <style jsx global>{`
        .input-premium {
          @apply w-full rounded-xl border border-primary/10 bg-primary/5 px-4 py-3 text-sm font-medium outline-none transition-all placeholder:text-primary/20 focus:border-accent;
        }
      `}</style>
      </div>
    </PreviewSyncProvider>
  );
}
