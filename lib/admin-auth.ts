import { supabase } from "@/lib/supabase";

export async function getAdminUser(
  userId: string
) {
  if (!userId) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("admin_users")
      .select(
        "id, email, role, is_active"
      )
      .eq("id", userId)
      .eq("is_active", true)
      .maybeSingle();

  if (error) {
    console.error(
      "Admin authorization error:",
      error
    );

    return null;
  }

  return data;
}
