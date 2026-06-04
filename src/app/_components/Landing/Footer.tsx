import Image from "next/image";
import React from "react";

export default function Footer() {
  return (
    <div className='text-white bg-brand-dark px-6 sm:px-12 py-10'>
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-10'>
        {/* Logo & Description */}
        <div className='flex flex-col gap-3'>
          <Image src='/images/Ajer.png' width={100} height={100} alt='logo' />
          <p className='text-sm'>
            منصة ذكية تتيح لك استئجار المنتجات التي تحتاجها أو تأجير ممتلكاتك
            لتحقيق دخل إضافي، من خلال تجربة آمنة وسهلة وموثوقة.
          </p>
        </div>

        {/* Important Links */}
        <div className='flex flex-col gap-3 items-center'>
          <p className='font-black'>روابط مهمة</p>
          <p className='text-sm'>سياسة الاستخدام والخصوصية</p>
          <p className='text-sm'>اعرض منتجك للايجار</p>
          <p className='text-sm'>كيف يعمل أجر</p>
        </div>

        {/* Support */}
        <div className='flex flex-col gap-3 items-center'>
          <p className='font-black'>الدعم</p>
          <p className='text-sm'>الأسئلة الشائعة</p>
          <p className='text-sm'>تواصل معنا</p>
          <p className='text-sm'>الدعم الفني</p>
        </div>

        {/* Social */}
        <div className='flex flex-col gap-3 items-center'>
          <p className='font-black'>تابعنا</p>
          <div className='flex items-center gap-3'>
            <Image
              src='/images/facebook.png'
              width={24}
              height={24}
              alt='facebook'
              className='w-6 h-6'
            />
            <Image
              src='/images/twitter.png'
              width={24}
              height={24}
              alt='twitter'
              className='w-6 h-6'
            />
            <Image
              src='/images/instagram.png'
              width={24}
              height={24}
              alt='instagram'
              className='w-6 h-6'
            />
            <Image
              src='/images/linkedin.png'
              width={24}
              height={24}
              alt='linkedin'
              className='w-6 h-6'
            />
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className='flex flex-col items-center gap-3'>
        <hr className='w-[70%] border-white' />
        <p className='text-sm text-white'>الحقوق محفوظة | 2026 أجر</p>
      </div>
    </div>
  );
}
