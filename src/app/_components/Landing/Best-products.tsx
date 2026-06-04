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
            <span className='absolute top-4 left-2 badge badge-sm text-accent-default bg-[#FDF6E9] font-black'>
              جديد
            </span>
          </div>
        </figure>
        <div className='card-body'>
          <p className='text-gray-400'>الكترونيات</p>
          <div className='flex justify-between'>
            <h2 className='card-title'>كاميرا سوني Alpha 7 III</h2>
            <div className='badge bg-[#FDF6E9] font-black'>
              4.7
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
                className='size-4 text-warning'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                />
              </svg>
            </div>
          </div>
          <h2 className='my-1'>
            <span className='text-3xl text-brand-primary font-black'>
              100ج.م
            </span>
            /يوم
          </h2>
          <div className='card-actions '>
            <button className='btn bg-white w-full border border-brand-primary rounded-xl text-brand-primary'>
              اعرف المزيد
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
