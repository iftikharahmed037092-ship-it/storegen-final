import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
}

export async function getAuthenticatedAdmin(): Promise<AdminUser | null> {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const {
    data: admin,
    error
  } = await supabaseAdmin
    .from("admin_users")
    .select(
      "id, email, role, is_active"
    )
    .eq("id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (error || !admin) {
    return null;
  }

  return admin;
}
