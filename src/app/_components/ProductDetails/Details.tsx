import { Product } from "@/modules/user/features/products/types/products.typs";
import React from "react";
import { CONDITION_STYLES } from "./handlingDetails";

export default function Details({ data }: { data: Product }) {
  const product = data;

  const conditionStyle = CONDITION_STYLES[product.condition] ?? {
    label: product.condition,
    text: "text-gray-600",
    bg: "bg-gray-200",
  };

  return (
    <div className="mx-4 sm:mx-6 lg:mx-10">
      <h1 className="text-xl sm:text-2xl font-black my-4">تفاصيل المنتج</h1>

      <div className="tabs [--tab-bg:bg-gray-200]">
        {/* ── Tab 1: About ── */}
        <input
          type="radio"
          name="my_tabs_2"
          className="tab rounded-3xl my-2 checked:bg-gray-100 checked:border checked:border-gray-300 text-sm sm:text-base"
          aria-label="نبذة عن المنتج"
          defaultChecked
        />
        <div className="tab-content border-gray-300 bg-gray-50 p-4 sm:p-6 lg:p-10 rounded-2xl">
          <p className="text-sm sm:text-base">{product.description}</p>

          <div className="flex flex-col sm:flex-row gap-4 my-5">
            {/* Condition card */}
            <div className="card w-full sm:w-96 bg-gray-50 card-lg shadow-sm border border-gray-300 rounded-3xl">
              <div className="card-body p-4 sm:p-6">
                <h2 className="card-title text-base sm:text-lg">
                  العمر والحالة
                </h2>
                <div className="flex gap-3 items-center">
                  <p className="text-sm">الحالة</p>
                  <div
                    className={`badge rounded-2xl text-xs sm:text-sm ${conditionStyle.text} ${conditionStyle.bg}`}>
                    {conditionStyle.label}
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  <p className="text-sm">ظروف الاستخدام</p>
                  <p className="text-sm font-medium">
                    {product.usage ?? "لا يوجد وصف لظروف الاستخدام"}
                  </p>
                </div>
              </div>
            </div>

            {/* Handling notes card */}
            <div className="card w-full sm:w-96 bg-[#FFFDFA] card-lg shadow-sm border border-accent-default rounded-3xl">
              <div className="card-body p-4 sm:p-6">
                <h2 className="card-title text-accent-default text-base sm:text-lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={20}
                    height={20}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="shrink-0">
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path d="M12 9v4" />
                    <path d="M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0" />
                    <path d="M12 16h.01" />
                  </svg>
                  ملاحظات التعامل
                </h2>
                <p className="text-sm sm:text-base">{product.handlingNotes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Tab 2: Specs ── */}
        <input
          type="radio"
          name="my_tabs_2"
          className="tab rounded-3xl my-2 checked:bg-gray-100 checked:border checked:border-gray-300 text-sm sm:text-base"
          aria-label="مواصفات"
        />
        <div className="tab-content border-gray-300 bg-gray-50 p-4 sm:p-6 lg:p-10 rounded-2xl">
          {product.specs?.map((spec, i) => (
            <div key={i} className="flex gap-4 sm:gap-10 my-1">
              <p className="text-gray-500 text-sm sm:text-base">{spec.label}</p>
              <p className="font-black text-sm sm:text-base">{spec.value}</p>
            </div>
          ))}
        </div>

        {/* ── Tab 3: Accessories ── */}
        <input
          type="radio"
          name="my_tabs_2"
          className="tab rounded-3xl my-2 checked:bg-gray-100 checked:border checked:border-gray-300 text-sm sm:text-base"
          aria-label="مرفقات مع المنتج"
        />
        <div className="tab-content border-gray-300 bg-gray-50 p-4 sm:p-6 lg:p-10 rounded-2xl">
          <div className="flex flex-wrap gap-2">
            {product.accessories?.map((acc, i) => (
              <div
                key={i}
                className="flex gap-1 items-center border border-brand-primary bg-white px-2 py-1 rounded-xl text-brand-primary text-sm">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-4 sm:size-5 shrink-0 text-brand-primary">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                <p>{acc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
