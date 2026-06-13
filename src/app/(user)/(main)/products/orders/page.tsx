import OrdersClient from "@/modules/user/features/Rent/components/OrdersClient";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const user = cookieStore.get("user")?.value;
  if (!token) redirect("/auth/login");

  // جيبي اليوزر الحالي
  // const meRes = await fetch(`api/me`, {
  //   headers: { cookie: cookieStore.toString() },
  //   cache: "no-store",
  // });
  // const { user } = await meRes.json();

  // جيبي الأوردرات
  const res = await fetch(`${process.env.API_BASE_URL}/requests`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = res.ok ? await res.json() : { rentals: [] };

  return <OrdersClient initialOrders={data.rentals} currentUserId={user.id} />;
}
