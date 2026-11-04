import Image from 'next/image';
import Link from 'next/link';
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  TreePine,
} from 'lucide-react';
import { ProductCard } from '@/components/product-card';
import { getFeaturedProducts } from '@/lib/products';
import { whatsappUrl } from '@/lib/whatsapp';

export const dynamic = 'force-dynamic';

const SPACES = [
  {
    title: 'Living & Sofás',
    copy: 'Piezas de encuentro',
    image:
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=80',
    href: '/catalogo?categoria=sillas',
    count: 'Sillones y sillas',
  },
  {
    title: 'Comedor & Mesas',
    copy: 'El ritual de compartir',
    image:
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80',
    href: '/catalogo?categoria=mesas-de-comedor',
    count: 'Mesas de comedor',
  },
  {
    title: 'Dormitorio & Relax',
    copy: 'Refugio y descanso',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    href: '/catalogo?categoria=comodas',
    count: 'Cómodas y respaldos',
  },
  {
    title: 'Iluminación & Deco',
    copy: 'Detalles que habitan',
    image:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    href: '/catalogo?categoria=espejos',
    count: 'Espejos y objetos',
  },
];

const TESTIMONIALS = [
  {
    quote:
      'El sofa modular transformó el living por completo. La calidad de la madera y el lino se sienten en cada detalle. La coordinación por WhatsApp fue impecable.',
    name: 'Valentina M.',
    place: 'Palermo, Buenos Aires',
    piece: 'Sofá Modular Alba',
    image:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=80',
  },
  {
    quote:
      'Buscábamos una mesa para toda la vida. Nos asesoraron con las medidas, la madera y el acabado. Llegó en el plazo prometido y armada.',
    name: 'Tomás & Lucía',
    place: 'Villa Allende, Córdoba',
    piece: 'Mesa de Comedor Roble',
    image:
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80',
  },
  {
    quote:
      'El acompañamiento postventa es real. A los meses volvimos a pedir dos mesas de luz y el mismo equipo se ocupó de que combinen perfecto.',
    name: 'Carolina R.',
    place: 'Pilar, Buenos Aires',
    piece: 'Mesas de Luz Nórdicas',
    image:
      'https://images.unsplash.com/photo-1615529182904-14819c35db37?auto=format&fit=crop&w=900&q=80',
  },
];

