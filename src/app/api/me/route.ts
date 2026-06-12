import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function clearAuthCookies(response: NextResponse) {
  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");
  response.cookies.delete("user");
  return response;
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;
    const refreshToken = cookieStore.get("refresh_token")?.value;
    const userRaw = cookieStore.get("user")?.value;

    if (!userRaw) {
      return NextResponse.json({ user: null });
    }

    let user = null;
    try {
      user = JSON.parse(userRaw);
    } catch {
      return clearAuthCookies(NextResponse.json({ user: null }));
    }

    if (accessToken) {
      return NextResponse.json({ user });
    }

    // access_token expired — delegate to the dedicated refresh route
    if (refreshToken) {
      const origin = new URL(request.url).origin;
      const refreshRes = await fetch(`${origin}/api/auth/refresh`, {
        method: "POST",
        headers: {
          // Forward the cookies so the refresh route can read refresh_token
          Cookie: request.headers.get("cookie") ?? "",
        },
      });

      if (!refreshRes.ok) {
        return clearAuthCookies(NextResponse.json({ user: null }));
      }

      // Proxy the Set-Cookie headers from the refresh route (new access_token, rotated refresh_token)
      const response = NextResponse.json({ user });
      refreshRes.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") {
          response.headers.append("set-cookie", value);
        }
      });
      return response;
    }

    return clearAuthCookies(NextResponse.json({ user: null }));
  } catch {
    return NextResponse.json({ user: null });
  }
}
