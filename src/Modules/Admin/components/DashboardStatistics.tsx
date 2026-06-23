import { getDashboard } from "../Features/Auth/services/actions";

export default async function DashboardStatistics() {
  const statistics = await getDashboard();
  const stats = statistics.data;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
      <div className="card border border-gray-300 bg-white rounded-xl px-3 py-3">
        <div className="bg-brand-light w-10 px-1 py-1 rounded-xl my-3">
          <span>
            <svg
              className="size-6 text-brand-primary m-auto my-1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16l-3-2l-2 2l-2-2l-2 2l-2-2l-3 2" />
              <path d="M9 7h6" />
              <path d="M9 11h6" />
              <path d="M9 15h4" />
            </svg>
          </span>
        </div>
        <p className="text-sm text-gray-600">اجمالي التأمينات المدفوعه</p>
        <h1 className="font-medium text-xl sm:text-2xl my-1">
          {stats?.totalInsuranceCollected}
        </h1>
      </div>

      <div className="card border border-gray-300 bg-white rounded-xl px-3 py-3">
        <div className="bg-[#FDF6E9] w-10 px-1 py-1 rounded-xl my-3">
          <span>
            <svg
              className="size-6 text-[#EAAB39] m-auto my-1"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v5l3 3" />
            </svg>
          </span>
        </div>
        <p className="text-sm text-gray-600">تأمينات تحتاج لمراجعة</p>
        <h1 className="font-medium text-xl sm:text-2xl my-1">
          {stats?.pendingInsuranceReview}
        </h1>
      </div>

      <div className="card border border-gray-300 bg-white rounded-xl px-3 py-3">
        <div className="bg-brand-light w-10 px-1 py-1 rounded-xl my-3">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-6 text-brand-primary m-auto my-1">
              <path d="M20 11A8.1 8.1 0 0 0 4.5 9M4 5v4h4" />
              <path d="M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4" />
            </svg>
          </span>
        </div>
        <p className="text-sm text-gray-600">تأمينات قابلة للاسترداد</p>
        <h1 className="font-medium text-xl sm:text-2xl my-1">
          {stats?.refundedInsurance} ج.م
        </h1>
      </div>

      <div className="card border border-gray-300 bg-white rounded-xl px-3 py-3">
        <div className="bg-[#FDF6E9] w-10 px-1 py-1 rounded-xl my-3">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 text-[#EAAB39] m-auto my-1">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            </svg>
          </span>
        </div>
        <p className="text-sm text-gray-600">اجمالي الخصومات الجزئية</p>
        <h1 className="font-medium text-xl sm:text-2xl my-1">
          {stats?.partialDeductions} ج.م
        </h1>
      </div>
    </div>
  );
}
