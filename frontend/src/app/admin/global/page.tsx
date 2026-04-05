"use client";

import { useState } from "react";
import HomepagePreview from "@/components/admin/HomepagePreview";
import LivePreviewPanel from "@/components/admin/LivePreviewPanel";
import ThemeEditor from "@/app/admin/settings/ThemeEditor";
import ImageUpload from "@/components/ImageUpload";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import {
  EditorPanel,
  PublishingHistoryPanel,
  PublishingToolbar,
  SaveButton,
  TextAreaField,
  TextField,
} from "@/components/admin/EditorToolkit";
import { PreviewSyncProvider } from "@/components/admin/PreviewSyncContext";
import useSiteSettingsEditor from "@/lib/use-site-settings-editor";
import { SiteSettings, SiteSettingsRevision } from "@/lib/types";

function comparableRevisionSnapshot(revision: SiteSettingsRevision) {
  const { id, published_at, published_by, source_updated_at, ...rest } = revision;
  return rest;
}

function comparableSettingsSnapshot(settings: SiteSettings) {
  const { id, updated_at, source_updated_at, ...rest } = settings;
  return rest;
}

export default function GlobalEditorPage() {
  const {
    settings,
    setSettings,
    publishedSettings,
    loading,
    saving,
    publishing,
    discarding,
    restoringRevisionId,
    restoringRevisionMode,
    hasUnpublishedChanges,
    lastPublishedAt,
    revisionCount,
    revisions,
    saveSettings,
    publishSettings,
    discardDraft,
    restoreRevision,
    updateNested,
  } = useSiteSettingsEditor();
  const [restoreTarget, setRestoreTarget] = useState<{
    revision: SiteSettingsRevision;
    mode: "draft" | "publish";
  } | null>(null);

  if (loading || !settings) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  const publishedRevisionId =
    revisions.find((revision) => {
      if (!publishedSettings) return false;
      return (
        JSON.stringify(comparableRevisionSnapshot(revision)) ===
        JSON.stringify(comparableSettingsSnapshot(publishedSettings))
      );
    })?.id || null;

  const draftRevisionId =
    revisions.find(
      (revision) =>
        JSON.stringify(comparableRevisionSnapshot(revision)) ===
        JSON.stringify(comparableSettingsSnapshot(settings)),
    )?.id || null;

  const draftBaseRevisionId =
    settings.source_updated_at
      ? revisions.find((revision) => revision.published_at === settings.source_updated_at)?.id ||
        null
      : null;

  return (
    <PreviewSyncProvider>
      <div className="space-y-10">
      <header>
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-primary/25">
          Site Wide Editor
        </p>
        <h2 className="mt-3 text-4xl font-serif font-bold tracking-tight text-primary">
          Global Settings
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-primary/45">
          Keep the global settings focused on the parts that affect every page: branding,
          theme, footer, social links, and search metadata.
        </p>
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

      <div className="grid gap-8 xl:grid-cols-[minmax(24rem,0.82fr)_minmax(46rem,1.18fr)]">
        <ThemeEditor
          settings={settings}
          saving={saving}
          updateNested={updateNested}
          onSave={() =>
            saveSettings({
              successTitle: "Theme draft updated",
              successDescription:
                "The live preview now matches the saved draft. Publish to update the public site.",
            })
          }
        />

        <LivePreviewPanel title="Live User-Side Preview" previewType="page">
          <HomepagePreview settings={settings} />
        </LivePreviewPanel>
      </div>

      <EditorPanel
        previewTarget="site-footer"
        title="Brand, Footer, and SEO"
        description="This editor owns the cross-site settings that should not be mixed into page-specific editors."
      >
        <form
          className="space-y-10"
          onSubmit={async (event) => {
            event.preventDefault();
            await saveSettings({
              successTitle: "Global draft updated",
              successDescription:
                "Branding, footer, and SEO values are saved to draft until publication.",
            });
          }}
        >
          <div className="space-y-6">
            <h4 className="text-lg font-bold text-primary">Brand Identity</h4>
            <div className="grid gap-6 md:grid-cols-2">
              <TextField
                label="Site Name"
                value={settings.site_name || ""}
                onChange={(value) =>
                  setSettings((current) =>
                    current ? { ...current, site_name: value } : current,
                  )
                }
                placeholder="Institution name"
              />
              <div className="space-y-2">
                <label className="ml-2 block text-[10px] font-bold uppercase tracking-widest text-primary/40">
                  Logo
                </label>
                <ImageUpload
                  value={settings.logo_url || ""}
                  onChange={(value) =>
                    setSettings((current) =>
                      current ? { ...current, logo_url: value } : current,
                    )
                  }
                  label="Upload Logo"
                  className="max-w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold text-primary">Footer and Social</h4>
            <TextAreaField
              label="Footer Description"
              value={settings.footer_content?.description || ""}
              onChange={(value) => updateNested("footer_content.description", value)}
              placeholder="Write the footer description shown across the site."
              rows={4}
            />
            <TextField
              label="Copyright Text"
              value={settings.footer_content?.copyright || ""}
              onChange={(value) => updateNested("footer_content.copyright", value)}
              placeholder="Copyright line"
            />
            <div className="grid gap-6 md:grid-cols-2">
              <TextField
                label="Facebook URL"
                type="url"
                value={settings.social_links?.facebook || ""}
                onChange={(value) => updateNested("social_links.facebook", value)}
                placeholder="https://facebook.com/..."
              />
              <TextField
                label="Instagram URL"
                type="url"
                value={settings.social_links?.instagram || ""}
                onChange={(value) => updateNested("social_links.instagram", value)}
                placeholder="https://instagram.com/..."
              />
              <TextField
                label="YouTube URL"
                type="url"
                value={settings.social_links?.youtube || ""}
                onChange={(value) => updateNested("social_links.youtube", value)}
                placeholder="https://youtube.com/..."
              />
              <TextField
                label="TikTok URL"
                type="url"
                value={settings.social_links?.tiktok || ""}
                onChange={(value) => updateNested("social_links.tiktok", value)}
                placeholder="https://tiktok.com/..."
              />
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-bold text-primary">SEO Defaults</h4>
            <TextField
              label="SEO Title"
              value={settings.meta_seo?.title || ""}
              onChange={(value) => updateNested("meta_seo.title", value)}
              placeholder="Site title for search engines"
            />
            <TextAreaField
              label="SEO Description"
              value={settings.meta_seo?.description || ""}
              onChange={(value) => updateNested("meta_seo.description", value)}
              placeholder="Site description for search engines"
              rows={4}
            />
            <TextAreaField
              label="SEO Keywords"
              value={settings.meta_seo?.keywords || ""}
              onChange={(value) => updateNested("meta_seo.keywords", value)}
              placeholder="keyword one, keyword two, keyword three"
              rows={3}
            />
          </div>

          <SaveButton saving={saving} label="Save global draft" />
        </form>
      </EditorPanel>

      <PublishingHistoryPanel
        revisions={revisions}
        restoringRevisionId={restoringRevisionId}
        restoringRevisionMode={restoringRevisionMode}
        publishedRevisionId={publishedRevisionId}
        draftRevisionId={draftRevisionId}
        draftBaseRevisionId={draftBaseRevisionId}
        hasUnpublishedChanges={hasUnpublishedChanges}
        onRestoreToDraft={(revision) => setRestoreTarget({ revision, mode: "draft" })}
        onRestoreAndPublish={(revision) => setRestoreTarget({ revision, mode: "publish" })}
      />

      <ConfirmDialog
        open={Boolean(restoreTarget)}
        title={
          restoreTarget?.mode === "publish"
            ? "Restore revision and publish?"
            : "Restore revision to draft?"
        }
        description={
          restoreTarget
            ? restoreTarget.mode === "publish"
              ? `This will replace the current draft and make the ${restoreTarget.revision.site_name} revision live immediately.`
              : `This will replace the current draft with the ${restoreTarget.revision.site_name} revision so you can review it before publishing.`
            : ""
        }
        confirmLabel={
          restoreTarget?.mode === "publish" ? "Restore and publish" : "Restore to draft"
        }
        confirmTone="primary"
        loading={Boolean(restoreTarget && restoringRevisionId === restoreTarget.revision.id)}
        onClose={() => setRestoreTarget(null)}
        onConfirm={async () => {
          if (!restoreTarget) return;
          const success = await restoreRevision(
            restoreTarget.revision.id,
            restoreTarget.mode,
          );
          if (success) {
            setRestoreTarget(null);
          }
        }}
      />
      </div>
    </PreviewSyncProvider>
  );
}
