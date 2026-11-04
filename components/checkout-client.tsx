'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  Check,
  CreditCard,
  Loader2,
  Lock,
  MessageCircle,
  ShieldCheck,
  Store,
  Truck,
} from 'lucide-react';
import { createCheckoutAction, type CheckoutInput } from '@/app/actions/checkout';
import { useCart } from './cart-provider';
import { MAX_INSTALLMENTS, MERCADOPAGO_SURCHARGE_RATE } from '@/lib/constants';
import { cn, formatPrice } from '@/lib/utils';

export function CheckoutClient({ defaultEmail }: { defaultEmail: string }) {
  const { cart, pending: cartPending } = useCart();
  const router = useRouter();
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState('');
  const [dni, setDni] = useState('');
  const [delivery, setDelivery] = useState<'delivery' | 'pickup'>('delivery');
  const [address, setAddress] = useState('');
  const [payment, setPayment] = useState<'offline' | 'mercadopago'>('offline');
  const [terms, setTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const idempotencyKey = useMemo(() => crypto.randomUUID(), []);

  const surcharge =
    payment === 'mercadopago' ? Math.round(cart.subtotal * MERCADOPAGO_SURCHARGE_RATE) : 0;
  const total = cart.subtotal + surcharge;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);

    if (!terms) {
      setError('Tenés que aceptar los términos y la política de privacidad.');
      return;
    }

    setSubmitting(true);
    const payload: CheckoutInput = {
      customerEmail: email.trim(),
      customerPhone: phone.trim(),
      customerDni: dni.trim() || undefined,
      deliveryMethod: delivery,
      deliveryAddress: delivery === 'delivery' ? address.trim() : undefined,
      paymentMethod: payment,
      idempotencyKey,
    };

    const result = await createCheckoutAction(payload);
    setSubmitting(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    if (result.mode === 'mercadopago' && result.checkoutUrl) {
      window.location.href = result.checkoutUrl;
      return;
    }

    if (result.orderId) {
      router.push(`/checkout/confirmacion/${result.orderId}`);
      return;
    }

    setError('No pudimos generar el pedido. Intentá de nuevo.');
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <div>
        <Link
          href="/catalogo"
          className="inline-flex items-center gap-2 text-[11.5px] text-muted hover:text-olive"
        >
          <ArrowLeft className="size-3.5" /> Seguir explorando
        </Link>

        <h1 className="mt-4 font-display text-[38px] leading-tight md:text-[46px]">
          Coordinemos tu pieza
        </h1>
        <p className="mt-2 max-w-xl text-[13.5px] leading-relaxed text-muted">
          Completá tus datos y elegí cómo querés abonar. Un asesor del atelier te
          contactará por WhatsApp para confirmar entrega, horarios y armado.
        </p>

        <section className="mt-8 rounded-xl border border-line bg-surface p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-olive text-[12px] font-semibold text-white">
              1
            </span>
            <h2 className="font-display text-[22px]">Tus datos de contacto</h2>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                Correo electrónico *
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="ejemplo@casawiki.com"
                className="field mt-1.5"
              />
            </label>
            <label className="block">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                Teléfono / WhatsApp *
              </span>
              <input
                type="tel"
                required
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+54 9 11 0000-0000"
                className="field mt-1.5"
              />
            </label>
            <label className="block sm:col-span-2 sm:max-w-[240px]">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                DNI / CUIT
              </span>
              <input
                value={dni}
                onChange={(event) => setDni(event.target.value)}
                placeholder="Opcional"
                className="field mt-1.5"
              />
            </label>
          </div>
        </section>

        <section className="mt-4 rounded-xl border border-line bg-surface p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-olive text-[12px] font-semibold text-white">
              2
            </span>
            <h2 className="font-display text-[22px]">Entrega</h2>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setDelivery('delivery')}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                delivery === 'delivery'
                  ? 'border-olive bg-olive-pale/60'
                  : 'border-line hover:border-olive/60',
              )}
            >
              <Truck className="mt-0.5 size-5 text-olive" />
              <span>
                <span className="block text-[13px] font-semibold">Envío a domicilio</span>
                <span className="mt-0.5 block text-[11px] text-muted">
                  Gratis a todo el país. Armado incluido en CABA y GBA.
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={() => setDelivery('pickup')}
              className={cn(
                'flex items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                delivery === 'pickup'
                  ? 'border-olive bg-olive-pale/60'
                  : 'border-line hover:border-olive/60',
              )}
            >
              <Store className="mt-0.5 size-5 text-olive" />
              <span>
                <span className="block text-[13px] font-semibold">Retiro en atelier</span>
                <span className="mt-0.5 block text-[11px] text-muted">
                  Palermo, Buenos Aires. Coordinamos día y horario.
                </span>
              </span>
            </button>
          </div>

          {delivery === 'delivery' && (
            <label className="mt-4 block">
              <span className="text-[10.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                Dirección de entrega *
              </span>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                placeholder="Calle, número, piso/depto, localidad y código postal"
                className="field mt-1.5 resize-none"
              />
              <span className="mt-1 block text-[10.5px] text-muted">
                Si el edificio tiene ascensor o acceso especial, lo coordinamos por
                WhatsApp.
              </span>
            </label>
          )}
        </section>

        <section className="mt-4 rounded-xl border border-line bg-surface p-5 md:p-6">
          <div className="flex items-center gap-3">
            <span className="grid size-8 place-items-center rounded-full bg-olive text-[12px] font-semibold text-white">
              3
            </span>
            <h2 className="font-display text-[22px]">Forma de pago</h2>
          </div>

          <div className="mt-5 space-y-3">
            <button
              type="button"
              onClick={() => setPayment('offline')}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                payment === 'offline'
                  ? 'border-olive bg-olive-pale/60'
                  : 'border-line hover:border-olive/60',
              )}
            >
              <MessageCircle className="mt-0.5 size-5 text-olive" />
              <span className="flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold">
                    Transferencia o efectivo · coordinado por WhatsApp
                  </span>
                  <span className="rounded-full bg-olive-soft px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-olive-dark">
                    Mejor precio
                  </span>
                </span>
                <span className="mt-1 block text-[11.5px] leading-snug text-muted">
                  Reservás la pieza ahora y un asesor te envía los datos de transferencia.
                  Sin recargos.
                </span>
              </span>
            </button>

            <button
              type="button"
              onClick={() => setPayment('mercadopago')}
              className={cn(
                'flex w-full items-start gap-3 rounded-xl border p-4 text-left transition-colors',
                payment === 'mercadopago'
                  ? 'border-olive bg-olive-pale/60'
                  : 'border-line hover:border-olive/60',
              )}
            >
              <CreditCard className="mt-0.5 size-5 text-olive" />
              <span className="flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold">Tarjeta o dinero en cuenta</span>
                  <span className="text-[11px] font-semibold text-muted">
                    +{Math.round(MERCADOPAGO_SURCHARGE_RATE * 100)}%
                  </span>
                </span>
                <span className="mt-1 block text-[11.5px] leading-snug text-muted">
                  Pagás ahora con MercadoPago en hasta {MAX_INSTALLMENTS} cuotas. El
                  recargo corresponde al precio de lista.
                </span>
              </span>
            </button>
          </div>
        </section>

        {error && (
          <p className="mt-4 rounded-lg bg-[#fdecea] px-4 py-3 text-[12.5px] text-[#93000a]">
            {error}
          </p>
        )}

        <label className="mt-5 flex items-start gap-2.5 text-[11.5px] leading-snug text-muted">
          <input
            type="checkbox"
            checked={terms}
            onChange={(event) => setTerms(event.target.checked)}
            className="mt-0.5 accent-olive"
          />
          Acepto los términos de atelier, la política de privacidad y la coordinación de
          entrega por WhatsApp.
        </label>
      </div>

      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="rounded-xl border border-line bg-surface p-5">
          <h2 className="font-display text-[22px]">Resumen de tu compra</h2>

          <ul className="mt-4 space-y-3">
            {cart.items.map((item) => (
              <li key={item.cartItemId} className="flex gap-3">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-surface-mid">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-[12.5px] font-medium leading-snug">
                    {item.name}
                  </p>
                  <p className="text-[10.5px] text-muted">
                    {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <p className="text-[12.5px] font-semibold">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-5 space-y-2 border-t border-line pt-4 text-[12.5px]">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal</span>
              <span>{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Envío</span>
              <span className="font-semibold text-olive">Gratis</span>
            </div>
            {surcharge > 0 && (
              <div className="flex justify-between">
                <span className="text-muted">Recargo MercadoPago</span>
                <span>{formatPrice(surcharge)}</span>
              </div>
            )}
            <div className="flex items-end justify-between border-t border-line pt-3">
              <span className="text-[13px] font-semibold">Total</span>
              <span className="font-display text-[28px] leading-none">{formatPrice(total)}</span>
            </div>
            {payment === 'offline' && (
              <p className="text-right text-[10.5px] text-muted">
                o {MAX_INSTALLMENTS} cuotas sin interés de {formatPrice(total / MAX_INSTALLMENTS)}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={submitting || cartPending || cart.items.length === 0}
            className="btn btn-primary mt-4 w-full py-4 text-[12px] uppercase tracking-[0.08em] disabled:opacity-60"
          >
            {submitting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Procesando...
              </>
            ) : (
              <>
                <Lock className="size-4" />
                {payment === 'mercadopago' ? 'Ir a pagar' : 'Confirmar pedido'}
              </>
            )}
          </button>

          <div className="mt-4 space-y-2 text-[10.5px] text-muted">
            <p className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-olive" /> Pago seguro SSL 256-bit
            </p>
            <p className="flex items-center gap-2">
              <Check className="size-3.5 text-olive" /> Garantía estructural de 5 años
            </p>
            <p className="flex items-center gap-2">
              <MessageCircle className="size-3.5 text-olive" /> Seguimiento por WhatsApp
            </p>
          </div>
        </div>

        <p className="mt-3 px-2 text-center text-[10px] leading-relaxed text-muted">
          Al confirmar, reservamos el stock de tu pieza. Si elegiste transferencia, el
          pedido queda pendiente hasta acreditar el pago.
        </p>
      </aside>
    </form>
  );
}
