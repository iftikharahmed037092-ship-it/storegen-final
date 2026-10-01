import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";
import {
  checkDomainHealth
} from "@/lib/domain-health";
import {
  normalizeDomain
} from "@/lib/domains";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const storeId =
      typeof body.storeId === "string"
        ? body.storeId.trim()
        : "";

    if (!storeId) {
      return NextResponse.json(
        {
          error:
            "Store ID is required."
        },
        { status: 400 }
      );
    }

    const { data: store, error } =
      await supabase
        .from("stores")
        .select(
          `
            id,
            custom_domain,
            domain_status,
            domain_verified,
            domain_verified_at
          `
        )
        .eq("id", storeId)
        .single();

    if (error || !store) {
      return NextResponse.json(
        {
          error:
            "Store not found."
        },
        { status: 404 }
      );
    }

    const domain =
      normalizeDomain(
        store.custom_domain
      );

    if (!domain) {
      return NextResponse.json(
        {
          error:
            "No custom domain is configured."
        },
        { status: 400 }
      );
    }

    const health =
      await checkDomainHealth(
        domain
      );

    return NextResponse.json({
      success: true,
      health,
      store: {
        domain_status:
          store.domain_status,
        domain_verified:
          store.domain_verified,
        domain_verified_at:
          store.domain_verified_at
      }
    });
  } catch (error) {
    console.error(
      "Domain health error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Could not check domain health."
      },
      { status: 500 }
    );
  }
}
