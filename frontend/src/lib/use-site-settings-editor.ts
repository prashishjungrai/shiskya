"use client";

import { SetStateAction, useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import {
  SiteSettings,
  SiteSettingsEditorState,
  SiteSettingsRevision,
} from "@/lib/types";
import { useToast } from "@/components/ui/ToastProvider";
import { getApiErrorMessage } from "@/lib/api-errors";

type SaveOptions = {
  successTitle?: string;
  successDescription?: string;
  errorTitle?: string;
  errorDescription?: string;
};

function cloneSettings(settings: SiteSettings) {
  return JSON.parse(JSON.stringify(settings)) as SiteSettings;
}

function comparableSettings(settings: SiteSettings | null) {
  if (!settings) return null;
  const { ...rest } = settings;
  return rest;
}

function hasDraftChanges(draft: SiteSettings | null, published: SiteSettings | null) {
  return JSON.stringify(comparableSettings(draft)) !== JSON.stringify(comparableSettings(published));
}

export default function useSiteSettingsEditor() {
  const { showToast } = useToast();
  const [settings, setSettingsState] = useState<SiteSettings | null>(null);
  const [publishedSettings, setPublishedSettings] = useState<SiteSettings | null>(null);
  const [revisions, setRevisions] = useState<SiteSettingsRevision[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [discarding, setDiscarding] = useState(false);
  const [restoringRevisionId, setRestoringRevisionId] = useState<string | null>(null);
  const [restoringRevisionMode, setRestoringRevisionMode] = useState<"draft" | "publish" | null>(
    null,
  );
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(false);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(null);
  const [revisionCount, setRevisionCount] = useState(0);

  const applyEditorState = useCallback((state: SiteSettingsEditorState) => {
    setSettingsState(state.draft);
    setPublishedSettings(state.published);
    setHasUnpublishedChanges(state.has_unpublished_changes);
    setLastPublishedAt(state.last_published_at || state.published.updated_at || null);
    setRevisionCount(state.revision_count || 0);
  }, []);

  const loadSettings = useCallback(async () => {
    setLoading(true);
    try {
      const [editorStateResponse, revisionResponse] = await Promise.all([
        api.get("/admin/settings/editor-state"),
        api.get("/admin/settings/revisions?limit=6"),
      ]);

      applyEditorState(editorStateResponse.data as SiteSettingsEditorState);
      setRevisions(revisionResponse.data as SiteSettingsRevision[]);
    } catch (error) {
      showToast({
        variant: "error",
        title: "Could not load site settings",
        description: getApiErrorMessage(error, "Refresh the page and try again."),
      });
    } finally {
      setLoading(false);
    }
  }, [applyEditorState, showToast]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

  const refreshRevisions = useCallback(async () => {
    const response = await api.get("/admin/settings/revisions?limit=6");
    setRevisions(response.data as SiteSettingsRevision[]);
  }, []);

  const saveSettings = useCallback(
    async (options: SaveOptions = {}) => {
      if (!settings) return false;

      setSaving(true);
      try {
        const response = await api.put("/admin/settings", settings);
        const nextDraft = response.data as SiteSettings;
        setSettingsState(nextDraft);
        setHasUnpublishedChanges(hasDraftChanges(nextDraft, publishedSettings));
        showToast({
          variant: "success",
          title: options.successTitle || "Draft updated",
          description:
            options.successDescription ||
            "Your changes are saved as a draft. Publish when you are ready.",
        });
        return true;
      } catch (error) {
        showToast({
          variant: "error",
          title: options.errorTitle || "Draft update failed",
          description:
            options.errorDescription ||
            getApiErrorMessage(error, "The draft could not be saved."),
        });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [publishedSettings, settings, showToast],
  );

  const publishSettings = useCallback(async () => {
    setPublishing(true);
    try {
      const [publishResponse, revisionResponse] = await Promise.all([
        api.post("/admin/settings/publish"),
        api.get("/admin/settings/revisions?limit=6"),
      ]);
      applyEditorState(publishResponse.data as SiteSettingsEditorState);
      setRevisions(revisionResponse.data as SiteSettingsRevision[]);
      showToast({
        variant: "success",
        title: "Changes published",
        description: "The public site now reflects the latest approved draft.",
      });
      return true;
    } catch (error) {
      showToast({
        variant: "error",
        title: "Publish failed",
        description: getApiErrorMessage(error, "The draft could not be published."),
      });
      return false;
    } finally {
      setPublishing(false);
    }
  }, [applyEditorState, showToast]);

  const discardDraft = useCallback(async () => {
    setDiscarding(true);
    try {
      const response = await api.post("/admin/settings/discard");
      applyEditorState(response.data as SiteSettingsEditorState);
      showToast({
        variant: "info",
        title: "Draft discarded",
        description: "The editor is back in sync with the current published site.",
      });
      return true;
    } catch (error) {
      showToast({
        variant: "error",
        title: "Discard failed",
        description: getApiErrorMessage(error, "The draft could not be reset."),
      });
      return false;
    } finally {
      setDiscarding(false);
    }
  }, [applyEditorState, showToast]);

  const restoreRevision = useCallback(
    async (revisionId: string, mode: "draft" | "publish") => {
      setRestoringRevisionId(revisionId);
      setRestoringRevisionMode(mode);
      try {
        const response = await api.post(
          `/admin/settings/revisions/${revisionId}/restore?publish=${mode === "publish"}`,
        );
        applyEditorState(response.data as SiteSettingsEditorState);
        await refreshRevisions();
        showToast({
          variant: "success",
          title: mode === "publish" ? "Revision published" : "Revision restored to draft",
          description:
            mode === "publish"
              ? "The selected revision is now live on the public site."
              : "The selected revision is now loaded into the draft preview.",
        });
        return true;
      } catch (error) {
        showToast({
          variant: "error",
          title: mode === "publish" ? "Revision publish failed" : "Revision restore failed",
          description: getApiErrorMessage(
            error,
            mode === "publish"
              ? "The selected revision could not be published."
              : "The selected revision could not be loaded into draft.",
          ),
        });
        return false;
      } finally {
        setRestoringRevisionId(null);
        setRestoringRevisionMode(null);
      }
    },
    [applyEditorState, refreshRevisions, showToast],
  );

  const updateNested = useCallback(
    (path: string, value: unknown) => {
      setSettingsState((current) => {
        if (!current) return current;

        const next = cloneSettings(current);
        const keys = path.split(".");
        let pointer = next as unknown as Record<string, unknown>;

        for (let index = 0; index < keys.length - 1; index += 1) {
          const key = keys[index];
          const nextValue = pointer[key];

          if (!nextValue || typeof nextValue !== "object") {
            pointer[key] = {};
          }

          pointer = pointer[key] as Record<string, unknown>;
        }

        pointer[keys[keys.length - 1]] = value;
        setHasUnpublishedChanges(hasDraftChanges(next, publishedSettings));
        return next;
      });
    },
    [publishedSettings],
  );

  const setSettings = useCallback(
    (value: SetStateAction<SiteSettings | null>) => {
      setSettingsState((current) => {
        const nextValue =
          typeof value === "function"
            ? (value as (prevState: SiteSettings | null) => SiteSettings | null)(current)
            : value;
        setHasUnpublishedChanges(hasDraftChanges(nextValue, publishedSettings));
        return nextValue;
      });
    },
    [publishedSettings],
  );

  return {
    settings,
    setSettings,
    publishedSettings,
    revisions,
    loading,
    saving,
    publishing,
    discarding,
    restoringRevisionId,
    restoringRevisionMode,
    hasUnpublishedChanges,
    lastPublishedAt,
    revisionCount,
    loadSettings,
    saveSettings,
    publishSettings,
    discardDraft,
    restoreRevision,
    updateNested,
  };
}
