"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordFormSchema,
  resetPasswordSchema,
  signupSchema,
} from "../schemas/auth.validation";

export async function loginService(prevState: any, formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ZodErrors: parsed.error.flatten().fieldErrors };
  }

  const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed.data),
  });

  const data = await res.json();
  console.log("Backend login response:", data);

  if (!res.ok) return { message: data.message || "فشل تسجيل الدخول" };

  const cookieStore = await cookies();

  cookieStore.set("access_token", data.accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 15,
    path: "/",
  });

  // Fetch refresh token from the refresh-token endpoint
  let refreshToken = null;
  try {
    const refreshRes = await fetch(
      `${process.env.API_BASE_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${data.accessToken}`,
        },
        body: JSON.stringify({ email: parsed.data.email }),
      },
    );

    if (refreshRes.ok) {
      const refreshData = await refreshRes.json();
      refreshToken = refreshData.refreshToken;
      console.log("Got refresh token from endpoint:", refreshToken);
    }
  } catch (error) {
    console.error("Failed to fetch refresh token:", error);
  }

  if (refreshToken) {
    cookieStore.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 15,
      path: "/",
    });
  }

  cookieStore.set("user", JSON.stringify(data.user), {
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });

  redirect("/");
}
export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  cookieStore.delete("user");
  redirect("/login");
}
export async function registerAction(data: z.infer<typeof signupSchema>) {
  const parsed = signupSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "بيانات غير صحيحة" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        password: parsed.data.password,
        phoneNumber: parsed.data.phoneNumber,
      }),
    });

    if (!res.ok) {
      const err = await res.json();

      return {
        success: false,
        error: err?.error?.message || "حدث خطأ أثناء إنشاء الحساب",
      };
    }

    // Store email in a cookie so verify-email page can use it
    const { cookies } = await import("next/headers");
    (await cookies()).set("pending_email", parsed.data.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });
    (await cookies()).set("otp_type", "register", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }

  redirect("/auth/register/verify-email");
}

export async function forgotPassword(
  data: z.infer<typeof forgotPasswordSchema>,
) {
  const parsed = forgotPasswordSchema.safeParse(data);

  if (!parsed.success) {
    return { success: false, error: "البريد الإلكتروني غير صحيح" };
  }

  try {
    const res = await fetch(
      `${process.env.API_BASE_URL}/auth/forget-password`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: parsed.data.email }),
      },
    );

    const result = await res.json();
    console.log(result);

    if (!res.ok) {
      return {
        success: false,
        error: result?.message || "حدث خطأ، تحقق من البريد الإلكتروني",
      };
    }

    const { cookies } = await import("next/headers");
    (await cookies()).set("pending_email", parsed.data.email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
    (await cookies()).set("otp_type", "reset-password", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 10,
      path: "/",
    });
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم" };
  }

  redirect("/auth/register/verify-email");
}

export async function resetPassword(
  data: z.infer<typeof resetPasswordFormSchema>,
) {
  const parsed = resetPasswordFormSchema.safeParse(data);
  if (!parsed.success) {
    return { success: false, error: "بيانات غير صحيحة" };
  }

  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;

  if (!email) {
    return { success: false, error: "انتهت الجلسة، أعد طلب رمز التحقق" };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email, // ← from cookie
        new_password: parsed.data.new_password, // ← from form
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      // 400 usually means the OTP/session expired → tell the client to restart
      if (res.status === 400) {
        return {
          success: false,
          expired: true,
          error: result?.message || "انتهت صلاحية الجلسة، أعد طلب رمز التحقق",
        };
      }
      return {
        success: false,
        error: result?.message || "فشل تغيير كلمة المرور",
      };
    }

    // clean up cookies
    cookieStore.delete("pending_email");
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم" };
  }

  return { success: true };
}

export async function resendOtpAction() {
  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;
  const otpType = cookieStore.get("otp_type")?.value;

  if (!email) {
    return { success: false, error: "انتهت الجلسة، يرجى التسجيل مجدداً" };
  }

  // reset-password flow resends via forget-password endpoint
  const endpoint =
    otpType === "reset-password"
      ? `${process.env.API_BASE_URL}/auth/forget-password`
      : `${process.env.API_BASE_URL}/auth/resend-otp`;

  try {
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!res.ok) {
      const err = await res.json();
      return {
        success: false,
        error: err?.message || "حدث خطأ أثناء إعادة الإرسال",
      };
    }

    return { success: true };
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }
}
// export async function verifyOtpAction(otp: string) {
//   const cookieStore = await cookies();
//   const email = cookieStore.get("pending_email")?.value;

//   if (!email) {
//     return { success: false, error: "انتهت الجلسة، يرجى التسجيل مجدداً" };
//   }

//   try {
//     const res = await fetch(`${process.env.API_BASE_URL}/auth/verify-otp`, {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ email, otp }),
//     });

//     if (!res.ok) {
//       const err = await res.json();
//       return {
//         success: false,
//         error: err?.message || "رمز التحقق غير صحيح أو منتهي الصلاحية",
//       };
//     }

//     // Clean up the cookie after successful verification
//     cookieStore.delete("pending_email");
//   } catch {
//     return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
//   }

//   redirect("/auth/login");
// }
export async function verifyOtpAction(otp: string) {
  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;
  const otpType = cookieStore.get("otp_type")?.value;

  if (!email) {
    return { success: false, error: "انتهت الجلسة، يرجى التسجيل مجدداً" };
  }

  // ── reset-password: verify OTP with the dedicated API endpoint
  if (otpType === "reset-password") {
    try {
      const res = await fetch(
        `${process.env.API_BASE_URL}/auth/verify-resetpassword-otp`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp_code: otp }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        return {
          success: false,
          error: err?.message || "رمز التحقق غير صحيح أو منتهي الصلاحية",
        };
      }
    } catch {
      return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
    }

    // OTP verified — keep pending_email for the reset-password step, drop otp_type
    cookieStore.delete("otp_type");
    return { success: true, otpType: "reset-password" }; // client → router.push("/auth/new-password")
  }

  // ── register: verify OTP with the API
  try {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/verify-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    if (!res.ok) {
      const err = await res.json();
      return {
        success: false,
        error: err?.message || "رمز التحقق غير صحيح أو منتهي الصلاحية",
      };
    }

    // Keep pending_email alive — deleting it here would cause the server component
    // to redirect to forgot-password while the success screen is still mounted.
    // The cookie expires naturally (maxAge 10 min) or is cleaned up on next login.
    cookieStore.delete("otp_type");
    return { success: true, otpType: "register" }; // client → setOtpState("success")
  } catch {
    return { success: false, error: "تعذر الاتصال بالخادم، حاول مجدداً" };
  }
}
