import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import OtpVerification from "@/Modules/User/Features/Auth/components/Otpverification";

export const metadata: Metadata = {
  title: "التحقق من البريد الإلكتروني | أجر",
  description: "أدخل رمز التحقق المرسل إلى بريدك الإلكتروني",
};

export default async function ForgotPasswordVerifyPage() {
  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;
  const otpType = cookieStore.get("otp_type")?.value;

  if (!email) {
    // Send back to the correct starting point based on what flow was intended
    redirect(
      otpType === "reset-password" ? "/auth/forgot-password" : "/auth/register",
    );
  }

  return (
    <div dir="rtl" className="pb-13">
      <OtpVerification email={email} otpType={otpType} />
    </div>
  );
}
