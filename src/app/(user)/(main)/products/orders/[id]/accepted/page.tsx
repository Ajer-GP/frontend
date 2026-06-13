import AcceptedClient from "@/Modules/User/Features/Rent/components/AcceptedClient";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AcceptedPage({ params }: Props) {
  const { id } = await params;

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

  const start = new Date(rental.startDate);
  const end = new Date(rental.endDate);
  const days = Math.ceil(
    (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24),
  );

  const product = {
    name: rental.product.title,
    category: "",
    image: rental.product.coverImage.url,
    ownerName: rental.owner.fullName,
    ownerAvatar: rental.owner.profileImage.url,
  };

  const dates = {
    start: start.toLocaleDateString("ar-EG"),
    end: end.toLocaleDateString("ar-EG"),
    days,
    dailyRate: rental.rentalFee / (days || 1),
  };

  // العربون = deposit + deliveryFee
  const depositTotal = rental.deposit + rental.deliveryFee;

  return (
    <AcceptedClient
      orderId={id}
      acceptedAt={rental.acceptedAt}
      product={product}
      dates={dates}
      deposit={rental.deposit}
      deliveryFee={rental.deliveryFee}
      depositTotal={depositTotal}
    />
  );
}
