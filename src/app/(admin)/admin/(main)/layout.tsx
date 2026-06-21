import Navbar from "@/Modules/Admin/components/Navbar";
import Sidebar from "@/Modules/Admin/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" dir="rtl">
      <Sidebar />

      <div className="md:mr-64 pb-20 md:pb-0 flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
