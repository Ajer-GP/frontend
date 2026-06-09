import React from "react";

export default function Details(data) {
  const product = data.data;
  return (
    <div className='mx-10'>
      <h1 className='text-2xl font-black my-4'> تفاصيل المنتج</h1>
      {/* name of each tab group should be unique */}
      <div className='tabs [--tab-bg:bg-gray-200] '>
        <input
          type='radio'
          name='my_tabs_2'
          className='tab rounded-3xl my-2 checked:bg-gray-100 checked:border checked:border-gray-300'
          aria-label='نبذة عن المنتج'
          defaultChecked
        />
        <div className='tab-content border-gray-300 bg-gray-50 p-10 rounded-2xl'>
          {product.description}{" "}
          <div className='flex my-5 gap-3'>
            <div className='card w-96 bg-gray-50 card-lg shadow-sm border border-gray-300 rounded-3xl'>
              <div className='card-body'>
                <h2 className='card-title'>العمر والحالة</h2>
                <div className='flex justify-between'>
                  <p>الحالة</p>
                  {product.condition == "excellent" ? (
                    <p>ممتازة</p>
                  ) : (
                    <p> {product.condition} </p>
                  )}
                </div>
                <div className='flex justify-between'>
                  <p>ظروف الاستخدام</p>
                  {product.usage ? (
                    <p>{product.usage}</p>
                  ) : (
                    <p>لا يوجد وصف لظروف الاستخدام </p>
                  )}
                </div>
              </div>
            </div>
            <div className='card w-96 bg-[#FFFDFA] card-lg shadow-sm border border-accent-default rounded-3xl'>
              <div className='card-body'>
                <h2 className='card-title text-accent-default'>
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
                    className='icon icon-tabler icons-tabler-outline icon-tabler-alert-triangle'>
                    <path stroke='none' d='M0 0h24v24H0z' fill='none' />
                    <path d='M12 9v4' />
                    <path d='M10.363 3.591l-8.106 13.534a1.914 1.914 0 0 0 1.636 2.871h16.214a1.914 1.914 0 0 0 1.636 -2.87l-8.106 -13.536a1.914 1.914 0 0 0 -3.274 0' />
                    <path d='M12 16h.01' />
                  </svg>
                  ملاحظات التعامل{" "}
                </h2>

                <p>{product.handlingNotes}</p>
              </div>
            </div>
          </div>
        </div>

        <input
          type='radio'
          name='my_tabs_2'
          className='tab rounded-3xl my-2 checked:bg-gray-100 checked:border checked:border-gray-300'
          aria-label='مواصفات'
        />
        <div className='tab-content border-gray-300 bg-gray-50 p-10 rounded-2xl'>
          {product.specs.map((spec, i) => (
            <div key={i} className='flex justify-between my-1'>
              <p className='text-gray-500'>{spec.label}</p>
              <p className='font-black'>{spec.value}</p>
            </div>
          ))}
        </div>

        <input
          type='radio'
          name='my_tabs_2'
          className='tab rounded-3xl my-2 checked:bg-gray-100 checked:border checked:border-gray-300'
          aria-label='مرفقات مع المنتج'
        />
        <div className=' tab-content border-gray-300 bg-gray-50 p-10 rounded-2xl'>
          <div className='flex flex-wrap'>
            {product.accessories.map((acc, i) => (
              <div
                key={i}
                className='flex gap-1 border border-brand-primary bg-white px-2 py-1 mx-3  my-1 rounded-xl text-brand-primary'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  fill='none'
                  viewBox='0 0 24 24'
                  strokeWidth={1.5}
                  stroke='currentColor'
                  className='size-6 text-brand-primary'>
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    d='M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z'
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
