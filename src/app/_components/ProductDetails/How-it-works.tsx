import React from "react";

const steps = [
  {
    n: 1,
    title: "تقديم طلب التأجير",
    desc: "اختر التواريخ المناسبة وأرسل طلب التأجير. لن يتم خصم أي مبلغ في هذه المرحلة.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
        />
      </svg>
    ),
  },
  {
    n: 2,
    title: "موافقة المالك",
    desc: "يقوم المالك بمراجعة الطلب والرد عليه، وستصلك إشعارات فورية بحالة الطلب.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    ),
  },
  {
    n: 3,
    title: "مبلغ الحجز",
    desc: "ادفع عربون الحجز ورسوم التوصيل الآن لحجز المنتج. سيتم تحصيل المبلغ المتبقي وقيمة التأمين عند وصول المنتج.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
        />
      </svg>
    ),
  },
  {
    n: 4,
    title: "تسليم المنتج للمستأجر",
    desc: "يتم تسليم المنتج إلى عنوانك. يتم تأكيد عملية التسليم باستخدام رمز تحقق مكوّن من 6 أرقام لضمان أمان العملية للطرفين.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
        />
      </svg>
    ),
  },
  {
    n: 5,
    title: "فترة التأجير النشطة",
    desc: "استمتع باستخدام المنتج طوال فترة التأجير، مع إمكانية متابعة حالة الحجز.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z"
        />
      </svg>
    ),
  },
  {
    n: 6,
    title: "إرجاع المنتج والفحص",
    desc: "عند انتهاء المدة، تتم مراجعة قائمة المحتويات وحالة المنتج مرة أخرى وتوثيق أي ملاحظات إن وجدت. يُعاد مبلغ التأمين بعد التحقق من سلامة المنتج.",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={24}
        height={24}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <path d="M19.933 13.041a8 8 0 1 1 -9.925 -8.788c3.899 -1 7.935 1.007 9.425 4.747" />
        <path d="M20 4v5h-5" />
      </svg>
    ),
  },
];

function StepCard({
  title,
  desc,
  icon,
  isLast,
  isCompleted, // ← جديد
}: {
  title: string;
  desc: string;
  icon: React.ReactNode;
  isLast: boolean;
  isCompleted: boolean; // ← جديد
}) {
  return (
    <div className="flex items-start gap-4" dir="rtl">
      <div className="relative flex flex-col items-center shrink-0 self-stretch">
        <span
          className={`relative z-10 flex items-center justify-center size-12 rounded-full border 
            ${
              isCompleted
                ? "border-[#1A6B4A] text-white bg-[#1A6B4A]" // ← completed style
                : "border-brand-primary text-brand-primary bg-gray-50" // ← default style
            }`}
        >
          {isCompleted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m4.5 12.75 6 6 9-13.5"
              />
            </svg>
          ) : (
            icon
          )}
        </span>

        {!isLast && (
          <div className="absolute top-12 bottom-0 w-px bg-gray-300" />
        )}
      </div>

      <div className="pb-8 pt-2">
        <h2 className="font-black text-lg leading-snug">{title}</h2>
        <p className="text-gray-500 text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
}
export default function HowItWorks({
  currentStep = 0,
}: {
  currentStep?: number;
}) {
  return (
    <div className="mx-4 sm:mx-10">
      <h1 className="text-2xl font-black">كيف تعمل عملية التأجير؟</h1>
      <div className="border border-gray-400 rounded-3xl p-6 sm:p-8 mt-5 mb-10 bg-gray-50">
        <div className="flex flex-col">
          {steps.map((step, i) => (
            <StepCard
              key={step.n}
              title={step.title}
              desc={step.desc}
              icon={step.icon}
              isLast={i === steps.length - 1}
              isCompleted={step.n < currentStep} // ← كل اللي قبل الـ current هي completed
            />
          ))}
        </div>
      </div>
    </div>
  );
}
