import { NextResponse } from "next/server";

function parseCookies(cookieHeader: string | null) {
  if (!cookieHeader) return {};
  return cookieHeader
    .split(";")
    .reduce<Record<string, string>>((acc, cookie) => {
      const [name, ...rest] = cookie.split("=");
      if (!name) return acc;
      acc[name.trim()] = decodeURIComponent(rest.join("=").trim());
      return acc;
    }, {});
}

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie");
    const cookies = parseCookies(cookieHeader);
    const accessToken = cookies["access_token"];
    const refreshToken = cookies["refresh_token"];
    const userCookie = cookies["user"];

    if (!accessToken && !refreshToken) return NextResponse.json({ user: null });

    // Access token still valid → return user directly
    if (accessToken)
      return NextResponse.json({ user: user ? JSON.parse(user) : null });

    // Access token expired → use refresh token
    const refreshRes = await fetch(
      `${process.env.API_BASE_URL}/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      },
    );
    console.log(refreshRes);
    if (!refreshRes.ok) {
      // Refresh token expired → clear cookies → force re-login
      cookieStore.delete("access_token");
      cookieStore.delete("refresh_token");
      cookieStore.delete("user");
      return NextResponse.json({ user: null });
    }

    const data = await refreshRes.json();

    // Save new access token
    cookieStore.set("access_token", data.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 15,
      path: "/",
    });

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
