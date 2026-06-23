"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { startDelivery } from "@/Modules/Delivery/Features/services/delivery.actions";
import { useRouter } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DeliveryStatus =
  | "assigned"
  | "on_the_way"
  | "picked_up"
  | "delivered";

export interface DeliveryTask {
  _id: string;
  type: string;
  status: DeliveryStatus;
  assignedAt: string;
  pickedUpAt: string | null;
  deliveredAt: string | null;
  ownerName: string;
  renterName: string;
  productTitle: string;
  productCoverImage: string;
  pickupLocation: {
    street: string;
    building: string;
    floor: string;
    home?: string;
    mark?: string;
  } | null;
  deliveryLocation: {
    street: string;
    building: string;
    floor: string;
    home?: string;
    mark?: string;
  } | null;
  deliveryDate: string;
}

// ─── Status badge config ───────────────────────────────────────────────────────

const statusLabel: Record<DeliveryStatus, string> = {
  assigned: "مُعيَّنة",
  on_the_way: "في الطريق",
  picked_up: "تم الاستلام",
  delivered: "تم التوصيل",
};

const statusStyles: Record<DeliveryStatus, string> = {
  assigned: "bg-accent-light text-accent-default",
  on_the_way: "bg-brand-light text-brand-primary",
  picked_up: "bg-warning-bg text-warning",
  delivered: "bg-success-bg text-success",
};
// الـ helper فوق الـ component
function getTaskRoute(task: DeliveryTask): string {
  const base = `/dashboard/${task._id}`;
  const isOwnerToRenter = task.type === "from_owner_to_renter";

  switch (task.status) {
    case "on_the_way":
      return isOwnerToRenter
        ? `${base}/ownerpickupinspection`
        : `${base}/returnpickupInspection`;
    case "picked_up":
      return isOwnerToRenter ? `${base}/otp-renter` : `${base}/otp-owner`;
    default:
      // assigned, delivered
      return base;
  }
}
// ─── Component ────────────────────────────────────────────────────────────────

export default function TaskCard({
  task,
  canStart,
}: {
  task: DeliveryTask;
  canStart: boolean;
}) {
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);

  const isAssigned = task.status === "assigned";
  const router = useRouter();
  async function handleStart() {
    setLoading(true);
    try {
      await startDelivery(task._id);
      setStarted(true);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="bg-white border border-border-default rounded-xl p-4 flex items-start gap-4"
      dir="rtl"
    >
      {/* Thumbnail */}
      <div className="w-14 h-14 rounded-lg bg-surface-tertiary shrink-0 overflow-hidden">
        {task.productCoverImage ? (
          <Image
            src={task.productCoverImage}
            alt={task.productTitle}
            className="w-full h-full object-cover"
            width={56}
            height={56}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-tertiary text-2xl">
            📷
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <div>
            <p className="text-body-sm font-medium text-text-primary truncate">
              {task.productTitle}
            </p>
            <p className="text-caption text-text-tertiary">
              المالك: {task.ownerName} · المستأجر: {task.renterName}
            </p>
          </div>
          <span
            className={`shrink-0 text-caption font-medium px-2 py-0.5 rounded-full ${statusStyles[task.status] ?? "bg-surface-secondary text-text-secondary"}`}
          >
            {statusLabel[task.status] ?? task.status}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 mt-2 text-caption text-text-tertiary">
          <span className="flex items-center gap-1">
            <span>🗓️</span>
            <span>
              {new Date(task.deliveryDate).toLocaleDateString("ar-EG", {
                day: "numeric",
                month: "short",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </span>
          {task.pickupLocation && (
            <span className="flex items-center gap-1">
              <span>📍</span>
              <span>
                {task.pickupLocation.street}، مبنى{" "}
                {task.pickupLocation.building}
              </span>
            </span>
          )}
          {task.deliveryLocation && (
            <span className="flex items-center gap-1">
              <span>🚚</span>
              <span>
                {task.deliveryLocation.street}، مبنى{" "}
                {task.deliveryLocation.building}
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="shrink-0 flex flex-col gap-2">
        {/* بدء المهمة — assigned + canStart + لسه مبدأتش */}
        {isAssigned && canStart && !started && (
          <button
            onClick={handleStart}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-success text-white text-caption font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? "جارٍ..." : "بدء المهمة"}
          </button>
        )}

        {/* متابعة المهمة — موجودة دايماً */}
        <Link
          // href={getTaskRoute(task)}
          href={`/dashboard/${task._id}`}
          className="px-4 py-2 rounded-lg bg-brand-primary text-white text-caption font-medium hover:bg-brand-dark transition-colors text-center"
        >
          متابعة المهمة
        </Link>
      </div>
    </div>
  );
}
