export interface Product {
  id: string;
  store_id: string;
  name: string;
  price: number;
  old_price: number | null;
  image_url: string | null;
  description: string | null;
  stock: number;
  sku: string | null;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProductInput {
  store_id: string;
  name: string;
  price: number;
  old_price?: number | null;
  image_url?: string | null;
  description?: string | null;
  stock?: number;
  sku?: string | null;
  published?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  price?: number;
  old_price?: number | null;
  image_url?: string | null;
  description?: string | null;
  stock?: number;
  sku?: string | null;
  published?: boolean;
}
