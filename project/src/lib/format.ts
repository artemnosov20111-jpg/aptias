export function formatPrice(value: number): string {
  return new Intl.NumberFormat("ru-RU", {
    style: "currency",
    currency: "RUB",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(value);
}

export function calcDiscount(market: number, liquidation: number): number {
  if (market <= 0) return 0;
  return Math.round(((market - liquidation) / market) * 100);
}

export function generateReserveId(): string {
  const num = Math.floor(1000 + Math.random() * 9000);
  return `SR-${num}`;
}
