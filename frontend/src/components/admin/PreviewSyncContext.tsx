"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type PreviewSyncRequest = {
  target: string;
  nonce: number;
};

type PreviewSyncContextValue = {
  request: PreviewSyncRequest | null;
  focusPreviewSection: (target: string) => void;
};

const PreviewSyncContext = createContext<PreviewSyncContextValue>({
  request: null,
  focusPreviewSection: () => {},
});

export function PreviewSyncProvider({ children }: { children: ReactNode }) {
  const [request, setRequest] = useState<PreviewSyncRequest | null>(null);

  const focusPreviewSection = useCallback((target: string) => {
    if (!target) return;

    setRequest({
      target,
      nonce: Date.now() + Math.random(),
    });
  }, []);

  const value = useMemo(
    () => ({
      request,
      focusPreviewSection,
    }),
    [focusPreviewSection, request],
  );

  return <PreviewSyncContext.Provider value={value}>{children}</PreviewSyncContext.Provider>;
}

export function usePreviewSync() {
  return useContext(PreviewSyncContext);
}
