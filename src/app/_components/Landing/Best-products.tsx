import React from "react";
import Image from "next/image";
import Link from "next/link";
import { getProductsAction } from "@/Modules/User/Features/products/services/products.actions";

export default async function Best_products() {
  const result = await getProductsAction();
  if (!result.success) return <div>حدث خطأ في تحميل المنتجات</div>;
  const data = result.data.result.products;

  return (
    <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-14 mb-10">
      <div className="badge badge-md mt-5 mb-1 p-4 font-black rounded-3xl bg-brand-light border-brand-light text-brand-primary">
        منتجات مختارة لك
      </div>
      <h1 className="text-2xl sm:text-3xl font-black mt-1 mb-4 text-center">
        اكتشف منتجات تم{" "}
        <strong className="text-brand-primary">اختيارها </strong> بناءً علي
        &nbsp;
        <strong className="text-brand-primary">اهتماماتك </strong>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {data.slice(0, 3).map((prd, i) => (
          <div key={i} className="card bg-white shadow-sm my-2 w-full">
            <figure>
              <div className="relative w-full">
                <Image
                  src={prd.coverImage.url}
                  alt="product"
                  width={400}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-4 left-2 badge badge-sm text-accent-default bg-[#FDF6E9] border-[#FDF6E9] font-black">
                  جديد
                </span>
              </div>
            </figure>
            <div className="card-body">
              <p className="text-gray-400">{prd.category}</p>
              <div className="flex justify-between items-start gap-2">
                <h2 className="card-title text-base">{prd.title}</h2>
                <div className="badge bg-[#FDF6E9] border-[#FDF6E9] font-black text-black shrink-0">
                  {prd.rating}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    className="size-4 text-warning">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                    />
                  </svg>
                </div>
              </div>
              <h2 className="my-1">
                <span className="text-2xl sm:text-3xl text-brand-primary font-black">
                  {prd.pricePerDay}ج.م
                </span>
                /يوم
              </h2>
              <div className="card-actions">
                <Link
                  href={`/products/${prd._id}`}
                  className="btn bg-white w-full border-brand-primary rounded-xl text-brand-primary shadow-none">
                  اعرف المزيد
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
