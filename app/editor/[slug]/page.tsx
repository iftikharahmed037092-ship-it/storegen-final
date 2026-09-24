import { notFound } from "next/navigation";
import { getStoreBySlug } from "@/lib/stores";
import { getPageByStoreId } from "@/lib/pages";
import Editor from "@/components/editor/Editor";
import type { PageData } from "@/types/page";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function EditorPage({ params }: Props) {
  const { slug } = await params;
  const store = await getStoreBySlug(slug);
  if (!store) notFound();

  const page: any = await getPageByStoreId(store.id);

  let blocks: any[] = [];

  if (page) {
    // 1. check page_data
    if (page.page_data?.content && Array.isArray(page.page_data.content)) {
      blocks = page.page_data.content;
    }
    // 2. check content column - yahi aapke supabase me hai
    else if (page.content) {
      try {
        const parsed = typeof page.content === 'string' ? JSON.parse(page.content) : page.content;
        if (Array.isArray(parsed)) blocks = parsed;
        else if (Array.isArray(parsed?.blocks)) blocks = parsed.blocks; // yahi format hai {"blocks":[...]}
        else if (Array.isArray(parsed?.content)) blocks = parsed.content;
      } catch {}
    }
    // 3. check blocks column
    else if (Array.isArray(page.blocks) && page.blocks.length > 0) {
      blocks = page.blocks;
    }
    // 4. check data column
    else if (Array.isArray(page.data) && page.data.length > 0) {
      blocks = page.data;
    }
  }

  const loadedData: PageData = {
    version: 1,
    content: blocks,
  };

  return (
    <Editor
      storeId={store.id}
      storeName={store.store_name}
      initialData={loadedData}
    />
  );
}
