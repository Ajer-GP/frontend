import OrdersClient from "@/Modules/User/Features/Rent/components/OrdersClient";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function OrdersPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;
  const userCookie = cookieStore.get("user")?.value;
  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
  if (!token) redirect("/auth/login");

  // 1. جيبي الـ list
  const res = await fetch(`${process.env.API_BASE_URL}/requests`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  const data = res.ok ? await res.json() : { rentals: [] };
  const rentals: { _id: string }[] = data.rentals ?? [];
  // console.log("rentals:", JSON.stringify(rentals, null, 2));
  // 2. جيبي تفاصيل كل واحدة بالتوازي (populated)
  const detailed = await Promise.all(
    rentals.map((r) =>
      fetch(`${process.env.API_BASE_URL}/requests/${r._id}`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      }).then((res) => res.json()),
    ),
  );

  // console.log("detailed[0]:", JSON.stringify(detailed[0], null, 2)); // ← شوفي الشكل
  const fullRentals = detailed
    .filter((d) => d.status === "success")
    .map((d) => d.rental);
  // console.log("Full rentals:", fullRentals);
  return <OrdersClient initialOrders={fullRentals} currentUserId={user?._id} />;
}
