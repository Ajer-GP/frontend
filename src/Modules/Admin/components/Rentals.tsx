import React from "react";
import { getRentals } from "../Features/Auth/services/actions";
import Link from "next/link";
import { RentalStatus, validDecisions } from "../types/rentals.types";
export default async function Rentals({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const page = Number(params?.page ?? 1);
  const rentals = await getRentals(page);
  console.log(rentals.data);
  return (
    <div className="border border-gray-300 rounded-xl my-5">
      <div className="overflow-x-auto">
        <table className="table">
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
            {rentals.data?.map((rental) => (
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
                  {(() => {
                    const s = RentalStatus.find(
                      (s) => s.status === rental?.status,
                    );
                    return (
                      <span
                        className={`badge rounded-2xl px-2 py-1 border ${s?.color ?? "border-gray-400 bg-gray-100 text-gray-600"}`}>
                        {s?.label ?? rental?.status}
                      </span>
                    );
                  })()}
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
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200">
        <span className="text-sm text-gray-500">
          عرض {(page - 1) * rentals.limit + 1} -{" "}
          {Math.min(page * rentals.limit, rentals.total)} من {rentals.total}
        </span>
        <div className="join">
          {Array.from({ length: rentals.totalPages }, (_, i) => i + 1).map(
            (p) => (
              <Link
                key={p}
                href={`?page=${p}`}
                className={`join-item btn btn-sm ${p === page ? "btn-active bg-brand-mid text-white " : "bg-white"} border-gray-300 text-brand-primary mx-1 rounded-lg `}>
                {p}
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
