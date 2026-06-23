import React from "react";

export default function How_it_works() {
  return (
    <div
      className="bg-brand-dark flex flex-col justify-center items-center px-4 sm:px-8 md:px-16 py-10"
      id="How-it-works">
      <div className="badge badge-md mt-5 p-4 font-black rounded-3xl bg-brand-light border-brand-light text-brand-primary">
        كيف يعمل أجر؟
      </div>
      <h1 className="text-2xl sm:text-3xl font-black my-2 text-white text-center">
        من البحث للتسليم في خطوات بسيطة
      </h1>

      <div className="flex flex-col md:flex-row w-full max-w-7xl gap-4">
        <div className="flex-1 card shadow-md shadow-brand-primary rounded-3xl my-2 px-3  hover:border hover:border-brand-primary">
          <h1 className="font-black text-white/10 text-9xl leading-none pt-4">
            01
          </h1>
          <div className="card-body">
            <h2 className="card-title text-white text-3xl">أنشئ حسابك</h2>
            <p className="text-gray-300 font-black">
              أنشئ حسابًا جديدًا وأكمل التحقق من هويتك للوصول إلى جميع خدمات
              المنصة بأمان.
            </p>
          </div>
        </div>

        <div className="flex-1 card shadow-md shadow-brand-primary rounded-3xl my-2 px-3  hover:border hover:border-brand-primary">
          <h1 className="font-black text-white/10 text-9xl leading-none pt-4">
            02
          </h1>
          <div className="card-body">
            <h2 className="card-title text-white text-3xl">ابحث واحجز</h2>
            <p className="text-gray-300 font-black">
              استكشف المنتجات المتاحة، اختر ما يناسب احتياجاتك، وحدد مدة الإيجار
              ثم أرسل طلبك.
            </p>
          </div>
        </div>

        <div className="flex-1 card shadow-md shadow-brand-primary rounded-3xl my-2 px-3  hover:border hover:border-brand-primary">
          <h1 className="font-black text-white/10 text-9xl leading-none pt-4">
            03
          </h1>
          <div className="card-body">
            <h2 className="card-title text-white text-3xl">استلم واستمتع</h2>
            <p className="text-gray-300 font-black">
              أكمل الدفع بأمان، استلم المنتج، وتابع حالة الإيجار حتى موعد
              الإرجاع
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
