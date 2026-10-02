import { NextResponse } from "next/server";
import {
  createHash,
  randomBytes,
} from "crypto";

import {
  getAuthenticatedAdmin,
} from "@/lib/server-admin-auth";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

function hashToken(
  token: string
) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function GET() {
  const admin =
    await getAuthenticatedAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const [
    { data: settings },
    { data: creators },
    { data: invites },
  ] =
    await Promise.all([
      supabaseAdmin
        .from("creator_settings")
        .select("max_creators")
        .eq("id", true)
        .single(),

      supabaseAdmin
        .from("creator_profiles")
        .select(
          "id,email,full_name,status,created_at"
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        ),

      supabaseAdmin
        .from("creator_invites")
        .select(
          "id,email,expires_at,created_at,accepted_at"
        )
        .is(
          "accepted_at",
          null
        )
        .gt(
          "expires_at",
          new Date().toISOString()
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        ),
    ]);

  return NextResponse.json({
    maxCreators:
      settings?.max_creators ||
      10,

    creators:
      creators || [],

    invites:
      invites || [],
  });
}

export async function POST(
  request: Request
) {
  const admin =
    await getAuthenticatedAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body =
    await request.json();

  const email =
    String(
      body.email || ""
    )
      .trim()
      .toLowerCase();

  if (
    !email ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      email
    )
  ) {
    return NextResponse.json(
      {
        error:
          "Valid email is required.",
      },
      { status: 400 }
    );
  }

  const { data: settings } =
    await supabaseAdmin
      .from("creator_settings")
      .select("max_creators")
      .eq("id", true)
      .single();

  const {
    count: activeCount,
  } =
    await supabaseAdmin
      .from("creator_profiles")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq(
        "status",
        "active"
      );

  const {
    count: pendingCount,
  } =
    await supabaseAdmin
      .from("creator_invites")
      .select("id", {
        count: "exact",
        head: true,
      })
      .is(
        "accepted_at",
        null
      )
      .gt(
        "expires_at",
        new Date().toISOString()
      );

  const max =
    settings?.max_creators ||
    10;

  if (
    (activeCount || 0) +
      (pendingCount || 0) >=
    max
  ) {
    return NextResponse.json(
      {
        error:
          "Creator limit reached. Increase Max Creators first.",
      },
      { status: 409 }
    );
  }

  await supabaseAdmin
    .from("creator_invites")
    .update({
      expires_at:
        new Date().toISOString(),
    })
    .eq(
      "email",
      email
    )
    .is(
      "accepted_at",
      null
    );

  const token =
    randomBytes(32).toString(
      "hex"
    );

  const expires =
    new Date(
      Date.now() +
        7 *
          24 *
          60 *
          60 *
          1000
    ).toISOString();

  const { error } =
    await supabaseAdmin
      .from("creator_invites")
      .insert({
        email,
        token_hash:
          hashToken(token),
        expires_at:
          expires,
        created_by:
          admin.id,
      });

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      { status: 500 }
    );
  }

  const inviteUrl =
    `${new URL(
      request.url
    ).origin}/creator/join/${token}`;

  return NextResponse.json({
    success: true,
    inviteUrl,
    expiresAt: expires,
  });
}

export async function PATCH(
  request: Request
) {
  const admin =
    await getAuthenticatedAdmin();

  if (!admin) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  const body =
    await request.json();

  const maxCreators =
    Number(
      body.maxCreators
    );

  if (
    !Number.isInteger(
      maxCreators
    ) ||
    maxCreators < 1
  ) {
    return NextResponse.json(
      {
        error:
          "Max creators must be a whole number greater than 0.",
      },
      { status: 400 }
    );
  }

  const { error } =
    await supabaseAdmin
      .from("creator_settings")
      .update({
        max_creators:
          maxCreators,
        updated_at:
          new Date().toISOString(),
      })
      .eq("id", true);

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
    maxCreators,
  });
}
