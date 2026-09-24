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

export default async function EditorPage({
  params
}: Props) {
  const { slug } = await params;

  const store =
    await getStoreBySlug(slug);

  if (!store) {
    notFound();
  }

  const page: any =
    await getPageByStoreId(store.id);

  const defaultData: PageData = {
    version: 1,
    content: []
  };

  // page_data یا content دونوں میں سے جو بھی ملے اسے لوڈ کرو
  let loadedData: PageData = defaultData;
  if (page) {
    if (page.page_data && typeof page.page_data === 'object' && page.page_data.content?.length > 0) {
      loadedData = page.page_data as PageData;
    } else if (page.content) {
      try {
        const parsed = typeof page.content === 'string' ? JSON.parse(page.content) : page.content;
        if (parsed?.content?.length > 0) {
          loadedData = parsed;
        }
      } catch (e) {}
    }
  }

  return (
    <Editor
      storeId={store.id}
      storeName={store.store_name}
      initialData={loadedData}
    />
  );
}
