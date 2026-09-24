import { supabase } from "./supabase";
import type { Page, PageData } from "@/types/page";

export async function getPageByStoreId(storeId: string): Promise<Page | null> {
  const { data } = await supabase
    .from("pages")
    .select("*")
    .eq("store_id", storeId)
    .eq("slug", "home")
    .maybeSingle();
  return data as any;
}

export async function savePage(storeId: string, pageData: PageData): Promise<Page> {
  const blocks = pageData?.content || [];
  
  if (!Array.isArray(blocks) || blocks.length === 0) {
    throw new Error("Empty blocks");
  }

  // صرف وہی کالم save کرو جو Supabase میں موجود ہیں
  const { data, error } = await supabase
    .from("pages")
    .upsert(
      {
        store_id: storeId,
        slug: "home",
        title: "Home",
        content: pageData, // پورا {version, content} یہیں save ہوگا
        updated_at: new Date().toISOString(),
      },
      { onConflict: "store_id,slug" }
    )
    .select("*")
    .single();

  if (error) throw error;
  return data as any;
}
