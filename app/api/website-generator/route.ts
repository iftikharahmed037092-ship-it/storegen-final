import { NextResponse } from "next/server";

import { generateWebsite } from "@/lib/website-generator";
import type {
  BusinessType,
  TemplateType
} from "@/types/store";

const businessTypes: BusinessType[] = [
  "general",
  "garments",
  "shoes",
  "watches",
  "electronics"
];

const templateTypes: TemplateType[] = [
  "classic",
  "modern",
  "minimal"
];

function cleanString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidSlug(slug: string) {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const store_name = cleanString(body.store_name);
    const slug = cleanString(body.slug).toLowerCase();

    const custom_domain = cleanString(body.custom_domain);
    const logo_url = cleanString(body.logo_url);
    const primary_color =
      cleanString(body.primary_color) || "#16a34a";

    const whatsapp_number = cleanString(
      body.whatsapp_number
    );

    const contact_phone = cleanString(body.contact_phone);
    const contact_email = cleanString(body.contact_email);
    const address = cleanString(body.address);

    const business_type = body.business_type as BusinessType;
    const template_type = body.template_type as TemplateType;

    const shipping_fee = Number(body.shipping_fee ?? 0);

    const social_links =
      body.social_links &&
      typeof body.social_links === "object"
        ? {
            facebook: cleanString(body.social_links.facebook),
            instagram: cleanString(body.social_links.instagram),
            tiktok: cleanString(body.social_links.tiktok),
            youtube: cleanString(body.social_links.youtube)
          }
        : {};

    // Store name
    if (!store_name) {
      return NextResponse.json(
        {
          error: "Store name is required."
        },
        { status: 400 }
      );
    }

    if (store_name.length < 2) {
      return NextResponse.json(
        {
          error: "Store name must contain at least 2 characters."
        },
        { status: 400 }
      );
    }

    // Slug
    if (!slug) {
      return NextResponse.json(
        {
          error: "Store slug is required."
        },
        { status: 400 }
      );
    }

    if (!isValidSlug(slug)) {
      return NextResponse.json(
        {
          error:
            "Invalid store slug. Use lowercase letters, numbers and hyphens only."
        },
        { status: 400 }
      );
    }

    if (slug.length < 2 || slug.length > 60) {
      return NextResponse.json(
        {
          error:
            "Store slug must be between 2 and 60 characters."
        },
        { status: 400 }
      );
    }

    // Business type
    if (!businessTypes.includes(business_type)) {
      return NextResponse.json(
        {
          error: "Invalid business type."
        },
        { status: 400 }
      );
    }

    // Template
    if (!templateTypes.includes(template_type)) {
      return NextResponse.json(
        {
          error: "Invalid website template."
        },
        { status: 400 }
      );
    }

    // Shipping
    if (!Number.isFinite(shipping_fee) || shipping_fee < 0) {
      return NextResponse.json(
        {
          error: "Shipping fee must be 0 or greater."
        },
        { status: 400 }
      );
    }

    // Email
    if (
      contact_email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact_email)
    ) {
      return NextResponse.json(
        {
          error: "Please enter a valid contact email."
        },
        { status: 400 }
      );
    }

    const generated = await generateWebsite({
      store_name,
      slug,
      custom_domain: custom_domain || null,
      logo_url: logo_url || null,
      primary_color,
      whatsapp_number: whatsapp_number || null,
      shipping_fee,
      is_active: true,

      business_type,
      template_type,

      contact_phone: contact_phone || null,
      contact_email: contact_email || null,
      address: address || null,

      social_links
    });

    return NextResponse.json(
      {
        success: true,
        generated
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Website generation error:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Website generation failed.";

    // PostgreSQL/Supabase unique constraint
    if (
      message.toLowerCase().includes("duplicate") ||
      message.toLowerCase().includes("unique") ||
      message.toLowerCase().includes("stores_slug")
    ) {
      return NextResponse.json(
        {
          error:
            "This store slug already exists. Please choose another slug."
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        error:
          "Website could not be generated. Please check your information and try again."
      },
      { status: 500 }
    );
  }
}
