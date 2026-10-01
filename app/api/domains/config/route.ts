import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import {
  getDomainVerificationRecordName,
  getDomainVerificationRecordValue,
  normalizeDomain
} from "@/lib/domains";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const storeId = typeof body.storeId === "string"? body.storeId.trim() : "";
    if (!storeId) return NextResponse.json({ error: "Store ID is required." }, { status: 400 });

    const { data: store, error } = await supabase.from("stores").select("id, custom_domain").eq("id", storeId).single();
    if (error ||!store) return NextResponse.json({ error: "Store not found." }, { status: 404 });

    const domain = normalizeDomain(store.custom_domain);
    if (!domain) return NextResponse.json({ error: "Please configure a custom domain first." }, { status: 400 });

    return NextResponse.json({
      success: true,
      domain,
      record: {
        type: "TXT",
        name: getDomainVerificationRecordName(domain),
        host: "_master-store-builder",
        value: getDomainVerificationRecordValue(store.id)
      }
    });
  } catch (error) {
    console.error("Domain config error:", error);
    return NextResponse.json({ error: "Could not generate domain verification configuration." }, { status: 500 });
  }
}
