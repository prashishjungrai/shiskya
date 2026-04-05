"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  ExternalLink,
  History,
  RefreshCw,
  Rocket,
  RotateCcw,
} from "lucide-react";
import { SiteSettingsRevision } from "@/lib/types";
import { usePreviewSync } from "@/components/admin/PreviewSyncContext";

export function EditorPanel({
  title,
  description,
  children,
  action,
  className = "",
  previewTarget,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
  previewTarget?: string;
}) {
  const { focusPreviewSection } = usePreviewSync();

  const handlePreviewFocus = () => {
    if (previewTarget) {
      focusPreviewSection(previewTarget);
    }
  };

  return (
    <section
      onPointerDownCapture={handlePreviewFocus}
      onFocusCapture={handlePreviewFocus}
      className={`rounded-[36px] border border-primary/10 bg-white p-8 shadow-premium transition-shadow duration-300 hover:shadow-[0_28px_72px_-36px_rgba(0,0,0,0.22)] ${className}`}
    >
      <div className="mb-8 flex items-start justify-between gap-6">
        <div>
          <h3 className="text-2xl font-serif font-bold text-primary">{title}</h3>
          {description ? (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-primary/45">
              {description}
            </p>
          ) : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

export function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  previewTarget,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: "text" | "email" | "url";
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
      className="space-y-2"
    >
      <label className="ml-2 block text-[10px] font-bold uppercase tracking-widest text-primary/40">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-primary/10 bg-primary/[0.03] px-5 py-4 text-sm font-medium outline-none transition-all duration-300 placeholder:text-primary/25 hover:border-primary/15 hover:bg-primary/[0.045] focus:border-primary/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
      />
    </div>
  );
}

export function TextAreaField({
  label,
  value,
  onChange,
  placeholder,
  rows = 6,
  previewTarget,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
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
      className="space-y-2"
    >
      <label className="ml-2 block text-[10px] font-bold uppercase tracking-widest text-primary/40">
        {label}
      </label>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-primary/10 bg-primary/[0.03] px-5 py-4 text-sm font-medium leading-relaxed outline-none transition-all duration-300 placeholder:text-primary/25 hover:border-primary/15 hover:bg-primary/[0.045] focus:border-primary/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
      />
    </div>
  );
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  previewTarget,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string }>;
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
      className="space-y-2"
    >
      <label className="ml-2 block text-[10px] font-bold uppercase tracking-widest text-primary/40">
        {label}
      </label>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-primary/10 bg-primary/[0.03] px-5 py-4 text-sm font-medium outline-none transition-all duration-300 hover:border-primary/15 hover:bg-primary/[0.045] focus:border-primary/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ColorField({
  label,
  value,
  onChange,
  previewTarget,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
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
      className="space-y-2"
    >
      <label className="ml-2 block text-[10px] font-bold uppercase tracking-widest text-primary/40">
        {label}
      </label>
      <div className="flex gap-3">
        <input
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-[58px] w-[72px] cursor-pointer rounded-2xl border border-primary/10 bg-white p-1 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20"
        />
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1 rounded-2xl border border-primary/10 bg-primary/[0.03] px-5 py-4 font-mono text-sm outline-none transition-all duration-300 hover:border-primary/15 hover:bg-primary/[0.045] focus:border-primary/30 focus:bg-white focus:shadow-[0_0_0_4px_rgba(0,0,0,0.04)]"
        />
      </div>
    </div>
  );
}

export function SaveButton({
  saving,
  label = "Save changes",
}: {
  saving: boolean;
  label?: string;
}) {
  return (
    <button
      type="submit"
      disabled={saving}
      className="inline-flex items-center justify-center gap-3 rounded-2xl bg-primary px-7 py-4 text-[10px] font-bold uppercase tracking-[0.25em] text-white shadow-xl transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-[0_22px_36px_-22px_rgba(0,0,0,0.45)] disabled:opacity-50"
    >
      {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : null}
      {saving ? "Saving..." : label}
    </button>
  );
}

export function ShortcutCard({
  href,
  title,
  description,
  statLabel,
  statValue,
  linkLabel = "Open editor",
}: {
  href: string;
  title: string;
  description: string;
  statLabel?: string;
  statValue?: string | number;
  linkLabel?: string;
}) {
  return (
    <Link
      href={href}
      className="group flex h-full flex-col justify-between rounded-[30px] border border-primary/10 bg-white p-6 shadow-premium transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/20 hover:bg-primary/[0.015] hover:shadow-[0_26px_60px_-30px_rgba(0,0,0,0.28)]"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h4 className="text-lg font-bold text-primary">{title}</h4>
          <ArrowUpRight className="h-5 w-5 text-primary/20 transition-all duration-300 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
        </div>
        <p className="mt-3 text-sm leading-relaxed text-primary/45">{description}</p>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          {statLabel ? (
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary/25">
              {statLabel}
            </p>
          ) : null}
          {statValue !== undefined ? (
            <p className="mt-2 text-3xl font-serif font-bold text-primary">{statValue}</p>
          ) : null}
        </div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary/55 transition-colors duration-300 group-hover:text-primary">
          {linkLabel}
        </span>
      </div>
    </Link>
  );
}

export function PublicPreviewLink({
  href,
  label = "Open public page",
}: {
  href: string;
  label?: string;
}) {
  return (
    <Link
      href={href}
      target="_blank"
      className="inline-flex items-center gap-2 rounded-full border border-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary/45 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white"
    >
      {label} <ExternalLink className="h-3.5 w-3.5" />
    </Link>
  );
}

function formatDateTime(value?: string | null) {
  if (!value) return "Not published yet";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export function PublishingToolbar({
  hasUnpublishedChanges,
  lastPublishedAt,
  draftUpdatedAt,
  revisionCount,
  publishing,
  discarding,
  onPublish,
  onDiscard,
}: {
  hasUnpublishedChanges: boolean;
  lastPublishedAt?: string | null;
  draftUpdatedAt?: string | null;
  revisionCount: number;
  publishing: boolean;
  discarding: boolean;
  onPublish: () => Promise<boolean>;
  onDiscard: () => Promise<boolean>;
}) {
  return (
    <section className="flex flex-col gap-6 rounded-[32px] border border-primary/10 bg-white p-6 shadow-premium lg:flex-row lg:items-center lg:justify-between">
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest ${
              hasUnpublishedChanges
                ? "bg-primary text-white"
                : "bg-primary/8 text-primary/75"
            }`}
          >
            {hasUnpublishedChanges ? "Draft has unpublished changes" : "Public site is synced"}
          </span>
          <span className="rounded-full border border-primary/10 bg-primary/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/45">
            {revisionCount} published revision{revisionCount === 1 ? "" : "s"}
          </span>
        </div>

        <div className="grid gap-3 text-sm text-primary/45 md:grid-cols-2">
          <p>
            <span className="font-bold text-primary">Draft saved:</span>{" "}
            {formatDateTime(draftUpdatedAt)}
          </p>
          <p>
            <span className="font-bold text-primary">Last published:</span>{" "}
            {formatDateTime(lastPublishedAt)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={async () => {
            await onDiscard();
          }}
          disabled={!hasUnpublishedChanges || publishing || discarding}
          className="inline-flex items-center gap-2 rounded-2xl border border-primary/10 px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white disabled:opacity-50"
        >
          {discarding ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}
          {discarding ? "Discarding..." : "Discard Draft"}
        </button>
        <button
          type="button"
          onClick={async () => {
            await onPublish();
          }}
          disabled={!hasUnpublishedChanges || publishing || discarding}
          className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 hover:shadow-[0_20px_32px_-20px_rgba(0,0,0,0.4)] disabled:opacity-50"
        >
          {publishing ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Rocket className="h-4 w-4" />}
          {publishing ? "Publishing..." : "Publish Site"}
        </button>
      </div>
    </section>
  );
}

export function PublishingHistoryPanel({
  revisions,
  restoringRevisionId,
  restoringRevisionMode,
  publishedRevisionId,
  draftRevisionId,
  draftBaseRevisionId,
  hasUnpublishedChanges,
  onRestoreToDraft,
  onRestoreAndPublish,
}: {
  revisions: SiteSettingsRevision[];
  restoringRevisionId: string | null;
  restoringRevisionMode: "draft" | "publish" | null;
  publishedRevisionId: string | null;
  draftRevisionId: string | null;
  draftBaseRevisionId: string | null;
  hasUnpublishedChanges: boolean;
  onRestoreToDraft: (revision: SiteSettingsRevision) => void;
  onRestoreAndPublish: (revision: SiteSettingsRevision) => void;
}) {
  return (
    <EditorPanel
      title="Publishing History"
      description="Recent published versions of the site settings. This gives the admin a visible timeline instead of silent overwrites."
      action={
        <div className="rounded-full bg-primary/5 p-3 text-primary/65">
          <History className="h-5 w-5" />
        </div>
      }
    >
      {revisions.length === 0 ? (
        <p className="text-sm text-primary/45">No published revisions yet.</p>
      ) : (
        <div className="grid gap-4">
          {revisions.map((revision) => (
            <div
              key={revision.id}
              className="flex flex-col gap-4 rounded-[28px] border border-primary/10 bg-primary/[0.02] p-5 transition-all duration-300 hover:border-primary/15 hover:bg-primary/[0.03]"
            >
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    {revision.id === publishedRevisionId ? (
                      <span className="rounded-full bg-primary px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                        Current live
                      </span>
                    ) : null}
                    {revision.id === draftRevisionId ? (
                      <span className="rounded-full border border-primary/10 bg-primary/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/80">
                        Loaded in draft
                      </span>
                    ) : null}
                    {hasUnpublishedChanges &&
                    revision.id === draftBaseRevisionId &&
                    revision.id !== draftRevisionId ? (
                      <span className="rounded-full border border-primary/10 bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/65">
                        Draft base
                      </span>
                    ) : null}
                    {revision.id !== publishedRevisionId &&
                    revision.id !== draftRevisionId &&
                    revision.id !== draftBaseRevisionId ? (
                      <span className="rounded-full bg-primary/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/35">
                        Older revision
                      </span>
                    ) : null}
                  </div>

                  <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.25em] text-primary/25">
                    Published {formatDateTime(revision.published_at)}
                  </p>
                  <h4 className="mt-2 text-lg font-serif font-bold text-primary">
                    {revision.site_name}
                  </h4>
                  <p className="mt-2 text-sm text-primary/45">
                    By {revision.published_by || "Admin"}.
                    {revision.source_updated_at
                      ? ` Draft saved ${formatDateTime(revision.source_updated_at)}.`
                      : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/35">
                    {revision.primary_colors?.primary || "No primary color"}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/35">
                    {revision.ui_customization?.fonts?.serif || "No heading font"}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-primary/5 pt-4">
                <p className="text-sm text-primary/45">
                  {revision.id === publishedRevisionId && revision.id === draftRevisionId
                    ? "This revision matches both the live site and the current draft."
                    : revision.id === publishedRevisionId
                      ? "This revision is currently visible on the public site."
                      : revision.id === draftRevisionId
                        ? "This revision is currently loaded in the draft preview."
                        : hasUnpublishedChanges && revision.id === draftBaseRevisionId
                          ? "The current draft started from this revision and has been edited since."
                          : "This revision is available as a restore point."}
                </p>

                <div className="flex flex-wrap gap-2 md:justify-end">
                  <button
                    type="button"
                    onClick={() => onRestoreToDraft(revision)}
                    disabled={Boolean(restoringRevisionId) || revision.id === draftRevisionId}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/10 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-primary hover:text-white disabled:opacity-50"
                  >
                    {restoringRevisionId === revision.id && restoringRevisionMode === "draft" ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <RotateCcw className="h-3.5 w-3.5" />
                    )}
                    {restoringRevisionId === revision.id && restoringRevisionMode === "draft"
                      ? "Restoring..."
                      : revision.id === draftRevisionId
                        ? "Already in draft"
                        : "Restore to draft"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onRestoreAndPublish(revision)}
                    disabled={
                      Boolean(restoringRevisionId) || revision.id === publishedRevisionId
                    }
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-800 disabled:opacity-50"
                  >
                    {restoringRevisionId === revision.id && restoringRevisionMode === "publish" ? (
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Rocket className="h-3.5 w-3.5" />
                    )}
                    {restoringRevisionId === revision.id && restoringRevisionMode === "publish"
                      ? "Publishing..."
                      : revision.id === publishedRevisionId
                        ? "Already live"
                        : "Restore & publish"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </EditorPanel>
  );
}
