"use client";

import { Monitor, Smartphone, Tablet } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { usePreviewSync } from "@/components/admin/PreviewSyncContext";

type DeviceMode = "desktop" | "tablet" | "phone";

type Props = {
  title?: string;
  children: React.ReactNode;
  previewType?: "component" | "page";
};

const pageCanvasWidths: Record<DeviceMode, number> = {
  desktop: 1440,
  tablet: 1024,
  phone: 430,
};

const componentWidths: Record<DeviceMode, string> = {
  desktop: "100%",
  tablet: "768px",
  phone: "375px",
};

const fallbackHeights: Record<DeviceMode, number> = {
  desktop: 980,
  tablet: 1180,
  phone: 1420,
};

type ScrollState = {
  top: number;
  height: number;
  scrollHeight: number;
};

export default function LivePreviewPanel({
  title = "Live Preview",
  children,
  previewType = "component",
}: Props) {
  const { request } = usePreviewSync();
  const [device, setDevice] = useState<DeviceMode>("desktop");
  const [viewportWidth, setViewportWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);
  const [scrollState, setScrollState] = useState<ScrollState>({
    top: 0,
    height: 0,
    scrollHeight: 0,
  });
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const highlightedTargetRef = useRef<HTMLElement | null>(null);
  const highlightTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previewRailRef = useRef<HTMLDivElement | null>(null);
  const previewDragCleanupRef = useRef<(() => void) | null>(null);
  const canvasWidth = pageCanvasWidths[device];
  const scale =
    previewType === "page" && viewportWidth > 0
      ? Math.min(1, viewportWidth / canvasWidth)
      : 1;
  const scaledWidth = previewType === "page" ? canvasWidth * scale : null;
  const scaledHeight =
    previewType === "page"
      ? Math.max((contentHeight || fallbackHeights[device]) * scale, 420)
      : null;
  const fitPercent = Math.round(scale * 100);
  const scrollRange = Math.max(scrollState.scrollHeight - scrollState.height, 0);
  const railThumbHeight =
    scrollState.scrollHeight > 0 && scrollState.height > 0
      ? Math.max((scrollState.height / scrollState.scrollHeight) * 100, 16)
      : 100;
  const railThumbOffset =
    scrollRange > 0 ? ((scrollState.top / scrollRange) * (100 - railThumbHeight)) : 0;

  const updateScrollState = () => {
    const viewportNode = viewportRef.current;
    if (!viewportNode) return;

    setScrollState((current) => {
      const nextState = {
        top: viewportNode.scrollTop,
        height: viewportNode.clientHeight,
        scrollHeight: viewportNode.scrollHeight,
      };

      return current.top === nextState.top &&
        current.height === nextState.height &&
        current.scrollHeight === nextState.scrollHeight
        ? current
        : nextState;
    });
  };

  useEffect(() => {
    if (previewType !== "page") return;

    const viewportNode = viewportRef.current;
    const contentNode = contentRef.current;

    if (!viewportNode || !contentNode || typeof ResizeObserver === "undefined") {
      return;
    }

    const viewportObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const nextWidth = Math.round(entry.contentRect.width);
      setViewportWidth((current) => (current === nextWidth ? current : nextWidth));
    });

    const contentObserver = new ResizeObserver((entries) => {
      const entry = entries[0];
      const nextHeight = Math.round(entry.contentRect.height);
      setContentHeight((current) => (current === nextHeight ? current : nextHeight));
    });

    viewportObserver.observe(viewportNode);
    contentObserver.observe(contentNode);

    setViewportWidth(Math.round(viewportNode.getBoundingClientRect().width));
    setContentHeight(Math.round(contentNode.getBoundingClientRect().height));
    updateScrollState();

    return () => {
      viewportObserver.disconnect();
      contentObserver.disconnect();
    };
  }, [previewType, device]);

  useEffect(() => {
    if (!request || previewType !== "page") return;

    const viewportNode = viewportRef.current;
    const contentNode = contentRef.current;

    if (!viewportNode || !contentNode) return;

    const candidates = request.target
      .split("|")
      .map((value) => value.trim())
      .filter(Boolean);

    const target = candidates
      .map(
        (candidate) =>
          contentNode.querySelector<HTMLElement>(
            `[data-preview-section="${candidate}"]`,
          ) || contentNode.querySelector<HTMLElement>(`#${candidate}`),
      )
      .find(Boolean);

    if (!target) return;

    const getOffsetTopWithin = (element: HTMLElement, ancestor: HTMLElement) => {
      let offset = 0;
      let node: HTMLElement | null = element;

      while (node && node !== ancestor) {
        offset += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }

      return offset;
    };

    const scaledOffsetTop = getOffsetTopWithin(target, contentNode) * scale;
    const scaledTargetHeight = Math.max(target.offsetHeight * scale, 120);
    const desiredTop = Math.max(
      scaledOffsetTop - Math.max((viewportNode.clientHeight - scaledTargetHeight) / 2, 32),
      0,
    );

    viewportNode.scrollTo({
      top: desiredTop,
      behavior: "smooth",
    });

    if (highlightedTargetRef.current && highlightedTargetRef.current !== target) {
      highlightedTargetRef.current.classList.remove("preview-section-focused");
    }

    target.classList.add("preview-section-focused");
    highlightedTargetRef.current = target;

    if (highlightTimerRef.current) {
      clearTimeout(highlightTimerRef.current);
    }

    highlightTimerRef.current = setTimeout(() => {
      target.classList.remove("preview-section-focused");
      if (highlightedTargetRef.current === target) {
        highlightedTargetRef.current = null;
      }
    }, 2400);
  }, [previewType, request, scale]);

  useEffect(() => {
    if (previewType !== "page") return;

    const viewportNode = viewportRef.current;
    if (!viewportNode) return;

    updateScrollState();

    const handleScroll = () => {
      updateScrollState();
    };

    viewportNode.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      viewportNode.removeEventListener("scroll", handleScroll);
    };
  }, [previewType, device, contentHeight, viewportWidth]);

  useEffect(() => {
    return () => {
      if (highlightTimerRef.current) {
        clearTimeout(highlightTimerRef.current);
      }
      if (previewDragCleanupRef.current) {
        previewDragCleanupRef.current();
      }
    };
  }, []);

  const handlePreviewTrackPointerDown = (
    event: React.PointerEvent<HTMLDivElement>,
    dragThumb = false,
  ) => {
    const viewportNode = viewportRef.current;
    const railNode = previewRailRef.current;

    if (!viewportNode || !railNode || scrollRange <= 0) return;

    event.preventDefault();
    event.stopPropagation();

    const railRect = railNode.getBoundingClientRect();
    const trackHeight = railRect.height;
    const thumbHeightPx = (railThumbHeight / 100) * trackHeight;
    const availableTrack = Math.max(trackHeight - thumbHeightPx, 1);
    const dragOffset = dragThumb ? event.clientY - railRect.top - thumbHeightPx / 2 : 0;
    const startScrollTop = viewportNode.scrollTop;
    const startY = event.clientY;

    const setScrollFromClientY = (clientY: number) => {
      const pointerOffset = dragThumb
        ? clientY - railRect.top - dragOffset - thumbHeightPx / 2
        : clientY - railRect.top - thumbHeightPx / 2;
      const nextThumbTop = Math.min(Math.max(pointerOffset, 0), availableTrack);
      const nextScrollTop = (nextThumbTop / availableTrack) * scrollRange;
      viewportNode.scrollTo({ top: nextScrollTop, behavior: "auto" });
    };

    if (!dragThumb) {
      setScrollFromClientY(event.clientY);
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (dragThumb) {
        const deltaY = moveEvent.clientY - startY;
        const nextThumbTop = Math.min(
          Math.max((startScrollTop / scrollRange) * availableTrack + deltaY, 0),
          availableTrack,
        );
        const nextScrollTop = (nextThumbTop / availableTrack) * scrollRange;
        viewportNode.scrollTo({ top: nextScrollTop, behavior: "auto" });
        return;
      }

      setScrollFromClientY(moveEvent.clientY);
    };

    const cleanup = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", cleanup);
      window.removeEventListener("pointercancel", cleanup);
      previewDragCleanupRef.current = null;
    };

    previewDragCleanupRef.current = cleanup;

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", cleanup, { once: true });
    window.addEventListener("pointercancel", cleanup, { once: true });
  };

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-[32px] border border-primary/10 bg-primary/[0.02] shadow-premium ${
        previewType === "page"
          ? "h-[78vh] min-h-[44rem] max-h-[56rem]"
          : "h-full min-h-[44rem]"
      }`}
    >
      <div className="flex items-center justify-between border-b border-primary/10 bg-white/80 px-6 py-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-black/80" />
            <div className="h-3 w-3 rounded-full bg-black/35" />
            <div className="h-3 w-3 rounded-full bg-black/15" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary/30">
              {title}
            </span>
            {previewType === "page" ? (
              <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-primary/20">
                Full-page fit view · {fitPercent}% scale
              </p>
            ) : null}
          </div>
        </div>

        <div className="flex items-center gap-3">
          {previewType === "page" ? (
            <span className="hidden rounded-full border border-primary/10 bg-primary/[0.03] px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-primary/45 md:inline-flex">
              {device} canvas {pageCanvasWidths[device]}px
            </span>
          ) : null}
          <div className="flex items-center gap-1 rounded-xl border border-primary/10 bg-primary/[0.03] p-1">
            {[
              { key: "desktop" as const, icon: Monitor },
              { key: "tablet" as const, icon: Tablet },
              { key: "phone" as const, icon: Smartphone },
            ].map(({ key, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setDevice(key)}
                className={`rounded-lg p-2 transition-all ${
                  device === key
                    ? "bg-primary text-white shadow-sm"
                    : "text-primary/35 hover:bg-white hover:text-primary"
                }`}
                aria-label={`Preview ${key} view`}
                title={`Preview ${key} view`}
              >
                <Icon className="h-4 w-4" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {previewType === "page" ? (
        <div
          ref={viewportRef}
          className="admin-preview-viewport relative min-h-0 flex-1 overflow-x-auto overflow-y-scroll bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.94),_rgba(241,241,241,0.98))] p-6"
          style={{ scrollbarGutter: "stable both-edges" }}
        >
          {scrollRange > 0 ? (
            <div className="pointer-events-none absolute bottom-6 right-3 top-6 z-20 flex items-center">
              <div
                ref={previewRailRef}
                onPointerDown={(event) => handlePreviewTrackPointerDown(event)}
                className="pointer-events-auto relative flex h-full w-4 cursor-pointer justify-center rounded-full bg-black/[0.06] p-[2px] shadow-[inset_0_0_0_1px_rgba(15,23,42,0.08)]"
                aria-label="Preview scroll rail"
                title="Drag to scroll the preview"
              >
                <div
                  onPointerDown={(event) => handlePreviewTrackPointerDown(event, true)}
                  className="absolute left-[2px] right-[2px] rounded-full bg-black/75 shadow-[0_12px_20px_-12px_rgba(15,23,42,0.75)]"
                  style={{
                    height: `${railThumbHeight}%`,
                    top: `${railThumbOffset}%`,
                  }}
                />
              </div>
            </div>
          ) : null}
          <div
            className="mx-auto"
            style={{
              width: scaledWidth || "100%",
              height: scaledHeight || fallbackHeights[device],
            }}
          >
            <div
              ref={contentRef}
              style={{
                width: canvasWidth,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <div className="overflow-hidden rounded-[32px] border border-primary/10 bg-white shadow-[0_40px_120px_-36px_rgba(0,0,0,0.24)]">
                {children}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 justify-center overflow-y-auto p-6">
          <div
            className="w-full"
            style={{ maxWidth: componentWidths[device] }}
          >
            <div className="overflow-hidden rounded-2xl border border-primary/10 bg-white shadow-[0_24px_72px_-32px_rgba(0,0,0,0.22)]">
              {children}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .preview-section-focused {
          outline: 4px solid rgba(34, 211, 238, 0.78);
          outline-offset: -4px;
          box-shadow:
            inset 0 0 0 9999px rgba(34, 211, 238, 0.12),
            0 0 0 3px rgba(255, 255, 255, 0.95),
            0 0 0 12px rgba(34, 211, 238, 0.18),
            0 26px 72px -30px rgba(15, 23, 42, 0.62);
          transition:
            box-shadow 180ms ease,
            outline-color 180ms ease;
          animation: previewPulse 0.9s ease;
        }

        .admin-preview-viewport {
          scrollbar-width: thin;
          scrollbar-color: rgba(15, 23, 42, 0.72) rgba(15, 23, 42, 0.08);
        }

        .admin-preview-viewport::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }

        .admin-preview-viewport::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.08);
          border-radius: 999px;
        }

        .admin-preview-viewport::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, rgba(15, 23, 42, 0.92), rgba(15, 23, 42, 0.68));
          border: 3px solid rgba(255, 255, 255, 0.72);
          border-radius: 999px;
        }

        .admin-preview-viewport::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, rgba(2, 6, 23, 0.96), rgba(15, 23, 42, 0.82));
        }

        @keyframes previewPulse {
          0% {
            box-shadow:
              inset 0 0 0 9999px rgba(34, 211, 238, 0),
              0 0 0 3px rgba(255, 255, 255, 0.15),
              0 0 0 0 rgba(34, 211, 238, 0.02),
              0 12px 36px -28px rgba(15, 23, 42, 0.18);
          }

          100% {
            box-shadow:
              inset 0 0 0 9999px rgba(34, 211, 238, 0.12),
              0 0 0 3px rgba(255, 255, 255, 0.95),
              0 0 0 12px rgba(34, 211, 238, 0.18),
              0 26px 72px -30px rgba(15, 23, 42, 0.62);
          }
        }
      `}</style>
    </div>
  );
}
