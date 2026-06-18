"use client";

import React from "react";
import { useState, useRef, useEffect } from "react";
export default function OTPInputs() {
  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [serverError, setServerError] = useState<string | null>(null);
  const [otpState, setOtpState] = useState<OtpState>("idle");
  // FUNCTIONS
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
  return (
    <div>
      {" "}
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
    </div>
  );
}
