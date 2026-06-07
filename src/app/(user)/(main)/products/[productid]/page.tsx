import Footer from "@/app/_components/Landing/Footer";
import Navbar from "@/app/_components/Landing/Navbar";
import Details from "@/app/_components/ProductDetails/Details";
import How_it_works from "@/app/_components/ProductDetails/How-it-works";
import Owner from "@/app/_components/ProductDetails/Owner";
import Product from "@/app/_components/ProductDetails/Product";
import ReturnRefundPolicy from "@/app/_components/ProductDetails/ReturnRefundPolicy";
import UsersReviews from "@/app/_components/ProductDetails/UsersReviews";
import { getProductByIdAction } from "@/Modules/User/Features/products/services/products.actions";

export default async function page({
  params,
}: {
  params: Promise<{ productid: string }>;
}) {
  const { productid } = await params;
  const result = await getProductByIdAction(productid);
  const data = result.data.product;
  // console.log(data);
  return (
    <div dir='rtl' className=''>
      <Navbar />
      <Product data={data} />
      <div className='flex flex-col gap-4 my-8 mx-4 sm:mx-8 lg:mx-10'>
        <h1 className='text-2xl sm:text-3xl lg:text-4xl font-black'>
          احجز إيجارك بسهولة
        </h1>
        <p className='text-gray-500 my-2'>
          اختار التواريخ وشوف تفاصيل السعر بشكل واضح ومباشر، علشان تعرف بالظبط
          هتدفع كام النهارده.
        </p>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {/* Rental period card */}
          <div className='card bg-white card-xl shadow-sm'>
            <div className='card-body'>
              <h2 className='card-title'>اختار مدة الإيجار</h2>
              <p>تحديثات مباشرة للسعر أثناء تعديل مدة الإيجار.</p>
              <div className='flex flex-col sm:flex-row gap-2'>
                <div className='flex-1'>
                  <p className='my-2 mx-2 text-gray-400'>تاريخ البداية</p>
                  <input
                    type='date'
                    className='input w-full border border-gray-300 bg-gray-50 rounded-xl'
                  />
                </div>
                <div className='flex-1'>
                  <p className='my-2 mx-2 text-gray-400'>تاريخ الارجاع</p>
                  <input
                    type='date'
                    className='input w-full border border-gray-300 bg-gray-50 rounded-xl'
                  />
                </div>
              </div>
              <div className='flex justify-between border border-brand-primary rounded-xl px-3 py-3'>
                <div className='flex gap-1'>
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
                      d='M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z'
                    />
                  </svg>
                  <p className='text-brand-primary'>مدة الايجار</p>
                </div>
                <div>
                  {" "}
                  <p className='text-brand-primary font-black'>3 أيام</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cost breakdown card */}
          <div className='card bg-white card-xl shadow-sm'>
            <div className='card-body'>
              <h2 className='card-title'>تفاصيل تكلفة الايجار</h2>
              <div className='flex justify-between'>
                <span className='text-gray-400'>سعر الايجار(3 أيام)</span>
                <span>300</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>سعر التأمين</span>
                <span>300</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>سعر التوصيل</span>
                <span>300</span>
              </div>
              <div className='flex justify-between'>
                <span className='text-gray-400'>نسبة المنصة (2%)</span>
                <span>300</span>
              </div>
              <div className='flex justify-between bg-gray-100 rounded-3xl px-4 py-1 my-1'>
                <span className='text-brand-primary'>الاجمالي</span>
                <span className='text-brand-primary font-black'>300</span>
              </div>
              <button className='btn bg-brand-primary rounded-3xl text-white w-full'>
                أجر الآن
              </button>
            </div>
          </div>
        </div>
      </div>
      <Details data={data} />
      <Owner data={data} />
      <How_it_works />
      <ReturnRefundPolicy />
      <UsersReviews data={data} />
      <Footer />
    </div>
  );
}
