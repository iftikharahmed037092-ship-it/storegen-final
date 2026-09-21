import { supabase } from "./supabase";

import type {
  Category,
  CreateCategoryInput,
  UpdateCategoryInput
} from "@/types/category";

export async function getCategoriesByStoreId(
  storeId: string
): Promise<Category[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("store_id", storeId)
    .order("sort_order", {
      ascending: true
    })
    .order("created_at", {
      ascending: true
    });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Category[];
}

export async function getCategoryById(
  id: string
): Promise<Category | null> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category | null;
}

export async function createCategory(
  input: CreateCategoryInput
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .insert({
      store_id: input.store_id,
      name: input.name,
      slug: input.slug,
      description:
        input.description ?? null,
      image_url:
        input.image_url ?? null,
      sort_order:
        input.sort_order ?? 0,
      is_active:
        input.is_active ?? true
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<Category> {
  const { data, error } = await supabase
    .from("categories")
    .update(input)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Category;
}

export async function deleteCategory(
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
