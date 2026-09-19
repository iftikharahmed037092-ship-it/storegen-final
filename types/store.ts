export interface Store {
  id: string;
  slug: string;
  store_name: string;
  custom_domain: string | null;
  logo_url: string | null;
  primary_color: string;
  whatsapp_number: string | null;
  created_at: string;
}

export interface CreateStoreInput {
  slug: string;
  store_name: string;
  custom_domain?: string;
  logo_url?: string;
  primary_color?: string;
  whatsapp_number?: string;
}
