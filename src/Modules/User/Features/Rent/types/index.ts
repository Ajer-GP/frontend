export interface Rental {
  _id: string;
  renterId: string;
  ownerId: string;
  status:
    | "pending"
    | "waiting_for_deposit"
    | "accepted"
    | "confirmed"
    | "active"
    | "returned"
    | "rejected";
  productId: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  insuranceAmount: number;
  deposit: number;
  rentalFee: number;
  deliveryFee: number;
  commissionFee: number;
  acceptedAt: string | null;
  createdAt: string;
  owner: {
    fullName: string;
    profileImage: { url: string; publicId: string | null };
  };
  product: {
    title: string;
    coverImage: { url: string; publicId: string };
  };
}

export type GetRentalResult =
  | {
      success: true;
      rental: Rental;
    }
  | {
      success: false;
      error: string;
      status?: number;
    };

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
    | "confirmed"
    | "active"
    | "returned"
    | "rejected";
  totalAmount: number;
  insuranceAmount: number;
  deposit: number;
  rentalFee: number;
  deliveryFee: number;
  commissionFee: number;
  otpCode: string | null;
  otpExpiresAt: string | null;
  acceptedAt: string | null;
  createdAt: string;
  updatedAt: string;
}
