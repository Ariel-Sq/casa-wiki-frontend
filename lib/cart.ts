import { backendFetch, backendImageUrl } from './backend';
import { identityHeaders } from './server-auth';
import type { BackendCart, Cart, CartItem } from './types';

export function emptyCart(): Cart {
  return { items: [], itemCount: 0, subtotal: 0 };
}

export function mapCart(cart: BackendCart): Cart {
  const items: CartItem[] = (cart.items ?? []).map((item) => {
    const variation = item.productVariation;
    const main =
      variation?.images?.find((img) => img.isMain) ?? variation?.images?.[0];
    const unitPrice =
      item.quantity > 0
        ? Number(item.price) / item.quantity
        : Number(variation?.price ?? 0);

    return {
      cartItemId: item.id,
      variationId: item.productVariationId,
      templateSlug: variation?.template_id ?? '',
      name: variation?.name ?? 'Producto',
      material: variation?.attributes?.material ?? '',
      price: unitPrice,
      image: backendImageUrl(main),
      quantity: item.quantity,
      stock: variation?.stock ?? 0,
    };
  });

  return {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  };
}

export async function getCart(): Promise<Cart> {
  try {
    const cart = await backendFetch<BackendCart>('/api/cart', {
      headers: await identityHeaders(),
    });
    return mapCart(cart);
  } catch {
    return emptyCart();
  }
}
