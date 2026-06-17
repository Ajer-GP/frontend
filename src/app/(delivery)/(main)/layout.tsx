import DashboardSidebar from "@/app/_components/delivery/DashboardSidebar";
import DashboardTopbar from "@/app/_components/delivery/DashboardTopbar";
import { cookies } from "next/headers";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const data = getDashboardData();

  return (
    <div className="min-h-screen " dir="rtl">
      <DashboardSidebar activeHref="/dashboard" />
      <div className="mr-64 flex flex-col min-h-screen">
        {/* <DashboardTopbar
        // driverName={data.driverName}
        // taskCount={data.currentTasks}
        /> */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
