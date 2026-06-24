import Footer from "@/app/_components/Landing/Footer";
import Navbar from "@/app/_components/Landing/Navbar";
import ProductsClient from "@/Modules/User/Features/products/components/ProductsClient";
import {
  AIProductRecommendation,
  getProductsAction,
} from "@/Modules/User/Features/products/services/products.actions";
import { GetProductsParams } from "@/modules/user/features/products/types/products.typs";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;

  const params: GetProductsParams = {
    page: sp.page ? Number(sp.page) : 1,
    limit: sp.limit ? Number(sp.limit) : 12,
    period: (sp.period as GetProductsParams["period"]) ?? undefined,
    minPrice: sp.minPrice ? Number(sp.minPrice) : undefined,
    maxPrice: sp.maxPrice ? Number(sp.maxPrice) : undefined,
    condition: sp.condition as GetProductsParams["condition"],
    category: sp.category,
    search: sp.search,
  };

  const result = await getProductsAction(params);
  const resultAI = await AIProductRecommendation();
  // console.log(resultAI.data.recommendations, "uuuu");
  //console.log(resultAI, "uuuu");

  return (
    <>
      <ProductsClient
        initialResult={result}
        initialParams={params}
        AiProducts={resultAI.data.recommendations}
      />
    </>
  );
}
