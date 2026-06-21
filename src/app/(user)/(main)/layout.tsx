// app/(main)/layout.tsx

import Footer from "@/app/_components/Landing/Footer";
import Navbar from "@/app/_components/Landing/Navbar";
import { Toaster } from "sonner";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <main>
        <Toaster position="top-center" />
        {children}
      </main>
      <footer>
        <Footer />
      </footer>
    </>
  );
}
