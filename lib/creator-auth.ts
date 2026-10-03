import {
  createSupabaseServerClient,
} from "@/lib/supabase-server";

import {
  supabaseAdmin,
} from "@/lib/supabase-admin";

export interface CreatorProfile {
  id: string;
  email: string;
  full_name: string;
  status:
    | "active"
    | "suspended";
  created_at: string;
}

export async function getAuthenticatedCreator(): Promise<
  CreatorProfile | null
> {
  try {
    const supabase =
      await createSupabaseServerClient();

    const {
      data: {
        user,
      },
      error: userError,
    } =
      await supabase.auth.getUser();

    if (
      userError ||
      !user
    ) {
      return null;
    }

    const {
      data: creator,
      error,
    } =
      await supabaseAdmin
        .from(
          "creator_profiles"
        )
        .select(
          "id,email,full_name,status,created_at"
        )
        .eq(
          "id",
          user.id
        )
        .eq(
          "status",
          "active"
        )
        .maybeSingle();

    if (
      error ||
      !creator
    ) {
      return null;
    }

    return creator as CreatorProfile;
  } catch {
    return null;
  }
}

export async function canManageStore(
  storeId: string
) {
  if (!storeId) {
    return {
      allowed: false,
      role: null,
      userId: null,
    };
  }

  /*
   * First check Master Admin.
   */
  const {
    getAuthenticatedAdmin,
  } =
    await import(
      "@/lib/server-admin-auth"
    );

  const admin =
    await getAuthenticatedAdmin();

  if (admin) {
    return {
      allowed: true,
      role: "admin" as const,
      userId: admin.id,
    };
  }

  /*
   * Then check Creator.
   */
  const creator =
    await getAuthenticatedCreator();

  if (!creator) {
    return {
      allowed: false,
      role: null,
      userId: null,
    };
  }

  const {
    data,
    error,
  } =
    await supabaseAdmin
      .from("creator_stores")
      .select("id")
      .eq(
        "creator_id",
        creator.id
      )
      .eq(
        "store_id",
        storeId
      )
      .maybeSingle();

  if (
    error ||
    !data
  ) {
    return {
      allowed: false,
      role: "creator" as const,
      userId: creator.id,
    };
  }

  return {
    allowed: true,
    role: "creator" as const,
    userId: creator.id,
  };
}
