import { NextResponse } from "next/server";

export async function POST(request: NextResponse) {
  const { access_token } = await request.json();

  if (!access_token) {
    return new NextResponse("Missing access token", { status: 400 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });

  return response;
}
