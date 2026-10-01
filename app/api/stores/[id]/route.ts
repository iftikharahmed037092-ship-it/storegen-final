import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import {
  normalizeDomain,
  isValidDomain
} from "@/lib/domains";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function PATCH(
  request: Request,
  { params }: RouteContext
) {
  try {
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Store ID is required." },
        { status: 400 }
      );
    }

    const { data: existingStore, error: fetchError } =
      await supabase
        .from("stores")
        .select(
          "id, custom_domain, domain_status, domain_verified"
        )
        .eq("id", id)
        .single();

    if (fetchError || !existingStore) {
      return NextResponse.json(
        { error: "Store not found." },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};

    if (typeof body.store_name === "string") {
      const storeName = body.store_name.trim();

      if (!storeName) {
        return NextResponse.json(
          { error: "Store name cannot be empty." },
          { status: 400 }
        );
      }

      updateData.store_name = storeName;
    }

    if (typeof body.slug === "string") {
      const slug = body.slug
        .trim()
        .toLowerCase();

      if (
        !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid slug. Use lowercase letters, numbers and hyphens only."
          },
          { status: 400 }
        );
      }

      updateData.slug = slug;
    }

    /*
     * Custom Domain
     */
    if (
      Object.prototype.hasOwnProperty.call(
        body,
        "custom_domain"
      )
    ) {
      const normalizedDomain =
        normalizeDomain(body.custom_domain);

      if (
        normalizedDomain &&
        !isValidDomain(normalizedDomain)
      ) {
        return NextResponse.json(
          {
            error:
              "Please enter a valid custom domain."
          },
          { status: 400 }
        );
      }

      const previousDomain =
        normalizeDomain(
          existingStore.custom_domain
        );

      updateData.custom_domain =
        normalizedDomain;

      /*
       * Reset verification only when the domain
       * actually changes.
       */
      if (
        normalizedDomain !== previousDomain
      ) {
        updateData.domain_status =
          normalizedDomain
            ? "pending"
            : "none";

        updateData.domain_verified =
          false;

        updateData.domain_verified_at =
          null;

        updateData.domain_last_checked_at =
          null;
      }
    }

    if (
      typeof body.logo_url === "string" ||
      body.logo_url === null
    ) {
      updateData.logo_url =
        typeof body.logo_url === "string"
          ? body.logo_url.trim() || null
          : null;
    }

    if (
      typeof body.primary_color === "string"
    ) {
      updateData.primary_color =
        body.primary_color.trim();
    }

    if (
      typeof body.whatsapp_number ===
        "string" ||
      body.whatsapp_number === null
    ) {
      updateData.whatsapp_number =
        typeof body.whatsapp_number === "string"
          ? body.whatsapp_number.trim() || null
          : null;
    }

    if (
      body.shipping_fee !== undefined
    ) {
      const shippingFee = Number(
        body.shipping_fee
      );

      if (
        !Number.isFinite(shippingFee) ||
        shippingFee < 0
      ) {
        return NextResponse.json(
          {
            error:
              "Shipping fee must be 0 or greater."
          },
          { status: 400 }
        );
      }

      updateData.shipping_fee =
        shippingFee;
    }

    if (
      typeof body.is_active === "boolean"
    ) {
      updateData.is_active =
        body.is_active;
    }

    if (
      typeof body.business_type === "string"
    ) {
      updateData.business_type =
        body.business_type;
    }

    if (
      typeof body.template_type === "string"
    ) {
      updateData.template_type =
        body.template_type;
    }

    if (
      typeof body.contact_phone ===
        "string" ||
      body.contact_phone === null
    ) {
      updateData.contact_phone =
        typeof body.contact_phone === "string"
          ? body.contact_phone.trim() || null
          : null;
    }

    if (
      typeof body.contact_email ===
        "string" ||
      body.contact_email === null
    ) {
      updateData.contact_email =
        typeof body.contact_email === "string"
          ? body.contact_email.trim() || null
          : null;
    }

    if (
      typeof body.address === "string" ||
      body.address === null
    ) {
      updateData.address =
        typeof body.address === "string"
          ? body.address.trim() || null
          : null;
    }

    if (
      body.social_links &&
      typeof body.social_links === "object"
    ) {
      updateData.social_links =
        body.social_links;
    }

    const { data, error } =
      await supabase
        .from("stores")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) {
      console.error(
        "Store update error:",
        error
      );

      if (
        error.code === "23505"
      ) {
        return NextResponse.json(
          {
            error:
              "This slug or custom domain is already in use."
          },
          { status: 409 }
        );
      }

      return NextResponse.json(
        {
          error: error.message
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      store: data
    });
  } catch (error) {
    console.error(
      "Store PATCH error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Store could not be updated."
      },
      { status: 500 }
    );
  }
}


// --- اس لائن کے بعد Add کرنا ہے ---

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { error } = await supabase
      .from("stores")
      .delete()
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Store delete error:", error);
    return NextResponse.json(
      { error: "Unable to delete store." },
      { status: 500 }
    );
  }
}
