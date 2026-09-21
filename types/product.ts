export interface Product {
  id: string;
  store_id: string;

  category_id: string | null;

  name: string;
  price: number;
  old_price: number | null;

  image_url: string | null;
  image_urls: string[];

  description: string | null;

  stock: number;

  sku: string | null;

  published: boolean;

  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  store_id: string;

  category_id?: string | null;

  name: string;
  price: number;

  old_price?: number | null;

  image_url?: string | null;
  image_urls?: string[];

  description?: string | null;

  stock?: number;

  sku?: string | null;

  published?: boolean;
}

export interface UpdateProductInput {
  category_id?: string | null;

  name?: string;
  price?: number;

  old_price?: number | null;

  image_url?: string | null;
  image_urls?: string[];

  description?: string | null;

  stock?: number;

  sku?: string | null;

  published?: boolean;
}
