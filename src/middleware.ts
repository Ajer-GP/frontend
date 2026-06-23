import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/products/add", "/products/orders"];
const authRoutes = ["/auth/login", "/auth/register"];

// Delivery routes
const deliveryProtectedRoutes = ["/dashboard"];
const deliveryAuthRoutes = ["/auth/DeliveryLogin"];

async function refreshAccessToken(
  refreshToken: string,
): Promise<{ token: string; newRefreshToken: string } | null> {
  try {
    const apiUrl =
      process.env.API_BASE_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!apiUrl) {
      console.error("[middleware] API_BASE_URL is not defined");
      return null;
    }

    const res = await fetch(`${apiUrl}/auth/refresh-token`, {
      method: "POST",
      headers: {
        Cookie: `refresh_token=${refreshToken}`,
      },
    });

    if (!res.ok) {
      console.error("[middleware] refresh failed:", res.status);
      return null;
    }

    const data = await res.json();
    if (!data.accessToken) return null;

    const setCookie = res.headers.get("set-cookie");
    const newRefreshToken =
      setCookie?.match(/refresh_token=([^;]+)/)?.[1] ?? refreshToken;

    return { token: data.accessToken, newRefreshToken };
  } catch (e) {
    console.error("[middleware] refresh error:", e);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";

  // ─── Delivery Auth ───────────────────────────────────────────
  const isDeliveryProtected = deliveryProtectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isDeliveryAuthRoute = deliveryAuthRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (isDeliveryProtected || isDeliveryAuthRoute) {
    const deliveryToken = request.cookies.get("delivery_token")?.value;
    const isDeliveryAuthenticated = !!deliveryToken;

    if (isDeliveryProtected && !isDeliveryAuthenticated) {
      const loginUrl = new URL("/auth/DeliveryLogin", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isDeliveryAuthRoute && isDeliveryAuthenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  // ─── Main App Auth ────────────────────────────────────────────
  let accessToken = request.cookies.get("access_token")?.value;
  const refreshToken = request.cookies.get("refresh_token")?.value;
  const user = request.cookies.get("user")?.value;

  let refreshedTokens: { token: string; newRefreshToken: string } | null = null;

  if (!accessToken && refreshToken && user) {
    refreshedTokens = await refreshAccessToken(refreshToken);
    if (refreshedTokens) {
      accessToken = refreshedTokens.token;
    }
  }

  const isAuthenticated = !!(accessToken || (refreshToken && user));
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  let response: NextResponse;

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    response = NextResponse.redirect(loginUrl);
  } else if (isAuthRoute && isAuthenticated) {
    response = NextResponse.redirect(new URL("/", request.url));
  } else {
    response = NextResponse.next();
  }

  if (refreshedTokens) {
    response.cookies.set("access_token", refreshedTokens.token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    response.cookies.set("refresh_token", refreshedTokens.newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 15,
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|api/).*)"],
};
