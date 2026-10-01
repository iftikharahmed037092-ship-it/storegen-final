import Link from "next/link";

import WebsiteGenerator
  from "@/components/admin/WebsiteGenerator";

export default function CreatorCreatePage() {
  return (
    <div>
      <Link
        href="/creator"
        style={{
          color:
            "#2563eb",
          fontWeight:
            800
        }}
      >
        ← Back to Creator Dashboard
      </Link>

      <div
        style={{
          marginTop: 20
        }}
      >
        <WebsiteGenerator
          successPath="/creator"
        />
      </div>
    </div>
  );
}
