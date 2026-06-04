import React from "react";
import Image from "next/image";
export default function Best_products() {
  return (
    <div className='flex flex-col justify-center items-center px-4 sm:px-6 md:px-14 mb-10'>
      <div className='badge badge-md mt-5 mb-1 p-4 font-black rounded-3xl bg-brand-light text-brand-primary'>
        منتجات مختارة لك{" "}
      </div>
      <h1 className='text-2xl sm:text-3xl font-black my-1 text-center'>
        اكتشف منتجات تم{" "}
        <strong className='text-brand-primary'>اختيارها </strong> بناءً علي
        &nbsp;
        <strong className='text-brand-primary'>اهتماماتك </strong>{" "}
        <strong className='text-brand-primary'>يقول </strong>
      </h1>
      <div className='card bg-base-100 w-96 shadow-sm'>
        <figure>
          <div className='relative'>
            <Image
              src='/images/cat-1.png'
              alt='product'
              width={200}
              height={200}
            />
            <span className='absolute top-4 left-2 badge badge-sm bg-amber-300 text-white'>
              جديد
            </span>
          </div>
        </figure>
        <div className='card-body'>
          <p className='text-gray-400'>الكترونيات</p>
          <h2 className='card-title'>كاميرا سوني Alpha 7 III</h2>
          <h2>
            {" "}
            <strong>100ج.م</strong>/يوم
          </h2>
          <div className='card-actions '>
            <button className='btn bg-white w-full border border-brand-primary rounded-xl'>
              اعرف المزيد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
