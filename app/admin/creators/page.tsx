import {
  supabaseAdmin
} from "@/lib/supabase-admin";

import CreatorManager
  from "@/components/admin/CreatorManager";

export const dynamic =
  "force-dynamic";

export default async function CreatorsPage() {
  const [
    settingsResult,
    creatorsResult,
    invitesResult
  ] = await Promise.all([
    supabaseAdmin
      .from("creator_settings")
      .select("max_creators")
      .eq("id", true)
      .single(),

    supabaseAdmin
      .from("creator_profiles")
      .select(
        "id, email, full_name, status, created_at"
      )
      .order("created_at", {
        ascending: false
      }),

    supabaseAdmin
      .from("creator_invites")
      .select(
        "id, email, expires_at, accepted_at, created_at"
      )
      .order("created_at", {
        ascending: false
      })
      .limit(30)
  ]);

  return (
    <CreatorManager
      maxCreators={
        settingsResult.data
          ?.max_creators ?? 10
      }
      creators={
        creatorsResult.data ?? []
      }
      invites={
        invitesResult.data ?? []
      }
    />
  );
}
