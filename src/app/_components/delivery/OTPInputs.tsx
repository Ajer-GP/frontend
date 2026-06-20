"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";

type OtpState = "idle" | "loading" | "success" | "failed";

export default function OTPInputs({ taskId }: { taskId: string }) {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [otpState, setOtpState] = useState<OtpState>("idle");
  const isComplete = otp.every((digit) => digit !== "");
  const router = useRouter();

  // ─── Handlers ───────────────────────────────────────────────
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleChange = (index: number, value: string) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setServerError(null);
    if (otpState === "failed") setOtpState("idle");
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
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

  const handleSubmit = async () => {
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      setServerError("من فضلك أدخل الرمز كاملاً");
      return;
    }

    setOtpState("loading");
    setServerError(null);

    //api
    setOtpState("success");

    // redirect
    router.push("YOUR_REDIRECT_PATH_HERE");
  };

  const handleReset = () => {
    setOtp(Array(6).fill(""));
    setOtpState("idle");
    setServerError(null);
    inputRefs.current[0]?.focus();
  };

  const getInputClass = (digit: string) => {
    const base =
      "w-10 h-11 sm:w-11 sm:h-12 text-center text-lg font-bold rounded-xl border-2 outline-none transition-all";

    if (otpState === "failed")
      return `${base} border-red-300 bg-red-50 text-red-500 focus:border-red-400`;
    if (otpState === "success")
      return `${base} border-green-400 bg-green-50 text-green-600`;
    if (digit) return `${base} border-[#1A6B4A] bg-[#E8F0ED] text-[#1A6B4A]`;
    return `${base} border-gray-200 bg-white text-gray-800 focus:border-[#1A6B4A]`;
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      {/* OTP inputs */}
      <div className="flex justify-center gap-2 sm:gap-3" dir="ltr">
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
            disabled={otpState === "loading" || otpState === "success"}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            className={getInputClass(digit)}
          />
        ))}
      </div>

      {/* Error message */}
      {serverError && (
        <p className="text-red-500 text-sm text-center">{serverError}</p>
      )}

      {/* Success message */}
      {otpState === "success" && (
        <p className="text-green-600 text-sm text-center font-semibold">
          ✓ تم التحقق بنجاح، جارٍ التحويل...
        </p>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={
          !isComplete || otpState === "loading" || otpState === "success"
        }
        className="w-full btn bg-[#1A6B4A] text-white rounded-xl hover:bg-[#155a3c] disabled:opacity-40 disabled:cursor-not-allowed transition-all">
        {otpState === "loading" ? (
          <span className="loading loading-spinner loading-sm" />
        ) : (
          "تحقق من الرمز"
        )}
      </button>

      {/* Retry button — only shown on failure */}
      {otpState === "failed" && (
        <button
          onClick={handleReset}
          className="text-sm text-gray-500 underline hover:text-gray-700">
          إعادة المحاولة
        </button>
      )}
    </div>
  );
}
