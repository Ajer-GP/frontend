import ReturnPickupInspectionPage from "@/Modules/Delivery/components/Returnpickupinspection";
import { getDeliveryById } from "@/Modules/Delivery/Features/services/delivery.actions";
import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ taskId: string }>;
}

export default async function Page({ params }: Props) {
  const { taskId } = await params;
  const taskDeatils = await getDeliveryById(taskId);
  const result = await getDeliveryById(taskId);
  const task = result.delivery;

  // guard — الصفحة دي بس للـ on_the_way من المالك للمستأجر
  if (task.status !== "on_the_way" || task.type !== "from_renter_to_owner") {
    redirect(`/dashboard/${taskId}`);
  }
  return (
    <ReturnPickupInspectionPage
      orderId={taskId}
      taskDeatils={taskDeatils.delivery}
    />
  );
}
