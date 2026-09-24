import { supabase } from "./supabase";
import type { Page, PageData } from "@/types/page";

export async function getPageByStoreId(storeId: string): Promise<Page | null> {
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .eq("store_id", storeId)
    .eq("slug", "home")
    .maybeSingle();

  if (error) {
    console.error("getPage error:", error.message);
    return null;
  }
  return data as any;
}

export async function savePage(storeId: string, pageData: PageData): Promise<Page> {
  // pageData = { version: 1, content: [...] }
  const blocks = pageData?.content || [];

  if (!Array.isArray(blocks) || blocks.length === 0) {
    throw new Error("Cannot save empty blocks");
  }

  const { data, error } = await supabase
    .from("pages")
    .upsert(
      {
        store_id: storeId,
        slug: "home",
        title: "Home",
        // سب کالمز میں ایک ہی چیز save کرو تاکہ پرانا کوڈ بھی چلے نیا بھی
        content: { blocks: blocks }, // Supabase me jo ab hai
        page_data: pageData, // {version, content}
        blocks: blocks,
        data: blocks,
        published: true,
        is_published: true,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "store_id,slug" }
    )
    .select("*")
    .single();

  if (error) throw new Error(error.message);
  return data as any;
}
