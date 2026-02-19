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
  domain: process.env.NEXT_PUBLIC_APP_DOMAIN || 'lyceumx.vercel.app',
  isSatellite: true,
  signInUrl: '/sign-in',
  signUpUrl: '/sign-up',
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
