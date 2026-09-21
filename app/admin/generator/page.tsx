import Link from "next/link";

import WebsiteGenerator
  from "@/components/admin/WebsiteGenerator";


export default function GeneratorPage() {

  return (
    <div>

      <Link
        href="/admin"
        style={{
          color: "#2563eb",
          fontWeight: 700
        }}
      >
        ← Back to Dashboard
      </Link>


      <div
        style={{
          marginTop: 20
        }}
      >

        <WebsiteGenerator />

      </div>

    </div>
  );
}
