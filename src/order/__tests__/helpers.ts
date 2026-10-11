import { emptyOrder, lineKey, type OrderState } from '../types';

export function order(patch: (s: OrderState) => void = () => {}): OrderState {
  const s = emptyOrder(Date.now() - 60_000);
  patch(s);
  return s;
}

export function line(productId: string, qty: number, variantId?: string) {
  return { key: lineKey(productId, variantId), productId, variantId, qty };
}
