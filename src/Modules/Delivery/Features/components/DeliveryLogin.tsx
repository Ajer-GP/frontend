"use client";
import { useState, useActionState, useEffect } from "react";
import Link from "next/link";

import { useRouter } from "next/navigation";
import { DeliveryLogin } from "../services/delivery.actions";
const initialState = { ZodErrors: undefined, message: undefined };

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formState, action, isPending] = useActionState(
    DeliveryLogin,
    initialState,
  );
  useEffect(() => {
    if (formState && (formState as any).success) {
      router.push("/dashboard");
    }
  }, [formState, router]);
  return (
    <div className="my-10">
      <h1 className="text-3xl font-black">مرحبا بعودتك</h1>
      <form action={action} className="flex flex-col gap-4">
        <label
          htmlFor="email"
          className="label text-body-sm  mt-4 mx-2 text-black ">
          البريد الالكتروني
        </label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-1 hover:border-black ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
            />
          </svg>

          <input
            lang="en"
            type="text"
            id="email"
            name="email"
            placeholder="مثال  johndoe@example.com"
            className="input bg-white w-full outline-0 border-0"
          />
        </div>
        {formState?.ZodErrors?.email && (
          <p className="label text-caption  mx-2 text-danger">
            {formState.ZodErrors?.email?.[0]}{" "}
          </p>
        )}
        <label
          htmlFor="password"
          className="label text-body-sm mt-4 mx-2 text-black ">
          كلمة السر
        </label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-1 hover:border-black ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
            />
          </svg>

          <input
            lang="en"
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="********************"
            className="input bg-white w-full outline-0 border-0"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="text-text-tertiary shrink-0"
            tabIndex={-1}>
            {showPassword ? (
              // Eye-off icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                />
              </svg>
            ) : (
              // Eye icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
            )}
          </button>
        </div>
        {formState?.ZodErrors?.password && (
          <p className="label text-caption mx-2 text-danger ">
            {formState.ZodErrors?.password?.[0]}
          </p>
        )}
        <Link
          href="/auth/forgot-password"
          className="text-brand-primary underline">
          {" "}
          نسيت كلمة السر ؟
        </Link>
        {formState?.message && (
          <p className="label text-caption mx-2 text-danger ">
            {formState.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="btn w-full bg-brand-primary hover:bg-brand-dark text-white border-none rounded-xl text-body font-medium mt-1 disabled:opacity-60">
          {isPending ? "جاري تسجيل الدخول..." : "سجل الدخول"}
        </button>
      </form>
    </div>
  );
}
