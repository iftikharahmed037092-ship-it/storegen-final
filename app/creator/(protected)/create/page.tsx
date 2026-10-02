"use client";

import Link from "next/link";
import WebsiteGenerator from "@/components/admin/WebsiteGenerator";
import { useRouter } from "next/navigation";

export default function CreatorCreatePage() {
  const router = useRouter();
  
  return (
    <div>
      <Link href="/creator" style={{ color: "#2563eb", fontWeight: 700 }}>
        ← Back to Creator Dashboard
      </Link>
      <div style={{ marginTop: 20 }}>
        <WebsiteGenerator
          afterCreate={(slug: string) => {
            router.push(`/editor/${slug}`);
          }}
        />
      </div>
    </div>
  );
}
