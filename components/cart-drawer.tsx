'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useCart } from './cart-provider';
import { FREE_SHIPPING_THRESHOLD, MAX_INSTALLMENTS } from '@/lib/constants';
import { formatPrice } from '@/lib/utils';

export function CartDrawer() {
  const { cart, open, setOpen, pending, error, update, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!open) return null;

  const missing = Math.max(0, FREE_SHIPPING_THRESHOLD - cart.subtotal);
  const progress = Math.min(100, (cart.subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="animate-fade absolute inset-0 bg-ink/35 backdrop-blur-[2px]"
        onClick={() => setOpen(false)}
        aria-label="Cerrar carrito"
      />

      <aside className="animate-drawer absolute inset-y-0 right-0 flex w-full max-w-[460px] flex-col bg-[#fbfaf7] shadow-lift">
        <div className="flex items-start justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="grid size-11 place-items-center rounded-full bg-olive-soft text-olive">
              <ShoppingBag className="size-5" />
            </span>
            <div>
              <h2 className="font-display text-[24px] leading-none">Tu Carrito</h2>
              <p className="mt-1.5 text-[12px] text-muted">
                {cart.itemCount === 0
                  ? 'Todavía no elegiste ninguna pieza'
                  : `${cart.itemCount} ${cart.itemCount === 1 ? 'pieza seleccionada' : 'piezas seleccionadas'} en tu atelier`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="grid size-9 place-items-center rounded-full border border-line bg-surface text-ink"
            aria-label="Cerrar carrito"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="border-b border-line px-6 py-4">
          <div className="flex items-center justify-between text-[11.5px] font-semibold">
            <span className="text-olive">
              {missing === 0
                ? '¡Genial! Tenés envío gratis desbloqueado'
                : `Te faltan ${formatPrice(missing)} para el envío gratis`}
            </span>
            <span className="text-muted">{Math.round(progress)}%</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-surface-mid">
            <div
              className="h-full rounded-full bg-olive transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {error && (
            <p className="mb-4 rounded-lg bg-[#fdecea] px-3 py-2 text-[12.5px] text-[#93000a]">
              {error}
            </p>
          )}

          {cart.items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
              <span className="grid size-16 place-items-center rounded-full bg-surface-mid text-olive">
                <ShoppingBag className="size-7" />
              </span>
              <p className="font-display text-2xl">Tu carrito está vacío</p>
              <p className="max-w-[260px] text-sm text-muted">
                Explorá la colección y sumá piezas hechas para durar generaciones.
              </p>
              <Link href="/catalogo" onClick={() => setOpen(false)} className="btn btn-primary">
                Ver catálogo
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-3">
              {cart.items.map((item) => (
                <li
                  key={item.cartItemId}
                  className="flex gap-3 rounded-xl border border-line bg-surface p-3"
                >
                  <Link
                    href={`/producto/${item.templateSlug || item.variationId}`}
                    onClick={() => setOpen(false)}
                    className="relative size-[82px] shrink-0 overflow-hidden rounded-lg bg-surface-mid"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="82px"
                        className="object-cover"
                      />
                    ) : null}
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-[13.5px] font-semibold leading-snug">
                          {item.name}
                        </p>
                        {item.material && (
                          <p className="mt-0.5 text-[11px] text-muted">{item.material}</p>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(item.cartItemId)}
                        disabled={pending}
                        className="text-muted transition-colors hover:text-terracotta disabled:opacity-40"
                        aria-label={`Quitar ${item.name}`}
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="flex items-center gap-2.5 rounded-full border border-line px-2.5 py-1">
                        <button
                          type="button"
                          disabled={pending || item.quantity <= 1}
                          onClick={() => update(item.cartItemId, item.quantity - 1)}
                          className="disabled:opacity-30"
                          aria-label="Restar una unidad"
                        >
                          <Minus className="size-3.5" />
                        </button>
                        <span className="min-w-4 text-center text-[13px] font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={pending || item.quantity >= item.stock}
                          onClick={() => update(item.cartItemId, item.quantity + 1)}
                          className="disabled:opacity-30"
                          aria-label="Sumar una unidad"
                        >
                          <Plus className="size-3.5" />
                        </button>
                      </div>
                      <p className="text-[15px] font-semibold">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cart.items.length > 0 && (
          <div className="border-t border-line bg-surface-low px-6 py-5">
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between">
                <span className="text-muted">Subtotal de productos</span>
                <span className="font-medium">{formatPrice(cart.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted">Envío especial a domicilio</span>
                <span className="font-semibold text-olive">
                  {missing === 0 ? 'GRATIS' : 'A coordinar'}
                </span>
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-olive-pale px-3 py-2.5 text-[11.5px] leading-snug text-olive-dark">
              <strong>Seguimiento por WhatsApp:</strong> coordinamos entrega y horarios de
              forma personalizada apenas confirmás tu compra.
            </div>

            <div className="mt-4 flex items-end justify-between">
              <div>
                <p className="text-[13px] font-semibold">Total Final</p>
                <p className="text-[11px] text-muted">
                  o {MAX_INSTALLMENTS} cuotas sin interés de{' '}
                  {formatPrice(cart.subtotal / MAX_INSTALLMENTS)}
                </p>
              </div>
              <p className="font-display text-[28px] leading-none">
                {formatPrice(cart.subtotal)}
              </p>
            </div>

            <Link
              href="/checkout"
              onClick={() => setOpen(false)}
              className="btn btn-primary mt-4 w-full py-4 text-[13px] uppercase tracking-[0.08em]"
            >
              Iniciar compra segura
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="mt-2.5 w-full text-center text-[12px] text-muted underline underline-offset-4"
            >
              Continuar explorando el catálogo
            </button>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9px] font-semibold tracking-[0.12em] text-muted">
              <span>VISA</span>
              <span>MASTERCARD</span>
              <span>MERCADO PAGO</span>
              <span>AMEX</span>
            </div>
            <p className="mt-1.5 text-center text-[9.5px] text-muted">
              Encriptación SSL 256-bit · 10% OFF extra abonando con transferencia
            </p>
          </div>
        )}
      </aside>
    </div>
  );
}
