import { NextResponse } from "next/server";

import {
  canManageStore,
} from "@/lib/creator-auth";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export async function GET(
  req: Request
) {
  const {
    searchParams,
  } = new URL(req.url);

  const slug =
    searchParams.get(
      "slug"
    );

  if (!slug) {
    return NextResponse.json(
      {
        error:
          "slug is required",
      },
      { status: 400 }
    );
  }

  const { data: store } =
    await supabaseAdmin
      .from("stores")
      .select(
        "id,slug"
      )
      .eq(
        "slug",
        slug
      )
      .maybeSingle();

  if (!store) {
    return NextResponse.json(
      {
        error:
          "Store not found",
      },
      { status: 404 }
    );
  }

  const access =
    await canManageStore(
      store.id
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

  const { error } =
    await supabaseAdmin
      .from("stores")
      .update({
        is_published:
          true,
      })
      .eq(
        "id",
        store.id
      );

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message:
      `${slug} published`,
  });
}
