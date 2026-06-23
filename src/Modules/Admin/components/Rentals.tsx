import React from "react";
import { getRentals } from "../Features/Auth/services/actions";
import Link from "next/link";
import { RentalStatus, validDecisions } from "../types/rentals.types";
import StatusFilter from "../components/StatusFilter";

export default async function Rentals({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page ?? 1);
  const status = typeof params?.status === "string" ? params.status : undefined;

  const rentals = await getRentals(page, status);

  return (
    <div className="border border-gray-300 rounded-xl my-5">
      {/* Filter bar */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        <h2 className="text-sm font-semibold text-gray-700">طلبات الإيجار</h2>
        <StatusFilter />
      </div>

      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block overflow-x-auto">
        <table className="table w-full">
          <thead className="bg-gray-100 text-gray-500">
            <tr>
              <th>الطلب</th>
              <th>المستأجر</th>
              <th>المالك</th>
              <th>قيمة التأمين</th>
              <th>حالة التأمين</th>
              <th>حالة الايجار</th>
              <th>اجراء</th>
            </tr>
          </thead>
          <tbody>
            {rentals.data?.map((rental) => {
              const s = RentalStatus.find((s) => s.status === rental?.status);
              return (
                <tr key={rental._id}>
                  <td>{rental?._id.slice(0, 6).toUpperCase()}</td>
                  <td>{rental?.renterId?.fullName}</td>
                  <td>{rental?.ownerId?.fullName}</td>
                  <td>
                    {validDecisions.find(
                      (d) => d.value === rental?.insuranceDecision,
                    )?.label ?? "لم يتم البت بعد"}
                  </td>
                  <td>{rental?.insuranceAmount} ج.م</td>
                  <td>
                    <span
                      className={`badge rounded-2xl px-2 py-1 border ${s?.color ?? "border-gray-400 bg-gray-100 text-gray-600"}`}>
                      {s?.label ?? rental?.status}
                    </span>
                  </td>
                  <td>
                    <Link
                      href={`/admin/insurance/${rental._id}`}
                      className="bg-brand-light text-brand-primary rounded-xl px-4 py-1 font-black">
                      مراجعة
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-4 inline font-black">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 19.5 8.25 12l7.5-7.5"
                        />
                      </svg>
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards (< md) ── */}
      <div className="md:hidden divide-y divide-gray-200">
        {rentals.data?.map((rental) => {
          const s = RentalStatus.find((s) => s.status === rental?.status);
          const decisionLabel =
            validDecisions.find((d) => d.value === rental?.insuranceDecision)
              ?.label ?? "لم يتم البت بعد";

          return (
            <div
              key={rental._id}
              className="px-4 py-3 flex flex-col gap-2"
              dir="rtl">
              {/* Row 1: ID + status badge */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-text-primary">
                  #{rental._id.slice(0, 6).toUpperCase()}
                </span>
                <span
                  className={`badge rounded-2xl px-2 py-1 border text-[11px] ${s?.color ?? "border-gray-400 bg-gray-100 text-gray-600"}`}>
                  {s?.label ?? rental?.status}
                </span>
              </div>

              {/* Row 2: renter + owner */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  <span className="font-medium text-gray-700">مستأجر: </span>
                  {rental?.renterId?.fullName}
                </span>
                <span>
                  <span className="font-medium text-gray-700">مالك: </span>
                  {rental?.ownerId?.fullName}
                </span>
              </div>

              {/* Row 3: amounts + decision */}
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  <span className="font-medium text-gray-700">التأمين: </span>
                  {rental?.insuranceAmount} ج.م
                </span>
                <span className="text-[11px] text-gray-500">
                  {decisionLabel}
                </span>
              </div>

              {/* Row 4: action */}
              <Link
                href={`/admin/insurance/${rental._id}`}
                className="self-start bg-brand-light text-brand-primary rounded-xl px-4 py-1.5 text-xs font-black">
                مراجعة
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-3.5 inline mr-1">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5 8.25 12l7.5-7.5"
                  />
                </svg>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 flex-wrap gap-2">
        <span className="text-sm text-gray-500">
          عرض {(page - 1) * rentals.limit + 1} -{" "}
          {Math.min(page * rentals.limit, rentals.total)} من {rentals.total}
        </span>
        <div className="join flex-wrap">
          {Array.from({ length: rentals.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                href={`?page=${p}`}
                className={`join-item btn btn-sm ${p === page ? "btn-active bg-brand-mid text-white" : "bg-white"} border-gray-300 text-brand-primary mx-1 rounded-lg`}>
                {p}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
