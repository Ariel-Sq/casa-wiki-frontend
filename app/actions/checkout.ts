'use server';

import { BACKEND_URL } from '@/lib/env';
import { frontendKeyHeaders } from '@/lib/backend';
import { identityHeaders } from '@/lib/server-auth';

export interface CheckoutInput {
  customerEmail: string;
  customerPhone: string;
  customerDni?: string;
  deliveryMethod: 'delivery' | 'pickup';
  deliveryAddress?: string;
  paymentMethod: 'mercadopago' | 'offline';
  idempotencyKey: string;
}

export interface CheckoutResult {
  mode?: 'mercadopago' | 'offline';
  orderId?: string;
  checkoutUrl?: string;
  error?: string;
}

export async function createCheckoutAction(
  input: CheckoutInput,
): Promise<CheckoutResult> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/payments/mercadopago/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...frontendKeyHeaders(),
        ...(await identityHeaders()),
      },
      body: JSON.stringify(input),
      cache: 'no-store',
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      if (data?.error === 'INSUFFICIENT_STOCK') {
        return {
          error:
            'No hay stock suficiente de alguna pieza del carrito. Ajustá las cantidades e intentá de nuevo.',
        };
      }
      return {
        error:
          typeof data?.message === 'string'
            ? data.message
            : 'No pudimos iniciar la compra. Intentá de nuevo en unos minutos.',
      };
    }

    return data as CheckoutResult;
  } catch (error) {
    console.error('[checkout] failed', error);
    return {
      error:
        'No pudimos conectar con el atelier. Revisá tu conexión e intentá de nuevo.',
    };
  }
}
