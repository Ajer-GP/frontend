import React from "react";
import Image from "next/image";
import type { Product } from "@/modules/user/features/products/types/products.typs";
export default async function Product({ data }: { data: Product }) {
  const ProductInfo = data;
  return (
    <div className="flex my-10 mx-10">
      <div className="flex flex-col">
        <Image
          src={ProductInfo.coverImage.url}
          alt="product image"
          width={100}
          height={100}
          className="border border-gray-500 rounded-2xl w-100"
        />
        <div className=" flex gap-4 my-3 ">
          {ProductInfo.images?.map((img, i: number) => (
            <Image
              key={i}
              src={img.url}
              alt="product image"
              width={100}
              height={100}
              className="border border-gray-500 rounded-2xl w-31"
            />
          ))}
        </div>
      </div>
      <div className="mx-3">
        <h1 className="text-3xl font-black ">{ProductInfo.title}</h1>
        <div className="border border-gray-300 bg-gray-50 px-3 py-3 rounded-2xl">
          <div className="flex justify-between">
            <p className="px-2 py-2 text-xl text-gray-500">سعر الايجار</p>
            <div className="bg-brand-light rounded-4xl px-2 py-2 text-brand-primary flex gap-1 text-body-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z"
                />
              </svg>
              سعر ذكي بتقييم الذكاء الاصطناعي
            </div>
          </div>
          <div className="flex gap-3">
            <div className="flex flex-col px-2 py-2 w-40 h-30 border border-gray-400 my-2 rounded-xl items-center justify-center">
              <p className="text-gray-600 font-black">ساعة</p>
              <h1 className="text-gray-500">
                {" "}
                <strong className="font-black text-brand-primary text-2xl">
                  {ProductInfo.pricePerHour}ج.م
                </strong>
                /ساعة
              </h1>
            </div>
            <div className="flex flex-col px-2 py-2 w-40 h-30 border border-gray-400 my-2 rounded-xl items-center justify-center">
              <p className="text-gray-600 font-black">يوم</p>
              <h1 className="text-gray-500">
                {" "}
                <strong className="font-black text-brand-primary text-2xl">
                  {ProductInfo.pricePerDay}ج.م
                </strong>
                /يوم
              </h1>
            </div>
            <div className="flex flex-col px-2 py-2 w-40 h-30 border border-gray-400 my-2 rounded-xl items-center justify-center">
              <p className="text-gray-600 font-black">اسبوع</p>
              <h1 className="text-gray-500">
                {" "}
                <strong className="font-black text-brand-primary text-2xl">
                  {ProductInfo.pricePerWeek}ج.م
                </strong>
                /اسبوع
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
