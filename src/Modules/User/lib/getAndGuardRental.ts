import { cookies } from "next/headers";
import { notFound, redirect } from "next/navigation";

const STATUS_PAGE: Record<string, string> = {
  pending: "request-sent",
  accepted: "accepted",
  waiting_for_deposit: "accepted",
  confirmed: "confirmed",
  delivering_to_renter: "confirmed",
  active: "active",
  returning_to_owner: "completed",
  completed: "completed",
  cancelled: "cancelled",
};
export async function getAndGuardRental(
  id: string,
  expectedStatus: string | string[],
) {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  const res = await fetch(`${process.env.API_BASE_URL}/requests/${id}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    cache: "no-store",
  });

  if (!res.ok) notFound();

  const { rental } = await res.json();

  const allowed = Array.isArray(expectedStatus)
    ? expectedStatus
    : [expectedStatus];

  if (!allowed.includes(rental.status)) {
    const page = STATUS_PAGE[rental.status];
    if (page) redirect(`/products/orders/${id}/${page}`);
    else redirect("/products/orders");
  }

  return rental;
}
