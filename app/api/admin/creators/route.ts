import {
  NextResponse
} from "next/server";

import crypto from "crypto";

import {
  getAuthenticatedAdmin
} from "@/lib/server-admin-auth";

import {
  supabaseAdmin
} from "@/lib/supabase-admin";

function hashToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}

function createToken() {
  return crypto
    .randomBytes(32)
    .toString("hex");
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
    settingsResult,
    creatorsResult,
    invitesResult
  ] = await Promise.all([
    supabaseAdmin
      .from("creator_settings")
      .select("max_creators")
      .eq("id", true)
      .single(),

    supabaseAdmin
      .from("creator_profiles")
      .select(
        "id, email, full_name, status, created_at"
      )
      .order("created_at", {
        ascending: false
      }),

    supabaseAdmin
      .from("creator_invites")
      .select(
        "id, email, expires_at, accepted_at, created_at"
      )
      .order("created_at", {
        ascending: false
      })
      .limit(30)
  ]);

  if (settingsResult.error) {
    return NextResponse.json(
      {
        error:
          settingsResult.error.message
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    maxCreators:
      settingsResult.data
        ?.max_creators ?? 10,

    creators:
      creatorsResult.data ?? [],

    invites:
      invitesResult.data ?? []
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
      body.email ?? ""
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
          "Valid creator email is required."
      },
      { status: 400 }
    );
  }

  const {
    data: settings
  } =
    await supabaseAdmin
      .from("creator_settings")
      .select("max_creators")
      .eq("id", true)
      .single();

  const maxCreators =
    settings?.max_creators ?? 10;

  const {
    count: activeCount
  } =
    await supabaseAdmin
      .from("creator_profiles")
      .select(
        "id",
        {
          count: "exact",
          head: true
        }
      )
      .eq("status", "active");

  const {
    count: pendingCount
  } =
    await supabaseAdmin
      .from("creator_invites")
      .select(
        "id",
        {
          count: "exact",
          head: true
        }
      )
      .is("accepted_at", null)
      .gt(
        "expires_at",
        new Date().toISOString()
      );

  const usedSeats =
    (activeCount ?? 0) +
    (pendingCount ?? 0);

  if (
    usedSeats >= maxCreators
  ) {
    return NextResponse.json(
      {
        error:
          `Creator limit reached. Maximum allowed: ${maxCreators}.`
      },
      { status: 409 }
    );
  }

  /*
   * Remove old pending invite
   * for the same email.
   */

  await supabaseAdmin
    .from("creator_invites")
    .delete()
    .eq("email", email)
    .is("accepted_at", null);

  const token =
    createToken();

  const tokenHash =
    hashToken(token);

  const expiresAt =
    new Date(
      Date.now() +
        7 * 24 * 60 * 60 * 1000
    ).toISOString();

  const { error } =
    await supabaseAdmin
      .from("creator_invites")
      .insert({
        email,
        token_hash: tokenHash,
        expires_at: expiresAt,
        created_by: admin.id
      });

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message
      },
      { status: 500 }
    );
  }

  const origin =
    new URL(request.url)
      .origin;

  const inviteUrl =
    `${origin}/creator/join/${token}`;

  return NextResponse.json({
    success: true,
    inviteUrl,
    expiresAt
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
    maxCreators < 1 ||
    maxCreators > 10000
  ) {
    return NextResponse.json(
      {
        error:
          "Maximum creators must be between 1 and 10000."
      },
      { status: 400 }
    );
  }

  const {
    count: activeCount
  } =
    await supabaseAdmin
      .from("creator_profiles")
      .select(
        "id",
        {
          count: "exact",
          head: true
        }
      )
      .eq("status", "active");

  if (
    maxCreators <
    (activeCount ?? 0)
  ) {
    return NextResponse.json(
      {
        error:
          "Maximum cannot be lower than the current active creator count."
      },
      { status: 400 }
    );
  }

  const {
    error
  } =
    await supabaseAdmin
      .from("creator_settings")
      .update({
        max_creators:
          maxCreators,
        updated_at:
          new Date().toISOString()
      })
      .eq("id", true);

  if (error) {
    return NextResponse.json(
      {
        error:
          error.message
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    maxCreators
  });
}
