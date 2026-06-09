const DELIVERY_FEE = 50;
const PLATFORM_COMMISSION_RATE = 0.05;
const DEPOSIT_RATE = 0.1;
export const MIN_HOURS_FROM_NOW = 25;

function breakDownDuration(totalHours) {
  const weeks = Math.floor(totalHours / (7 * 24));
  const remainingAfterWeeks = totalHours % (7 * 24);
  const days = Math.floor(remainingAfterWeeks / 24);
  const hours = remainingAfterWeeks % 24;
  return { weeks, days, hours };
}

export function calculateRentalFee(totalHours, product) {
  const { weeks, days, hours } = breakDownDuration(totalHours);

  const pricePerHour = product.pricePerHour ?? 0;
  const pricePerDay = product.pricePerDay ?? 0;
  const pricePerWeek = product.pricePerWeek ?? 0;

  const weeksCost = weeks * pricePerWeek;
  const daysCost = days * pricePerDay;
  const hoursCost = hours * pricePerHour;

  const rentalFee = weeksCost + daysCost + hoursCost;
  const commission = rentalFee * PLATFORM_COMMISSION_RATE;
  const deposit = rentalFee * DEPOSIT_RATE;
  const deliveryFee = DELIVERY_FEE;
  const insurance = product.insuranceAmount ?? 0;

  const total = rentalFee + insurance + deliveryFee + commission + deposit;
  return {
    breakdown: { weeks, days, hours, weeksCost, daysCost, hoursCost },
    fees: {
      rentalFee,
      deliveryFee,
      commission,
      deposit,
      insurance,
      total,
    },
  };
}