export default async function HomePage() {
  const products = await getFeaturedProducts(8);

  return (
    <>
      {/* Hero editorial */}
      <section className="pt-6">
        <div className="shell">
          <div className="relative min-h-[620px] overflow-hidden rounded-2xl lg:min-h-[700px]">
            <Image
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=2200&q=85"
              alt="Living luminoso con muebles artesanales de Casa Wiki"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#12200f]/90 via-[#12200f]/35 to-transparent" />

            <div className="relative z-10 flex min-h-[620px] flex-col justify-end p-6 md:p-12 lg:min-h-[700px]">
              <div className="max-w-2xl text-white">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] backdrop-blur-md">
                  <span className="size-1.5 rounded-full bg-olive-soft" />
                  Lanzamiento exclusivo · Solsticio 2026
                </span>
                <h1 className="mt-5 font-display text-[42px] leading-[1.02] tracking-tight text-balance md:text-[58px]">
                  Diseño consciente para hogares con alma.
                </h1>
                <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-white/80 md:text-[16.5px]">
                  Muebles artesanales concebidos en maderas nobles certificadas y
                  tapizados orgánicos. Descubrí piezas que celebran el sosiego y la
                  belleza de lo auténtico.
                </p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <Link href="/catalogo" className="btn btn-primary px-7 py-3.5">
                    Explorar colección
                    <ArrowRight className="size-4" />
                  </Link>
                  <a
                    href={whatsappUrl(
                      'Hola Casa Wiki, quisiera agendar una visita al showroom.',
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="btn border border-white/25 bg-white/10 px-7 py-3.5 text-white backdrop-blur-md hover:bg-white/20"
                  >
                    <CalendarDays className="size-4" />
                    Agendar showroom
                  </a>
                </div>
              </div>
            </div>

            {products[0] && (
              <div className="absolute right-8 top-8 hidden w-[240px] rounded-xl border border-white/20 bg-[#12200f]/45 p-4 text-right text-white backdrop-blur-md lg:block">
                <p className="text-[9.5px] font-semibold uppercase tracking-[0.18em] text-olive-soft">
                  Pieza central
                </p>
                <p className="mt-1 font-display text-[21px] italic leading-tight">
                  {products[0].name}
                </p>
                <p className="mt-1 text-[11px] text-white/75">
                  {products[0].material} · Hecha a mano
                </p>
              </div>
            )}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              {
                icon: TreePine,
                title: '100% Madera Certificada',
                copy: 'Bosques nativos reforestados bajo normas FSC® internacionales.',
              },
              {
                icon: ShieldCheck,
                title: 'Garantía Estructural 5 Años',
                copy: 'Ebanistería de espiga y caja pensada para perdurar generaciones.',
              },
              {
                icon: MessageCircle,
                title: 'Coordinación por WhatsApp',
                copy: 'Asesoramiento directo del atelier, entregas y armado coordinado.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center gap-4 rounded-xl border border-line bg-surface p-5 shadow-soft"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-olive-soft text-olive">
                  <item.icon className="size-6" />
                </span>
                <div>
                  <h2 className="text-[14px] font-semibold">{item.title}</h2>
                  <p className="mt-0.5 text-[11.5px] leading-snug text-muted">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Espacios */}
      <section className="shell py-16 md:py-20">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div className="max-w-xl">
            <p className="eyebrow text-olive">Atmósferas habitables</p>
            <h2 className="mt-2 font-display text-[34px] leading-tight md:text-[42px]">
              Explorá por espacios y piezas clave
            </h2>
          </div>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-olive hover:text-olive-dark"
          >
            Ver todas las colecciones
            <ArrowUpRight className="size-4" />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
          {SPACES.map((space) => (
            <Link
              key={space.title}
              href={space.href}
              className="group relative aspect-[3/4] overflow-hidden rounded-xl"
            >
              <Image
                src={space.image}
                alt={space.title}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#151a12]/85 via-[#151a12]/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-white md:p-5">
                <span className="inline-block rounded-full bg-white/20 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] backdrop-blur">
                  {space.count}
                </span>
                <h3 className="mt-2 font-display text-[22px] leading-tight md:text-[25px]">
                  {space.title}
                </h3>
                <p className="mt-0.5 text-[11px] text-white/70">{space.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Piezas destacadas */}
      <section className="bg-surface-low py-16 md:py-20">
        <div className="shell">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-olive">Colección vigente</p>
              <h2 className="mt-2 font-display text-[34px] leading-tight md:text-[42px]">
                Piezas esenciales para contemplar
              </h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {['Todos', 'Sillones', 'Mesas', 'Almacenaje'].map((tab, index) => (
                <Link
                  key={tab}
                  href="/catalogo"
                  className={
                    index === 0
                      ? 'rounded-full bg-olive px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-white'
                      : 'rounded-full border border-line bg-surface px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.08em] text-muted hover:border-olive hover:text-olive'
                  }
                >
                  {tab}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {products.map((product, index) => (
              <ProductCard key={product.id} product={product} priority={index < 2} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/catalogo" className="btn btn-outline px-7 py-3.5">
              Ver catálogo completo
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Manifiesto */}
      <section id="manifiesto" className="shell py-16 md:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl">
            <Image
              src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1400&q=80"
              alt="Ebanista trabajando la madera en el atelier"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div className="absolute bottom-4 left-4 max-w-[280px] rounded-xl bg-background/95 p-4 shadow-soft backdrop-blur">
              <p className="font-display text-[19px] italic leading-snug">
                “El atelier trabaja la madera como material de legado: noble,
                honesto y para siempre.”
              </p>
              <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-olive">
                Manifiesto Casa Wiki
              </p>
            </div>
          </div>

          <div>
            <p className="eyebrow text-olive">El manifiesto Casa Wiki</p>
            <h2 className="mt-2 font-display text-[36px] leading-tight md:text-[46px]">
              Ebanistería honesta: donde la materia prima dicta la forma.
            </h2>
            <p className="mt-5 text-[14.5px] leading-relaxed text-muted">
              Cada pieza nace de un diálogo entre la madera y quien la trabaja.
              Seleccionamos tablas por su veta, respetamos sus tiempos y dejamos que
              el uso termine de pulir lo que la mano empezó.
            </p>

            <div className="mt-6 space-y-4">
              <div className="flex gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-olive-soft text-olive">
                  <TreePine className="size-4.5" />
                </span>
                <div>
                  <h3 className="text-[13.5px] font-semibold">Cero desperdicio</h3>
                  <p className="text-[12.5px] leading-snug text-muted">
                    Aprovechamos cada retazo para herrajes, detalles y piezas menores.
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-olive-soft text-olive">
                  <Sparkles className="size-4.5" />
                </span>
                <div>
                  <h3 className="text-[13.5px] font-semibold">Método a la medida</h3>
                  <p className="text-[12.5px] leading-snug text-muted">
                    Adaptamos medidas, maderas y tapizados a tu espacio real.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <Link href="/catalogo" className="btn btn-primary px-7 py-3.5">
                Conocer nuestro proceso
                <ArrowRight className="size-4" />
              </Link>
              <Link
                href="/ingresar"
                className="text-[12.5px] font-semibold text-olive underline underline-offset-4"
              >
                Proyectos arquitectónicos
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonios */}
      <section className="bg-surface-low py-16 md:py-20">
        <div className="shell">
          <div className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-olive">Comunidad & espacios</p>
            <h2 className="mt-2 font-display text-[34px] leading-tight md:text-[42px]">
              Casas reales. Vidas reales.
            </h2>
            <p className="mt-3 text-[13.5px] leading-relaxed text-muted">
              Una mirada íntima a los hogares donde nuestras piezas encontraron su
              lugar. Compartí tu espacio con #MiCasaWiki.
            </p>
          </div>

          <div className="mt-9 grid gap-4 md:grid-cols-3">
            {TESTIMONIALS.map((testimonial) => (
              <figure
                key={testimonial.name}
                className="overflow-hidden rounded-xl border border-line bg-surface"
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={testimonial.image}
                    alt={`Casa de ${testimonial.name}`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <figcaption className="p-5">
                  <blockquote className="text-[13px] leading-relaxed text-ink/85">
                    “{testimonial.quote}”
                  </blockquote>
                  <div className="mt-4 border-t border-line pt-3">
                    <p className="text-[12.5px] font-semibold">{testimonial.name}</p>
                    <p className="text-[11px] text-muted">{testimonial.place}</p>
                    <p className="mt-1 text-[10.5px] uppercase tracking-[0.1em] text-olive">
                      {testimonial.piece}
                    </p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* Club */}
      <section className="shell py-16">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-olive px-6 py-8 text-white md:flex-row md:items-center md:px-10">
          <div className="flex items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-full bg-white/15">
              <Sparkles className="size-6" />
            </span>
            <div>
              <p className="font-display text-[24px] leading-tight">
                Sumate al Club Casa Wiki
              </p>
              <p className="mt-1 text-[12.5px] text-white/75">
                10% OFF en tu primera pieza, lanzamientos privados y asesoramiento
                de atelier.
              </p>
            </div>
          </div>
          <Link
            href="/ingresar"
            className="btn bg-white px-7 py-3.5 text-olive-dark hover:bg-olive-soft"
          >
            Quiero ser parte
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
