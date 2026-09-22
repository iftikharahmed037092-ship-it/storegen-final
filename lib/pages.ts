import { supabase } from "./supabase";
import type { Page, PageData } from "@/types/page";

export async function getPageByStoreId(storeId: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("store_id", storeId)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as any;
}

export async function savePage(storeId: string, pageData: PageData): Promise<Page> {
  const { data, error } = await supabase
    .from("pages")
    .upsert(
      {
        store_id: storeId,
        slug: "home",
        title: "Home",
        content: JSON.stringify(pageData), // پرانی ٹیبل کے لیے
        page_data: pageData, // نئی ٹیبل کے لیے
        published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "store_id,slug" }
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as any;
}
