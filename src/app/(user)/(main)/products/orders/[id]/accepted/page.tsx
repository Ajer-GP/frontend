import AcceptedClient from "@/Modules/User/Features/Rent/components/AcceptedClient";
import { getAndGuardRental } from "@/modules/user/lib/getAndGuardRental";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AcceptedPage({ params }: Props) {
  const { id } = await params;

  const rental = await getAndGuardRental(id, [
    "accepted",
    "waiting_for_deposit",
  ]);

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

  const depositTotal = rental.deposit + rental.deliveryFee;

  return (
    <AcceptedClient
      orderId={id}
      status={rental.status} // ← من الـ API مباشرة
      acceptedAt={rental.acceptedAt}
      product={product}
      dates={dates}
      deposit={rental.deposit}
      deliveryFee={rental.deliveryFee}
      depositTotal={depositTotal}
    />
  );
}
