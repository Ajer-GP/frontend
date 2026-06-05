import React from "react";

const steps = [
  {
    n: 1,
    title: "تقديم طلب التأجير",
    desc: "اختر التواريخ المناسبة وأرسل طلب التأجير. لن يتم خصم أي مبلغ في هذه المرحلة.",
  },
  {
    n: 2,
    title: "موافقة المالك",
    desc: "يقوم المالك بمراجعة الطلب والرد عليه، وستصلك إشعارات فورية بحالة الطلب.",
  },
  {
    n: 3,
    title: "تأمين الحجز",
    desc: "يتم حجز مبلغ التأمين لضمان سلامة المنتج، ويُسترد بالكامل بعد انتهاء التأجير وإعادة المنتج بحالته الأصلية.",
  },
  {
    n: 4,
    title: "فحص الاستلام",
    desc: "يقوم الطرفان بمراجعة قائمة المحتويات وحالة المنتج قبل التسليم، مع توثيق الحالة بالصور.",
  },
  {
    n: 5,
    title: "تسليم المنتج للمستأجر",
    desc: "يتم تسليم المنتج إلى عنوانك أو استلامه من الموقع المتفق عليه.",
  },
  {
    n: 6,
    title: "التحقق عبر رمز OTP",
    desc: "يتم تأكيد عملية التسليم باستخدام رمز تحقق مكوّن من 6 أرقام لضمان أمان العملية للطرفين.",
  },
  {
    n: 7,
    title: "فترة التأجير النشطة",
    desc: "استمتع باستخدام المنتج طوال فترة التأجير، مع إمكانية متابعة حالة الحجز.",
  },
  {
    n: 8,
    title: "فحص الإرجاع",
    desc: "عند انتهاء المدة، تتم مراجعة قائمة المحتويات وحالة المنتج مرة أخرى وتوثيق أي ملاحظات إن وجدت.",
  },
  {
    n: 9,
    title: "استرداد مبلغ التأمين",
    desc: "يُعاد مبلغ التأمين بعد التحقق من سلامة المنتج وعدم وجود أضرار أو نواقص.",
  },
];

function StepCard({
  n,
  title,
  desc,
}: {
  n: number;
  title: string;
  desc: string;
}) {
  return (
    <div className='flex items-start gap-3' dir='rtl'>
      {/* Number badge */}
      <span className='flex items-center justify-center shrink-0 size-9 rounded-full border border-brand-primary text-brand-primary font-black text-base'>
        {n}
      </span>
      <div>
        <h2 className='font-black text-lg leading-snug'>{title}</h2>
        <p className='text-gray-500 text-sm mt-1'>{desc}</p>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const col1 = steps.slice(0, 6); // steps 1–6 on the right
  const col2 = steps.slice(6); // steps 7–9 on the left

  return (
    <div className='mx-10'>
      <h1 className='text-2xl font-black'>كيف تعمل عملية التأجير؟</h1>
      <div className='border border-gray-400 rounded-3xl p-8 mt-5 mb-10 bg-gray-50'>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8'>
          {/* Right column — steps 1–6 */}
          <div className='flex flex-col gap-8'>
            {col1.map((s) => (
              <StepCard key={s.n} {...s} />
            ))}
          </div>
          {/* Left column — steps 7–9 */}
          <div className='flex flex-col gap-8'>
            {col2.map((s) => (
              <StepCard key={s.n} {...s} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
