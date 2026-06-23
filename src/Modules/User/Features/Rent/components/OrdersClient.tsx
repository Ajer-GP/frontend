"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  acceptRentalAction,
  rejectRentalAction,
} from "../services/Rent.actions";

export interface Rental {
  _id: string;
  productId: string;
  renterId: string;
  ownerId: string;
  startDate: string;
  endDate: string;
  status:
    | "pending"
    | "accepted"
    | "waiting_for_deposit"
    | "confirmed"
    | "rejected"
    | "cancelled"
    | "delivering_to_renter"
    | "active"
    | "returning_to_owner"
    | "suspended"
    | "completed";
  totalAmount: number;
  insuranceAmount: number;
  deposit: number;
  rentalFee: number;
  deliveryFee: number;
  commissionFee: number;
  createdAt: string;
  owner?: { fullName: string; profileImage: { url: string } };
  renter?: { fullName: string; profileImage: { url: string } };
  product?: { title: string; coverImage: { url: string } };
}

interface Props {
  initialOrders: Rental[];
  currentUserId: string;
}

const STATUS_LABEL: Record<Rental["status"], string> = {
  pending: "قيد الانتظار",
  accepted: "مقبول",
  waiting_for_deposit: "في انتظار الدفعة المقدمة",
  confirmed: "مؤكد",
  rejected: "مرفوض",
  cancelled: "ملغي",
  delivering_to_renter: "في الطريق إلى المستأجر",
  active: "نشط",
  returning_to_owner: "في طريق الإرجاع للمالك",
  suspended: "معلق",
  completed: "مكتمل",
};

const STATUS_STYLE: Record<Rental["status"], string> = {
  pending: "bg-[#FDF6E9] text-[#BA801A]",
  accepted: "bg-[#E1F5EE] text-[#0F6E56]",
  waiting_for_deposit: "bg-[#FFF4E5] text-[#B26A00]",
  confirmed: "bg-[#E6F1FB] text-[#185FA5]",
  rejected: "bg-[#FCEBEB] text-[#A32D2D]",
  cancelled: "bg-[#F3F3F3] text-[#6B6B6B]",
  delivering_to_renter: "bg-[#EEF6FF] text-[#1E63B5]",
  active: "bg-[#EAF3DE] text-[#3B6D11]",
  returning_to_owner: "bg-[#FFF1E8] text-[#B45309]",
  suspended: "bg-[#F5E9FF] text-[#6B21A8]",
  completed: "bg-[#F1EFE8] text-[#5F5E5A]",
};

const STATUS_PAGE: Record<string, string> = {
  pending: "request-sent",
  accepted: "accepted",
  waiting_for_deposit: "accepted",
  confirmed: "confirmed",
  active: "active",
  returned: "returned",
  cancelled: "cancelled",
  returning_to_owner: "cancelled",
  completed: "cancelled",
};

const STATUS_TABS = [
  { value: "all", label: "جميع الطلبات" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "accepted", label: "المقبولة" },
  { value: "rejected", label: "المرفوضة" },
];
const categories = [
  { id: "electronics", label: "الكترونيات" },
  { id: "clothes", label: "ملابس" },
  { id: "party tools", label: "معدات حفلات" },
  { id: "books", label: "كتب" },
];
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ar-EG", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

function getDays(start: string, end: string) {
  return Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) /
      (1000 * 60 * 60 * 24),
  );
}

// انتهى الإيجار كلياً (بعد endDate)
function isExpired(endDate: string) {
  return new Date() > new Date(endDate);
}

// بدأ تاريخ الاستلام (startDate فات)
function isStarted(startDate: string) {
  return new Date() > new Date(startDate);
}

// ── Confirm Dialog (Accept) ───────────────────────────────────────────────────

