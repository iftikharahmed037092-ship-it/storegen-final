import { createSupabaseServerClient } from "@/lib/supabase-server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export interface CreatorUser {
  id: string;
  email: string;
  full_name: string;
  status: "active" | "suspended";
}

export async function getAuthenticatedCreator(): Promise<CreatorUser | null> {
  const supabase =
    await createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const {
    data: creator,
    error
  } = await supabaseAdmin
    .from("creator_profiles")
    .select(
      "id, email, full_name, status"
    )
    .eq("id", user.id)
    .eq("status", "active")
    .maybeSingle();

  if (error || !creator) {
    return null;
  }

  return creator as CreatorUser;
}
