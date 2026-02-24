import { clerkMiddleware } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { GEO_COOKIE_NAME, GEO_COOKIE_MAX_AGE } from "@/lib/geo-savings";

function setGeoCookie(request: NextRequest, response: NextResponse) {
  const existing = request.cookies.get(GEO_COOKIE_NAME);
  if (!existing) {
    const country = request.headers.get("x-country") ?? "";
    const region = country === "IN" ? "IN" : "INTL";
    response.cookies.set(GEO_COOKIE_NAME, region, {
      httpOnly: false, // client needs to read it
      sameSite: "lax",
      maxAge: GEO_COOKIE_MAX_AGE,
      path: "/",
    });
  }
  return response;
}

// Use Clerk middleware when secret key is available, otherwise plain middleware.
// Clerk auth still works client-side via ClerkProvider regardless.
const hasClerkKey = !!process.env.CLERK_SECRET_KEY;

const handler = hasClerkKey
  ? clerkMiddleware((_auth, request) => {
      return setGeoCookie(request, NextResponse.next());
    })
  : (request: NextRequest) => {
      return setGeoCookie(request, NextResponse.next());
    };

export default handler;

export const config = {
  matcher: [
    // Skip Next.js internals and static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
