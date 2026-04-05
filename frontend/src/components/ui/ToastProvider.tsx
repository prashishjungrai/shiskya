"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

type ToastVariant = "success" | "error" | "info";

type ToastInput = {
  title: string;
  description?: string;
  variant?: ToastVariant;
};

type ToastItem = ToastInput & {
  id: number;
};

type ToastContextValue = {
  showToast: (toast: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const variantStyles: Record<
  ToastVariant,
  {
    icon: typeof CheckCircle2;
    iconClass: string;
    panelClass: string;
  }
> = {
  success: {
    icon: CheckCircle2,
    iconClass: "text-black",
    panelClass: "border-black/10 bg-white",
  },
  error: {
    icon: AlertCircle,
    iconClass: "text-black",
    panelClass: "border-black/10 bg-white",
  },
  info: {
    icon: Info,
    iconClass: "text-black/70",
    panelClass: "border-black/10 bg-white",
  },
};

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export default function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback((toast: ToastInput) => {
    setToasts((current) => [
      ...current,
      {
        id: Date.now() + Math.floor(Math.random() * 1000),
        variant: toast.variant ?? "info",
        title: toast.title,
        description: toast.description,
      },
    ]);
  }, []);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timeout = window.setTimeout(() => {
      removeToast(toasts[0].id);
    }, 4500);

    return () => window.clearTimeout(timeout);
  }, [removeToast, toasts]);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="pointer-events-none fixed right-4 top-4 z-[200] flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-3">
        <AnimatePresence initial={false}>
          {toasts.map((toast) => {
            const variant = toast.variant ?? "info";
            const { icon: Icon, iconClass, panelClass } = variantStyles[variant];

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 24, y: -12 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: 24, y: -12 }}
                className={`pointer-events-auto rounded-3xl border px-4 py-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.28)] ${panelClass}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-0.5 shrink-0 ${iconClass}`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-slate-900">{toast.title}</p>
                    {toast.description ? (
                      <p className="mt-1 text-sm leading-relaxed text-slate-500">
                        {toast.description}
                      </p>
                    ) : null}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeToast(toast.id)}
                    className="rounded-full p-1 text-slate-300 transition hover:bg-black/5 hover:text-black/60"
                    aria-label="Dismiss notification"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
