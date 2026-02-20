import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/clerk(.*)",
]);

const resolvedPublishableKey =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_TEST ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY_LIVE ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default clerkMiddleware(async (auth, request) => {
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

export const config = {
  matcher: [
    // Exclude _next, static files, AND the Clerk proxy route (/api/clerk/…)
    // Clerk middleware must NOT run on the proxy route — otherwise it initiates
    // a dev-browser handshake whose redirect_url is the proxy endpoint itself,
    // producing the recursive "redirect_url is invalid" Clerk error.
    "/((?!_next|api/clerk|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/api/(?!clerk)(.*)",
    "/trpc/(.*)",
  ],
};
