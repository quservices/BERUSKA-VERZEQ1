import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, type ReactNode } from 'react';
import { getProduct } from '../data/products';
import { emptyOrder, lineKey, type OrderState, type OrderType } from './types';

const STORAGE_KEY = 'beruska-objednavka-v1';

type Action =
  | { type: 'setType'; orderType: OrderType }
  | { type: 'add'; productId: string; variantId?: string; qty?: number }
  | { type: 'setQty'; key: string; qty: number }
  | { type: 'setVariant'; key: string; variantId: string }
  | { type: 'remove'; key: string }
  | { type: 'update'; recipe: (s: OrderState) => OrderState }
  | { type: 'reset' };

function reducer(state: OrderState, action: Action): OrderState {
  switch (action.type) {
    case 'setType':
      return { ...state, type: action.orderType };
    case 'add': {
      const product = getProduct(action.productId);
      if (!product?.orderable) return state;
      const key = lineKey(action.productId, action.variantId);
      const step = product.step ?? 1;
      const add = action.qty ?? product.minQty ?? step;
      const existing = state.items.find((l) => l.key === key);
      const items = existing
        ? state.items.map((l) => (l.key === key ? { ...l, qty: clampQty(l.qty + add, product.maxQty) } : l))
        : [...state.items, { key, productId: action.productId, variantId: action.variantId, qty: clampQty(add, product.maxQty) }];
      return { ...state, items };
    }
    case 'setQty':
      return { ...state, items: state.items.map((l) => (l.key === action.key ? { ...l, qty: action.qty } : l)) };
    case 'setVariant': {
      const line = state.items.find((l) => l.key === action.key);
      if (!line) return state;
      const key = lineKey(line.productId, action.variantId);
      const merged = state.items.find((l) => l.key === key);
      if (merged && merged !== line) {
        return {
          ...state,
          items: state.items.filter((l) => l !== line).map((l) => (l === merged ? { ...l, qty: l.qty + line.qty } : l)),
        };
      }
      return { ...state, items: state.items.map((l) => (l === line ? { ...l, key, variantId: action.variantId } : l)) };
    }
    case 'remove':
      return { ...state, items: state.items.filter((l) => l.key !== action.key) };
    case 'update':
      return action.recipe(state);
    case 'reset':
      return emptyOrder();
  }
}

function clampQty(qty: number, max?: number) {
  return max ? Math.min(qty, max) : qty;
}

function load(): OrderState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyOrder();
    const saved = JSON.parse(raw) as Partial<OrderState>;
    const base = emptyOrder();
    return {
      ...base,
      ...saved,
      details: { ...base.details, ...saved.details },
      pickup: { ...base.pickup, ...saved.pickup },
      // souhlas a honeypot se neukládají – zákazník je potvrzuje vždy znovu
      customer: { ...base.customer, ...saved.customer, consent: false, website: '' },
      items: (saved.items ?? []).filter((l) => getProduct(l.productId)?.orderable),
      startedAt: Date.now(),
    };
  } catch {
    return emptyOrder();
  }
}

interface OrderContextValue {
  state: OrderState;
  itemCount: number;
  setType: (t: OrderType) => void;
  add: (productId: string, variantId?: string, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  setVariant: (key: string, variantId: string) => void;
  remove: (key: string) => void;
  update: (recipe: (s: OrderState) => OrderState) => void;
  reset: () => void;
}

const OrderContext = createContext<OrderContextValue | null>(null);

export function OrderProvider({ children, initialState }: { children: ReactNode; initialState?: OrderState }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => init ?? load());

  useEffect(() => {
    try {
      const { consent: _c, website: _w, ...customer } = state.customer;
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state, customer }));
    } catch {
      /* úložiště nemusí být dostupné (anonymní režim) – objednávka funguje i bez něj */
    }
  }, [state]);

  const update = useCallback((recipe: (s: OrderState) => OrderState) => dispatch({ type: 'update', recipe }), []);

  const value = useMemo<OrderContextValue>(
    () => ({
      state,
      itemCount: state.items.length,
      setType: (orderType) => dispatch({ type: 'setType', orderType }),
      add: (productId, variantId, qty) => dispatch({ type: 'add', productId, variantId, qty }),
      setQty: (key, qty) => dispatch({ type: 'setQty', key, qty }),
      setVariant: (key, variantId) => dispatch({ type: 'setVariant', key, variantId }),
      remove: (key) => dispatch({ type: 'remove', key }),
      update,
      reset: () => dispatch({ type: 'reset' }),
    }),
    [state, update],
  );

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>;
}

export function useOrder() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrder musí být použito uvnitř <OrderProvider>.');
  return ctx;
}
