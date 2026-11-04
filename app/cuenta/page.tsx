import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { ArrowRight, Leaf, Package, Sparkles } from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { getOrders } from '@/lib/orders';
import { formatPrice } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Mi cuenta',
};

const STATUS_LABEL: Record<string, string> = {
  processing_payment: 'Procesando pago',
  pending_transfer: 'Pendiente de transferencia',
  paid_preparing: 'En preparación',
  paid_ready_to_ship: 'Listo para enviar',
  paid_shipped: 'En camino',
  paid_delivered: 'Entregado',
  cancelled: 'Cancelado',
  expired: 'Expirado',
  refunded: 'Reembolsado',
};

export default async function CuentaPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect('/ingresar');

  const orders = await getOrders();

  return (
    <div className="shell py-10">
      <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
        <aside className="h-fit rounded-2xl border border-line bg-surface p-6">
          <span className="grid size-14 place-items-center rounded-full bg-olive text-[20px] font-semibold text-white">
            {(session.user.name || session.user.email || 'C').slice(0, 1).toUpperCase()}
          </span>
          <h1 className="mt-4 font-display text-[28px] leading-tight">
            {session.user.name || 'Bienvenido'}
          </h1>
          <p className="mt-1 text-[12px] text-muted">{session.user.email}</p>

          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-olive-pale px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-olive-dark">
            <Leaf className="size-3.5" /> Miembro del Club
          </div>

          <div className="mt-6 space-y-2 border-t border-line pt-4 text-[12.5px]">
            <p className="flex items-center justify-between">
              <span className="text-muted">Pedidos</span>
              <span className="font-semibold">{orders.length}</span>
            </p>
            <p className="flex items-center justify-between">
              <span className="text-muted">Beneficio club</span>
              <span className="font-semibold text-olive">10% OFF</span>
            </p>
          </div>

          <div className="mt-6 rounded-xl bg-surface-low p-4">
            <p className="flex items-center gap-1.5 text-[12px] font-semibold">
              <Sparkles className="size-3.5 text-clay" /> Atención de atelier
            </p>
            <p className="mt-1 text-[11px] leading-snug text-muted">
              ¿Necesitás una medida especial o combinar piezas? Escribinos y lo vemos
              juntos.
            </p>
            <a
              href="https://wa.me/5491145892000"
              className="btn btn-primary mt-3 w-full py-2.5 text-[11px]"
            >
              WhatsApp
            </a>
          </div>
        </aside>

        <section id="pedidos">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow text-olive">Historial</p>
              <h2 className="mt-1 font-display text-[30px] leading-tight">Mis pedidos</h2>
            </div>
            <Link
              href="/catalogo"
              className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-olive"
            >
              Seguir comprando <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-line bg-surface px-6 py-16 text-center">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-surface-mid text-olive">
                <Package className="size-6" />
              </span>
              <p className="mt-4 font-display text-2xl">Todavía no hay pedidos</p>
              <p className="mt-2 text-[13px] text-muted">
                Cuando confirmes tu primera pieza, la vas a ver acá con su seguimiento.
              </p>
              <Link href="/catalogo" className="btn btn-primary mt-5">
                Explorar colección
              </Link>
            </div>
          ) : (
            <ul className="mt-5 space-y-4">
              {orders.map((order) => (
                <li key={order.id} className="rounded-2xl border border-line bg-surface p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted">
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted">
                        {new Date(order.createdAt).toLocaleDateString('es-AR', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="rounded-full bg-olive-pale px-3 py-1 text-[10px] font-semibold text-olive-dark">
                      {STATUS_LABEL[order.status] ?? order.status}
                    </span>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {order.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="relative size-14 overflow-hidden rounded-lg bg-surface-mid"
                        >
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          )}
                        </div>
                      ))}
                      <span className="ml-1 text-[11.5px] text-muted">
                        {order.items.reduce((sum, item) => sum + item.quantity, 0)} piezas
                      </span>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="font-display text-[22px]">{formatPrice(order.total)}</p>
                      <Link
                        href={`/checkout/confirmacion/${order.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-[11px] font-semibold hover:border-olive hover:text-olive"
                      >
                        Ver detalle <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
