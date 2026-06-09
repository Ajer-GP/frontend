"use client";
import { useState, useActionState } from "react";
import Link from "next/link";
import { loginService } from "../services/actions";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);

  const [formState, formAction] = useActionState(loginService, {
    ZodErrors: {},
    message: undefined,
    data: undefined,
  });
  return (
    <>
      <form action={formAction} className="flex flex-col gap-4">
        <label
          htmlFor="email"
          className="label text-body-sm  mt-4 mx-2 text-black "
        >
          البريد الالكتروني
        </label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-1 hover:border-black ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
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
        {formState?.ZodErrors && (
          <p className="label text-caption  mx-2 text-danger">
            {formState.ZodErrors?.email?.[0]}{" "}
          </p>
        )}
        <label
          htmlFor="password"
          className="label text-body-sm mt-4 mx-2 text-black "
        >
          كلمة السر
        </label>
        <div className="flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-1 hover:border-black ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="size-6"
          >
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
            tabIndex={-1}
          >
            {showPassword ? (
              // Eye-off icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
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
                className="w-4 h-4"
              >
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
        {formState.ZodErrors && (
          <p className="label text-caption mx-2 text-danger ">
            {formState.ZodErrors?.password?.[0]}
          </p>
        )}
        <Link
          href="/auth/forgot-password"
          className="text-brand-primary underline"
        >
          {" "}
          نسيت كلمة السر ؟
        </Link>
        <div className="flex gap-2">
          <input
            type="checkbox"
            className="checkbox border-border-default checked:border-brand-primary text-white checked:bg-brand-primary"
          />
          <p> تذكرني علي هذا الجهاز</p>
        </div>
        {formState?.message && (
          <p className="label text-caption mx-2 text-danger ">
            {formState.message}
          </p>
        )}
        {formState?.data?.user && (
          <p className="label text-caption mx-2 text-green-600">
            تم تسجيل الدخول بنجاح
          </p>
        )}
        <button className="btn w-full bg-brand-primary hover:bg-brand-dark text-white border-none rounded-xl text-body font-medium mt-1">
          {" "}
          سجل الدخول
        </button>
      </form>
      <div className="mt-6 w-80 mx-auto">
        <div className="flex items-center gap-4">
          <hr className="flex-1 border-gray-500" />
          <span className="text-gray-500 text-sm">أو التسجيل ب </span>
          <hr className="flex-1 border-gray-500" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 my-2">
        <button
          type="button"
          className="btn btn-outline border-border-default text-text-secondary hover:bg-surface-secondary hover:border-border-default hover:text-text-primary rounded-lg gap-2"
        >
          {/* Facebook */}
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill="#1877F2"
            aria-hidden="true"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
          فيسبوك
        </button>
        <button
          type="button"
          className="btn btn-outline border-border-default text-text-secondary hover:bg-surface-secondary hover:border-border-default hover:text-text-primary rounded-lg gap-2"
        >
          {/* Google */}
          <svg className="w-4 h-4" viewBox="0 0 24 24" aria-hidden="true">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          جوجل
        </button>
      </div>
    </>
  );
}
