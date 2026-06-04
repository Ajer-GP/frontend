import React from "react";
import Image from "next/image";

const StarIcon = () => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    fill='currentColor'
    stroke='currentColor'
    viewBox='0 0 24 24'
    className='size-6 text-warning'>
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
    />
  </svg>
);

export default function Reviews() {
  return (
    <div className='flex flex-col justify-center items-center px-4 sm:px-6 md:px-14 mb-10'>
      <div className='badge badge-md mt-5 mb-1 p-4 font-black rounded-3xl bg-brand-light text-brand-primary'>
        آراء عملاؤنا{" "}
      </div>
      <h1 className='text-2xl sm:text-3xl font-black my-1 text-center'>
        {" "}
        ماذا <strong className='text-brand-primary'>يقول </strong>
        مستخدمونا؟{" "}
      </h1>

      <div className='flex flex-wrap justify-center gap-2 mt-5 mb-3'>
        <div className='card border border-gray-300 shadow-lg shadow-brand-light  w-80 h-50'>
          <div className='card-body p-4 justify-between'>
            <div className='flex justify-between'>
              <div className='flex gap-1'>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <Image
                src='/images/Quote-Icon.png'
                height={40}
                width={40}
                alt='quotes'
                className='w-7 h-7'
              />
            </div>
            <p className='text-sm font-bold'>
              احتجت كاميرا احترافية لتغطية فعالية ليوم واحد فقط، ووجدتها بسهولة
              على أجر. التجربة كانت سلسة والتسليم في الموعد.
            </p>
            <div className='flex items-center gap-2'>
              <div className='avatar avatar-placeholder'>
                <div className='bg-brand-primary text-neutral-content w-10 rounded-full'>
                  <span>B</span>
                </div>
              </div>
              <p className='font-black text-sm'>بسنت خالد</p>
            </div>
          </div>
        </div>
        <div className='card border border-gray-300 shadow-lg shadow-brand-light  w-80 h-50'>
          <div className='card-body p-4 justify-between'>
            <div className='flex justify-between'>
              <div className='flex gap-1'>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <Image
                src='/images/Quote-Icon.png'
                height={40}
                width={40}
                alt='quotes'
                className='w-7 h-7'
              />
            </div>
            <p className='text-sm font-bold'>
              تجربة سهلة جدًا، وجدت المنتج الذي أحتاجه خلال دقائق.
            </p>
            <div className='flex items-center gap-2'>
              <div className='avatar avatar-placeholder'>
                <div className='bg-brand-primary text-neutral-content w-10 rounded-full'>
                  <span>R</span>
                </div>
              </div>
              <p className='font-black text-sm'> رؤى فودة</p>
            </div>
          </div>
        </div>
        <div className='card border border-gray-300 shadow-lg shadow-brand-light w-80 h-50'>
          <div className='card-body p-4 justify-between'>
            <div className='flex justify-between'>
              <div className='flex gap-1'>
                {[...Array(5)].map((_, i) => (
                  <StarIcon key={i} />
                ))}
              </div>
              <Image
                src='/images/Quote-Icon.png'
                height={40}
                width={40}
                alt='quotes'
                className='w-7 h-7'
              />
            </div>
            <p className='text-sm font-bold'>
              بدأت بتأجير منتجاتي غير المستخدمة وأصبحت أحقق دخلًا إضافيًا بشكل
              منتظم.
            </p>
            <div className='flex items-center gap-2'>
              <div className='avatar avatar-placeholder'>
                <div className='bg-brand-primary text-neutral-content w-10 rounded-full'>
                  <span>kh</span>
                </div>
              </div>
              <p className='font-black text-sm'> خالد محمود</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
