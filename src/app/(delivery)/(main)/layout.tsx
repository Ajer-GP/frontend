import DashboardSidebar from "@/app/_components/delivery/DashboardSidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen" dir="rtl">
      <DashboardSidebar />

      {/* Desktop: push content left of sidebar. Mobile: add bottom padding for tab bar */}
      <div className="md:mr-64 pb-20 md:pb-0 flex flex-col min-h-screen">
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
