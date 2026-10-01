import { supabase } from "@/lib/supabase";
import { normalizeDomain } from "@/lib/domains";

export async function getStoreByCustomDomain(
  hostname: string
) {
  const domain = normalizeDomain(hostname);

  if (!domain) {
    return null;
  }

  const { data, error } = await supabase
    .from("stores")
    .select(
      "id, slug, store_name, custom_domain, is_active, domain_status, domain_verified"
    )
    .ilike("custom_domain", domain)
    .eq("is_active", true)
    .eq("domain_status", "verified")
    .eq("domain_verified", true)
    .maybeSingle();

  if (error) {
    console.error(
      "Custom domain lookup error:",
      error
    );

    return null;
  }

  return data;
}
