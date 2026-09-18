import Link from "next/link";

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px"
      }}
    >
      <div
        style={{
          maxWidth: "700px",
          width: "100%",
          background: "#ffffff",
          borderRadius: "20px",
          padding: "40px",
          textAlign: "center",
          boxShadow: "0 10px 35px rgba(0,0,0,0.08)"
        }}
      >
        <h1>Master Store Builder</h1>

        <p>
          Create and manage multiple client e-commerce
          stores from one system.
        </p>

        <Link
          href="/admin"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "13px 24px",
            borderRadius: "10px",
            background: "#16a34a",
            color: "#ffffff",
            fontWeight: 700
          }}
        >
          Open Admin Panel
        </Link>
      </div>
    </main>
  );
}
