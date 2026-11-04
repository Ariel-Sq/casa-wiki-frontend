import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getCart } from '@/lib/cart';
import { CheckoutClient } from '@/components/checkout-client';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Checkout',
  description: 'Coordiná la compra de tus piezas Casa Wiki por WhatsApp o MercadoPago.',
};

export default async function CheckoutPage() {
  const [cart, session] = await Promise.all([getCart(), getServerSession(authOptions)]);
  if (cart.items.length === 0) redirect('/catalogo');

  return (
    <div className="shell py-10">
      <CheckoutClient defaultEmail={session?.user?.email ?? ''} />
    </div>
  );
}
