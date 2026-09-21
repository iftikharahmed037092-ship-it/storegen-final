import {
  NextResponse
} from "next/server";

import {
  generateWebsite
} from "@/lib/website-generator";


export async function POST(
  request: Request
) {

  try {

    const body =
      await request.json();


    const storeName =
      String(
        body?.store_name || ""
      ).trim();

    const slug =
      String(
        body?.slug || ""
      )
        .trim()
        .toLowerCase();


    if (!storeName) {

      return NextResponse.json(
        {
          error:
            "Store name is required."
        },
        {
          status: 400
        }
      );
    }


    if (!slug) {

      return NextResponse.json(
        {
          error:
            "Store slug is required."
        },
        {
          status: 400
        }
      );
    }


    if (
      !/^[a-z0-9-]+$/.test(
        slug
      )
    ) {

      return NextResponse.json(
        {
          error:
            "Slug may contain only lowercase letters, numbers and hyphens."
        },
        {
          status: 400
        }
      );
    }


    const shippingFee =
      Number(
        body?.shipping_fee || 0
      );


    if (
      !Number.isFinite(
        shippingFee
      ) ||
      shippingFee < 0
    ) {

      return NextResponse.json(
        {
          error:
            "Invalid shipping fee."
        },
        {
          status: 400
        }
      );
    }


    const website =
      await generateWebsite({

        store_name:
          storeName,

        slug,

        custom_domain:
          String(
            body?.custom_domain || ""
          ).trim() || undefined,

        logo_url:
          String(
            body?.logo_url || ""
          ).trim() || undefined,

        primary_color:
          String(
            body?.primary_color ||
            "#16a34a"
          ),

        whatsapp_number:
          String(
            body?.whatsapp_number ||
            ""
          ).trim() || undefined,

        shipping_fee:
          shippingFee,

        is_active:
          true
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
      "Website generation error:",
      error
    );


    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to generate website."
      },
      {
        status: 500
      }
    );
  }
}
