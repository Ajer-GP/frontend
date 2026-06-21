"use client";
import { useState } from "react";
import { setDeliveryRepOnline } from "@/Modules/Delivery/Features/services/delivery.actions";

export default function OnlineToggle({
  initialState,
}: {
  initialState: boolean;
}) {
  const [isOnline, setIsOnline] = useState(initialState);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    try {
      await setDeliveryRepOnline(!isOnline);
      setIsOnline(!isOnline);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-caption text-white/80">
        {isOnline ? "متصل" : "غير متصل"}
      </span>
      <button
        onClick={handleToggle}
        disabled={loading}
        className={`relative w-11 h-6 rounded-full transition-colors duration-200 disabled:opacity-50
          ${isOnline ? "bg-white/40" : "bg-white/20"}`}
      >
        <span
          className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-200
          ${isOnline ? "right-1" : "right-6"}`}
        />
      </button>
    </div>
  );
}
