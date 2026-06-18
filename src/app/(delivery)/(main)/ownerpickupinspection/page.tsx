// ─── Route: /orders/[orderId]/return-pickup ────────────────────────────────

import OwnerPickupInspectionPage from "@/Modules/Delivery/components/Ownerpickupinspection";
import ReturnPickupInspectionPage from "@/Modules/Delivery/components/Returnpickupinspection";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function Page() {
  // const { orderId } = await params;
  // { params }: Props
  return <OwnerPickupInspectionPage orderId={"4444"} />;
}
