import { NextResponse } from "next/server";

import {
  canManageStore,
} from "@/lib/creator-auth";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function POST(
  req: Request
) {
  try {
    const body =
      await req.json();

    const storeId =
      body.storeId ||
      body.store_id;

    let blocks =
      body.pageData ||
      body.page_data ||
      body.content ||
      body.blocks ||
      body.data ||
      [];

    if (
      blocks &&
      typeof blocks ===
        "object" &&
      !Array.isArray(blocks)
    ) {
      if (
        Array.isArray(
          blocks.content
        )
      ) {
        blocks =
          blocks.content;
      } else if (
        Array.isArray(
          blocks.blocks
        )
      ) {
        blocks =
          blocks.blocks;
      }
    }

    if (!storeId) {
      return NextResponse.json(
        {
          error:
            "storeId missing",
        },
        { status: 400 }
      );
    }

    const access =
      await canManageStore(
        storeId
      );

    if (!access.allowed) {
      return NextResponse.json(
        {
          error:
            "Forbidden",
        },
        { status: 403 }
      );
    }

    if (
      !Array.isArray(
        blocks
      ) ||
      blocks.length === 0
    ) {
      return NextResponse.json(
        {
          error:
            "Empty blocks received",
        },
        { status: 400 }
      );
    }

    const finalContent = {
      version: 1,
      content: blocks,
    };

    const { error } =
      await supabaseAdmin
        .from("pages")
        .upsert(
          {
            store_id:
              storeId,
            slug: "home",
            title: "Home",
            content:
              finalContent,
            page_data:
              finalContent,
            blocks:
              blocks,
            data:
              blocks,
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict:
              "store_id,slug",
          }
        );

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      savedCount:
        blocks.length,
    });
  } catch (e: any) {
    return NextResponse.json(
      {
        error:
          e.message,
      },
      { status: 500 }
    );
  }
}
