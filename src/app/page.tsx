import Best_products from "./_components/Landing/Best-products";
import Categories from "./_components/Landing/Categories";
import Common_questions from "./_components/Landing/Common-questions";
import Footer from "./_components/Landing/Footer";
import Hero from "./_components/Landing/Hero";
import How_it_works from "./_components/Landing/How-it-works";
import Navbar from "./_components/Landing/Navbar";
import Reviews from "./_components/Landing/Reviews";
import Why_us from "./_components/Landing/why-us";

export default function Home() {
  return (
    <main dir='rtl'>
      <Navbar />
      <Hero />
      <Categories />
      <How_it_works />
      <Best_products />
      <Why_us />
      <Reviews />
      <Common_questions />
      <Footer />{" "}
    </main>
  );
}
