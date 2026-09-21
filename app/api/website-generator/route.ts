import { NextResponse } from "next/server";

import {
  generateWebsite
} from "@/lib/website-generator";

import type {
  BusinessType,
  TemplateType
} from "@/types/store";

const BUSINESS_TYPES: BusinessType[] = [
  "general",
  "garments",
  "shoes",
  "watches",
  "electronics"
];

const TEMPLATE_TYPES: TemplateType[] = [
  "classic",
  "modern",
  "minimal"
];

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const store_name =
      String(
        body.store_name ?? ""
      ).trim();

    const slug =
      String(
        body.slug ?? ""
      )
        .trim()
        .toLowerCase();

    const business_type =
      String(
        body.business_type ??
          "general"
      ) as BusinessType;

    const template_type =
      String(
        body.template_type ??
          "classic"
      ) as TemplateType;

    if (!store_name) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Store name is required."
        },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Store slug is required."
        },
        { status: 400 }
      );
    }

    if (
      !/^[a-z0-9-]+$/.test(
        slug
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Slug can contain only lowercase letters, numbers and hyphens."
        },
        { status: 400 }
      );
    }

    if (
      !BUSINESS_TYPES.includes(
        business_type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid business type."
        },
        { status: 400 }
      );
    }

    if (
      !TEMPLATE_TYPES.includes(
        template_type
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid template type."
        },
        { status: 400 }
      );
    }

    const shipping_fee =
      Number(
        body.shipping_fee ?? 0
      );

    if (
      !Number.isFinite(
        shipping_fee
      ) ||
      shipping_fee < 0
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Shipping fee must be a valid non-negative number."
        },
        { status: 400 }
      );
    }

    const socialLinks = {
      facebook:
        String(
          body.social_links?.facebook ??
            ""
        ).trim(),

      instagram:
        String(
          body.social_links?.instagram ??
            ""
        ).trim(),

      tiktok:
        String(
          body.social_links?.tiktok ??
            ""
        ).trim(),

      youtube:
        String(
          body.social_links?.youtube ??
            ""
        ).trim()
    };

    const website =
      await generateWebsite({
        store_name,

        slug,

        custom_domain:
          String(
            body.custom_domain ?? ""
          ).trim() ||
          undefined,

        logo_url:
          String(
            body.logo_url ?? ""
          ).trim() ||
          undefined,

        primary_color:
          String(
            body.primary_color ??
              "#16a34a"
          ).trim(),

        whatsapp_number:
          String(
            body.whatsapp_number ??
              ""
          ).trim() ||
          undefined,

        shipping_fee,

        is_active:
          true,

        business_type,

        template_type,

        contact_phone:
          String(
            body.contact_phone ??
              ""
          ).trim() ||
          undefined,

        contact_email:
          String(
            body.contact_email ??
              ""
          ).trim() ||
          undefined,

        address:
          String(
            body.address ?? ""
          ).trim() ||
          undefined,

        social_links:
          socialLinks
      });

    return NextResponse.json(
      {
        success: true,
        website
      },
      {
        status: 201
      }
    );
  } catch (error) {
    console.error(
      "Website generator error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Failed to generate website."
      },
      {
        status: 500
      }
    );
  }
}
