import Footer from "@/app/_components/Landing/Footer";
import Details from "@/app/_components/ProductDetails/Details";
import How_it_works from "@/app/_components/ProductDetails/How-it-works";
import Owner from "@/app/_components/ProductDetails/Owner";
import Product from "@/app/_components/ProductDetails/Product";
import ReturnRefundPolicy from "@/app/_components/ProductDetails/ReturnRefundPolicy";
import UsersReviews from "@/app/_components/ProductDetails/UsersReviews";
import { getProductByIdAction } from "@/modules/user/features/products/services/products.actions";
import RentNow from "@/app/_components/ProductDetails/RentNow";
import Checklist from "@/app/_components/ProductDetails/Checklist";
import Link from "next/link";
export default async function page({
  params,
}: {
  params: Promise<{ productid: string }>;
}) {
  const { productid } = await params;
  const result = await getProductByIdAction(productid);

  if (!result.success)
    return <div>حدث خطأ في تحميل المنتج , {result.error}</div>;

  const data = result.data.product;

  // if (!result.success)
  //   return <div>حدث خطأ في تحميل المنتج , {result.error}</div>;
  // const res = result.data;
  // const data = res.product;

  // console.log(data, "ppp");

  return (
    <div dir="rtl" className="">
      <div className="breadcrumbs text-sm max-w-7xl mx-8 my-4 px-4 py-2.5 text-[#676767]">
        <ul>
          <li className="font-medium text-[20px]">
            <Link href="/">الرئيسية</Link>
          </li>
          <li className="font-medium text-[20px]">
            <Link href="/products">الفئات</Link>
          </li>
          <li className="font-medium text-[20px]">{data.name}</li>
        </ul>
      </div>
      <Product data={data} />
      <RentNow data={data} />
      <Details data={data} />
      <Checklist data={data} />
      <Owner data={data} />
      <How_it_works />
      <ReturnRefundPolicy />
      <UsersReviews data={data} />
    </div>
  );
}
