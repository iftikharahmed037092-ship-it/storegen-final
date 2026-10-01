import { NextResponse } from "next/server";
import { promises as dns } from "dns";
import { supabase } from "@/lib/supabase";
import {
  getDomainVerificationRecordName,
  getDomainVerificationRecordValue,
  normalizeDomain,
  isValidDomain
} from "@/lib/domains";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const storeId = typeof body.storeId === "string"? body.storeId.trim() : "";
    if (!storeId) return NextResponse.json({ error: "Store ID is required." }, { status: 400 });

    const { data: store, error: storeError } = await supabase.from("stores").select("id, slug, custom_domain, domain_status, domain_verified").eq("id", storeId).single();
    if (storeError ||!store) return NextResponse.json({ error: "Store not found." }, { status: 404 });

    const domain = normalizeDomain(store.custom_domain);
    if (!domain ||!isValidDomain(domain)) return NextResponse.json({ error: "A valid custom domain must be configured first." }, { status: 400 });

    const recordName = getDomainVerificationRecordName(domain);
    const expectedValue = getDomainVerificationRecordValue(store.id);

    let txtRecords: string[][] = [];
    try {
      txtRecords = await dns.resolveTxt(recordName);
    } catch {
      await supabase.from("stores").update({ domain_status: "failed", domain_verified: false, domain_last_checked_at: new Date().toISOString() }).eq("id", store.id);
      return NextResponse.json({ success: false, verified: false, status: "failed", error: "Verification TXT record was not found. Please add the DNS TXT record and try again." }, { status: 200 });
    }

    const flattenedRecords = txtRecords.map((record) => record.join(""));
    const verified = flattenedRecords.includes(expectedValue);

    if (!verified) {
      await supabase.from("stores").update({ domain_status: "failed", domain_verified: false, domain_last_checked_at: new Date().toISOString() }).eq("id", store.id);
      return NextResponse.json({ success: false, verified: false, status: "failed", error: "The TXT record was found, but the verification value does not match." }, { status: 200 });
    }

    const now = new Date().toISOString();
    const { error: updateError } = await supabase.from("stores").update({ domain_status: "verified", domain_verified: true, domain_verified_at: now, domain_last_checked_at: now }).eq("id", store.id);
    if (updateError) throw new Error(updateError.message);

    return NextResponse.json({ success: true, verified: true, status: "verified", domain, message: "Custom domain has been verified successfully." });
  } catch (error) {
    console.error("Domain verification error:", error);
    return NextResponse.json({ success: false, verified: false, error: "Domain verification could not be completed." }, { status: 500 });
  }
}
