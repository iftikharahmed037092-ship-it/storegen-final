import { createHash } from "crypto";

export type DomainStatus =
  | "none"
  | "pending"
  | "verified"
  | "failed";

const DOMAIN_REGEX =
  /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

export function normalizeDomain(
  value: string | null | undefined
) {
  if (!value) return null;
  let domain = value.trim().toLowerCase();
  domain = domain
   .replace(/^https?:\/\//, "")
   .replace(/^www\./, "")
   .replace(/\/.*$/, "")
   .replace(/\s+/g, "");
  return domain || null;
}

export function isValidDomain(
  value: string | null | undefined
) {
  const domain = normalizeDomain(value);
  if (!domain) return false;
  return DOMAIN_REGEX.test(domain);
}

export function getDomainStatusLabel(
  status: DomainStatus
) {
  switch (status) {
    case "pending": return "Pending Verification";
    case "verified": return "Verified";
    case "failed": return "Verification Failed";
    default: return "No Custom Domain";
  }
}

export function createDomainVerificationToken(
  storeId: string
) {
  return createHash("sha256")
   .update(`master-store-builder:${storeId}`)
   .digest("hex")
   .slice(0, 32);
}

export function getDomainVerificationRecordName(
  domain: string
) {
  return `_master-store-builder.${domain}`;
}

export function getDomainVerificationRecordValue(
  storeId: string
) {
  return `msb-verification=${createDomainVerificationToken(
    storeId
  )}`;
}
