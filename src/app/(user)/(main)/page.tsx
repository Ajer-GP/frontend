import Best_products from "@/app/_components/Landing/Best-products";
import Categories from "@/app/_components/Landing/Categories";
import Common_questions from "@/app/_components/Landing/Common-questions";
import Hero from "@/app/_components/Landing/Hero";
import How_it_works from "@/app/_components/Landing/How-it-works";
import Reviews from "@/app/_components/Landing/Reviews";
import Why_us from "@/app/_components/Landing/why-us";

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <How_it_works />
      <Best_products />
      <Why_us />
      <Reviews />
      <Common_questions />
    </>
  );
}
