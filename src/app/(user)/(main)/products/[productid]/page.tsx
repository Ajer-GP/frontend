import Footer from "@/app/_components/Landing/Footer";
import Details from "@/app/_components/ProductDetails/Details";
import How_it_works from "@/app/_components/ProductDetails/How-it-works";
import Owner from "@/app/_components/ProductDetails/Owner";
import Product from "@/app/_components/ProductDetails/Product";
import ReturnRefundPolicy from "@/app/_components/ProductDetails/ReturnRefundPolicy";
import UsersReviews from "@/app/_components/ProductDetails/UsersReviews";
import { getProductByIdAction } from "@/Modules/User/Features/products/services/products.actions";
import RentNow from "@/app/_components/ProductDetails/RentNow";
export default async function page({
  params,
}: {
  params: Promise<{ productid: string }>;
}) {
  const { productid } = await params;
  const result = await getProductByIdAction(productid);
  const data = result.data.product;
  console.log(data);
  return (
    <div dir='rtl' className=''>
      <Product data={data} />
      <RentNow data={data} />
      <Details data={data} />
      <Owner data={data} />
      <How_it_works />
      <ReturnRefundPolicy />
      <UsersReviews data={data} />
      <Footer />
    </div>
  );
}
