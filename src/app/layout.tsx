import type { Metadata } from "next";
import { cookies } from "next/headers";
import "./globals.css";
import { Inter, IBM_Plex_Sans_Arabic, JetBrains_Mono } from "next/font/google";
import { UserProvider } from "./_context/UserContext";

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600"],
  variable: "--font-arabic",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  icons: { icon: "/images/logo.png" },
  title: "Ajer Website",
  description: "help people to rent tools",
};

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getUserFromCookies();

  return (
    <html
      lang='ar'
      dir='rtl'
      className={`${ibmPlexSansArabic.variable}  h-full antialiased`}>
      <body className='min-h-full flex flex-col'>
        <UserProvider initialUser={initialUser}>{children}</UserProvider>
      </body>
    </html>
  );
}
