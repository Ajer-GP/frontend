// ReviewForm.tsx  "use client"
"use client";
import { useState, useTransition } from "react";

export default function ReviewForm({
  rentalId,
  productId,
}: {
  rentalId: string;
  productId: string;
}) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [done, setDone] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = () => {
    startTransition(async () => {
      // await submitReview({ rentalId, productId, rating, comment });
      setDone(true);
    });
  };

  if (done) {
    return (
      <p className="text-brand-primary text-body-sm font-medium text-center py-4">
        ✅ شكراً! تم إرسال تقييمك بنجاح.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {/* Stars */}
      <div className="flex gap-2 flex-row-reverse justify-end">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`text-2xl transition-colors ${
              star <= rating ? "text-yellow-400" : "text-text-tertiary"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="اكتب تعليقك هنا..."
        dir="rtl"
        rows={3}
        className="w-full resize-none rounded-xl border border-border-default bg-surface-secondary
                   px-3 py-2 text-body-sm text-text-primary placeholder:text-text-tertiary
                   focus:outline-none focus:border-brand-primary transition-colors"
      />

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isPending || rating === 0}
        className="w-full bg-brand-primary text-white rounded-xl py-3 text-body-sm font-medium disabled:opacity-50"
      >
        {isPending ? "جاري الإرسال..." : "إرسال التقييم"}
      </button>
    </div>
  );
}
