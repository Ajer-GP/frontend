import React from "react";
import Image from "next/image";
export default async function Owner(data) {
  const owner = data.data.owner;
  return (
    <div className='my-10 mx-10'>
      <h1 className='text-2xl font-black my-4'>نبذة عن المالك</h1>
      <div className='flex gap-2 items-center px-4 py-4 border border-gray-400 bg-gray-50 rounded-2xl'>
        <div>
          <Image
            src={owner.profileImage.url}
            alt='user image'
            width={150}
            height={150}
            className='rounded-full'
          />
        </div>
        <div className='flex justify-between w-100'>
          <div>
            {" "}
            <h1 className='font-black text-xl py-2'>{owner.fullName}</h1>
          </div>{" "}
          {owner.isVerified ? (
            <div className='flex text-brand-primary px-2 bg-brand-light py-2 rounded-3xl'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                fill='none'
                viewBox='0 0 24 24'
                strokeWidth={1.5}
                stroke='currentColor'
                className='size-6'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z'
                />
              </svg>{" "}
              مالك موثوق{" "}
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
    </div>
  );
}
