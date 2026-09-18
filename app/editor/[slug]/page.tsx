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

  const page =
    await getPageByStoreId(store.id);

  const defaultData: PageData = {
    version: 1,
    content: []
  };

  return (
    <Editor
      storeId={store.id}
      storeName={store.store_name}
      initialData={
        page?.page_data ||
        defaultData
      }
    />
  );
}
