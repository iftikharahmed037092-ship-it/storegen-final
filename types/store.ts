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
}
