import { supabase } from "./supabase";
import type {
  Store,
  CreateStoreInput,
  UpdateStoreInput
} from "@/types/store";
import { normalizeDomain } from "./domains";

export async function getStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as Store[];
}

export async function getStoreBySlug(slug: string): Promise<Store | null> {
  if (!slug) return null;
  const cleanSlug = slug.toLowerCase().trim();
  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .ilike("slug", cleanSlug)
    .maybeSingle();

  if (error) {
    console.error("getStoreBySlug error:", error.message);
    return null;
  }
  return data as Store | null;
}

// NEW FUNCTION for Step 1 Foundation
export async function getStoreByCustomDomain(
  domain: string
): Promise<Store | null> {
  const normalized = normalizeDomain(domain);
  if (!normalized) return null;

  const { data, error } = await supabase
    .from("stores")
    .select("*")
    .eq("custom_domain", normalized)
    .maybeSingle();

  if (error) {
    console.error("getStoreByCustomDomain error:", error.message);
    return null;
  }
  return data as Store | null;
}

export async function createStore(input: CreateStoreInput): Promise<Store> {
  const normalizedDomain = normalizeDomain(input.custom_domain);

  const { data, error } = await supabase
    .from("stores")
    .insert({
      slug: input.slug,
      store_name: input.store_name,
      custom_domain: normalizedDomain,
      domain_status: normalizedDomain ? "pending" : "none",
      domain_verified: false,
      domain_verified_at: null,
      domain_last_checked_at: null,
      logo_url: input.logo_url || null,
      primary_color: input.primary_color || "#16a34a",
      whatsapp_number: input.whatsapp_number || null,
      shipping_fee: input.shipping_fee ?? 0,
      is_active: input.is_active ?? true,
      business_type: input.business_type || "general",
      template_type: input.template_type || "classic",
      contact_phone: input.contact_phone || null,
      contact_email: input.contact_email || null,
      address: input.address || null,
      social_links: input.social_links || {}
    })
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Store;
}

export async function updateStore(
  id: string,
  input: UpdateStoreInput & { page_id?: string }
): Promise<Store> {
  // پہلے existing store نکالو تاکہ domain change check کر سکیں
  const { data: existingStore } = await supabase
    .from("stores")
    .select("custom_domain")
    .eq("id", id)
    .single();

  const updateData: Record<string, unknown> = {};

  if (input.slug !== undefined) updateData.slug = input.slug;
  if (input.store_name !== undefined) updateData.store_name = input.store_name;
  
  if (input.custom_domain !== undefined) {
    const normalizedDomain = normalizeDomain(input.custom_domain);
    updateData.custom_domain = normalizedDomain;

    // صرف جب domain واقعی change ہو تب status reset کرو
    if (existingStore && normalizedDomain !== existingStore.custom_domain) {
      updateData.domain_status = normalizedDomain ? "pending" : "none";
      updateData.domain_verified = false;
      updateData.domain_verified_at = null;
      updateData.domain_last_checked_at = null;
    }
  }

  // اگر direct domain_status update آرہا ہو (verification کے بعد)
  if (input.domain_status !== undefined) updateData.domain_status = input.domain_status;
  if (input.domain_verified !== undefined) updateData.domain_verified = input.domain_verified;
  if (input.domain_verified_at !== undefined) updateData.domain_verified_at = input.domain_verified_at;
  if (input.domain_last_checked_at !== undefined) updateData.domain_last_checked_at = input.domain_last_checked_at;

  if (input.logo_url !== undefined) updateData.logo_url = input.logo_url;
  if (input.primary_color !== undefined) updateData.primary_color = input.primary_color;
  if (input.whatsapp_number !== undefined) updateData.whatsapp_number = input.whatsapp_number;
  if (input.shipping_fee !== undefined) updateData.shipping_fee = input.shipping_fee;
  if (input.is_active !== undefined) updateData.is_active = input.is_active;
  if (input.business_type !== undefined) updateData.business_type = input.business_type;
  if (input.template_type !== undefined) updateData.template_type = input.template_type;
  if (input.contact_phone !== undefined) updateData.contact_phone = input.contact_phone;
  if (input.contact_email !== undefined) updateData.contact_email = input.contact_email;
  if (input.address !== undefined) updateData.address = input.address;
  if (input.social_links !== undefined) updateData.social_links = input.social_links;
  if ((input as any).page_id !== undefined) updateData.page_id = (input as any).page_id;

  const { data, error } = await supabase
    .from("stores")
    .update(updateData)
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as Store;
}

export async function deleteStore(id: string): Promise<void> {
  const { error } = await supabase.from("stores").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
