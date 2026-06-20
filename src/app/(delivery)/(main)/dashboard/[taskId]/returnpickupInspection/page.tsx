import ReturnPickupInspectionPage from "@/Modules/Delivery/components/Returnpickupinspection";

interface Props {
  params: Promise<{ orderId: string }>;
}

export default async function Page({ params }: Props) {
  const { orderId } = await params;
  return <ReturnPickupInspectionPage orderId={orderId} />;
}
