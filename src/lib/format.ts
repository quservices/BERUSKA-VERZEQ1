const czk = new Intl.NumberFormat('cs-CZ', { style: 'currency', currency: 'CZK', maximumFractionDigits: 0 });
const num = new Intl.NumberFormat('cs-CZ', { maximumFractionDigits: 1 });

export const formatCzk = (amount: number) => czk.format(amount);
export const formatNumber = (n: number) => num.format(n);

export function formatQty(qty: number, unit: string): string {
  return `${formatNumber(qty)} ${unit}`;
}
