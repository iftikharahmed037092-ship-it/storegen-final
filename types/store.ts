export type BusinessType =
  | "general"
  | "garments"
  | "shoes"
  | "watches"
  | "electronics";

export type TemplateType =
  | "classic"
  | "modern"
  | "minimal";

export interface SocialLinks {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
  youtube?: string;
}

export interface Store {
  id: string;
  slug: string;
  store_name: string;
  custom_domain: string | null;
  logo_url: string | null;
  primary_color: string;
  whatsapp_number: string | null;
  shipping_fee: number;
  is_active: boolean;

  business_type: BusinessType;
  template_type: TemplateType;

  contact_phone: string | null;
  contact_email: string | null;
  address: string | null;
  social_links: SocialLinks;

  created_at: string;
}

export interface CreateStoreInput {
  slug: string;
  store_name: string;
  custom_domain?: string;
  logo_url?: string;
  primary_color?: string;
  whatsapp_number?: string;
  shipping_fee?: number;
  is_active?: boolean;

  business_type?: BusinessType;
  template_type?: TemplateType;

  contact_phone?: string;
  contact_email?: string;
  address?: string;
  social_links?: SocialLinks;
}

export interface UpdateStoreInput {
  slug?: string;
  store_name?: string;
  custom_domain?: string | null;
  logo_url?: string | null;
  primary_color?: string;
  whatsapp_number?: string | null;
  shipping_fee?: number;
  is_active?: boolean;

  business_type?: BusinessType;
  template_type?: TemplateType;

  contact_phone?: string | null;
  contact_email?: string | null;
  address?: string | null;
  social_links?: SocialLinks;
}
