import { promises as dns } from "dns";

import {
  isValidDomain,
  normalizeDomain
} from "@/lib/domains";

export interface DomainHealthResult {
  domain: string;
  valid: boolean;
  dnsResolved: boolean;
  addresses: string[];
  message: string;
}

export async function checkDomainHealth(
  value: string
): Promise<DomainHealthResult> {
  const domain = normalizeDomain(value);

  if (!domain || !isValidDomain(domain)) {
    return {
      domain: domain || "",
      valid: false,
      dnsResolved: false,
      addresses: [],
      message:
        "The custom domain format is invalid."
    };
  }

  try {
    const addresses =
      await dns.resolve(domain);

    return {
      domain,
      valid: true,
      dnsResolved: true,
      addresses,
      message:
        "The domain currently resolves in DNS."
    };
  } catch {
    return {
      domain,
      valid: true,
      dnsResolved: false,
      addresses: [],
      message:
        "The domain is valid, but DNS resolution was not detected."
    };
  }
}
