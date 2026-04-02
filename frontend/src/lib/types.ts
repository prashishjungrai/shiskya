export interface AdminUser {
  id: string;
  username: string;
}

export interface Course {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  duration?: str;
  image_url?: string;
  is_active: boolean;
  display_order: number;
}

// Ensure settings match the backend exactly
export interface SiteSettings {
  _id: string;
  institute_name: string;
  hero_title: string;
  hero_subtitle: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  social_links: Record<string, string>;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
