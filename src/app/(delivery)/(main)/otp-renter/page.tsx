import React from "react";
import Link from "next/link";
import { getDeliveryById } from "@/Modules/Delivery/Features/services/delivery.actions";
import OTPInputs from "@/app/_components/delivery/OTPInputs";

export default async function page({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const result = await getDeliveryById("6a307da2964a2a7f702aec71");
  const task = result.delivery;

  const totalFees =
    task.insuranceAmount + task.remainingAmount + task.commissionFee;

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* Breadcrumbs */}
      <div className="breadcrumbs text-sm overflow-x-auto">
        <ul>
          <li>
            <Link href="/dashboard">الرئيسية</Link>
          </li>
          <li className="break-all">{taskId}</li>
        </ul>
      </div>

      {/* Mission header */}
      <div className="rounded-xl bg-linear-to-r to-brand-mid from-brand-primary p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between my-3 text-white gap-3 text-center sm:text-start">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="rounded-full p-3 bg-white/10 backdrop-blur-md border border-white/20 shrink-0">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-10 sm:size-12">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
              />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-gray-300 text-sm">
              رقم المهمة: <span className="text-white break-all">{taskId}</span>
            </p>
            <p className="text-lg font-semibold">التسليم للمستأجر</p>
            <p className="text-sm text-white/80">
              أكمل خطوات التسليم وتحقق من الرمز السري قبل تسليم المنتج للمستأجر.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0">
          <button className="btn bg-white rounded-4xl w-full sm:w-auto whitespace-nowrap text-brand-primary">
            تأكيد التسليم
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5 8.25 12l7.5-7.5"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Main grid — stacks on mobile, side by side on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* OTP card */}
        <div className="border border-gray-300 rounded-2xl px-4 py-4">
          <h1 className="font-black text-xl my-3">التحقق من رمز التسليم</h1>
          <OTPInputs taskId={taskId} />
        </div>

        {/* Financial summary card */}
        <div className="border border-gray-400 px-3 py-3 rounded-2xl">
          <h3 className="font-black text-xl mb-4">ملخص مالي</h3>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between gap-2">
              <p className="text-gray-600">سعر التأمين</p>
              <p className="font-black">{task.insuranceAmount} </p>
            </div>
            <div className="flex justify-between gap-2">
              <p className="text-gray-600">باقي الحساب</p>
              <p className="font-black">{task.remainingAmount} </p>
            </div>
            <div className="flex justify-between gap-2">
              <p className="text-gray-600">نسبة المنصة (5%)</p>
              <p className="font-black">{task.commissionFee} </p>
            </div>
            <div className="flex justify-between gap-2 text-brand-primary bg-gray-50 rounded-xl px-3 py-2 mt-2">
              <p className="font-black">الاجمالي</p>
              <p className="font-black">{totalFees} ج.م</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
