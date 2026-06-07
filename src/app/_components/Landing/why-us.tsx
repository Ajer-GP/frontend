import Image from "next/image";
import React from "react";

export default function Why_us() {
  return (
    <div className='flex flex-col justify-center items-center px-4 sm:px-6 md:px-14 mb-10'>
      <div className='badge badge-md mt-5 p-4 font-black rounded-3xl bg-brand-light border-brand-light text-brand-primary'>
        لماذا تختارنا؟{" "}
      </div>
      <h1 className='text-2xl sm:text-3xl font-black my-2 text-center'>
        {" "}
        لماذا يختار &nbsp;
        <strong className='text-brand-primary'>الآلاف </strong>
        أجر؟
      </h1>

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-7xl'>
        <div className='card bg-gray-50 shadow-lg rounded-2xl my-5 hover:border hover:border-brand-primary'>
          <figure className='px-10 pt-10'>
            <Image
              src='/images/why-us-1.png'
              alt='why-us'
              className='rounded-xl'
              width={100}
              height={100}
            />
          </figure>
          <div className='card-body items-center text-center'>
            <h2 className='card-title font-black text-2xl'>توصيات ذكية</h2>
            <p className='text-gray-500'>
              اقتراحات مخصصة تساعدك في العثور على المنتج المناسب بسرعة.
            </p>
          </div>
        </div>
        <div className='card bg-gray-50 shadow-lg rounded-2xl my-5 hover:border hover:border-brand-primary'>
          <figure className='px-10 pt-10'>
            <Image
              src='/images/why-us-2.png'
              alt='why-us'
              className='rounded-xl'
              width={100}
              height={100}
            />
          </figure>
          <div className='card-body items-center text-center'>
            <h2 className='card-title font-black text-2xl'> معاملات آمنة</h2>
            <p className='text-gray-500'>
              استمتع بتجربة موثوقة بفضل آليات الحماية المتقدمة.{" "}
            </p>
          </div>
        </div>
        <div className='card bg-gray-50 shadow-lg rounded-2xl my-5 hover:border hover:border-brand-primary'>
          <figure className='px-10 pt-10'>
            <Image
              src='/images/why-us-3.png'
              alt='why-us'
              className='rounded-xl'
              width={100}
              height={100}
            />
          </figure>
          <div className='card-body items-center text-center'>
            <h2 className='card-title font-black text-2xl'> توصيل بسهولة</h2>
            <p className='text-gray-500'>
              استلم المنتج وأعده بسهولة من خلال خيارات مرنة تناسب وقتك
              وموقعك.{" "}
            </p>
          </div>
        </div>
        <div className='card bg-gray-50 shadow-lg rounded-2xl my-5 hover:border hover:border-brand-primary'>
          <figure className='px-10 pt-10'>
            <Image
              src='/images/why-us-4.png'
              alt='why-us'
              className='rounded-xl'
              width={100}
              height={100}
            />
          </figure>
          <div className='card-body items-center text-center'>
            <h2 className='card-title font-black text-2xl'>
              وفر أكثر أو اربح أكثر{" "}
            </h2>
            <p className='text-gray-500'>
              استأجر ما تحتاجه دون تكلفة، أو اربح عند تأجير منتجاتك غير
              المستخدمة
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
