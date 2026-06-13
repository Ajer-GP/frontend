import OrdersClient from "@/Modules/User/Features/Rent/components/OrdersClient";
import { redirect } from "next/navigation";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const userCookie = cookieStore.get("user")?.value;
  console.log(userCookie);

  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
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

  return (
    <OrdersClient initialOrders={data.rentals} currentUserId={user?._id} />
  );
}
