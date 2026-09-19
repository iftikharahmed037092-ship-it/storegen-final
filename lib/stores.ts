import { supabase } from "./supabase";

import type {
  CreateStoreInput,
  Store,
  UpdateStoreInput
} from "@/types/store";


export async function getStores(): Promise<Store[]> {
  const {
    data,
    error
  } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", {
      ascending: false
    });

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data ?? [];
}


export async function getStoreBySlug(
  slug: string
): Promise<Store | null> {

  const {
    data,
    error
  } = await supabase
    .from("stores")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}


export async function createStore(
  input: CreateStoreInput
): Promise<Store> {

  const {
    data,
    error
  } = await supabase
    .from("stores")
    .insert({
      slug: input.slug,
      store_name: input.store_name,
      custom_domain:
        input.custom_domain || null,
      logo_url:
        input.logo_url || null,
      primary_color:
        input.primary_color ||
        "#000000",
      whatsapp_number:
        input.whatsapp_number ||
        null,
      shipping_fee:
        input.shipping_fee ?? 0,
      is_active:
        input.is_active ?? true
    })
    .select("*")
    .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}


export async function updateStore(
  id: string,
  input: UpdateStoreInput
): Promise<Store> {

  const updateData: Record<
    string,
    unknown
  > = {};

  if (
    input.slug !== undefined
  ) {
    updateData.slug =
      input.slug;
  }

  if (
    input.store_name !== undefined
  ) {
    updateData.store_name =
      input.store_name;
  }

  if (
    input.custom_domain !==
    undefined
  ) {
    updateData.custom_domain =
      input.custom_domain || null;
  }

  if (
    input.logo_url !== undefined
  ) {
    updateData.logo_url =
      input.logo_url || null;
  }

  if (
    input.primary_color !==
    undefined
  ) {
    updateData.primary_color =
      input.primary_color;
  }

  if (
    input.whatsapp_number !==
    undefined
  ) {
    updateData.whatsapp_number =
      input.whatsapp_number ||
      null;
  }

  if (
    input.shipping_fee !==
    undefined
  ) {
    updateData.shipping_fee =
      input.shipping_fee;
  }

  if (
    input.is_active !==
    undefined
  ) {
    updateData.is_active =
      input.is_active;
  }

  const {
    data,
    error
  } = await supabase
    .from("stores")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      error.message
    );
  }

  return data;
}


export async function deleteStore(
  id: string
): Promise<void> {

  const {
    error
  } = await supabase
    .from("stores")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(
      error.message
    );
  }
}
