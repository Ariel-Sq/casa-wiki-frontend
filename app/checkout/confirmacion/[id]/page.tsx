import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Check,
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  User,
} from 'lucide-react';
import { getOrder } from '@/lib/orders';
import type { OrderStatus } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { whatsappUrl } from '@/lib/whatsapp';
import { PrintButton } from '@/components/print-button';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Pedido confirmado',
};

const STEPS = [
  { title: 'Pedido registrado', copy: 'Pago acreditado u orden enviada al atelier.' },
  { title: 'Coordinación por WhatsApp', copy: 'Definimos entrega, horarios y acceso.' },
  { title: 'Embalaje especial', copy: 'Protección con telas naturales y fibras.' },
  { title: 'Entrega y armado', copy: 'Montaje artesanal en tu espacio.' },
];

function stepState(status: OrderStatus): number {
  switch (status) {
    case 'processing_payment':
      return 0;
    case 'pending_transfer':
    case 'paid_preparing':
      return 1;
    case 'paid_ready_to_ship':
    case 'paid_shipped':
      return 2;
    case 'paid_delivered':
      return 3;
    default:
      return 0;
  }
}

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = await getOrder(id);
  if (!order) notFound();

  const current = stepState(order.status);
  const reference = order.id.slice(0, 8).toUpperCase();
  const message = `Hola Casa Wiki, acabo de confirmar mi pedido #${reference} (${order.items
    .map((item) => `${item.name} x${item.quantity}`)
    .join(', ')}). Quisiera coordinar la entrega.`;

  return (
    <div className="shell py-10">
      <div className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-olive-pale px-3 py-1.5 text-olive-dark">
          <span className="size-1.5 rounded-full bg-olive" /> Coordinando por WhatsApp
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-muted">
          <ShieldCheck className="size-3.5" /> Transacción segura · Ref. CW-{reference}
        </span>
      </div>

      <div className="mt-5 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-[44px] leading-none tracking-tight md:text-[56px]">
            ¡Pedido Confirmado!
          </h1>
          <p className="mt-3 max-w-2xl text-[13.5px] leading-relaxed text-muted">
            Gracias por confiar en el diseño consciente y la nobleza de nuestras maderas.
            Tu compra ya ingresó al atelier de ebanistería.
          </p>
        </div>
        <div className="flex items-center gap-3 rounded-xl border border-line bg-surface px-4 py-3">
          <span className="grid size-9 place-items-center rounded-full bg-olive-pale text-olive">
            <Mail className="size-4" />
          </span>
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted">
              Comprobante digital
            </p>
            <p className="text-[12.5px] font-semibold">{order.customerEmail || 'Tu correo'}</p>
          </div>
        </div>
      </div>

      <section className="mt-7 flex flex-col items-start justify-between gap-5 rounded-2xl bg-surface-low p-6 md:flex-row md:items-center md:p-8">
        <div className="flex items-start gap-4">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-olive text-white">
            <MessageCircle className="size-5" />
          </span>
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-olive">
              Atención personalizada en atelier · Respuesta inmediata
            </p>
            <h2 className="mt-1 max-w-xl font-display text-[26px] leading-tight md:text-[30px]">
              Tu pedido está listo para coordinar entrega por WhatsApp.
            </h2>
            <p className="mt-2 max-w-2xl text-[12.5px] leading-relaxed text-muted">
              Un asesor de nuestro equipo te contactará en breve. También podés iniciar el
              diálogo ahora para elegir el día, la franja horaria y los requisitos de acceso
              para el armado en tu domicilio.
            </p>
          </div>
        </div>
        <a
          href={whatsappUrl(message)}
          target="_blank"
          rel="noreferrer"
          className="btn btn-primary shrink-0 px-6 py-3.5 text-[11.5px] uppercase tracking-[0.06em]"
        >
          <MessageCircle className="size-4" />
          Iniciar coordinación
        </a>
      </section>

      <section className="mt-6 rounded-2xl border border-line bg-surface p-6 md:p-7">
        <div className="flex flex-col justify-between gap-2 md:flex-row md:items-end">
          <div>
            <p className="text-[9.5px] font-semibold uppercase tracking-[0.16em] text-muted">
              Estado de logística artesanal
            </p>
            <h2 className="mt-1 font-display text-[26px]">Hoja de ruta de tu compra</h2>
          </div>
          <p className="text-[11px] text-muted">
            Tiempo estimado de entrega: 4 a 7 días hábiles
          </p>
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {STEPS.map((step, index) => {
            const done = index < current;
            const active = index === current;
            return (
              <div
                key={step.title}
                className={
                  active
                    ? 'rounded-xl border border-olive/30 bg-olive-pale/50 p-4'
                    : 'rounded-xl border border-line p-4'
                }
              >
                <div className="flex items-center justify-between">
                  <span
                    className={
                      done
                        ? 'grid size-8 place-items-center rounded-full bg-olive text-white'
                        : active
                          ? 'grid size-8 place-items-center rounded-full bg-clay text-white'
                          : 'grid size-8 place-items-center rounded-full border border-line text-[11px] font-semibold text-muted'
                    }
                  >
                    {done ? <Check className="size-4" /> : index + 1}
                  </span>
                  <span className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                    {done ? 'Completado' : active ? 'En curso' : 'Próximo'}
                  </span>
                </div>
                <p className="mt-3 text-[12.5px] font-semibold">{step.title}</p>
                <p className="mt-1 text-[10.5px] leading-snug text-muted">{step.copy}</p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="rounded-2xl border border-line bg-surface p-6">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-[24px]">Detalle de las piezas</h2>
            <span className="text-[11px] text-muted">
              {order.items.length} {order.items.length === 1 ? 'artículo' : 'artículos'}
            </span>
          </div>

          <ul className="mt-4 space-y-4">
            {order.items.map((item) => (
              <li key={item.id} className="flex gap-3 border-b border-line pb-4 last:border-0 last:pb-0">
                <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-surface-mid">
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-cover" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold leading-snug">{item.name}</p>
                  <p className="mt-1 text-[10.5px] text-muted">Cantidad: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-[10px] text-muted">
                    6 cuotas de {formatPrice((item.price * item.quantity) / 6)}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-4 space-y-2 rounded-xl bg-surface-low p-4 text-[12.5px]">
            <div className="flex justify-between">
              <span className="text-muted">Subtotal productos</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Envío especializado</span>
              <span className="font-semibold text-olive">Gratis</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Servicio de montaje</span>
              <span className="text-olive">Bonificado</span>
            </div>
            <div className="flex items-end justify-between border-t border-line pt-2">
              <span className="text-[13px] font-semibold">Total</span>
              <span className="font-display text-[26px] leading-none">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </section>

        <div className="space-y-4">
          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="flex items-center gap-2 font-display text-[22px]">
              <Truck className="size-5 text-olive" /> Datos de entrega
            </h2>
            <p className="mt-1 text-[10.5px] text-muted">
              Información registrada para coordinar la logística.
            </p>

            <dl className="mt-4 space-y-3 text-[12px]">
              <div className="flex gap-2.5">
                <User className="mt-0.5 size-3.5 shrink-0 text-muted" />
                <div>
                  <dt className="text-[9.5px] uppercase tracking-[0.1em] text-muted">Contacto</dt>
                  <dd>{order.customerEmail || '—'}</dd>
                </div>
              </div>
              <div className="flex gap-2.5">
                <MapPin className="mt-0.5 size-3.5 shrink-0 text-muted" />
                <div>
                  <dt className="text-[9.5px] uppercase tracking-[0.1em] text-muted">
                    {order.deliveryMethod === 'pickup' ? 'Retiro' : 'Destino'}
                  </dt>
                  <dd>
                    {order.deliveryMethod === 'pickup'
                      ? 'Atelier Casa Wiki · Palermo, CABA'
                      : order.deliveryAddress || 'A coordinar por WhatsApp'}
                  </dd>
                </div>
              </div>
              <div className="flex gap-2.5">
                <Phone className="mt-0.5 size-3.5 shrink-0 text-muted" />
                <div>
                  <dt className="text-[9.5px] uppercase tracking-[0.1em] text-muted">
                    Teléfono / WhatsApp
                  </dt>
                  <dd>{order.customerPhone || 'A coordinar'}</dd>
                </div>
              </div>
            </dl>

            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-olive-pale py-2.5 text-[11px] font-semibold text-olive-dark hover:bg-olive-soft"
            >
              <MessageCircle className="size-3.5" /> WhatsApp oficial de soporte
            </a>
          </section>

          <section className="rounded-2xl border border-line bg-surface p-6">
            <h2 className="flex items-center gap-2 font-display text-[20px]">
              <Sparkles className="size-4.5 text-clay" /> Garantía de atelier por 5 años
            </h2>
            <p className="mt-2 text-[11.5px] leading-relaxed text-muted">
              Estructuras de madera maciza ensambladas artesanalmente con espigas y colas
              biodegradables de alta resistencia.
            </p>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <PrintButton />
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 rounded-full bg-olive px-4 py-2.5 text-[11.5px] font-semibold text-white hover:bg-olive-dark"
              >
                <Package className="size-3.5" /> Volver a la tienda
              </Link>
            </div>
          </section>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-xl bg-olive-pale/60 p-4 text-[11.5px] text-olive-dark">
        <CheckCircle2 className="size-5 shrink-0" />
        Guardá este comprobante. Podés seguir el estado de tu pedido desde{' '}
        <Link href="/cuenta" className="font-semibold underline underline-offset-2">
          Mi cuenta
        </Link>
        .
      </div>
    </div>
  );
}
