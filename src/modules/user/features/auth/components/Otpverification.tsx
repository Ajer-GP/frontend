"use client";

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { resendOtpAction, verifyOtpAction } from "../services/actions";

type OtpState = "idle" | "failed" | "success";
type Props = {
  email: string;
  type?: string;
};
export default function OtpVerification({ email, type }: Props) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [otpState, setOtpState] = useState<OtpState>("idle");
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300); // 5:00
  const [attempts, setAttempts] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  function startTimer() {
    setTimeLeft(300);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
  }

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setServerError(null);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = Array(6).fill("");
    pasted.split("").forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(pasted.length, 5)]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length < 6) return;

    setIsSubmitting(true);
    setServerError(null);

    const result = await verifyOtpAction(code);

    if (result?.success === false) {
      setAttempts((a) => a + 1);
      setOtpState("failed");
      setServerError(result.error);
      setIsSubmitting(false);
    }
    // On success → server redirects automatically, no need to handle here
  };

  const handleRetry = () => {
    setOtp(Array(6).fill(""));
    setOtpState("idle");
    setServerError(null);
    inputRefs.current[0]?.focus();
  };

  const handleResend = async () => {
    setResendLoading(true);
    setServerError(null);

    const result = await resendOtpAction();

    if (result?.success === false) {
      setServerError(result.error);
    } else {
      setOtp(Array(6).fill(""));
      setOtpState("idle");
      startTimer();
      inputRefs.current[0]?.focus();
    }
    setResendLoading(false);
  };

  const isFilled = otp.every((d) => d !== "");

  // ─── Success Screen ───────────────────────────────────────────────
  if (otpState === "success") {
    return (
      <div className="flex-1 flex flex-col justify-center px-8 py-10 gap-5">
        <div className="flex justify-center">
          <div className="w-32 h-32 rounded-full bg-[#E8F0ED] flex items-center justify-center">
            <Image
              src="/icons/message.svg"
              alt="Success"
              width={80}
              height={80}
              className="mt-0.5 shrink-0"
            />
          </div>
        </div>
        <div className="text-center">
          <h1 className="text-5xl font-medium text-[#1C1C1A] mb-4">
            أهلا بك في <span className="text-brand-primary">أجر</span>!
          </h1>
          <p className="text-[20px] text-[#515151]">
            تم إنشاء حسابك بنجاح والتحقق من بريدك الإلكتروني. أنت الآن جزء من
            مجتمع الإيجار الأذكى في مصر.
          </p>
        </div>
        <button className="w-full py-3 rounded-xl font-semibold text-[24px] bg-brand-primary hover:bg-brand-dark text-white shadow-md shadow-green-100 transition-all">
          ابدأ رحلتك الآن
        </button>
      </div>
    );
  }

  // ─── Main OTP Screen ──────────────────────────────────────────────
  return (
    <div className="flex-1 flex flex-col justify-center px-8 py-10 gap-5">
      {/* Icon */}
      <div className="flex justify-center">
        <div
          className={`w-32 h-32 rounded-full flex items-center justify-center ${otpState === "failed" ? "bg-[#FCEDED]" : "bg-[#E8F0ED]"}`}
        >
          <Image
            src={
              otpState === "failed"
                ? "/icons/info-circle.svg"
                : "/icons/message.svg"
            }
            alt="icon"
            width={80}
            height={80}
            className="mt-0.5 shrink-0"
          />
        </div>
      </div>

      {/* Title */}
      <div className="text-center">
        <h1 className="text-5xl font-medium text-[#1C1C1A] mb-4">
          {otpState === "failed" ? "رمز تحقق خاطئ" : "تحقق من بريدك الإلكتروني"}
        </h1>
        <p className="text-xl text-[#515151]">
          أدخل الرمز المكون من 6 أرقام الذي أرسلناه إلى
          <span className="text-xl px-1 text-black" dir="ltr">
            {email}
          </span>
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-2" dir="ltr">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className={`w-11 h-12 text-center text-lg font-bold rounded-xl border-2 outline-none transition-all
              ${
                otpState === "failed"
                  ? "border-red-300 bg-red-50 text-red-500 focus:border-red-400"
                  : digit
                    ? "border-[#1A6B4A] bg-[#E8F0ED] text-[#1A6B4A]"
                    : "border-gray-200 bg-white text-gray-800 focus:border-[#1A6B4A]"
              }`}
          />
        ))}
      </div>

      {/* Server error */}
      {serverError && (
        <div
          role="alert"
          className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M12 3a9 9 0 100 18A9 9 0 0012 3z"
            />
          </svg>
          <span>{serverError}</span>
        </div>
      )}

      {/* Timer & Resend */}
      {otpState !== "failed" && (
        <div className="text-center text-sm text-gray-500 space-y-1">
          {timeLeft > 0 ? (
            <p>
              ينتهي صلاحية الرمز خلال{" "}
              <span className="font-semibold text-gray-700">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <p className="text-red-500">انتهت صلاحية الرمز</p>
          )}
          <p>
            لم يصلك رمز التحقق؟{" "}
            <button
              onClick={handleResend}
              disabled={resendLoading || timeLeft > 0}
              className="text-brand-primary font-medium underline disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {resendLoading ? (
                <span className="loading loading-spinner loading-xs" />
              ) : (
                "أعد إرسال الرمز"
              )}
            </button>
          </p>
        </div>
      )}

      {/* Attempts warning */}
      {attempts > 0 && otpState !== "failed" && (
        <div className="flex items-start gap-2 bg-[#FDF6E9] border border-[#AE7818] rounded-xl px-4 py-3 text-[16px] text-black">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 shrink-0 text-[#AE7818]"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
            />
          </svg>
          <span>
            تملك 5 محاولات كحد أقصى. إذا حدث 5 محاولات فاشلة قد يؤدي ذلك إلى
            إغلاق الحساب مؤقتاً
          </span>
        </div>
      )}

      {/* CTA */}
      {otpState === "failed" ? (
        <button
          onClick={handleRetry}
          className="w-full border border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-xl transition-all text-sm"
        >
          أعد المحاولة
        </button>
      ) : (
        <button
          onClick={handleVerify}
          disabled={!isFilled || isSubmitting}
          className={`w-full py-3 rounded-xl font-semibold text-sm transition-all
            ${
              isFilled && !isSubmitting
                ? "bg-brand-primary hover:bg-brand-dark text-white shadow-md shadow-green-100"
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "تأكيد الرمز"
          )}
        </button>
      )}
    </div>
  );
}
