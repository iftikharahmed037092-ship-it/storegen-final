import { NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      {
        role: null
      },
      {
        status: 401
      }
    );
  }

  const { data: admin } =
    await supabaseAdmin
      .from("admin_users")
      .select(
        "id, role, is_active"
      )
      .eq("id", user.id)
      .eq("is_active", true)
      .maybeSingle();

  if (admin) {
    return NextResponse.json({
      role: "master_admin"
    });
  }

  const { data: creator } =
    await supabaseAdmin
      .from("creator_profiles")
      .select(
        "id, status"
      )
      .eq("id", user.id)
      .eq("status", "active")
      .maybeSingle();

  if (creator) {
    return NextResponse.json({
      role: "creator"
    });
  }

  return NextResponse.json({
    role: null
  });
}