function ConfirmAcceptDialog({
  rental,
  onConfirm,
  onCancel,
  isPending,
}: {
  rental: Rental;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  const days = getDays(rental.startDate, rental.endDate);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div
        dir="rtl"
        className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4"
      >
        <h3 className="text-h3 font-medium text-text-primary text-center">
          هل تريد قبول طلب الإيجار؟
        </h3>
        <p className="text-caption text-text-secondary text-center">
          سيتم إخطار {rental.renter?.fullName ?? "المستأجر"} وسيتم تأكيد عملية
          الإيجار
        </p>
        <div className="border border-border-default rounded-xl p-3 space-y-2 text-body-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">فترة الإيجار</span>
            <span className="text-text-primary font-medium">
              {formatDate(rental.startDate)} {"-->"}{" "}
              {formatDate(rental.endDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">المدة</span>
            <span className="text-text-primary font-medium">{days} أيام</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">الإجمالي</span>
            <span className="text-brand-primary font-medium">
              {rental.totalAmount.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 border border-border-default text-text-secondary rounded-xl py-2.5 text-body-sm hover:border-brand-primary transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-brand-primary text-white rounded-xl py-2.5 text-body-sm font-medium hover:bg-brand-dark disabled:opacity-50 transition-colors"
          >
            {isPending ? "جاري..." : "تأكيد القبول"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Confirm Dialog (Reject) ───────────────────────────────────────────────────

function ConfirmRejectDialog({
  rental,
  onConfirm,
  onCancel,
  isPending,
}: {
  rental: Rental;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div
        dir="rtl"
        className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl space-y-4"
      >
        {/* أيقونة تحذير */}
        <div className="flex justify-center">
          <div className="size-12 rounded-full bg-[#FCEBEB] flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="#A32D2D"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
              />
            </svg>
          </div>
        </div>

        <h3 className="text-h3 font-medium text-text-primary text-center">
          هل تريد رفض هذا الطلب؟
        </h3>
        <p className="text-caption text-text-secondary text-center">
          سيتم إخطار{" "}
          <span className="font-medium text-text-primary">
            {rental.renter?.fullName ?? "المستأجر"}
          </span>{" "}
          برفض طلبه ولن تتمكن من التراجع
        </p>

        <div className="border border-border-default rounded-xl p-3 space-y-2 text-body-sm">
          <div className="flex justify-between">
            <span className="text-text-secondary">المنتج</span>
            <span className="text-text-primary font-medium">
              {rental.product?.title ??
                `طلب #${rental._id.slice(-6).toUpperCase()}`}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">تاريخ الاستلام</span>
            <span className="text-text-primary font-medium">
              {formatDate(rental.startDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-secondary">الإجمالي</span>
            <span className="text-text-primary font-medium">
              {rental.totalAmount.toLocaleString("ar-EG")} ج.م
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 border border-border-default text-text-secondary rounded-xl py-2.5 text-body-sm hover:border-brand-primary transition-colors"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            disabled={isPending}
            className="flex-1 bg-[#A32D2D] text-white rounded-xl py-2.5 text-body-sm font-medium hover:bg-[#8a2424] disabled:opacity-50 transition-colors"
          >
            {isPending ? "جاري..." : "تأكيد الرفض"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Rental Card ───────────────────────────────────────────────────────────────

function RentalCard({
  rental,
  isOwner,
  onAccept,
  onReject,
}: {
  rental: Rental;
  isOwner: boolean;
  onAccept: (r: Rental) => void;
  onReject: (r: Rental) => void;
}) {
  const days = getDays(rental.startDate, rental.endDate);
  const subPage = STATUS_PAGE[rental.status] ?? "request-sent";
  const person = isOwner ? rental.renter : rental.owner;
  const expired = isExpired(rental.endDate);
  const started = isStarted(rental.startDate);

  const displayStatus: Rental["status"] =
    !isOwner && started && rental.status === "pending"
      ? "rejected"
      : rental.status;

  return (
    <div
      dir="ltr"
      className="bg-white border border-[#E9EDFF] rounded-2xl overflow-hidden hover:shadow-sm transition-all duration-200"
    >
      {/* Person row — full width on top */}
      {person && (
        <div className="flex items-center justify-end gap-2.5 px-4 pt-4 pb-3">
          <div className="text-right">
            <p className="text-body-sm font-medium text-text-primary">
              {person.fullName}
            </p>
            <p className="text-body-sm font-medium text-text-primary">
              عملية تأجير ناجحة{" "}
              {rental.successfulRentals?.toLocaleDateString("ar-EG") ?? 0}
            </p>
          </div>
          <div className="relative size-9 rounded-full overflow-hidden bg-surface-secondary shrink-0">
            <Image
              src={
                person.profileImage?.url ?? "https://placehold.net/avatar-4.png"
              }
              alt={person.fullName}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* Main body: 1/3 image + 2/3 content */}
      <div className="flex gap-0">
        {/* 2/3 — content */}
        <div className="flex-1 p-4 flex flex-col gap-3 min-w-0">
          {/* Row 1: category + status */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <span
              className={`text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${STATUS_STYLE[displayStatus]}`}
            >
              {STATUS_LABEL[displayStatus]}
            </span>
            <span className="text-[11px] text-text-secondary bg-surface-tertiary px-2.5 py-1 rounded-full whitespace-nowrap">
              {categories.find((cat) => cat.id === rental.product?.catigories)
                ?.label ?? "—"}
            </span>
          </div>

          {/* Row 2: product name */}
          <h3
            dir="rtl"
            className="text-h3 font-semibold text-text-primary leading-snug"
          >
            {rental.product?.title ??
              `طلب #${rental._id.slice(-6).toUpperCase()}`}
          </h3>

          {/* Row 3: total amount */}

          <p
            dir="rtl"
            className="text-brand-primary font-black text-[20px] leading-none"
          >
            {rental.totalAmount.toLocaleString("ar-EG")}
            <span className="text-body-sm font-medium mr-1">ج.م / يوم</span>
          </p>

          {/* Row 4: dates + duration */}
          <div
            dir="rtl"
            className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-2"
          >
            {[
              { label: "تاريخ الاستلام", value: formatDate(rental.startDate) },
              { label: "تاريخ التسليم", value: formatDate(rental.endDate) },
              { label: "المدة", value: `${days.toLocaleString("ar-EG")} يوم` },
              {
                label: "الإجمالي",
                value: `${rental.totalAmount.toLocaleString("ar-EG")} ج.م`,
                green: true,
              },
            ].map(({ label, value, green }) => (
              <div key={label}>
                <p className="text-[11px] text-text-tertiary">{label}</p>
                <p
                  className={`text-body-sm font-medium mt-0.5 ${green ? "text-brand-primary" : "text-text-primary"}`}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Row 5: actions */}
          <div dir="rtl" className="flex gap-2 pt-1">
            {isOwner ? (
              rental.status === "pending" && !started ? (
                <>
                  <button
                    onClick={() => onAccept(rental)}
                    className="px-8 bg-brand-primary text-white rounded-xl py-2 text-body-sm font-medium hover:bg-brand-dark transition-colors"
                  >
                    قبول
                  </button>
                  <button
                    onClick={() => onReject(rental)}
                    className="px-6 border border-border-default text-text-secondary rounded-xl py-2 text-body-sm hover:border-danger hover:text-danger transition-colors"
                  >
                    رفض
                  </button>
                </>
              ) : null
            ) : !expired &&
              [
                "pending",
                "accepted",
                "waiting_for_deposit",
                "confirmed",
                "active",
              ].includes(rental.status) &&
              !(started && rental.status === "pending") ? (
              <Link
                href={`/products/orders/${rental._id}/${subPage}`}
                className="px-6 text-center border border-border-default text-text-secondary rounded-xl py-2 text-body-sm hover:border-brand-primary hover:text-brand-primary transition-colors"
              >
                عرض التفاصيل
              </Link>
            ) : null}
          </div>
        </div>

        {/* 1/3 — image */}
        <div className="w-1/3 shrink-0 p-3 flex items-stretch">
          <div className="relative w-full rounded-xl overflow-hidden bg-surface-secondary min-h-[180px]">
            {rental.product?.coverImage?.url ? (
              <Image
                src={rental.product.coverImage.url}
                alt={rental.product.title ?? "منتج"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-text-tertiary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="size-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Z"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function OrdersClient({ initialOrders, currentUserId }: Props) {
  const [orders, setOrders] = useState<Rental[]>(initialOrders);
  const [roleTab, setRoleTab] = useState<"renter" | "owner">("renter");
  const [statusTab, setStatusTab] = useState("all");
  const [confirmAccept, setConfirmAccept] = useState<Rental | null>(null);
  const [confirmReject, setConfirmReject] = useState<Rental | null>(null);
  const [isPending, startTransition] = useTransition();

  const roleFiltered = orders.filter((o) =>
    roleTab === "renter"
      ? o.renterId === currentUserId
      : o.ownerId === currentUserId,
  );

  const filtered =
    statusTab === "all"
      ? roleFiltered
      : roleFiltered.filter((o) => o.status === statusTab);

  const countOf = (status: string) =>
    status === "all"
      ? roleFiltered.length
      : roleFiltered.filter((o) => o.status === status).length;

  const handleAcceptConfirm = () => {
    if (!confirmAccept) return;
    startTransition(async () => {
      try {
        const res = await acceptRentalAction(confirmAccept._id);
        if (!res.success) throw new Error(res.error);
        setOrders((prev) =>
          prev
            .map((o) =>
              o._id === confirmAccept._id
                ? { ...o, status: "accepted" as const }
                : o,
            )
            .filter(
              (o) =>
                !(
                  o.productId === confirmAccept.productId &&
                  o.status === "pending" &&
                  o._id !== confirmAccept._id
                ),
            ),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setConfirmAccept(null);
      }
    });
  };

  const handleRejectConfirm = () => {
    if (!confirmReject) return;
    startTransition(async () => {
      try {
        const res = await rejectRentalAction(confirmReject._id);
        if (!res.success) throw new Error(res.error);
        setOrders((prev) =>
          prev.map((o) =>
            o._id === confirmReject._id
              ? { ...o, status: "rejected" as const }
              : o,
          ),
        );
      } catch (err) {
        console.error(err);
      } finally {
        setConfirmReject(null);
      }
    });
  };

  return (
    <div dir="rtl" className="min-h-screen bg-surface-primary">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div
          className="mb-6 min-h-30 py-10 px-3"
          style={{
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.05) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        >
          <h1 className="text-[28px] font-medium text-text-primary">
            طلبات الإيجار
          </h1>
          <p className="text-body-sm text-text-secondary mt-1">
            راجع طلبات استئجار منتجاتك وقم برفضها أو قبولها
          </p>
        </div>

        {/* Role Tabs */}
        <div className="flex gap-2 mb-5">
          {(["renter", "owner"] as const).map((role) => (
            <button
              key={role}
              onClick={() => {
                setRoleTab(role);
                setStatusTab("all");
              }}
              className={`px-5 py-2 rounded-xl text-body-sm font-medium border transition-colors ${
                roleTab === role
                  ? "bg-brand-primary text-white border-brand-primary"
                  : "bg-white text-text-secondary border-border-default hover:border-brand-primary"
              }`}
            >
              {role === "renter" ? "طلباتي كمستأجر" : "طلبات منتجاتي"}
            </button>
          ))}
        </div>

        {/* Status Tabs */}
        <div className="flex gap-1 border-b border-border-default mb-5 overflow-x-auto scrollbar-hide">
          {STATUS_TABS.map((tab) => {
            const count = countOf(tab.value);
            return (
              <button
                key={tab.value}
                onClick={() => setStatusTab(tab.value)}
                className={`shrink-0 px-4 py-2.5 text-body-sm font-medium border-b-2 transition-colors -mb-px ${
                  statusTab === tab.value
                    ? "border-brand-primary text-brand-primary"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                {tab.label}
                {count > 0 && (
                  <span
                    className={`mr-1.5 text-caption px-1.5 py-0.5 rounded-full ${
                      statusTab === tab.value
                        ? "bg-brand-primary/10 text-brand-primary"
                        : "bg-surface-tertiary text-text-tertiary"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-secondary">
            <div className="size-14 rounded-full bg-surface-secondary flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25Z"
                />
              </svg>
            </div>
            <p className="text-body-sm">لا توجد طلبات</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((order) => (
              <RentalCard
                key={order._id}
                rental={order}
                isOwner={roleTab === "owner"}
                onAccept={setConfirmAccept}
                onReject={setConfirmReject}
              />
            ))}
          </div>
        )}
      </div>

      {confirmAccept && (
        <ConfirmAcceptDialog
          rental={confirmAccept}
          onConfirm={handleAcceptConfirm}
          onCancel={() => setConfirmAccept(null)}
          isPending={isPending}
        />
      )}

      {confirmReject && (
        <ConfirmRejectDialog
          rental={confirmReject}
          onConfirm={handleRejectConfirm}
          onCancel={() => setConfirmReject(null)}
          isPending={isPending}
        />
      )}
    </div>
  );
}
