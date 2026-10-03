import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const email = String(
      body?.email ?? ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      body?.password ?? ""
    );

    if (!email || !password) {
      return NextResponse.json(
        {
          error:
            "Email and password are required.",
        },
        { status: 400 }
      );
    }

    const cookieStore =
      await cookies();

    const supabase =
      createServerClient(
        process.env
          .NEXT_PUBLIC_SUPABASE_URL!,
        process.env
          .NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            getAll() {
              return cookieStore.getAll();
            },

            setAll(
              cookiesToSet
            ) {
              for (const {
                name,
                value,
                options,
              } of cookiesToSet) {
                cookieStore.set(
                  name,
                  value,
                  options
                );
              }
            },
          },
        }
      );

    const {
      data,
      error,
    } =
      await supabase.auth.signInWithPassword(
        {
          email,
          password,
        }
      );

    if (
      error ||
      !data.user
    ) {
      return NextResponse.json(
        {
          error:
            error?.message ||
            "Invalid email or password.",
        },
        { status: 401 }
      );
    }

    /*
     * Force Supabase to establish/refresh
     * the authenticated session before returning.
     */
    const {
      data: verified,
    } =
      await supabase.auth.getUser();

    if (!verified.user) {
      return NextResponse.json(
        {
          error:
            "Login succeeded but the session could not be established. Please try again.",
        },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      userId:
        verified.user.id,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Login failed.",
      },
      { status: 500 }
    );
  }
}
