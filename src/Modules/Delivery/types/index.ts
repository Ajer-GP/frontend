// ─── Types ───────────────────────────────────────────────────────────────────
export interface TaskDetails {
  _id: string;
  productTitle: string;
  productName: string;
  productCoverImage: string;
  ownerName: string;
  renterName: string;
  ownerPhoneNumber: string;
  renterPhoneNumber: string;
  startDate: string;
  endDate: string;
  pricePerDay: number;
  insuranceAmount: number;
  remainingAmount: number;
  commissionFee: number;
  handlingNotes: string;
  checklist: string[];
  status: string;
  type: string;
}
