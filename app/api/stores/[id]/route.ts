import { NextResponse } from "next/server";
import { deleteStore, updateStore, getStoreBySlug } from "@/lib/stores";
import { supabase } from "@/lib/supabase";
import { normalizeDomain, isValidDomain } from "@/lib/domains";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (body.store_name !== undefined && !String(body.store_name).trim()) {
      return NextResponse.json({ error: "Store name is required." }, { status: 400 });
    }
    if (body.slug !== undefined && !String(body.slug).trim()) {
      return NextResponse.json({ error: "Store slug is required." }, { status: 400 });
    }

    const shippingFee = body.shipping_fee === undefined ? undefined : Number(body.shipping_fee);
    if (shippingFee !== undefined && (!Number.isFinite(shippingFee) || shippingFee < 0)) {
      return NextResponse.json({ error: "Invalid shipping fee." }, { status: 400 });
    }

    // ===== CUSTOM DOMAIN LOGIC - PART 11 STEP 1 =====
    // Existing store fetch for comparison
    const { data: existingStore } = await supabase
      .from("stores")
      .select("custom_domain")
      .eq("id", id)
      .single();

    let normalizedDomain: string | null | undefined = undefined;
    let domainUpdate: any = {};

    if (body.custom_domain !== undefined) {
      // اگر خالی string بھیجی تو null
      if (String(body.custom_domain).trim() === "") {
        normalizedDomain = null;
      } else {
        normalizedDomain = normalizeDomain(body.custom_domain);
        if (!isValidDomain(normalizedDomain)) {
          return NextResponse.json({ error: "Invalid domain format. Example: yourstore.com" }, { status: 400 });
        }
      }

      // صرف تبھی status reset کرو جب domain واقعی change ہوا ہو
      if (existingStore && normalizedDomain !== existingStore.custom_domain) {
        domainUpdate = {
          custom_domain: normalizedDomain,
          domain_status: normalizedDomain ? "pending" : "none",
          domain_verified: false,
          domain_verified_at: null,
          domain_last_checked_at: null,
        };
      } else if (!existingStore) {
        // اگر existing نہ ملے تو بھی pending لگا دو
        domainUpdate = {
          custom_domain: normalizedDomain,
          domain_status: normalizedDomain ? "pending" : "none",
          domain_verified: false,
          domain_verified_at: null,
          domain_last_checked_at: null,
        };
      }
      // اگر domain same ہے تو کچھ بھی domain fields میں update مت کرو
    }

    const store = await updateStore(id, {
      store_name: body.store_name !== undefined ? String(body.store_name).trim() : undefined,
      slug: body.slug !== undefined ? String(body.slug).trim().toLowerCase() : undefined,
      // custom_domain ہم domainUpdate سے handle کریں گے
      ...(Object.keys(domainUpdate).length > 0 ? domainUpdate : body.custom_domain === undefined ? {} : { custom_domain: normalizedDomain }),
      logo_url: body.logo_url ?? undefined,
      primary_color: body.primary_color ?? undefined,
      whatsapp_number: body.whatsapp_number ?? undefined,
      shipping_fee: shippingFee,
      is_active: body.is_active ?? undefined,
      business_type: body.business_type ?? undefined,
      template_type: body.template_type ?? undefined,
      contact_phone: body.contact_phone ?? undefined,
      contact_email: body.contact_email ?? undefined,
      address: body.address ?? undefined,
      social_links: body.social_links ?? undefined,
    });

    return NextResponse.json({ store });
  } catch (error) {
    console.error("Store update error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to update store." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteProps) {
  try {
    const { id } = await params;
    await deleteStore(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Store delete error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to delete store." },
      { status: 500 }
    );
  }
}
