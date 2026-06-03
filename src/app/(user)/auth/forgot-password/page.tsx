import React from "react";

export default function forgotpassword() {
  return (
    <div dir='rtl'>
      <h1 className='text-4xl text-text-primary mb-2 '>نسيت كلمة المرور ؟</h1>
      <p className='text-gray-400 text-h3 my-2'>
        ادخل بريدك الالكتروني و سنرسل لك رمز الاستعادة{" "}
      </p>
      <form>
        <label
          htmlFor='email'
          className=' label text-body-sm my-2 mx-2 text-black'>
          البريد الالكتروني
        </label>
        <div className='flex items-center gap-2 border border-gray-300 rounded-xl px-3 py-1 hover:border-black '>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75'
            />
          </svg>

          <input
            type='email'
            id='email'
            name='email'
            placeholder='مثال  johndoe@example.com'
            className='input bg-white w-full outline-0 border-0'
          />
        </div>
        <p className='text-gray-400 text-caption my-2'>
          سيتم ارسال رمز التحقق الي بريدك الالكتروني
        </p>
        <button className='btn w-full bg-brand-primary h-10 hover:bg-brand-dark text-white border-none rounded-xl text-body font-medium mt-1 '>
          ارسال رمز التحقق
        </button>
      </form>
    </div>
  );
}
