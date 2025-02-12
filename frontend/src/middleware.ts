import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  const publicPaths = [
    "/src/app/Styles/",
    "/src/app/globals.css",
    "/_next",
    "/favicon.ico",
    "/api/auth",
    "/header/hLogo.svg",
    "/auth",
  ];

  const protectedRoutes = [
    '/dashboard',
    '/onboarding',
    '/profile',
    '/administrator',
    '/partner',
    '/students',
    // Add other routes that require authentication
  ]


  const authRoutes = ['/login']

  const isPublicPath = publicPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  if (isPublicPath) {
    return NextResponse.next();
  }

  const path = request.nextUrl.pathname

  // const accessToken = request.cookies.get('access_token_level_up')?.value
  const refreshToken = request.cookies.get('refresh_token_level_up')?.value


  const isProtectedRoute = protectedRoutes.some(route =>
    path.startsWith(route)
  )

  if (pathname === '/') {
    return refreshToken
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.redirect(new URL('/login', request.url));
  }


  const isAuthRoute = authRoutes.includes(path)


  if (isProtectedRoute && !refreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  }


  if (isAuthRoute && refreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }



  // const studentIdMatch = pathname.match(/^\/students\/([^\/]+)$/);
  // if (studentIdMatch) {
  //   const studentId = studentIdMatch[1];
  //   url.pathname = `/students/${studentId}/submission`;
  //   return NextResponse.redirect(url);
  // }

  return NextResponse.next();
}

export const config = {
  matcher: ["/:path*", "/dashboard/:path*", "/about/:path*", "/", "/students/:path*"],
};
