import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const response = NextResponse.json({ message: "Logged out" });


  response.cookies.set('access_token_level_up', '', {
    path: '/',
    expires: new Date(0), // Set expiration to past
    httpOnly: false, // Ensure client-side access
    secure: false, // For non-HTTPS
    sameSite: 'lax'
  });

  response.cookies.set('refresh_token_level_up', '', {
    path: '/',
    expires: new Date(0), // Set expiration to past
    httpOnly: false, // Ensure client-side access
    secure: false, // For non-HTTPS
    sameSite: 'lax'
  });

  // Additional fallback method
  response.headers.append(
    'Set-Cookie',
    'access_token_level_up=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly=false; SameSite=Lax'
  );

  response.headers.append(
    'Set-Cookie',
    'refresh_token_level_up=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly=false; SameSite=Lax'
  );

  return response;
}