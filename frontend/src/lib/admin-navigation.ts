import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  House,
  BookOpen,
  Users,
  FileText,
  Phone,
  Settings,
  Image as ImageIcon,
  MessageSquare,
  BellRing,
  Mail,
} from "lucide-react";

export type AdminRouteMeta = {
  name: string;
  href: string;
  icon: LucideIcon;
  description: string;
  publicHref?: string;
  matches: string[];
  sections: string[];
};

export const ADMIN_PRIMARY_NAV: AdminRouteMeta[] = [
  {
    name: "Overview",
    href: "/admin",
    icon: LayoutDashboard,
    description: "See page editors, collection health, and the current publishing surface.",
    matches: ["/admin"],
    sections: ["Pages", "Publishing", "Collection health"],
  },
  {
    name: "Home",
    href: "/admin/home",
    icon: House,
    description: "Control the homepage hero, banners, featured content, social proof, and notices.",
    publicHref: "/",
    matches: ["/admin/home", "/admin/banners", "/admin/testimonials", "/admin/notices"],
    sections: ["Hero", "Banners", "Featured courses", "Faculty", "Testimonials", "Notices"],
  },
  {
    name: "Courses",
    href: "/admin/courses",
    icon: BookOpen,
    description: "Manage the public courses page, catalog entries, pricing, images, and slugs.",
    publicHref: "/courses",
    matches: ["/admin/courses"],
    sections: ["Catalog", "Pricing", "Images", "Ordering"],
  },
  {
    name: "Teachers",
    href: "/admin/teachers",
    icon: Users,
    description: "Manage the public teachers page, faculty profiles, bios, photos, and display order.",
    publicHref: "/teachers",
    matches: ["/admin/teachers"],
    sections: ["Profiles", "Bios", "Photos", "Ordering"],
  },
  {
    name: "About",
    href: "/admin/about",
    icon: FileText,
    description: "Edit the institutional story and the narrative shown on the public about page.",
    publicHref: "/about",
    matches: ["/admin/about"],
    sections: ["Story", "Narrative"],
  },
  {
    name: "Contact",
    href: "/admin/contact",
    icon: Phone,
    description: "Control public contact details, office hours, website data, and inquiry workflows.",
    publicHref: "/contact",
    matches: ["/admin/contact", "/admin/contacts"],
    sections: ["Contact info", "Office hours", "Website", "Inbox"],
  },
  {
    name: "Global",
    href: "/admin/global",
    icon: Settings,
    description: "Manage site-wide branding, theme, footer, social links, and SEO defaults.",
    matches: ["/admin/global", "/admin/settings"],
    sections: ["Branding", "Theme", "Footer", "SEO"],
  },
];

export const ADMIN_COLLECTION_SHORTCUTS = [
  {
    name: "Banner Library",
    href: "/admin/banners",
    icon: ImageIcon,
    description: "Homepage hero slides and promotional imagery.",
  },
  {
    name: "Testimonials",
    href: "/admin/testimonials",
    icon: MessageSquare,
    description: "Student quotes and homepage social proof.",
  },
  {
    name: "Notices",
    href: "/admin/notices",
    icon: BellRing,
    description: "Urgent announcements and homepage notice items.",
  },
  {
    name: "Inbox",
    href: "/admin/contacts",
    icon: Mail,
    description: "Inquiry review and deletion workflow.",
  },
];

export function getAdminRouteMeta(pathname: string) {
  return (
    ADMIN_PRIMARY_NAV.find((item) =>
      item.matches.some((match) =>
        match === "/admin"
          ? pathname === match
          : pathname === match || pathname.startsWith(`${match}/`),
      ),
    ) || ADMIN_PRIMARY_NAV[0]
  );
}
