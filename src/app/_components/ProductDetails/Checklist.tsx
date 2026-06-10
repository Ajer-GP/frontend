import React from "react";

export default function Checklist(data: any) {
  const product = data.data;
  return (
    <div className='my-5 mx-4 md:mx-10'>
      <h1 className='text-2xl font-black my-4'>قائمة فحص المنتج</h1>
      <p className='text-sm md:text-base'>
        يتم فحص جميع العناصر والتأكد من مطابقتها لهذه القائمة عند الاستلام
        والتسليم، مما يضمن لك معرفة جميع المحتويات المرفقة بدقة والحصول على
        المنتج كاملًا كما هو موضح في الإعلان.
      </p>
      <div className='border border-gray-300 my-3 px-2 py-2 rounded-2xl'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-1'>
          {product.checklist.map((check: any, i: number) => (
            <div
              key={i}
              className='flex gap-1 border border-brand-primary bg-white px-2 py-1 mx-3 my-2 rounded-xl text-brand-primary'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6 text-brand-primary flex-shrink-0'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
              <p>{check}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
