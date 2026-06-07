// app/(main)/layout.tsx

import Footer from "@/app/_components/Landing/Footer";
import Navbar from "@/app/_components/Landing/Navbar";
import { UserProvider } from "@/app/_context/UserContext";
async function getUserFromCookies() {
  try {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("user");
    if (userCookie?.value) {
      return JSON.parse(userCookie.value);
    }
    return null;
  } catch {
    return null;
  }
}
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserProvider initialUser={getUserFromCookies()}>
      <nav>
        <Navbar />
      </nav>
      <main>{children}</main>
      <footer>
        <Footer />
      </footer>
    </UserProvider>
  );
}
