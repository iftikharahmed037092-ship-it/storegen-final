import { supabase } from "./supabase";
import type { Page, PageData } from "@/types/page";

export async function getPageByStoreId(
  storeId: string
): Promise<Page | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("store_id", storeId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function savePage(
  storeId: string,
  pageData: PageData
): Promise<Page> {
  const { data, error } = await supabase
    .from("pages")
    .upsert(
      {
        store_id: storeId,
        page_data: pageData,
        updated_at: new Date().toISOString()
      },
      {
        onConflict: "store_id"
      }
    )
    .select("*")
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
