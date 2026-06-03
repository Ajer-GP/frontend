import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className='flex items-center justify-center bg-zinc-50 font-sans '>
      <main className='flex w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white sm:items-start'>
        <div
          className='flex min-h-screen items-center justify-center bg-surface-secondary'
          dir='rtl'>
          <div className='flex flex-col items-center gap-4'>
            <Link
              href='/auth/login'
              className='w-48 rounded-lg bg-brand-primary px-6 py-3 text-center text-body text-white hover:bg-brand-dark transition-colors'>
              تسجيل الدخول
            </Link>
            <Link
              href='/auth/register'
              className='w-48 rounded-lg border border-brand-primary px-6 py-3 text-center text-body text-brand-primary hover:bg-brand-light transition-colors'>
              إنشاء حساب
            </Link>
            <Link
              href='/auth/forgot-password'
              className='w-48 rounded-lg border border-brand-primary px-6 py-3 text-center text-body text-brand-primary hover:bg-brand-light transition-colors'>
              نسيت كلمة المرور
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
