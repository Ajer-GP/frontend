import React from "react";
import Image from "next/image";
import Link from "next/link";

export default async function Owner(data) {
  const owner = data.data.owner;
  return (
    <div className='my-10 mx-10'>
      <h1 className='text-2xl font-black my-4'>نبذة عن المالك</h1>
      <div className='flex flex-col gap-4 px-4 py-4 border border-gray-400 bg-gray-50 rounded-2xl'>
        {/* Top row */}
        <div className='flex gap-3 items-center'>
          <Image
            src={owner.profileImage.url}
            alt='user image'
            width={80}
            height={80}
            className='rounded-full object-cover'
          />
          <div className='flex flex-col gap-2'>
            {/* Name + badge */}
            <div className='flex items-center gap-2'>
              <h1 className='font-black text-xl'>{owner.fullName}</h1>
              {owner.isVerified ? (
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

            {/* Rating — under the name, not under the image */}
            {owner.rating > 0 ? (
              <div className='flex items-center gap-1 font-black text-sm'>
                {owner.rating}
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
            ) : (
              <p className='text-sm text-gray-500'>لا يوجد تصنيف بعد</p>
            )}
          </div>

          {/* Left: profile image */}
        </div>

        {/* Bottom: full-width button */}
        <Link
          href='/user/profile'
          className='btn bg-brand-primary rounded-3xl w-100 text-white text-center'>
          شاهد الحساب
        </Link>
      </div>
    </div>
  );
}
