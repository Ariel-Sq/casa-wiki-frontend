import { backendFetch } from './backend';
import { identityHeaders } from './server-auth';
import type { BackendOrder, Order, OrderStatus } from './types';

const KNOWN: OrderStatus[] = [
  'processing_payment',
  'pending_transfer',
  'paid_preparing',
  'paid_ready_to_ship',
  'paid_shipped',
  'paid_delivered',
  'cancelled',
  'expired',
  'refunded',
];

export function mapOrder(order: BackendOrder): Order {
  const items = (order.items ?? []).map((item) => {
    const image =
      item.productVariation?.images?.find((img) => img.isMain) ??
      item.productVariation?.images?.[0];
    return {
      id: item.id,
      productVariationId: item.productVariationId,
      name: item.title,
      price: Number(item.unitPrice),
      quantity: item.quantity,
      image: image?.url ?? '',
    };
  });

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return {
    id: order.id,
    status: (KNOWN as string[]).includes(order.status)
      ? (order.status as OrderStatus)
      : 'processing_payment',
    total: Number(order.totalAmount ?? subtotal),
    subtotal,
    createdAt: order.createdAt,
    customerEmail: order.customerEmail ?? '',
    customerPhone: order.customerPhone ?? '',
    deliveryMethod: order.deliveryMethod ?? '',
    deliveryAddress: order.deliveryAddress ?? '',
    items,
  };
}

export async function getOrders(): Promise<Order[]> {
  try {
    const orders = await backendFetch<BackendOrder[]>('/api/orders', {
      headers: await identityHeaders(),
    });
    return orders.map(mapOrder);
  } catch {
    return [];
  }
}

export async function getOrder(id: string): Promise<Order | null> {
  try {
    const order = await backendFetch<BackendOrder>(
      `/api/orders/${encodeURIComponent(id)}`,
      { headers: await identityHeaders() },
    );
    return mapOrder(order);
  } catch {
    return null;
  }
}
