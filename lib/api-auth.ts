import {
  NextResponse
} from "next/server";

import {
  getAuthenticatedAdmin
} from "@/lib/server-admin-auth";

export async function requireAdmin() {
  const admin =
    await getAuthenticatedAdmin();

  if (!admin) {
    return {
      admin: null,
      response:
        NextResponse.json(
          {
            error:
              "Unauthorized. Admin access required."
          },
          {
            status: 401
          }
        )
    };
  }

  return {
    admin,
    response: null
  };
}
