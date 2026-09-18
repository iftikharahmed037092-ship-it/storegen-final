import { supabase } from "./supabase";
import type { CreateStoreInput, Store } from "@/types/store";

export async function getStores(): Promise<Store[]> {
  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase getStores error:", error.message);
      return [];
    }
    return data ?? [];
  } catch (err: any) {
    console.error("getStores failed:", err.message);
    return [];
  }
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  try {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

    if (error) {
      console.error("getStoreBySlug error:", error.message);
      return null;
    }
    return data;
  } catch (err: any) {
    console.error("getStoreBySlug failed:", err.message);
    return null;
  }
}

export async function createStore(input: CreateStoreInput): Promise<Store> {
  const { data, error } = await supabase
    .from("stores")
    .insert({
      slug: input.slug,
      store_name: input.store_name,
      custom_domain: input.custom_domain || null,
      logo_url: input.logo_url || null,
      primary_color: input.primary_color || "#000000"
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }
  return data;
}
