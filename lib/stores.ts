import { supabase } from "./supabase";
import type {
  Store,
  CreateStoreInput,
  UpdateStoreInput
} from "@/types/store";

export async function getStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as Store[];
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

  return data as Store | null;
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
      primary_color: input.primary_color || "#16a34a",
      whatsapp_number: input.whatsapp_number || null,
      shipping_fee: input.shipping_fee ?? 0,
      is_active: input.is_active ?? true,

      business_type: input.business_type || "general",
      template_type: input.template_type || "classic"
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Store;
}

export async function updateStore(
  id: string,
  input: UpdateStoreInput
): Promise<Store> {
  const updateData: Record<string, unknown> = {};

  if (input.slug !== undefined) {
    updateData.slug = input.slug;
  }

  if (input.store_name !== undefined) {
    updateData.store_name = input.store_name;
  }

  if (input.custom_domain !== undefined) {
    updateData.custom_domain = input.custom_domain;
  }

  if (input.logo_url !== undefined) {
    updateData.logo_url = input.logo_url;
  }

  if (input.primary_color !== undefined) {
    updateData.primary_color = input.primary_color;
  }

  if (input.whatsapp_number !== undefined) {
    updateData.whatsapp_number = input.whatsapp_number;
  }

  if (input.shipping_fee !== undefined) {
    updateData.shipping_fee = input.shipping_fee;
  }

  if (input.is_active !== undefined) {
    updateData.is_active = input.is_active;
  }

  if (input.business_type !== undefined) {
    updateData.business_type = input.business_type;
  }

  if (input.template_type !== undefined) {
    updateData.template_type = input.template_type;
  }

  const { data, error } = await supabase
    .from("stores")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data as Store;
}

export async function deleteStore(id: string): Promise<void> {
  const { error } = await supabase
    .from("stores")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}
