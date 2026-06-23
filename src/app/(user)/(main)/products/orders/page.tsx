import OrdersClient from "@/Modules/User/Features/Rent/components/OrdersClient";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getTokenOrRefresh } from "@/Modules/User/lib/getTokenOrRefresh";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
  const token = await getTokenOrRefresh();
  // 1. جيبي الـ list
  const res = await fetch(`${process.env.API_BASE_URL}/requests`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = res.ok ? await res.json() : { rentals: [] };
  const rentals: { _id: string }[] = data.rentals ?? [];

  const detailed = await Promise.all(
    rentals.map((r) =>
      fetch(`${process.env.API_BASE_URL}/requests/${r._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }).then((res) => res.json()),
    ),
  );

  const fullRentals = detailed
    .filter((d) => d.status === "success")
    .map((d) => d.rental);
  return <OrdersClient initialOrders={fullRentals} currentUserId={user?._id} />;
}
