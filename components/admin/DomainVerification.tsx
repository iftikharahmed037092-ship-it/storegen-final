"use client";
import { useState, useEffect } from "react";

interface DomainVerificationProps {
  storeId: string;
  domain: string | null;
  status: "none" | "pending" | "verified" | "failed";
}

export default function DomainVerification({ storeId, domain, status }: DomainVerificationProps) {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState("");
  const [recordValue, setRecordValue] = useState("");
  const [recordName, setRecordName] = useState("_master-store-builder");

  const cleanDomain = domain?.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/^www\./, "").replace(/\/.*$/, "");

  async function loadVerificationConfig() {
    try {
      const response = await fetch("/api/domains/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ storeId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Could not load verification configuration.");
      setRecordName(data.record.host || "_master-store-builder");
      setRecordValue(data.record.value);
    } catch (error) {
      setMessage(error instanceof Error? error.message : "Could not load DNS configuration.");
    }
  }

  useEffect(() => {
    if (cleanDomain && status!== "verified") {
      loadVerificationConfig();
    }
  }, [cleanDomain, status]);

  async function handleVerify() {
    setMessage("");
    if (!cleanDomain) { setMessage("Please save a custom domain first."); return; }
    setChecking(true);
    try {
      const response = await fetch("/api/domains/verify", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ storeId }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Domain verification failed.");
      if (data.verified) {
        setMessage("✓ Domain verified successfully. Refreshing...");
        setTimeout(() => window.location.reload(), 800);
        return;
      }
      setMessage(data?.error || "Domain is not verified yet.");
    } catch (error) {
      setMessage(error instanceof Error? error.message : "Domain verification failed.");
    } finally {
      setChecking(false);
    }
  }

  if (!cleanDomain) {
    return (
      <div style={{ marginTop: 14, padding: 14, borderRadius: 12, background: "#f3f4f6", color: "#374151", fontSize: 13, lineHeight: 1.6 }}>
        Save a custom domain first to start domain verification.
      </div>
    );
  }

  return (
    <div style={{ marginTop: 16, padding: 18, borderRadius: 14, border: "1px solid #e5e7eb", background: "#f9fafb" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap", marginBottom: 14 }}>
        <div>
          <h3 style={{ margin: 0, fontSize: 16, color: "#111827" }}>Domain Verification</h3>
          <p style={{ margin: "5px 0 0", color: "#6b7280", fontSize: 12 }}>Verify ownership of {cleanDomain}</p>
        </div>
        <StatusBadge status={status} />
      </div>

      {status!== "verified" && (
        <>
          <div style={{ marginBottom: 12, padding: 13, borderRadius: 10, background: "#ffffff", border: "1px solid #e5e7eb" }}>
            <strong style={{ display: "block", marginBottom: 5, fontSize: 13 }}>Add this DNS TXT record</strong>
            <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>Record Type</div>
            <code style={{ display: "block", marginTop: 4, padding: 9, borderRadius: 8, background: "#111827", color: "#ffffff", overflowX: "auto" }}>TXT</code>
            <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>Name / Host</div>
            <code style={{ display: "block", marginTop: 4, padding: 9, borderRadius: 8, background: "#111827", color: "#ffffff", overflowX: "auto" }}>{recordName}</code>
            <div style={{ marginTop: 10, fontSize: 12, color: "#6b7280" }}>Value</div>
            <code style={{ display: "block", marginTop: 4, padding: 9, borderRadius: 8, background: "#111827", color: "#ffffff", overflowX: "auto" }}>{recordValue || "Loading verification value..."}</code>
            <p style={{ margin: "10px 0 0", fontSize: 12, color: "#6b7280", lineHeight: 1.5 }}>The exact verification value is generated securely by the server for this store.</p>
          </div>
          <button type="button" onClick={handleVerify} disabled={checking} style={{ border: "none", borderRadius: 10, padding: "11px 16px", background: checking? "#9ca3af" : "#16a34a", color: "#ffffff", fontWeight: 800, cursor: checking? "not-allowed" : "pointer" }}>
            {checking? "Checking DNS..." : "Verify Domain"}
          </button>
        </>
      )}

      {status === "verified" && (
        <div style={{ padding: 12, borderRadius: 10, background: "#dcfce7", color: "#166534", fontSize: 13, fontWeight: 700 }}>✓ Domain ownership has been verified.</div>
      )}

      {message && (
        <div style={{ marginTop: 12, padding: 11, borderRadius: 10, background: message.startsWith("✓")? "#dcfce7" : "#fef2f2", color: message.startsWith("✓")? "#166534" : "#991b1b", fontSize: 13, fontWeight: 700, lineHeight: 1.5 }}>{message}</div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: "none" | "pending" | "verified" | "failed" }) {
  const config = {
    none: { label: "Not Configured", background: "#f3f4f6", color: "#374151" },
    pending: { label: "Pending", background: "#fef3c7", color: "#92400e" },
    verified: { label: "Verified", background: "#dcfce7", color: "#166534" },
    failed: { label: "Verification Failed", background: "#fee2e2", color: "#991b1b" }
  }[status];
  return <span style={{ display: "inline-flex", padding: "6px 10px", borderRadius: 999, background: config.background, color: config.color, fontSize: 12, fontWeight: 800 }}>{config.label}</span>;
}
