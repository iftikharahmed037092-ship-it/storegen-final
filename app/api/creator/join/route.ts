import {
  NextResponse
} from "next/server";

import crypto from "crypto";

import {
  supabaseAdmin
} from "@/lib/supabase-admin";

function hashToken(
  token: string
) {
  return crypto
    .createHash("sha256")
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
      String(
        body.token ?? ""
      ).trim();

    const email =
      String(
        body.email ?? ""
      )
        .trim()
        .toLowerCase();

    const fullName =
      String(
        body.fullName ?? ""
      ).trim();

    const password =
      String(
        body.password ?? ""
      );

    if (
      !token ||
      !email ||
      !fullName ||
      password.length < 8
    ) {
      return NextResponse.json(
        {
          error:
            "Name, email and password are required."
        },
        {
          status: 400
        }
      );
    }

    const tokenHash =
      hashToken(token);

    const {
      data: invite,
      error: inviteError
    } =
      await supabaseAdmin
        .from("creator_invites")
        .select(
          "id, email, expires_at, accepted_at"
        )
        .eq(
          "token_hash",
          tokenHash
        )
        .maybeSingle();

    if (
      inviteError ||
      !invite
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid creator invitation."
        },
        {
          status: 400
        }
      );
    }

    if (
      invite.accepted_at
    ) {
      return NextResponse.json(
        {
          error:
            "This invitation has already been used."
        },
        {
          status: 409
        }
      );
    }

    if (
      new Date(
        invite.expires_at
      ) <= new Date()
    ) {
      return NextResponse.json(
        {
          error:
            "This invitation has expired."
        },
        {
          status: 410
        }
      );
    }

    if (
      invite.email.toLowerCase() !==
      email
    ) {
      return NextResponse.json(
        {
          error:
            "This invitation belongs to a different email address."
        },
        {
          status: 403
        }
      );
    }

    /*
     * Check capacity again at the
     * moment of account creation.
     */

    const {
      data: settings
    } =
      await supabaseAdmin
        .from("creator_settings")
        .select(
          "max_creators"
        )
        .eq("id", true)
        .single();

    const maxCreators =
      settings?.max_creators ??
      10;

    const {
      count: activeCount
    } =
      await supabaseAdmin
        .from("creator_profiles")
        .select(
          "id",
          {
            count:
              "exact",
            head: true
          }
        )
        .eq(
          "status",
          "active"
        );

    if (
      (activeCount ?? 0) >=
      maxCreators
    ) {
      return NextResponse.json(
        {
          error:
            "Creator capacity is currently full."
        },
        {
          status: 409
        }
      );
    }

    const {
      data: authUser,
      error:
        authError
    } =
      await supabaseAdmin.auth.admin.createUser(
        {
          email,
          password,
          email_confirm:
            true,
          user_metadata: {
            full_name:
              fullName,
            account_type:
              "creator"
          }
        }
      );

    if (
      authError ||
      !authUser.user
    ) {
      return NextResponse.json(
        {
          error:
            authError?.message ||
            "Unable to create authentication account."
        },
        {
          status: 400
        }
      );
    }

    const userId =
      authUser.user.id;

    const {
      error:
        profileError
    } =
      await supabaseAdmin
        .from(
          "creator_profiles"
        )
        .insert({
          id: userId,
          email,
          full_name:
            fullName,
          status:
            "active",
          created_by:
            null
        });

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(
        userId
      );

      return NextResponse.json(
        {
          error:
            profileError.message
        },
        {
          status: 500
        }
      );
    }

    const {
      error:
        inviteUpdateError
    } =
      await supabaseAdmin
        .from(
          "creator_invites"
        )
        .update({
          accepted_at:
            new Date().toISOString()
        })
        .eq(
          "id",
          invite.id
        );

    if (inviteUpdateError) {
      await supabaseAdmin
        .from(
          "creator_profiles"
        )
        .delete()
        .eq(
          "id",
          userId
        );

      await supabaseAdmin.auth.admin.deleteUser(
        userId
      );

      return NextResponse.json(
        {
          error:
            "Unable to finalize invitation."
        },
        {
          status: 500
        }
      );
    }

    return NextResponse.json({
      success: true
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Creator registration failed."
      },
      {
        status: 500
      }
    );
  }
}
