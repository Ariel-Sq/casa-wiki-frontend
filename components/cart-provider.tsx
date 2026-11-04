'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  addToCartAction,
  clearCartAction,
  removeCartItemAction,
  updateCartItemAction,
  type CartActionResult,
} from '@/app/actions/cart';
import type { Cart } from '@/lib/types';

interface CartContextValue {
  cart: Cart;
  open: boolean;
  pending: boolean;
  error: string | null;
  setOpen: (open: boolean) => void;
  add: (variationId: string, quantity?: number) => Promise<CartActionResult>;
  update: (cartItemId: string, quantity: number) => Promise<CartActionResult>;
  remove: (cartItemId: string) => Promise<CartActionResult>;
  clear: () => Promise<CartActionResult>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({
  initialCart,
  children,
}: {
  initialCart: Cart;
  children: ReactNode;
}) {
  const [cart, setCart] = useState<Cart>(initialCart);
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (action: () => Promise<CartActionResult>) => {
      setPending(true);
      setError(null);
      try {
        const result = await action();
        if (result.cart) setCart(result.cart);
        if (result.error) setError(result.error);
        return result;
      } finally {
        setPending(false);
      }
    },
    [],
  );

  const add = useCallback(
    async (variationId: string, quantity = 1) => {
      const result = await run(() => addToCartAction(variationId, quantity));
      if (!result.error) setOpen(true);
      return result;
    },
    [run],
  );

  const update = useCallback(
    (cartItemId: string, quantity: number) =>
      run(() => updateCartItemAction(cartItemId, quantity)),
    [run],
  );

  const remove = useCallback(
    (cartItemId: string) => run(() => removeCartItemAction(cartItemId)),
    [run],
  );

  const clear = useCallback(() => run(() => clearCartAction()), [run]);

  const value = useMemo(
    () => ({
      cart,
      open,
      pending,
      error,
      setOpen,
      add,
      update,
      remove,
      clear,
    }),
    [cart, open, pending, error, add, update, remove, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
}
