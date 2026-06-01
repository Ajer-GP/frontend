import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "إنشاء حساب جديد | أجر",
  description: "أنشئ حسابك على منصة أجر وابدأ في إدارة أعمالك بكفاءة",
};

export default function RegisterPage() {
  return (
    <div dir="rtl" className="">
      {/* العنوان */}
      <div className="mb-8 ">
        <h1 className="text-h1 text-text-primary mb-2">إنشاء حساب جديد</h1>
        <p className="text-body-sm text-text-secondary">
          هل تمتلك حساباً بالفعل؟{" "}
          <Link
            href="/login"
            className="text-brand-primary font-medium hover:underline"
          >
            سجل الدخول
          </Link>
        </p>
      </div>

      <form className="flex flex-col gap-4" noValidate>
        {/* الاسم الكامل */}
        <div>
          <label
            htmlFor="fullname"
            className="text-body-sm text-text-secondary mb-1.5 block"
          >
            الاسم الكامل
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-text-tertiary shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
              />
            </svg>
            <input
              id="fullname"
              type="text"
              placeholder="مثال: أحمد محمد"
              className="grow text-right bg-transparent outline-none"
              autoComplete="name"
            />
          </label>
        </div>

        {/* البريد الإلكتروني */}
        <div>
          <label
            htmlFor="email"
            className="text-body-sm text-text-secondary mb-1.5 block"
          >
            البريد الإلكتروني
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-text-tertiary shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
              />
            </svg>
            <input
              id="email"
              type="email"
              placeholder="example@gmail.com"
              className="grow text-right bg-transparent outline-none"
              autoComplete="email"
              dir="ltr"
            />
          </label>
        </div>

        {/* رقم الهاتف */}
        <div>
          <label
            htmlFor="phone"
            className="text-body-sm text-text-secondary mb-1.5 block"
          >
            رقم الهاتف
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-text-tertiary shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>
            <span className="text-text-tertiary text-body-sm shrink-0">
              +20
            </span>
            <input
              id="phone"
              type="tel"
              placeholder="01X XXXX XXXX"
              className="grow text-right bg-transparent outline-none"
              autoComplete="tel"
              dir="ltr"
            />
          </label>
        </div>

        {/* كلمة السر */}
        <div>
          <label
            htmlFor="password"
            className="text-body-sm text-text-secondary mb-1.5 block"
          >
            كلمة السر
          </label>
          <label className="input input-bordered flex items-center gap-2 w-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 text-text-tertiary shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
            <input
              id="password"
              type="password"
              placeholder="كلمة السر"
              className="grow text-right bg-transparent outline-none"
              autoComplete="new-password"
            />
          </label>
          <p className="text-caption text-text-tertiary mt-1.5">
            كلمة السر لا تقل عن 8 أحرف وتحتوي على أرقام وحروف
          </p>
        </div>

        {/* الموافقة على الشروط */}
        <div className="flex items-center gap-2">
          <input
            id="terms"
            type="checkbox"
            className="checkbox checkbox-sm border-border-default checked:border-brand-primary [--chkbg:theme(colors.brand-primary)]"
          />
          <label
            htmlFor="terms"
            className="text-body-sm text-text-secondary cursor-pointer"
          >
            أوافق على{" "}
            <Link href="/terms" className="text-brand-primary hover:underline">
              شروط الخدمة
            </Link>{" "}
            و{" "}
            <Link
              href="/privacy"
              className="text-brand-primary hover:underline"
            >
              سياسة الخصوصية
            </Link>
          </label>
        </div>

        {/* زر الإنشاء */}
        <button
          type="submit"
          className="btn w-full bg-brand-primary hover:bg-brand-dark text-white border-none rounded-lg text-body font-medium mt-1"
        >
          إنشاء حساب
        </button>

        {/* فاصل */}
        <div className="divider text-caption text-text-tertiary">
          أو التسجيل بـ
        </div>

        {/* أزرار السوشيال */}
        <div className="grid grid-cols-2 gap-3">
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
      </form>
    </div>
  );
}
