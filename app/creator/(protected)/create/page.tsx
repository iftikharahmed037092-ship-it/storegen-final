import Link from "next/link";

import WebsiteGenerator from "@/components/admin/WebsiteGenerator";

export default function CreatorCreatePage() {
  return (
    <div>
      <Link
        href="/creator"
        style={{
          color: "#2563eb",
          fontWeight: 700,
        }}
      >
        ← Back to Creator Dashboard
      </Link>

      <div
        style={{
          marginTop: 20,
        }}
      >
        <WebsiteGenerator
          afterCreate={(slug) =>
            `/creator?created=${encodeURIComponent(
              slug
            )}`
          }
        />
      </div>
    </div>
  );
}
