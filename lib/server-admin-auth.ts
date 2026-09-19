import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

interface AdminUser {
  id: string;
  email: string;
  role: string;
  is_active: boolean;
}

export async function getAuthenticatedAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return null;
  }

  const supabaseServer = createClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        cookies: {
          getAll() {
            return cookieStore.getAll();
          }
        }
      }
    }
  );

  const {
    data: {
      user
    }
  } =
    await supabaseServer.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: admin, error } =
    await supabaseServer
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
