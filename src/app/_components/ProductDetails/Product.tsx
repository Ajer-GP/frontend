import React from "react";
import Image from "next/image";
import type { Product } from "@/modules/user/features/products/types/products.typs";
export default async function Product({ data }: { data: Product }) {
  const ProductInfo = data;
  return (
    <div className='flex my-10 mx-10'>
      <div className='flex flex-col'>
        <Image
          src={ProductInfo.coverImage.url}
          alt='product image'
          width={100}
          height={100}
          className='border border-gray-500 rounded-2xl w-100'
        />
        <div className=' flex gap-4 my-3 '>
          {ProductInfo.images?.map((img, i: number) => (
            <Image
              key={i}
              src={img.url}
              alt='product image'
              width={100}
              height={100}
              className='border border-gray-500 rounded-2xl w-20 md:w-31 shrink-0 object-cover'
            />
          ))}
        </div>
      </div>

      {/* Info Section */}
      <div className='flex flex-col flex-1 min-w-0'>
        {/* Badges */}
        <div className='flex gap-2 flex-wrap mb-2'>
          {ProductInfo.condition === "excellent" ? (
            <div className='badge text-warning bg-accent-light rounded-2xl'>
              ممتاز
            </div>
          ) : (
            <div className='badge text-warning bg-accent-light rounded-2xl'>
              {ProductInfo.condition}
            </div>
          )}
          <div className='badge bg-gray-200 rounded-2xl'>
            {ProductInfo.category}
          </div>
        </div>

        {/* Title */}
        <h1 className='text-2xl md:text-3xl font-black mb-4'>
          {ProductInfo.title}
        </h1>
        <div className='flex gap-2 my-2'>
          <div className='px-2 py-1'>location</div>
          {ProductInfo.rating == null ? (
            <div className='flex items-center px-2 py-1 text-sm'>
              لا يوجد تقيم لهذا المنتج{" "}
            </div>
          ) : (
            <div className='flex items-center px-2 py-1 text-sm '>
              {ProductInfo.rating}
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 24 24'
                className='size-4 text-warning'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z'
                />
              </svg>
            </div>
          )}
          <div className='flex px-2 py-1 text-sm items-center'>
            {ProductInfo.successfulRentals} عملية ايجار ناجحة{" "}
          </div>
          <div className='px-2 py-1'>
            {ProductInfo.owner.isVerified ? (
              <div className='flex items-center gap-1 text-brand-primary px-2 py-1 bg-brand-light rounded-3xl text-sm'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width={14}
                  height={14}
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                  <path d='M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3' />
                  <path d='M9 12l2 2l4 -4' />
                </svg>
                مالك موثوق
              </div>
            ) : (
              <div className='flex items-center gap-1 text-danger px-2 py-1 bg-danger-bg rounded-3xl text-sm'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  width={14}
                  height={14}
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                  <path d='M12.277 20.925c-.092 .026 -.184 .051 -.277 .075a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3a12 12 0 0 0 8.5 3a12 12 0 0 1 .145 6.232' />
                  <path d='M16 19a3 3 0 1 0 6 0a3 3 0 1 0 -6 0' />
                  <path d='M17 21l4 -4' />
                </svg>
                لم يوثق بعد
              </div>
            )}
          </div>
        </div>
        {/* Pricing Card */}
        <div className='border border-gray-300 bg-gray-50 px-3 py-3 rounded-2xl'>
          <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-2'>
            <p className='px-2 py-2 text-xl text-gray-500'>سعر الايجار</p>
            <div className='bg-brand-light rounded-4xl px-2 py-2 text-brand-primary flex gap-1 text-body-sm items-center self-start sm:self-auto'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-5 shrink-0'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z'
                />
              </svg>
              سعر ذكي بتقييم الذكاء الاصطناعي
            </div>
          </div>

          {/* Price Cards */}
          <div className='grid grid-cols-3 gap-2 md:gap-3'>
            {[
              { label: "ساعة", price: ProductInfo.pricePerHour, unit: "ساعة" },
              { label: "يوم", price: ProductInfo.pricePerDay, unit: "يوم" },
              {
                label: "اسبوع",
                price: ProductInfo.pricePerWeek,
                unit: "اسبوع",
              },
            ].map(({ label, price, unit }) => (
              <div
                key={unit}
                className='flex flex-col px-2 py-2 border border-gray-400 my-1 md:my-2 rounded-xl items-center justify-center min-h-[80px] md:h-30 hover:bg-brand-light hover:border hover:border-brand-primary'>
                <p className='text-gray-800 font-black md:text-base'>{label}</p>
                <p className='text-gray-500 text-center text-xs md:text-base'>
                  <strong className='font-black text-brand-primary text-lg md:text-2xl block'>
                    {price}ج.م
                  </strong>
                  /{unit}
                </p>
              </div>
            ))}
          </div>
          <div className=' flex justify-between border border-blue-950 bg-blue-100 rounded-xl px-2 py-3 my-2'>
            <div className='flex gap-1'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width={24}
                height={24}
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
                className='icon icon-tabler icons-tabler-outline icon-tabler-shield text-blue-950'>
                <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                <path d='M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3' />
              </svg>
              <p>مبلغ االتأمين يسترد بالكامل</p>
            </div>{" "}
            <p className='font-black'>{ProductInfo.insuranceAmount} ج.م</p>
          </div>
        </div>
      </div>
    </div>
  );
}
