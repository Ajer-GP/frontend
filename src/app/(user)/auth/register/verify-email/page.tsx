import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import OtpVerification from "@/Modules/User/Features/Auth/components/Otpverification";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "إنشاء حساب جديد | أجر",
  description: "أنشئ حسابك على منصة أجر وابدأ في إدارة أعمالك بكفاءة",
};

export default async function VerifyEmailPage() {
  const cookieStore = await cookies();
  const email = cookieStore.get("pending_email")?.value;
  const otpType = cookieStore.get("otp_type")?.value;

  if (!email) redirect("/auth/register"); // no cookie = kick back

  return (
    <div dir="rtl" className="pb-13">
      <OtpVerification email={email} otpType={otpType} />
    </div>
  );
}
