import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import {
  ArrowLeft,
  BadgeCheck,
  Leaf,
  MessageCircle,
  Sparkles,
  UserRound,
} from 'lucide-react';
import { authOptions } from '@/lib/auth';
import { LoginPanel } from '@/components/login-panel';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Ingresar',
  description:
    'Accedé a tu cuenta Casa Wiki para seguir tus pedidos y coordinar entregas y armado por WhatsApp.',
};

const BENEFITS = [
  {
    icon: MessageCircle,
    title: 'Coordinación por WhatsApp',
    copy: 'Confirmación de entregas, horarios y armado con nosotros.',
  },
  {
    icon: BadgeCheck,
    title: 'Seguimiento de pedidos',
    copy: 'Consultá el estado y el historial de tus compras desde tu cuenta.',
  },
  {
    icon: UserRound,
    title: 'Tus datos guardados',
    copy: 'Direcciones y datos de contacto listos para tu próxima compra.',
  },
  {
    icon: Sparkles,
    title: 'Atención personalizada',
    copy: 'Asesoramiento en medidas, materiales y terminaciones.',
  },
];

export default async function IngresarPage() {
  const session = await getServerSession(authOptions);
  if (session?.user) redirect('/cuenta');

  return (
    <div className="shell py-8 md:py-12">
      <Link
        href="/"
        className="mb-5 inline-flex items-center gap-2 text-[11.5px] text-muted hover:text-olive-dark"
      >
        <ArrowLeft className="size-3.5" /> Volver a la tienda
      </Link>

      <div className="grid overflow-hidden rounded-2xl border border-line bg-surface shadow-soft lg:grid-cols-2">
        <div className="relative min-h-[420px] overflow-hidden bg-olive-dark p-8 text-white md:p-12 lg:min-h-[660px]">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1400&q=80"
            alt="Interior Casa Wiki"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-olive-dark/60 via-olive-dark/80 to-[#0a1c33]/95" />

          <div className="relative z-10 flex h-full flex-col">
            <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.16em] backdrop-blur">
              <Leaf className="size-3.5" /> Tu cuenta Casa Wiki
            </span>

            <h1 className="mt-10 max-w-md font-display text-[38px] leading-[1.06] md:text-[46px]">
              Todo lo que necesitás para tu compra, en un solo lugar.
            </h1>

            <ul className="mt-8 space-y-5">
              {BENEFITS.map((benefit) => (
                <li key={benefit.title} className="flex gap-3.5">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-white/12 text-olive-soft">
                    <benefit.icon className="size-4.5" />
                  </span>
                  <div>
                    <p className="text-[13px] font-semibold">{benefit.title}</p>
                    <p className="mt-0.5 max-w-xs text-[11.5px] leading-snug text-white/65">
                      {benefit.copy}
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex items-center justify-between pt-10 text-[9.5px] uppercase tracking-[0.16em] text-white/55">
              <span>Est. 2021 · Buenos Aires — Córdoba</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-olive-soft" /> Soporte personalizado
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center px-6 py-10 md:px-12 md:py-14">
          <div className="flex flex-col items-center text-center">
            <Image
              src="/casa-wiki-logo-azul.png"
              alt="Casa Wiki"
              width={1774}
              height={887}
              className="h-20 w-auto md:h-24"
            />
            <p className="mt-2 text-[8.5px] font-semibold uppercase tracking-[0.32em] text-muted">
              Mobiliario · Fabricación nacional
            </p>
          </div>

          <div className="mt-8 w-full">
            <LoginPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
