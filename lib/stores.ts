import { supabase } from "./supabase";
import type { CreateStoreInput, Store } from "@/types/store";

export async function getStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getStoreBySlug(
  slug: string
): Promise<Store | null> {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function createStore(
  input: CreateStoreInput
): Promise<Store> {
  const { data, error } = await supabase
    .from("stores")
    .insert({
      slug: input.slug,
      store_name: input.store_name,
      custom_domain: input.custom_domain || null,
      logo_url: input.logo_url || null,
      primary_color: input.primary_color || "#000000",
      whatsapp_number: input.whatsapp_number || null
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
