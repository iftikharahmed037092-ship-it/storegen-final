export interface Product {
  id: string;
  store_id: string;
  name: string;
  price: number;
  image_url: string | null;
  created_at: string;
}

export interface CreateProductInput {
  store_id: string;
  name: string;
  price: number;
  image_url?: string;
}
