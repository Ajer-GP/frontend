import OwnerPickupInspectionPage from "@/Modules/Delivery/components/Ownerpickupinspection";

interface Props {
  params: Promise<{ taskId: string }>;
}

export default async function Page({ params }: Props) {
  const { taskId } = await params;
  return <OwnerPickupInspectionPage orderId={taskId} />;
}
