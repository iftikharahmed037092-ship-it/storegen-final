import { supabase } from "@/lib/supabase";

export async function storeBelongsToUser(
  storeId: string,
  userId: string
) {
  if (!storeId || !userId) {
    return false;
  }

  const { data, error } =
    await supabase
      .from("store_members")
      .select("id")
      .eq("store_id", storeId)
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

  if (error) {
    console.error(
      "Tenant security check error:",
      error
    );

    return false;
  }

  return Boolean(data);
}
