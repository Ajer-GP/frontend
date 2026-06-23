import { getDeliveryById } from "@/Modules/Delivery/Features/services/delivery.actions";
import Image from "next/image";
import Link from "next/link";
import {
  diffInDaysAndHours,
  formatEgyptArabicDate,
} from "@/utils/RentingHandle";
// import InspectionButton from "@/app/_components/delivery/InspectionButton";
import { redirect } from "next/navigation";
import InspectionButton from "@/Modules/Delivery/components/InspectionButton";
export default async function page({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = await params;
  const result = await getDeliveryById(taskId);
  const task = result.delivery;

  const isOwnerToRenter = task.type === "from_owner_to_renter";

  const { days, hours } = diffInDaysAndHours(
    result.delivery.endDate,
    result.delivery.startDate,
  );
  const totalFees =
    result.delivery.insuranceAmount +
    result.delivery.remainingAmount +
    result.delivery.commissionFee;

  const startDate = formatEgyptArabicDate(result.delivery.startDate);

  return (
    <div className="px-3 sm:px-4 md:px-6">
      {/* menu top  */}
      <div className="breadcrumbs text-sm overflow-x-auto">
        <ul>
          <li>
            <Link href="/dashboard">الرئيسية</Link>
          </li>
          <li className="break-all">{taskId}</li>
        </ul>
      </div>
      {/* Mission details */}
      <div className="rounded-xl bg-linear-to-r to-brand-mid from-brand-primary p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between my-3 text-white gap-3 text-center sm:text-start">
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-start">
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
            <p className="text-gray-300 break-words">
              رقم المهمة :{" "}
              <span className="text-white break-all">{taskId}</span>{" "}
            </p>
            <p>تفاصيل المهمة</p>

            {(() => {
              const s = task.status;
              const isO2R = task.type === "from_owner_to_renter";
              if (s === "assigned")
                return <p>المهمة معيّنة لك — ابدأها من لوحة التحكم</p>;
              if (s === "on_the_way")
                return (
                  <p>
                    {isO2R
                      ? "في الطريق إلى المالك لاستلام المنتج"
                      : "في الطريق إلى المستأجر لاستلام المنتج"}
                  </p>
                );
              if (s === "picked_up")
                return (
                  <p>
                    {isO2R
                      ? "تم استلام المنتج — توجّه للمستأجر وأدخل الـ OTP"
                      : "تم استلام المنتج — توجّه للمالك وأدخل الـ OTP"}
                  </p>
                );
              return null;
            })()}
          </div>
        </div>

        <div className="w-full sm:w-auto shrink-0">
          {task.status !== "delivered" && (
            <InspectionButton
              type={task.type}
              status={task.status}
              taskId={taskId}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="border border-gray-400 px-3 py-3 rounded-2xl w-full lg:flex-1">
          <h1 className="font-black text-xl">ملخص الطلب</h1>
          <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start my-4 text-center sm:text-start">
            <Image
              loading="eager"
              src={result.delivery.productCoverImage}
              alt="productImage"
              height={120}
              width={120}
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-gray-500 object-cover shrink-0"
            />

            <div className="w-full min-w-0">
              <div className="badge bg-gray-200 text-gray-500 rounded-2xl">
                {result.delivery.productName}{" "}
              </div>
              <h1 className="font-bold text-lg sm:text-xl break-words">
                {result.delivery.productTitle}
              </h1>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2">
                {result.delivery.type === "from_owner_to_renter" ? (
                  <div>
                    {result?.delivery?.ownerImage ? (
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full shrink-0 overflow-hidden">
                        <Image
                          src={result.delivery.ownerImage}
                          alt="userImage"
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="avatar avatar-placeholder">
                        <div className="bg-brand-primary text-neutral-content w-16 rounded-full">
                          <span className="text-2xl">
                            {result.delivery.ownerName[0]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {" "}
                    {result?.delivery?.renterImage ? (
                      <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full shrink-0 overflow-hidden">
                        <Image
                          src={result.delivery.renterImage}
                          alt="userImage"
                          width={100}
                          height={100}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="avatar avatar-placeholder">
                        <div className="bg-brand-primary text-neutral-content w-16 rounded-full">
                          <span className="text-2xl">
                            {result.delivery.renterName[0]}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div>
                  {result.delivery.type === "from_owner_to_renter" ? (
                    <div>
                      <h3>{result.delivery.ownerName}</h3>
                      <p>المالك</p>
                    </div>
                  ) : (
                    <div>
                      {" "}
                      <h3>{result.delivery.renterName}</h3>
                      <p>المستأجر</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 my-2">
            <div className="border-s px-1">
              <p>
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6 inline mx-1">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
                تاريخ البداية{" "}
              </p>
              <p className="font-black my-1">
                {result.delivery.startDate.split("T")[0]}
              </p>
            </div>
            <div className="border-s px-1">
              <p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 inline mx-1">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
                تاريخ التسليم{" "}
              </p>
              <p className="font-black my-1">
                {result.delivery.endDate.split("T")[0]}
              </p>
            </div>

            <div className="border-s px-1">
              {" "}
              <p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 inline mx-1">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                المدة
              </p>
              <p className="font-black my-1">
                {" "}
                {Math.abs(days)} ايام {Math.abs(hours)} ساعات
              </p>
            </div>
            <div className="border-s px-1">
              {" "}
              <p>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 mx-1 inline">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 12a2.25 2.25 0 0 0-2.25-2.25H15a3 3 0 1 1-6 0H5.25A2.25 2.25 0 0 0 3 12m18 0v6a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 9m18 0V6a2.25 2.25 0 0 0-2.25-2.25H5.25A2.25 2.25 0 0 0 3 6v3"
                  />
                </svg>
                الحساب اليومي
              </p>
              <p className="font-black my-1">{result.delivery.pricePerDay}</p>
            </div>
          </div>
          <div className="bg-[#FFFDFA] border border-warning text-warning px-3 py-3 rounded-2xl">
            <h1>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 mx-1 inline">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                />
              </svg>
              ملاحظات التعامل
            </h1>
            <div>
              {result.delivery.checklist ? (
                <div className="flex flex-wrap gap-2 mt-2">
                  {result.delivery.checklist.map((c: any, i: any) => (
                    <div
                      key={i}
                      className="badge text-[#AC7825] bg-[#FDF6EA] rounded-2xl">
                      {c}
                    </div>
                  ))}
                </div>
              ) : (
                <p></p>
              )}
            </div>
            <p className="text-black my-2 break-words">
              {result.delivery.handlingNotes}
            </p>
          </div>
        </div>
        <div className="w-full lg:w-96 flex flex-col gap-4">
          <div className="border border-gray-400 rounded-2xl">
            <div className="text-white bg-linear-to-r to-brand-mid from-brand-primary rounded-t-2xl px-4 py-2 mb-3">
              <p>الإجراء المطلوب الآن</p>
              <p className="font-black my-1 break-words">
                {isOwnerToRenter
                  ? "استلام المنتج من المالك"
                  : "استلام المنتج من المستأجر"}
              </p>
              <p className="break-words">
                {isOwnerToRenter
                  ? "توجّه إلى عنوان المالك واستلم المنتج بعد فحصه"
                  : "توجّه إلى عنوان المستأجر واستلم المنتج بعد فحصه"}
              </p>
            </div>
            <div className="flex gap-4 px-4 py-2">
              <div className="bg-brand-light text-brand-primary px-2 py-2 rounded-xl shrink-0 self-start">
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
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
              </div>
              <div className="min-w-0">
                <p>
                  {isOwnerToRenter
                    ? "موعد الاستلام المجدول"
                    : "موعد الإرجاع المجدول"}
                </p>
                <p className="font-black break-words">
                  {isOwnerToRenter
                    ? startDate
                    : formatEgyptArabicDate(result.delivery.endDate)}
                </p>
              </div>
            </div>
          </div>
          <div className="border border-gray-400 px-3 py-3 rounded-2xl">
            <h3 className="font-black mb-3">ملخص مالي</h3>
            <div className="flex flex-wrap justify-between gap-2">
              <p>سعر التأمين</p>
              <p className="font-black">{result.delivery.insuranceAmount}</p>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <p> باقي الحساب</p>
              <p className="font-black"> {result.delivery.remainingAmount}</p>
            </div>
            <div className="flex flex-wrap justify-between gap-2">
              <p> نسبة المنصة (5%)</p>
              <p className="font-black">{result.delivery.commissionFee}</p>
            </div>
            <div className="flex flex-wrap justify-between gap-2 text-brand-primary bg-gray-50 rounded-xl px-2 py-2 my-1">
              <p className="font-black"> الاجمالي</p>
              <p className="font-black">{totalFees}ج.م </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 my-5">
        {/* Owner Info */}
        <div className="card w-full md:w-1/2 bg-base-100 card-lg shadow-sm px-3">
          <div className="flex flex-wrap justify-between gap-2 my-3 ">
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8 bg-brand-light text-brand-primary rounded-full py-1 inline mx-1">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                />
              </svg>
              معلومات المالك
            </p>
            <p className="badge text-brand-primary bg-brand-light ">
              الاستلام أولاً
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="avatar">
              {result?.delivery?.ownerImage ? (
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                  <Image
                    src={result.delivery.ownerImage}
                    alt="userImage"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="avatar avatar-placeholder">
                  <div className="bg-brand-primary text-neutral-content w-16 rounded-full">
                    <span className="text-2xl">
                      {result.delivery.ownerName[0]}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <p className="break-words">{result.delivery.ownerName}</p>
          </div>
          <div className="flex flex-wrap gap-2 my-1">
            <p className="flex items-center gap-1 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 inline">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>{" "}
              الهاتف{" "}
            </p>
            <p className="break-words">{result.delivery.ownerPhoneNumber}</p>
          </div>
          <div className="flex flex-wrap gap-2 my-1">
            <p className="flex items-center gap-1 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 inline">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              العنوان
            </p>
            <p className="break-words">
              شارع {result.delivery.ownerLocation?.street}، مبني رقم{" "}
              {result.delivery.ownerLocation?.building}، دور{" "}
              {result.delivery.ownerLocation?.floor}، علامة مميزة{" "}
              {result.delivery.ownerLocation?.mark}
            </p>
          </div>
          <a
            href={`tel:${result.delivery.ownerPhoneNumber}`}
            className="btn bg-white py-2 my-2 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 inline">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>{" "}
            اتصال{" "}
          </a>
        </div>
        {/* renter Info */}
        <div className="card w-full md:w-1/2 bg-base-100 card-lg shadow-sm px-3 ">
          <div className="flex flex-wrap justify-between gap-2 my-3">
            <p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8 bg-brand-light text-brand-primary rounded-full py-1 inline mx-1">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"
                />
              </svg>
              معلومات المستأجر
            </p>
            <p className="badge text-brand-primary bg-brand-light ">
              {" "}
              التسليم لاحقا
            </p>
          </div>
          <div className="flex gap-3 items-center">
            <div className="avatar">
              {result?.delivery?.renterImage ? (
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                  <Image
                    src={result.delivery.renterImage}
                    alt="userImage"
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="avatar avatar-placeholder">
                  <div className="bg-brand-primary text-neutral-content w-16 rounded-full">
                    <span className="text-2xl">
                      {result.delivery.renterName[0]}
                    </span>
                  </div>
                </div>
              )}
            </div>
            <p className="break-words">{result.delivery.renterName}</p>
          </div>
          <div className="flex flex-wrap gap-2 my-1">
            <p className="flex items-center gap-1 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 inline">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
                />
              </svg>{" "}
              الهاتف{" "}
            </p>
            <p className="break-words">{result.delivery.renterPhoneNumber}</p>
          </div>
          <div className="flex flex-wrap gap-2 my-1">
            <p className="flex items-center gap-1 shrink-0">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-4 inline">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                />
              </svg>
              العنوان
            </p>
            <p className="break-words">
              شارع {result.delivery.renterLocation.street}، مبني رقم{" "}
              {result.delivery.renterLocation.building}، دور{" "}
              {result.delivery.renterLocation.floor}، علامة مميزة{" "}
              {result.delivery.renterLocation.mark}
            </p>
          </div>
          <a
            href={`tel:${result.delivery.renterPhoneNumber}`}
            className="btn bg-white py-2 my-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-4 inline">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z"
              />
            </svg>{" "}
            اتصال{" "}
          </a>
        </div>
      </div>
    </div>
  );
}
