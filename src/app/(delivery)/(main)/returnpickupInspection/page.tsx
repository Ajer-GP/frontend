// ─── Route: /orders/[orderId]/return-pickup ────────────────────────────────

import ReturnPickupInspectionPage from "@/modules/delivery/components/Returnpickupinspection";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function Page() {
  // const { orderId } = await params;
  // { params }: Props
  return <ReturnPickupInspectionPage orderId={"4444"} />;
}
