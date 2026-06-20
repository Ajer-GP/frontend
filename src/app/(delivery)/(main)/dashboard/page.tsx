// src/app/(user)/(main)/dashboard/page.tsx
// Server Component — fetches data, no "use client"
import Link from "next/link";
import DashboardStats from "@/app/_components/delivery/DashboardStats";
import RightPanel from "@/app/_components/delivery/RightPanel";
import TaskCard from "@/app/_components/delivery/TaskCard";
import { getAllDeliveries } from "@/Modules/Delivery/Features/services/delivery.actions";
import { cookies } from "next/headers";

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

interface DashboardData {
  driverName: string;
  currentTasks: number;
  completedToday: number;
  totalTasks: number;
  tasks: Task[];
  activeOrder: {
    pickupDate: string;
    pickupTime: string;
    returnDate: string;
    returnTime: string;
  };
  financial: {
    insurance: number;
    balance: number;
    platformFee: number;
    platformFeePercent: number;
    total: number;
  };
}

// ─── Data Fetcher ─────────────────────────────────────────────────────────────

async function getDashboardData(): Promise<DashboardData> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  // TODO: Replace with real API call
  // const res = await fetch(`${process.env.API_BASE_URL}/delivery/dashboard`, {
  //   headers: { Authorization: `Bearer ${token}` },
  //   cache: "no-store",
  // });
  // if (!res.ok) throw new Error("Failed to fetch dashboard data");
  // return res.json();

  // Mock data matching the Figma design
  return {
    driverName: "أحمد",
    currentTasks: 6,
    completedToday: 12,
    totalTasks: 18,
    tasks: [
      {
        id: "task-001",
        productName: "كاميرا Canon EOS R6",
        ownerName: "خالد محمود",
        renterName: "ريا مالك",
        status: "في الطريق إلى المالك",
        scheduledTime: "10:00 صباحاً",
        deliveryTime: "10:00 صباحاً",
        address: "المنصورة، المنصورة",
        city: "المحافظة",
      },
      {
        id: "task-002",
        productName: "كاميرا Canon EOS R6",
        ownerName: "خالد محمود",
        renterName: "ريا مالك",
        status: "استلام المنتج",
        scheduledTime: "10:00 صباحاً",
        deliveryTime: "10:00 صباحاً",
        address: "المنصورة، المنصورة",
        city: "المحافظة",
      },
      {
        id: "task-003",
        productName: "كاميرا Canon EOS R6",
        ownerName: "خالد محمود",
        renterName: "ريا مالك",
        status: "عاجل",
        scheduledTime: "11:00 صباحاً",
        deliveryTime: "12:00 ظهراً",
        address: "المنصورة، المنصورة",
        city: "المحافظة",
      },
    ],
    activeOrder: {
      pickupDate: "14 يونيو 2026",
      pickupTime: "04:30",
      returnDate: "14 يونيو 2026",
      returnTime: "06:30",
    },
    financial: {
      insurance: 300,
      balance: 300,
      platformFee: 100,
      platformFeePercent: 7.5,
      total: 400,
    },
  };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

// في getDashboardData أو مباشرة في الـ page

export default async function DashboardPage() {
  const data = await getAllDeliveries();

  const sortedDeliveries = [...data.deliveryData.deliveries].sort((a, b) => {
    const isActive = (s: string) => s !== "assigned" && s !== "delivered";
    const aActive = isActive(a.status);
    const bActive = isActive(b.status);

    // المهام الـ active تيجي الأول
    if (aActive && !bActive) return -1;
    if (!aActive && bActive) return 1;

    // لو نفس الـ group → ترتيب بـ deliveryDate
    return (
      new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime()
    );
  });

  // لو في أي مهمة مش assigned ومش delivered → مينفعش يبدأ
  const canStartNew = sortedDeliveries.every(
    (d) => d.status === "assigned" || d.status === "delivered",
  );

  return (
    <div className="flex-1 p-6 flex gap-6">
      <div className="flex-1 min-w-0 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-h3 text-text-primary font-medium">
              المهام الحالية
            </h2>
            <p className="text-caption text-text-tertiary">
              مرتبة حسب تاريخ التوصيل
            </p>
            <Link
              href="/dashboard/tasks"
              className="text-caption text-brand-primary hover:underline"
            >
              ‹ عرض الكل
            </Link>
          </div>

          <div className="space-y-3">
            {sortedDeliveries.map((task) => (
              <TaskCard key={task._id} task={task} canStart={canStartNew} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
