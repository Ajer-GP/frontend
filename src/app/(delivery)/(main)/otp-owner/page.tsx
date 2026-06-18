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
  // const { taskId } = await params;
  // const result = await getDeliveryById(taskId);
  // const task = result.delivery;
  return (
    <div>
      {/* menu top  */}
      <div className="breadcrumbs text-sm overflow-x-auto">
        <ul>
          <li>
            <Link href="/dashboard">الرئيسية</Link>
          </li>
          <li className="break-all">{}</li>
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
              {/* <span className="text-white break-all">{taskId}</span>{" "} */}
            </p>
            <p className="text-lg">التسليم للمستأجر</p>
            <p className="text-caption">
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
      <div className="grid grid-cols-2 gap-3">
        <div className="border border-gray-300 rounded-2xl px-4 py-4 ">
          <h1 className="font-black text-xl my-3">التحقق من رمز التسليم</h1>
          <OTPInputs />
        </div>
        <div className="border border-gray-400 px-3 py-3 rounded-2xl w-full lg:flex-1">
          <h1 className="font-black text-xl">ملخص الطلب</h1>
          <div className="flex flex-col sm:flex-row gap-3 items-center sm:items-start my-4 text-center sm:text-start">
            {/* <Image
                     loading="eager"
                     src={result.delivery.productCoverImage}
                     alt="productImage"
                     height={120}
                     width={120}
                     className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border border-gray-500 object-cover shrink-0"
                   /> */}

            <div className="w-full min-w-0">
              <div className="badge bg-gray-200 text-gray-500 rounded-2xl">
                {/* {result.delivery.productName}{" "} */}
              </div>
              <h1 className="font-bold text-lg sm:text-xl break-words">
                {/* {result.delivery.productTitle} */}
              </h1>
              {/* <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-2">
                       {result.delivery.type === "from_owner_to_renter" ? (
                         <div>
                           {/* {result?.delivery?.ownerImage ? (
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
                           )} */}
              {/* </div>
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
                       )} */}
              {/* <div>
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
                       </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
