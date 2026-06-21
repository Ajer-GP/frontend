import { cookies } from "next/headers";
import DashboardSidebar from "@/app/_components/delivery/DashboardSidebar";
import Navbar from "@/app/_components/delivery/Navbar";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const delivery = cookieStore.get("delivery")?.value;
  const deliveryData = delivery
    ? JSON.parse(decodeURIComponent(delivery))
    : null;

  return (
    <div className="min-h-screen" dir="rtl">
      <DashboardSidebar deliveryData={deliveryData} />

      <div className="md:mr-64 pb-20 md:pb-0 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
