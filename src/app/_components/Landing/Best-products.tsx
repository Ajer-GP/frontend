import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import {
  getProductsAction,
  AIProductRecommendation,
} from "@/Modules/User/Features/products/services/products.actions";
import { CATEGORY_LABELS } from "../ProductDetails/handlingDetails";

const conditionConfig = {
  excellent: { color: "bg-green-100 text-green-700", label: "ممتاز" },
  good: { color: "bg-yellow-100 text-yellow-700", label: "جيد" },
  fair: { color: "bg-gray-200 text-gray-600", label: "مقبول" },
};

function ProductCard({ product }: { product: any }) {
  const condition =
    conditionConfig[
      product.condition?.toLowerCase() as keyof typeof conditionConfig
    ];

  return (
    <div className="card bg-white shadow-sm my-2 w-full">
      <figure>
        <div className="relative w-full">
          <Image
            src={product.coverImage.url}
            alt="product"
            width={400}
            height={200}
            className="w-full h-48 object-cover"
          />
          <span
            className={`px-2 py-1 rounded-full text-sm absolute top-4 left-2 badge ${
              condition?.color ?? "bg-gray-100 text-gray-700"
            }`}>
            {condition?.label ?? product.condition}
          </span>
        </div>
      </figure>
      <div className="card-body">
        <p className="text-gray-400">
          {CATEGORY_LABELS[product.category] ?? product.category}
        </p>
        <div className="flex justify-between items-start gap-2">
          <h2 className="card-title text-base">{product.title}</h2>
          <div className="badge bg-[#FDF6E9] border-[#FDF6E9] text-black shrink-0">
            {product.rating || 0}
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
            {product.pricePerDay}ج.م
          </span>
          /يوم
        </h2>
        <div className="card-actions">
          <Link
            href={`/products/${product._id}`}
            className="btn bg-white w-full border-brand-primary rounded-xl text-brand-primary shadow-none">
            اعرف المزيد
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function Best_products() {
  let title = "";
  const cookieStore = await cookies();
  const isLoggedIn = !!(
    cookieStore.get("access_token")?.value ||
    (cookieStore.get("refresh_token")?.value && cookieStore.get("user")?.value)
  );

  const result = await getProductsAction();
  if (!result.success) return <div>حدث خطأ في تحميل المنتجات</div>;

  let products: any[] = [];
  title = "اكتشف أحدث المنتجات المضافة";
  if (isLoggedIn) {
    const ai = await AIProductRecommendation();
    if (ai?.data?.recommendations?.length) {
      title = "اكتشف منتجات تم اختيارها بناءً علي اهتماماتك";
      products = ai.data.recommendations
        .slice(0, 3)
        .map(({ product }: { product: any }) => product);
    }
  }

  // Fallback to regular products if not logged in or AI returned nothing
  if (products.length === 0) {
    products = result.data.result.products.slice(0, 3);
  }

  return (
    <div className="flex flex-col justify-center items-center px-4 sm:px-6 md:px-14 mb-10">
      <div className="badge badge-md mt-5 mb-1 p-4 font-black rounded-3xl bg-brand-light border-brand-light text-brand-primary">
        منتجات مختارة لك
      </div>
      <h1 className="text-2xl sm:text-3xl font-black mt-1 mb-4 text-center">
        {title}
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
}
