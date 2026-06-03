import React from "react";
import { z } from "zod";
const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "كلمة المرور يجب ألا تقل عن 8 أحرف")
    .max(70, "كلمة المرور طويلة جدًا")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?]).{8,70}$/,
      "كلمة المرور يجب أن تحتوي على حرف واحد على الأقل ورقم واحد على الأقل ورمز خاص واحد على الأقل",
    ),
});
export default function page() {
  return (
    <div dir='rtl'>
      <h1 className='text-4xl text-text-primary mb-2'>تعيين كلمة سر جديدة </h1>
      <p className='text-gray-400 text-h3 my-2'>اختر كلمة سر قوية لحسابك </p>
      <form>
        <label
          htmlFor='password'
          className='label text-body-sm mt-4 mx-2 text-black '>
          كلمة السر
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
              d='M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z'
            />
          </svg>

          <input
            type='password'
            id='password'
            name='password'
            placeholder='********************'
            className='input bg-white w-full outline-0 border-0'
          />
        </div>
        <p className='text-gray-400 text-caption my-2'>
          {" "}
          كلمة السر لا تقل عن 8 أحرف تحتوي علي أرقام و علامات خاصة{" "}
        </p>
        <label
          htmlFor='password'
          className='label text-body-sm mt-4 mx-2 text-black '>
          تأكيد كلمة السر
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
              d='M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z'
            />
          </svg>

          <input
            type='password'
            id='password'
            name='password'
            placeholder='********************'
            className='input bg-white w-full outline-0 border-0'
          />
        </div>

        <button className='btn w-full bg-brand-primary hover:bg-brand-dark text-white border-none rounded-xl text-body font-medium mt-1'>
          {" "}
          ارسال رمز التحقق
        </button>
      </form>
    </div>
  );
}
