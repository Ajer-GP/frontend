import React from "react";
import Link from "next/link";
export default function page() {
  return (
    <div dir='rtl' className='flex flex-col'>
      <div className='m-auto'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='size-30 text-brand-primary bg-brand-light rounded-full p-4'>
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
          />
        </svg>
      </div>
      <div className='my-8 text-center'>
        <h1 className='text-4xl text-text-primary my-2'>
          تم تعيين كلمة سر جديدة
        </h1>
        <p className='text-gray-400 text-h3 my-2'>
          يمكنك الان استخدام كلمة السر الجديدة لتسجيل الدخول الي حسابك
        </p>

        <Link
          href='/auth/login'
          className='btn w-full bg-brand-primary hover:bg-brand-dark text-white border-none rounded-xl text-body font-medium mt-1'>
          سجل الدخول
        </Link>
      </div>
    </div>
  );
}
