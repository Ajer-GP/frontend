import React from "react";

export default function Common_questions() {
  return (
    <div className='flex flex-col gap-3 items-center my-10 px-4 sm:px-8 md:px-16'>
      <div className='badge badge-md mt-5 p-4 font-black rounded-3xl bg-brand-light text-brand-primary'>
        الأسئلة الشائعة
      </div>
      <h1 className='mb-4 mt-2 font-black text-2xl sm:text-3xl md:text-4xl text-center'>
        كل ما <strong className='text-brand-primary'>تحتاج</strong> إلى معرفته
      </h1>

      <div className='flex flex-col gap-3 w-full max-w-7xl'>
        <div className='collapse collapse-arrow border border-base-300 bg-gray-100 has-checked:bg-brand-light has-checked:border has-checked:border-brand-primary'>
          <input type='checkbox' />
          <div className='collapse-title font-semibold'>
            1. كيف يمكنني استئجار منتج؟
          </div>
          <div className='collapse-content text-sm'>
            يمكنك إنشاء حساب، البحث عن المنتج المناسب، تحديد مدة الإيجار، ثم
            إرسال الطلب وإتمام عملية الدفع بشكل آمن.
          </div>
        </div>

        <div className='collapse collapse-arrow border border-base-300 bg-gray-100 has-checked:bg-brand-light has-checked:border has-checked:border-brand-primary'>
          <input type='checkbox' />
          <div className='collapse-title font-semibold'>
            2. كيف تتم عملية استلام وإرجاع المنتج؟
          </div>
          <div className='collapse-content text-sm'>
            يتم الاتفاق على موعد ومكان الاستلام مع المؤجر، وعند انتهاء مدة
            الإيجار يتم إرجاع المنتج بنفس الطريقة.
          </div>
        </div>

        <div className='collapse collapse-arrow border border-base-300 bg-gray-100 has-checked:bg-brand-light has-checked:border has-checked:border-brand-primary'>
          <input type='checkbox' />
          <div className='collapse-title font-semibold'>
            3. كيف أربح من منتجاتي؟
          </div>
          <div className='collapse-content text-sm'>
            قم بإضافة منتجاتك على المنصة، حدد السعر ومدة الإيجار، وستحصل على
            أرباحك بعد كل عملية إيجار ناجحة.
          </div>
        </div>

        <div className='collapse collapse-arrow border border-base-300 bg-gray-100 has-checked:bg-brand-light has-checked:border has-checked:border-brand-primary'>
          <input type='checkbox' />
          <div className='collapse-title font-semibold'>
            4. ماذا أفعل إذا واجهت مشكلة أثناء الإيجار؟
          </div>
          <div className='collapse-content text-sm'>
            تواصل مع فريق الدعم الفني عبر صفحة تواصل معنا وسيتم الرد عليك في
            أقرب وقت ممكن.
          </div>
        </div>
      </div>
    </div>
  );
}
