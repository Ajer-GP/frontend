import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("user");
  return response;
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;
    const userRaw = cookieStore.get("user")?.value;

    // No user cookie at all — definitely not signed in
    if (!userRaw) {
      return NextResponse.json({ user: null });
    }

    let user = null;
    try {
      user = JSON.parse(userRaw);
    } catch {
      return clearAuthCookies(NextResponse.json({ user: null }));
    }

    // access_token still valid — user is signed in
    if (accessToken) {
      return NextResponse.json({ user });
    }

    // access_token expired — try to silently refresh with refresh_token
    if (refreshToken) {
      const refreshRes = await fetch(
        `${process.env.API_BASE_URL}/auth/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
          body: JSON.stringify({ refreshToken }),
        },
      );

      if (!refreshRes.ok) {
        return clearAuthCookies(NextResponse.json({ user: null }));
      }

      const data = await refreshRes.json();
      if (!data?.accessToken) {
        return clearAuthCookies(NextResponse.json({ user: null }));
      }

      // Issue a fresh access_token cookie and return the user
      const response = NextResponse.json({ user });
      response.cookies.set("access_token", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15, // 15 minutes
        path: "/",
      });
      return response;
    }

    // No tokens at all — clear stale user cookie
    return clearAuthCookies(NextResponse.json({ user: null }));
  } catch {
    return NextResponse.json({ user: null });
  }
}
