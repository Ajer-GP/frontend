// Server Component
import Link from "next/link";

export type TaskStatus = "عاجل" | "في الطريق إلى المالك" | "استلام المنتج";

interface Task {
  id: string;
  productName: string;
  productImage?: string;
  ownerName: string;
  renterName: string;
  status: TaskStatus;
  scheduledTime: string;
  deliveryTime: string;
  address: string;
  city: string;
}

interface TaskCardProps {
  task: Task;
}

const statusStyles: Record<TaskStatus, string> = {
  عاجل: "bg-danger-bg text-danger",
  "في الطريق إلى المالك": "bg-brand-light text-brand-primary",
  "استلام المنتج": "bg-accent-light text-accent-default",
};

export default function TaskCard({ task }: TaskCardProps) {
  return (
    <div
      className="bg-white border border-border-default rounded-xl p-4 flex items-start gap-4"
      dir="rtl"
    >
      {/* Product thumbnail */}
      <div className="w-14 h-14 rounded-lg bg-surface-tertiary flex-shrink-0 overflow-hidden">
        {task.productImage ? (
          <img
            src={task.productImage}
            alt={task.productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary text-2xl">
            📷
          </div>
        )}
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-body-sm font-medium text-text-primary">
              {task.productName}
            </p>
            <p className="text-caption text-text-tertiary">
              المالك: {task.ownerName} · المستأجر: {task.renterName}
            </p>
          </div>
          <span
            className={`flex-shrink-0 text-caption font-medium px-2 py-0.5 rounded-full ${
              statusStyles[task.status] ??
              "bg-surface-secondary text-text-secondary"
            }`}
          >
            {task.status}
          </span>
        </div>

        {/* Info row */}
        <div className="flex items-center gap-4 mt-2 text-caption text-text-tertiary">
          <span className="flex items-center gap-1">
            <span>🕐</span>
            <span>الموعد: {task.scheduledTime}</span>
          </span>
          <span className="flex items-center gap-1">
            <span>📍</span>
            <span>
              الاستلام: {task.address}، {task.city}
            </span>
          </span>
          <span className="flex items-center gap-1">
            <span>🚚</span>
            <span>التوصيل: {task.deliveryTime}</span>
          </span>
        </div>
      </div>

      {/* CTA */}
      <Link
        href={`/dashboard/tasks/${task.id}`}
        className="flex-shrink-0 px-4 py-2 rounded-lg bg-brand-primary text-white text-caption font-medium hover:bg-brand-dark transition-colors"
      >
        متابعة المهمة
      </Link>
    </div>
  );
}
