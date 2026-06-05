import React from "react";

export default function ReturnRefundPolicy() {
  return (
    <div className='my-10 mx-4 sm:mx-10'>
      <h1 className='text-2xl font-black'>سياسة الإلغاء والاسترداد</h1>
      <p className='text-gray-500 my-2'>
        قواعد واضحة وشفافة لضمان تجربة موثوقة للجميع. يتم الاحتفاظ بمبلغ التأمين
        كضمان فقط، ولا يُستخدم إلا في حال وجود مطالبة موثقة ومعتمدة.
      </p>

      <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-2'>
        <div className='card bg-brand-light shadow-sm border border-brand-primary my-3'>
          <div className='card-body'>
            <h1 className='card-title'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-10 text-brand-primary'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
            </h1>
            <h2 className='font-black text-brand-primary text-lg'>
              استرداد كامل
            </h2>
            <h3 className='font-black'>
              عند الإلغاء قبل أكثر من 48 ساعة من موعد بدء الإيجار
            </h3>
            <p>استرداد 100٪ من قيمة الإيجار. إعادة مبلغ التأمين بالكامل.</p>
          </div>
        </div>

        <div className='card bg-[#FFFDFA] shadow-sm border border-accent-default my-3'>
          <div className='card-body'>
            <h1 className='card-title'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-8 text-accent-default'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
            </h1>
            <h2 className='font-black text-accent-default text-lg'>
              استرداد جزئي
            </h2>
            <h3 className='font-black'>
              عند الإلغاء خلال 24 إلى 48 ساعة قبل موعد بدء الإيجار
            </h3>
            <p>
              استرداد 50٪ من قيمة الإيجار. إعادة مبلغ التأمين بالكامل. رسوم
              التوصيل غير قابلة للاسترداد.
            </p>
          </div>
        </div>

        <div className='card bg-[#FFFBFB] shadow-sm border border-danger my-3 sm:col-span-2 xl:col-span-1'>
          <div className='card-body'>
            <h1 className='card-title'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-8 text-danger'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
                />
              </svg>
            </h1>
            <h2 className='font-black text-danger text-lg'>
              غير قابل للاسترداد
            </h2>
            <h3 className='font-black'>
              عند الإلغاء قبل أقل من 24 ساعة من موعد بدء الإيجار أو بعد استلام
              المنتج
            </h3>
            <p>
              قيمة الإيجار غير قابلة للاسترداد. رسوم التوصيل غير قابلة
              للاسترداد. يُسترد مبلغ التأمين فقط إذا لم يتم تسليم المنتج أو بعد
              إرجاعه بحالة سليمة وعدم وجود أي مطالبات أو أضرار.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
