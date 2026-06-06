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

    if (!userCookie) {
      return NextResponse.json({ user: null });
    }

    let user = null;
    try {
      user = JSON.parse(userCookie);
    } catch {
      user = null;
    }

    if (!accessToken) {
      if (!refreshToken) {
        return NextResponse.json({ user: null });
      }

      const refreshRes = await fetch(
        `${process.env.API_BASE_URL}/refresh-token`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
        },
      );

      if (!refreshRes.ok) {
        const response = NextResponse.json({ user: null });
        response.cookies.delete("access_token");
        response.cookies.delete("refresh_token");
        response.cookies.delete("user");
        return response;
      }

      const data = await refreshRes.json();
      const response = NextResponse.json({ user });
      response.cookies.set("access_token", data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 15,
        path: "/",
      });
      return response;
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ user: null });
  }
}
