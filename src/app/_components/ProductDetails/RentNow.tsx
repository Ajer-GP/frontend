"use client";
import React, { useMemo, useState } from "react";
import { calculateRentalFee, MIN_HOURS_FROM_NOW } from "@/utils/RentingHandle";
import { CreateRentRequest } from "@/modules/user/features/Rent/services/Rent.actions";
import { redirect } from "next/navigation";
export default function RentNow(data) {
  const product = data.data;
  const day = new Date().toISOString().split("T")[0];
  const [returnHour, setReturnHour] = useState("");
  const [startHour, setStartHour] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [startDate, setstartDate] = useState("");
  const [returnVal, setReturnVal] = useState("am");
  const [startVal, setStartVal] = useState("am");
  const [rentError, setRentError] = useState("");
  const [rentSuccess, setRentSuccess] = useState("");
  const handleReturnHourChange = (e) => {
    setReturnHour(e.target.value);
  };
  const handleStartHourChange = (e) => {
    setStartHour(e.target.value);
  };
  const handleReturnDateChange = (e) => {
    setReturnDate(e.target.value);
  };
  const handleStartDateChange = (e) => {
    setstartDate(e.target.value);
  };
  const handleReturnVal = (e) => {
    setReturnVal(e.target.value);
  };
  const handleStartVal = (e) => {
    setStartVal(e.target.value);
  };
  const buildDateTime = (date, hour, period) => {
    if (!date || !hour || !period) return null;

    let h = parseInt(hour);

    // Convert to 24h
    if (period === "pm" && h !== 12) h += 12;
    if (period === "am" && h === 12) h = 0;

    const [year, month, day] = date.split("-").map(Number);

    return new Date(year, month - 1, day, h, 0, 0);
  };

  const rental = useMemo(() => {
    const start = buildDateTime(startDate, startHour, startVal);
    const end = buildDateTime(returnDate, returnHour, returnVal);
    const today = new Date();

    if (
      start?.toISOString().split("T")[0] <= today.toISOString().split("T")[0]
    ) {
      return {
        days: 0,
        hours: 0,
        totalfee: null,
        error: `يجب أن يبدأ الإيجار بعد ${MIN_HOURS_FROM_NOW} ساعة على الأقل`,
      };
    } else if (
      start &&
      end &&
      start?.toISOString().split("T")[0] === end?.toISOString().split("T")[0] &&
      Number(returnHour) - Number(startHour) <= 3
    ) {
      return {
        days: 0,
        hours: 0,
        totalfee: null,
        error: "يجب أن تكون مدة الإيجار 4 ساعات على الأقل",
      };
    } else if (!start || !end) return { days: 0, hours: 0 };
    else if (end <= start) {
      return {
        days: 0,
        hours: 0,
        totalfee: null,
        error: "تاريخ الإرجاع يجب أن يكون بعد تاريخ البداية",
      };
    }
    const diffMs = end - start;

    const totalHours = Math.floor(diffMs / (1000 * 60 * 60));
    const totalfee = calculateRentalFee(totalHours, product);
    const days = Math.floor(totalHours / 24);
    const hours = totalHours % 24; // remaining hours after full days

    return {
      days,
      hours,
      totalfee,
      error: "",
    };
  }, [
    startDate,
    startHour,
    startVal,
    returnDate,
    returnHour,
    returnVal,
    product,
  ]);

  const createRequest = async () => {
    const productId = product._id;
    const rentStart = buildDateTime(startDate, startHour, startVal);
    const rentEnd = buildDateTime(returnDate, returnHour, returnVal);
    if (!rentStart || !rentEnd || !rental.totalfee) {
      setRentError(
        "لإتمام عملية الإيجار، يُرجى تحديد التاريخ والوقت المناسبَين لك",
      );
      return;
    }
    setRentError("");
    setRentSuccess("");
    const res = await CreateRentRequest(
      productId,
      rentStart?.toISOString(),
      rentEnd?.toISOString(),
      rental.totalfee?.fees.totalAmount,
    );
    if (res.status === 400) {
      setRentError(JSON.parse(res.error).error.message);
    } else if (!res.success) {
      setRentError(res.error);
    } else {
      setRentError("");
      setRentSuccess("تم إرسال طلب الإيجار بنجاح! جاري معالجة طلبك...");
      setTimeout(() => setRentSuccess(""), 5000);
      redirect(
        `/products/orders/${res.rentalRequest.rentalRequest.rentalRequest._id}/request-sent`,
      );
    }
  };

  return (
    <div className="flex flex-col gap-4 my-8 mx-4 sm:mx-8 lg:mx-10">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black">
        احجز إيجارك بسهولة
      </h1>
      <p className="text-gray-500 my-2 text-sm sm:text-base">
        اختار التواريخ وشوف تفاصيل السعر بشكل واضح ومباشر، علشان تعرف بالظبط
        هتدفع كام النهارده.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Rental period card */}
        <div className="card bg-white card-xl shadow-sm">
          <div className="card-body gap-3">
            <h2 className="card-title text-lg sm:text-xl">اختار مدة الإيجار</h2>
            <p className="text-sm text-gray-500">
              تحديثات مباشرة للسعر أثناء تعديل مدة الإيجار.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              {/* Start date */}
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-gray-400 text-sm font-medium">
                  تاريخ البداية
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-gray-400 text-sm">الساعة</p>
                  <input
                    type="number"
                    name="startHour"
                    id="startHour"
                    max={12}
                    min={1}
                    placeholder="1"
                    className="input w-16 border border-gray-300 bg-gray-50 rounded-xl"
                    value={startHour}
                    onChange={handleStartHourChange}
                  />
                  <select
                    value={startVal}
                    onChange={handleStartVal}
                    name="startPeriod"
                    id="startPeriod"
                    className="select w-20 rounded-2xl">
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-400 text-sm shrink-0">التاريخ</p>
                  <input
                    min={day}
                    value={startDate}
                    onChange={handleStartDateChange}
                    type="date"
                    name="startDate"
                    id="startDate"
                    className="input w-full border border-gray-300 bg-gray-50 rounded-xl"
                  />
                </div>
              </div>

              {/* Divider on mobile */}
              <div className="border-t border-gray-200 sm:hidden" />

              {/* Return date */}
              <div className="flex-1 flex flex-col gap-2">
                <p className="text-gray-400 text-sm font-medium">
                  تاريخ الارجاع
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-gray-400 text-sm">الساعة</p>
                  <input
                    value={returnHour}
                    onChange={handleReturnHourChange}
                    type="number"
                    name="returnHour"
                    id="returnHour"
                    max={12}
                    min={1}
                    placeholder="1"
                    className="input w-16 border border-gray-300 bg-gray-50 rounded-xl"
                  />
                  <select
                    value={returnVal}
                    onChange={handleReturnVal}
                    name="returnPeriod"
                    id="returnPeriod"
                    className="select w-20 rounded-2xl">
                    <option value="am">AM</option>
                    <option value="pm">PM</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-gray-400 text-sm shrink-0">التاريخ</p>
                  <input
                    min={day}
                    value={returnDate}
                    onChange={handleReturnDateChange}
                    type="date"
                    name="returnDate"
                    id="returnDate"
                    className="input w-full border border-gray-300 bg-gray-50 rounded-xl"
                  />
                </div>
              </div>
            </div>
            <div>
              {rental.error ? (
                <p className="text-danger">{rental.error}</p>
              ) : (
                <p></p>
              )}
            </div>
            {/* Duration badge */}
            <div className="flex justify-between border border-brand-primary rounded-xl px-3 py-3 mt-1">
              <div className="flex gap-1 items-center ">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-5 text-brand-primary shrink-0">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                  />
                </svg>
                <p className="text-brand-primary text-sm">مدة الايجار</p>
              </div>

              <div className="flex gap-2 text-brand-primary font-black">
                <p> {rental.hours} ساعة </p>
                <p> {rental.days} أيام</p>{" "}
              </div>
            </div>
          </div>
        </div>

        {/* Cost breakdown card */}
        <div className="card bg-white card-xl shadow-sm">
          <div className="card-body gap-3">
            <h2 className="card-title text-lg sm:text-xl">
              تفاصيل تكلفة الايجار
            </h2>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">
                  سعر الايجار ({rental.hours} ساعة {rental.days} أيام){" "}
                </span>
                <span>{rental.totalfee?.fees.rentalFee ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">سعر التأمين</span>
                <span>{product.insuranceAmount ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">سعر التوصيل</span>
                <span>{rental.totalfee?.fees?.deliveryFee ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">نسبة المنصة (5%)</span>
                <span>{rental.totalfee?.fees.commission ?? 0}</span>
              </div>
              <div className="flex justify-between text-sm sm:text-base">
                <span className="text-gray-400">نسبة العربون (1%)</span>
                <span>{rental.totalfee?.fees.deposit ?? 0}</span>
              </div>
              <div className="flex justify-between bg-gray-100 rounded-3xl px-4 py-2 mt-1">
                <span className="text-brand-primary font-medium">الاجمالي</span>
                <span className="text-brand-primary font-black">
                  {rental.totalfee?.fees.totalAmount ?? 0}
                </span>
              </div>
            </div>

            <button
              onClick={createRequest}
              disabled={!product.isActive}
              className="btn bg-brand-primary rounded-3xl text-white w-full mt-auto">
              أجر الآن
            </button>
            {rentSuccess && (
              <span className="text-success my-2 font-medium">
                {rentSuccess}
              </span>
            )}
            {rentError && <span className="text-danger my-2">{rentError}</span>}
          </div>
        </div>
      </div>
    </div>
  );
}
