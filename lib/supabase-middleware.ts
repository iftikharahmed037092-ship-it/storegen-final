import { createServerClient } from "@supabase/ssr";
import {
  NextRequest,
  NextResponse,
} from "next/server";

export async function updateSupabaseSession(
  request: NextRequest
) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          /*
           * Keep the request cookies updated so that
           * subsequent server-side auth checks can see
           * the refreshed session.
           */
          for (const {
            name,
            value,
          } of cookiesToSet) {
            request.cookies.set(
              name,
              value
            );
          }

          /*
           * Also copy refreshed cookies to the response.
           */
          for (const {
            name,
            value,
            options,
          } of cookiesToSet) {
            response.cookies.set(
              name,
              value,
              options
            );
          }
        },
      },
    }
  );

  /*
   * IMPORTANT:
   * Do not use getSession() for authorization.
   * getUser() validates the current authenticated user.
   */
  await supabase.auth.getUser();

  return response;
}
