import { supabase } from "./supabase";

import type {
  Product,
  CreateProductInput,
  UpdateProductInput
} from "@/types/product";

export async function getProductsByStoreId(
  storeId: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .order("created_at", {
      ascending: false
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Product[];
}

export async function getProductById(
  id: string
): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Product | null;
}

export async function createProduct(
  input: CreateProductInput
): Promise<Product> {
  const imageUrls =
    input.image_urls ?? [];

  const firstImage =
    input.image_url ??
    imageUrls[0] ??
    null;

  const { data, error } =
    await supabase
      .from("products")
      .insert({
        store_id:
          input.store_id,

        category_id:
          input.category_id ??
          null,

        name:
          input.name,

        price:
          input.price,

        old_price:
          input.old_price ??
          null,

        image_url:
          firstImage,

        image_urls:
          imageUrls,

        description:
          input.description ??
          null,

        stock:
          input.stock ?? 0,

        sku:
          input.sku ?? null,

        published:
          input.published ??
          true
      })
      .select("*")
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Product;
}

export async function updateProduct(
  id: string,
  input: UpdateProductInput
): Promise<Product> {
  const updateData: Record<
    string,
    unknown
  > = {};

  if (
    input.category_id !== undefined
  ) {
    updateData.category_id =
      input.category_id;
  }

  if (
    input.name !== undefined
  ) {
    updateData.name =
      input.name;
  }

  if (
    input.price !== undefined
  ) {
    updateData.price =
      input.price;
  }

  if (
    input.old_price !== undefined
  ) {
    updateData.old_price =
      input.old_price;
  }

  if (
    input.image_urls !==
    undefined
  ) {
    updateData.image_urls =
      input.image_urls;

    updateData.image_url =
      input.image_urls[0] ??
      null;
  }

  if (
    input.image_url !== undefined &&
    input.image_urls === undefined
  ) {
    updateData.image_url =
      input.image_url;
  }

  if (
    input.description !==
    undefined
  ) {
    updateData.description =
      input.description;
  }

  if (
    input.stock !== undefined
  ) {
    updateData.stock =
      input.stock;
  }

  if (
    input.sku !== undefined
  ) {
    updateData.sku =
      input.sku;
  }

  if (
    input.published !==
    undefined
  ) {
    updateData.published =
      input.published;
  }

  updateData.updated_at =
    new Date().toISOString();

  const { data, error } =
    await supabase
      .from("products")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Product;
}

export async function deleteProduct(
  id: string
): Promise<void> {
  const { error } =
    await supabase
      .from("products")
      .delete()
      .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getPublishedProductsByStoreId(
  storeId: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("store_id", storeId)
    .eq("published", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Product[];
}

