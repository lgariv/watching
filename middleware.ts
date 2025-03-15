import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/swipe", "/search", "/api(.*)"]);

export default clerkMiddleware(async (auth, req) => {
	if (isProtectedRoute(req) && !req.nextUrl.pathname.startsWith("/api/recommendation")) await auth.protect();
});

export const config = {
	matcher: [
		// Skip Next.js internals and all static files, unless found in search params
		"/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // run for all the api routes except /api/recommendation
    "/api/((?!recommendation))",
    // run for /results but not for /results/* subroutes
    "/results",
    // run for search and swipe routes
    "/search",
    "/swipe",
	],
};
