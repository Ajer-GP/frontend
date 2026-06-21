import DashboardStatistics from "@/Modules/Admin/components/DashboardStatistics";
import Link from "next/link";
import Rentals from "@/Modules/Admin/components/Rentals";

export default function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  return (
    <div>
      <div>
        <div className="breadcrumbs text-sm">
          <ul>
            <li>
              <Link href="/admin/dashboard">الرئيسية</Link>
            </li>
            <li>
              <Link href="admin/insurance">ادارة التأمينات</Link>
            </li>
          </ul>
        </div>
        <h1 className="font-black my-3 text-2xl">ادارة التأمينات</h1>
      </div>
      <DashboardStatistics />
      <Rentals searchParams={searchParams} />
    </div>
  );
}
