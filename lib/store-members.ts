import { supabase } from "@/lib/supabase";

export type StoreMemberRole =
  | "owner"
  | "manager"
  | "editor";

export async function getStoreMember(
  storeId: string,
  userId: string
) {
  if (!storeId || !userId) {
    return null;
  }

  const { data, error } =
    await supabase
      .from("store_members")
      .select(
        "id, store_id, user_id, role, is_active"
      )
      .eq("store_id", storeId)
      .eq("user_id", userId)
      .eq("is_active", true)
      .maybeSingle();

  if (error) {
    console.error(
      "Store member lookup error:",
      error
    );

    return null;
  }

  return data;
}

export async function hasStoreAccess(
  storeId: string,
  userId: string
) {
  const member =
    await getStoreMember(
      storeId,
      userId
    );

  return Boolean(member);
}

export async function hasStoreRole(
  storeId: string,
  userId: string,
  roles: StoreMemberRole[]
) {
  const member =
    await getStoreMember(
      storeId,
      userId
    );

  if (!member) {
    return false;
  }

  return roles.includes(
    member.role as StoreMemberRole
  );
}
