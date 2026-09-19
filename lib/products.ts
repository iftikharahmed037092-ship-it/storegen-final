import { supabase } from "./supabase";
import type { CreateProductInput, Product, UpdateProductInput } from "@/types/product";

export async function getProductsByStoreId(storeId: string): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("store_id", storeId).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getPublishedProductsByStoreId(storeId: string): Promise<Product[]> {
  const { data, error } = await supabase.from("products").select("*").eq("store_id", storeId).eq("published", true).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getProductById(productId: string): Promise<Product | null> {
  const { data, error } = await supabase.from("products").select("*").eq("id", productId).maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function createProduct(input: CreateProductInput): Promise<Product> {
  const { data, error } = await supabase.from("products").insert({
      store_id: input.store_id,
      name: input.name,
      price: input.price,
      old_price: input.old_price ?? null,
      image_url: input.image_url ?? null,
      description: input.description ?? null,
      stock: input.stock ?? 0,
      sku: input.sku ?? null,
      published: input.published ?? true
    }).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(productId: string, input: UpdateProductInput): Promise<Product> {
  const { data, error } = await supabase.from("products").update({ ...input, updated_at: new Date().toISOString() }).eq("id", productId).select("*").single();
  if (error) throw new Error(error.message);
  return data;
}

export async function deleteProduct(productId: string): Promise<void> {
  const { error } = await supabase.from("products").delete().eq("id", productId);
  if (error) throw new Error(error.message);
}
