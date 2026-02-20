import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { type NextFetchEvent, type NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/clerk(.*)",
]);

const resolvedPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_TEST ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_LIVE ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

// Build the Clerk middleware separately so we can gate it below.
const _clerkMiddleware = clerkMiddleware(async (auth, request) => {
  // Fail open if Clerk keys are missing (prevents full 404 on misconfigured deployments)
  if (!resolvedPublishableKey) {
    return NextResponse.next();
  }
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
}, {
  secretKey: process.env.CLERK_SECRET_KEY_TEST || process.env.CLERK_SECRET_KEY_LIVE || process.env.CLERK_SECRET_KEY,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
});

// Wrap in a plain middleware so we can bypass Clerk entirely for the proxy
// route BEFORE Clerk's own processing runs (Clerk triggers a dev-browser
// handshake before calling our handler, so checking inside the handler is
// too late and causes an infinite redirect loop).
export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (req.nextUrl.pathname.startsWith("/api/clerk")) {
    return NextResponse.next();
  }
  return _clerkMiddleware(req, event);
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
