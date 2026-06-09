// app/(main)/layout.tsx

import Footer from "@/app/_components/Landing/Footer";
import Navbar from "@/app/_components/Landing/Navbar";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserFromCookies();

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
