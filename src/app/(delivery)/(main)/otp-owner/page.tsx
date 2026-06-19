import React from "react";
import Link from "next/link";
import Image from "next/image";
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
            <p className="text-gray-300 text-sm">رقم المهمة</p>
            <p className="text-lg font-semibold">تسليم المنتج للمالك</p>
            <p className="text-sm text-white/80">
              قم بالتحقق من هوية المالك عبر الرمز السري لإغلاق المهمة رسمياً.
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0">
          <button className="btn bg-white rounded-4xl w-full sm:w-auto whitespace-nowrap text-brand-primary">
            اغلاق المهمة
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

      {/* Main grid — single col on mobile, two cols on lg+ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* OTP card */}
        <div className="border border-gray-300 rounded-2xl px-4 py-4">
          <h1 className="font-black text-xl my-3">التحقق من رمز التسليم</h1>
          <OTPInputs taskId={taskId} />
        </div>

        {/* Return summary card */}
        <div className="border border-gray-400 px-3 py-3 rounded-2xl w-full">
          <h1 className="font-black text-xl mb-4">ملخص المرتجع</h1>

          <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start text-center sm:text-start">
            <Image
              loading="eager"
              src={task.productCoverImage}
              alt="productImage"
              height={120}
              width={120}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-gray-500 object-cover shrink-0"
            />

            <div className="w-full min-w-0">
              <div className="badge bg-gray-200 text-gray-500 rounded-2xl mb-1">
                {task.productName}
              </div>
              <h2 className="font-bold text-lg sm:text-xl break-words">
                {task.productTitle}
              </h2>

              {/* Owner */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-2">
                {task?.ownerImage ? (
                  <div className="w-14 h-14 rounded-full shrink-0 overflow-hidden">
                    <Image
                      src={task.ownerImage}
                      alt="userImage"
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="avatar avatar-placeholder">
                    <div className="bg-brand-primary text-neutral-content w-14 rounded-full">
                      <span className="text-xl">{task.ownerName[0]}</span>
                    </div>
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{task.ownerName}</h3>
                  <p className="text-sm text-gray-500">المالك</p>
                </div>
              </div>

              {/* Meta */}
              <div className="mt-3 flex flex-col gap-1 text-sm">
                <div className="flex flex-wrap gap-2">
                  <p className="text-gray-500">رقم المهمة:</p>
                  <p className="font-semibold break-all">{taskId}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <p className="text-gray-500">تاريخ الارجاع:</p>
                  <p className="font-semibold">{task.endDate.split("T")[0]}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
