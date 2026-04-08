import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  variant?: "light" | "dark";
  className?: string;
};

export default function Breadcrumbs({
  items,
  variant = "dark",
  className = "",
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  const isLight = variant === "light";
  const containerClassName = isLight
    ? "border-white/12 bg-white/8 text-white/75"
    : "border-slate-200 bg-white/80 text-slate-600";
  const activeClassName = isLight ? "text-white" : "text-slate-900";

  return (
    <nav
      aria-label="Breadcrumb"
      className={`inline-flex max-w-full overflow-x-auto rounded-full border px-4 py-2 backdrop-blur-xl ${containerClassName} ${className}`}
    >
      <ol className="flex items-center gap-2 whitespace-nowrap text-xs font-semibold">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${item.href || index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link href={item.href} className="transition-opacity hover:opacity-100 opacity-90">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? activeClassName : undefined}>{item.label}</span>
              )}
              {!isLast ? <ChevronRight className="h-3.5 w-3.5 opacity-65" /> : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
