import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!refreshToken) {
    return NextResponse.json({ message: "No refresh token" }, { status: 401 });
  }

  const res = await fetch(`${process.env.API_BASE_URL}/auth/refresh-token`, {
    method: "POST",
    headers: {
      Cookie: `refresh_token=${refreshToken}`,
    },
  });

  const data = await res.json();
  if (!res.ok) return NextResponse.json(data, { status: res.status });

  const isProduction = process.env.NODE_ENV === "production";
  const response = NextResponse.json(data);

  // Renew access token
  response.cookies.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 15,
  });

  // Rotate refresh token if backend sends a new one
  const setCookie = res.headers.get("set-cookie");
  const newRefreshToken =
    setCookie?.match(/refresh_token=([^;]+)/)?.[1] ?? data.refreshToken;

  if (newRefreshToken) {
    response.cookies.set("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 15,
    });
  }

  return response;
}
