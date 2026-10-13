import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "admin_session";

export async function GET(_request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET;

  if (!secret) {
    return NextResponse.json({ authed: false }, { status: 200 });
  }

  const token = _request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.json({ authed: false }, { status: 200 });
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    if (payload.role === "admin") {
      return NextResponse.json({ authed: true, username: payload.username }, { status: 200 });
    }
    return NextResponse.json({ authed: false }, { status: 200 });
  } catch {
    return NextResponse.json({ authed: false }, { status: 200 });
  }
}
