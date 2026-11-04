'use server';

import { revalidatePath } from 'next/cache';
import { backendFetch } from '@/lib/backend';
import { mapCart } from '@/lib/cart';
import { identityHeaders } from '@/lib/server-auth';
import type { BackendCart, Cart } from '@/lib/types';

export interface CartActionResult {
  cart?: Cart;
  error?: string;
}

async function mutate(
  path: string,
  init: RequestInit,
  fallbackMessage: string,
): Promise<CartActionResult> {
  try {
    const cart = await backendFetch<BackendCart>(path, {
      ...init,
      headers: await identityHeaders(),
    });
    revalidatePath('/', 'layout');
    return { cart: mapCart(cart) };
  } catch (error) {
    const message = error instanceof Error ? error.message : '';
    if (message.includes('insufficient stock') || message.includes('stock')) {
      return { error: 'No hay stock suficiente para esa cantidad.' };
    }
    if (message.includes('(401)')) {
      return { error: 'Tu sesión venció. Volvé a ingresar.' };
    }
    return { error: fallbackMessage };
  }
}

export async function addToCartAction(
  variationId: string,
  quantity: number,
): Promise<CartActionResult> {
  return mutate(
    '/api/cart/items',
    { method: 'POST', body: JSON.stringify({ productId: variationId, quantity }) },
    'No pudimos agregar la pieza al carrito.',
  );
}

export async function updateCartItemAction(
  cartItemId: string,
  quantity: number,
): Promise<CartActionResult> {
  return mutate(
    `/api/cart/items/${encodeURIComponent(cartItemId)}`,
    { method: 'PATCH', body: JSON.stringify({ quantity }) },
    'No pudimos actualizar el carrito.',
  );
}

export async function removeCartItemAction(
  cartItemId: string,
): Promise<CartActionResult> {
  return mutate(
    `/api/cart/items/${encodeURIComponent(cartItemId)}`,
    { method: 'DELETE' },
    'No pudimos quitar la pieza del carrito.',
  );
}

export async function clearCartAction(): Promise<CartActionResult> {
  return mutate('/api/cart/clear', { method: 'DELETE' }, 'No pudimos vaciar el carrito.');
}
