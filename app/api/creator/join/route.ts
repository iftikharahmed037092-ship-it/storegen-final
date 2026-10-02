import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";

function hashToken(token: string) {
  return createHash("sha256")
    .update(token)
    .digest("hex");
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const token =
      String(body.token || "").trim();

    const email =
      String(body.email || "")
        .trim()
        .toLowerCase();

    const fullName =
      String(body.fullName || "").trim();

    const password =
      String(body.password || "");

    if (
      !token ||
      !email ||
      !fullName ||
      password.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Please complete all fields. Password must be at least 8 characters.",
        },
        { status: 400 }
      );
    }

    const { data: invite } =
      await supabaseAdmin
        .from("creator_invites")
        .select(
          "id,email,expires_at,accepted_at"
        )
        .eq(
          "token_hash",
          hashToken(token)
        )
        .maybeSingle();

    if (!invite) {
      return NextResponse.json(
        {
          error:
            "This invitation link is invalid.",
        },
        { status: 400 }
      );
    }

    if (invite.accepted_at) {
      return NextResponse.json(
        {
          error:
            "This invitation has already been used.",
        },
        { status: 400 }
      );
    }

    if (
      new Date(
        invite.expires_at
      ).getTime() <= Date.now()
    ) {
      return NextResponse.json(
        {
          error:
            "This invitation link has expired.",
        },
        { status: 400 }
      );
    }

    if (
      invite.email.toLowerCase() !==
      email
    ) {
      return NextResponse.json(
        {
          error:
            "Use the email address that received this invitation.",
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
    } = await supabaseAdmin
      .from("creator_profiles")
      .select("id", {
        count: "exact",
        head: true,
      })
      .eq("status", "active");

    if (
      (activeCount || 0) >=
      (settings?.max_creators || 0)
    ) {
      return NextResponse.json(
        {
          error:
            "Creator capacity is currently full. Ask the Master Admin to increase the limit.",
        },
        { status: 403 }
      );
    }

    const {
      data: existingCreator,
    } = await supabaseAdmin
      .from("creator_profiles")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingCreator) {
      return NextResponse.json(
        {
          error:
            "A creator account already exists for this email.",
        },
        { status: 409 }
      );
    }

    const {
      data: authData,
      error: authError,
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email,
          password,
          email_confirm: true,
          user_metadata: {
            full_name: fullName,
          },
        }
      );

    if (
      authError ||
      !authData.user
    ) {
      throw new Error(
        authError?.message ||
          "Could not create account."
      );
    }

    const userId =
      authData.user.id;

    const { error: profileError } =
      await supabaseAdmin
        .from("creator_profiles")
        .insert({
          id: userId,
          email,
          full_name: fullName,
          status: "active",
        });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(
        userId
      );

      throw new Error(
        profileError.message
      );
    }

    const {
      error: inviteError,
    } =
      await supabaseAdmin
        .from("creator_invites")
        .update({
          accepted_at:
            new Date().toISOString(),
        })
        .eq("id", invite.id);

    if (inviteError) {
      await supabaseAdmin
        .from("creator_profiles")
        .delete()
        .eq("id", userId);

      await supabaseAdmin.auth.admin.deleteUser(
        userId
      );

      throw new Error(
        inviteError.message
      );
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "Creator join error",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Unable to create creator account.",
      },
      { status: 500 }
    );
  }
}
