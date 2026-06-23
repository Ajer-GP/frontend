import { redirect, notFound } from "next/navigation";
import { cookies } from "next/headers";
import { getOrderByIdAction } from "@/Modules/User/Features/Rent/services/Rent.actions";
import { getTokenOrRefresh } from "@/Modules/User/lib/getTokenOrRefresh";
interface Props {
  params: Promise<{ id: string }>;
}
export default async function OrderRedirectPage({ params }: Props) {
  const { id } = await params;

  const cookieStore = await cookies();
  // const token = cookieStore.get("access_token")?.value;
  const token = await getTokenOrRefresh();

  const userCookie = cookieStore.get("user")?.value;
  console.log(userCookie);

  const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
  if (!user) redirect("/auth/login");

  const result = await getOrderByIdAction(id);
  console.log(result);

  if (!result.success) notFound();

  const rental = result.rental;
  console.log(rental.renterId);
  console.log(rental.ownerId);
  console.log(user._id);
  // console.log("rental.status:", rental.status);
  // console.log("expectedStatus:", expectedStatus);
  if (rental.renterId !== user._id && rental.ownerId !== user._id) {
    redirect("/unauthorized");
  }

  switch (rental.status) {
    case "pending":
      redirect(`/products/orders/${id}/request-sent`);
    case "accepted":
      redirect(`/products/orders/${id}/accepted`);
    case "waiting_for_deposit":
      redirect(`/products/orders/${id}/accepted`);
    case "confirmed":
      redirect(`/products/orders/${id}/confirmed`);
    case "delivering_to_renter":
      redirect(`/products/orders/${id}/confirmed`);
    case "active":
      redirect(`/products/orders/${id}/active`);
    case "returning_to_owner":
      redirect(`/products/orders/${id}/completed`);
    case "cancelled":
      redirect(`/products/orders/${id}/cancelled`);
    case "completed":
      redirect(`/products/orders/${id}/completed`);
    default:
      redirect("/products/orders");
  }
  return <h1 className="text-h1 text-center mt-20">Redirecting...</h1>; // This line will never be reached, but it's here to satisfy TypeScript's return type checking.
}
