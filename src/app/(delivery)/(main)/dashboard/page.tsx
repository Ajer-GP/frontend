import TaskCard from "@/app/_components/delivery/TaskCard";
import { getAllDeliveries } from "@/Modules/Delivery/Features/services/delivery.actions";
import { cookies } from "next/headers";
import StatsCard from "@/Modules/Delivery/components/StatsCard";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Task {
  id: string;
  productName: string;
  productImage?: string;
  ownerName: string;
  renterName: string;
  status: "عاجل" | "في الطريق إلى المالك" | "استلام المنتج";
  scheduledTime: string;
  deliveryTime: string;
  address: string;
  city: string;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// في getDashboardData أو مباشرة في الـ page
export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, data, cookieStore] = await Promise.all([
    searchParams,
    getAllDeliveries(),
    cookies(),
  ]);
  const token = cookieStore.get("delivery_token")?.value;
  const delivery = cookieStore.get("delivery")?.value;
  const deliveryData = delivery
    ? JSON.parse(decodeURIComponent(delivery))
    : null;
  const sortedDeliveries = [...data.deliveryData.deliveries].sort((a, b) => {
    const priority = (s: string) => {
      if (s === "on_the_way" || s === "picked_up") return 0; // أعلى أولوية
      if (s === "assigned") return 1;
      return 2; // delivered في الآخر
    };
    const pd = priority(a.status) - priority(b.status);
    if (pd !== 0) return pd;
    return (
      new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
    );
  });
  const filtered = q?.trim()
    ? sortedDeliveries.filter(
        (t) =>
          t.productTitle?.includes(q) ||
          t.ownerName?.includes(q) ||
          t.renterName?.includes(q) ||
          t._id?.includes(q),
      )
    : sortedDeliveries;
  // لو في أي مهمة مش assigned ومش delivered → مينفعش يبدأ
  const canStartNew = sortedDeliveries.every(
    (d) => d.status === "assigned" || d.status === "delivered",
  );

  return (
    <div className="flex-1 p-6 flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <section>
          <StatsCard
            driverName={deliveryData?.fullName ?? ""}
            currentTasks={
              sortedDeliveries.filter((d) => d.status !== "delivered").length
            }
            completedToday={
              sortedDeliveries.filter((d) => d.status === "delivered").length
            }
            totalTasks={sortedDeliveries.length}
            initialOnline={deliveryData?.isOnline}
          />
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h3 text-text-primary font-medium">
              المهام الحالية
            </h2>
            <p className="text-caption text-text-tertiary">
              مرتبة حسب تاريخ التوصيل
            </p>
          </div>

          <div className="space-y-3">
            {filtered.map((task) => (
              <TaskCard key={task._id} task={task} canStart={canStartNew} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
