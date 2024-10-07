import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const publicRoutes = ['/','/api/webhook'];

// Function to check if a route is protected
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/forum(.*)',
]);

export default clerkMiddleware((auth, req) => {
  // Check if the route is public
  if (publicRoutes.includes(req.nextUrl.pathname)) {
    return; // No need to protect, it's a public route
  }

  // If it's a protected route, apply the auth protection
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)'],
};
