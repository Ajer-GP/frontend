"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { resetPasswordFormSchema } from "@/modules/user/features/auth/schemas/auth.validation";
import { resetPassword } from "@/modules/user/features/auth/services/actions";
import { useRouter } from "next/navigation";

type FormData = z.infer<typeof resetPasswordFormSchema>;

export default function ResetPasswordPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(resetPasswordFormSchema),
  });
  const router = useRouter();

  const onSubmit = async (data: FormData) => {
    const result = await resetPassword(data);

    if (result?.success === false) {
      // Session / OTP expired → send user back to start the flow again
      if ((result as { expired?: boolean }).expired) {
        router.push("/auth/forgot-password");
        return;
      }
      setError("root", { message: result.error });
      return;
    }

    router.push("/auth/new-password-sucess");
  };

  const EyeIcon = ({ open }: { open: boolean }) =>
    open ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5"
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
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-5"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
        />
      </svg>
    );

  return (
    <div dir="rtl" className="pb-13">
      <div className="mb-8">
        <h1 className="text-4xl font-medium text-text-primary mb-2">
          تعيين كلمة سر جديدة
        </h1>
        <p className="font-xl font-normal text-text-secondary">
          اختر كلمة سر قوية لحسابك
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        {/* Root / server error */}
        {errors.root && (
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
            <span>{errors.root.message}</span>
          </div>
        )}

        {/* New Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="new_password"
            className="label text-body-sm mt-2 mx-2 text-black"
          >
            كلمة السر الجديدة
          </label>
          <div
            className={`flex items-center gap-2 border rounded-xl px-3 py-1 hover:border-black ${
              errors.new_password ? "border-red-400" : "border-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-gray-400 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
            <input
              type={showPassword ? "text" : "password"}
              id="new_password"
              placeholder="********************"
              className="input bg-white w-full outline-0 border-0"
              {...register("new_password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
          <p className="text-gray-400 text-caption mx-2">
            كلمة السر لا تقل عن 8 أحرف تحتوي على أرقام وعلامات خاصة
          </p>
          {errors.new_password && (
            <p className="text-red-500 text-sm mx-2">
              {errors.new_password.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col gap-1">
          <label
            htmlFor="confirm_password"
            className="label text-body-sm mt-2 mx-2 text-black"
          >
            تأكيد كلمة السر
          </label>
          <div
            className={`flex items-center gap-2 border rounded-xl px-3 py-1 hover:border-black ${
              watch("new_password") &&
              watch("confirm_password" as keyof FormData) !==
                watch("new_password")
                ? "border-red-400"
                : "border-gray-300"
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-gray-400 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
              />
            </svg>
            <input
              type={showConfirm ? "text" : "password"}
              id="confirm_password"
              placeholder="********************"
              className="input bg-white w-full outline-0 border-0"
              {...register("confirm_password" as keyof FormData)}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              className="text-gray-400 hover:text-gray-600"
              tabIndex={-1}
            >
              <EyeIcon open={showConfirm} />
            </button>
          </div>
          {watch("new_password") &&
            (watch("confirm_password" as keyof FormData) as string) !==
              watch("new_password") && (
              <p className="text-red-500 text-sm mx-2">
                كلمتا السر غير متطابقتين
              </p>
            )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn w-full bg-brand-primary hover:bg-brand-dark text-white border-none rounded-xl text-body font-medium mt-1 disabled:opacity-60"
        >
          {isSubmitting ? (
            <span className="loading loading-spinner loading-sm" />
          ) : (
            "تعيين كلمة السر"
          )}
        </button>
      </form>
    </div>
  );
}
