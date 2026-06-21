import { redirect } from "next/navigation";
import OwnerPickupInspectionPage from "@/Modules/Delivery/components/Ownerpickupinspection";
import { getDeliveryById } from "@/Modules/Delivery/Features/services/delivery.actions";

interface Props {
  params: Promise<{ taskId: string }>;
}

export default async function Page({ params }: Props) {
  const { taskId } = await params;
  const result = await getDeliveryById(taskId);
  const task = result.delivery;

  // guard — الصفحة دي بس للـ on_the_way من المالك للمستأجر
  if (task.status !== "on_the_way" || task.type !== "from_owner_to_renter") {
    redirect(`/dashboard/${taskId}`);
  }

  return <OwnerPickupInspectionPage orderId={taskId} />;
}
