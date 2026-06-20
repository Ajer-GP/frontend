import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function clearAdminCookies(response: NextResponse) {
  response.cookies.delete("admin_access_token");
  response.cookies.delete("admin_refresh_token");
  response.cookies.delete("admin");
  return response;
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("admin_access_token")?.value;
    const refreshToken = cookieStore.get("admin_refresh_token")?.value;
    const adminRaw = cookieStore.get("admin")?.value;

    if (!adminRaw) {
      return NextResponse.json({ admin: null });
    }

    let admin = null;
    try {
      admin = JSON.parse(adminRaw);
    } catch {
      return clearAdminCookies(NextResponse.json({ admin: null }));
    }

    // Access token still valid — return immediately
    if (accessToken) {
      return NextResponse.json({ admin });
    }

    // Access token expired — delegate to the admin refresh route
    if (refreshToken) {
      const refreshRes = await fetch(
        `${process.env.API_BASE_URL}/admin/refresh-token`,
        {
          method: "POST",
          headers: {
            Cookie: request.headers.get("cookie") ?? "",
          },
        },
      );

      if (!refreshRes.ok) {
        return clearAdminCookies(NextResponse.json({ admin: null }));
      }

      // Proxy Set-Cookie headers (new access_token + rotated refresh_token)
      const response = NextResponse.json({ admin });
      refreshRes.headers.forEach((value, key) => {
        if (key.toLowerCase() === "set-cookie") {
          response.headers.append("set-cookie", value);
        }
      });
      return response;
    }

    return clearAdminCookies(NextResponse.json({ admin: null }));
  } catch {
    return NextResponse.json({ admin: null });
  }
}
