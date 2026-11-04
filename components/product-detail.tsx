'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronDown,
  Minus,
  Plus,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  TreePine,
  Truck,
} from 'lucide-react';
import { useCart } from './cart-provider';
import { cn, formatPrice } from '@/lib/utils';
import { productInquiryUrl } from '@/lib/whatsapp';

export interface ProductView {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string;
  categorySlug: string;
  specifications: { label: string; value: string }[];
  variations: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    attributes: Record<string, string>;
    images: string[];
  }>;
}

export function ProductDetail({ product }: { product: ProductView }) {
  const { add, pending } = useCart();
  const [variationId, setVariationId] = useState(product.variations[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const variation = useMemo(
    () => product.variations.find((item) => item.id === variationId) ?? product.variations[0],
    [product.variations, variationId],
  );

  const images = variation?.images?.length
    ? variation.images
    : product.variations.flatMap((item) => item.images).slice(0, 1);

  const compareAt = variation ? Math.round(variation.price * 1.15) : 0;
  const maxStock = Math.max(1, variation?.stock ?? 1);

  async function handleAdd() {
    if (!variation) return;
    setAdding(true);
    const result = await add(variation.id, quantity);
    setAdding(false);
    if (!result.error) {
      setAdded(true);
      setTimeout(() => setAdded(false), 2200);
    }
  }

  return (
    <div className="shell py-7">
      <nav className="flex flex-wrap items-center gap-2 text-[11px] text-muted">
        <Link href="/" className="hover:text-olive">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-olive">Catálogo</Link>
        <span>/</span>
        <Link href={`/catalogo?categoria=${product.categorySlug}`} className="hover:text-olive">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-ink">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14">
        <div>
          <div className="relative aspect-[5/4] overflow-hidden rounded-2xl bg-surface-mid">
            {images[activeImage] ? (
              <Image
                src={images[activeImage]}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover"
              />
            ) : (
              <div className="grid h-full place-items-center text-sm text-muted">Sin imagen</div>
            )}
            {product.specifications.length > 0 && (
              <div className="absolute left-4 top-4 rounded-full bg-surface/90 px-3 py-1.5 text-[9.5px] font-semibold uppercase tracking-[0.12em] text-olive-dark backdrop-blur">
                Hecho a mano en Argentina
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-4 gap-2.5">
              {images.slice(0, 4).map((image, index) => (
                <button
                  key={`${image}-${index}`}
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-lg border-2 bg-surface-mid transition-colors',
                    activeImage === index ? 'border-olive' : 'border-transparent',
                  )}
                  aria-label={`Ver imagen ${index + 1}`}
                >
                  <Image src={image} alt="" fill sizes="120px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:pt-2">
          <p className="eyebrow text-olive">{product.category}</p>
          <h1 className="mt-2 font-display text-[36px] leading-[1.08] tracking-tight md:text-[44px]">
            {product.name}
          </h1>
          {variation?.attributes?.material && (
            <p className="mt-2 text-[13px] text-muted">
              {variation.attributes.material} · Acabado natural
            </p>
          )}

          <div className="mt-5 flex flex-wrap items-end gap-3">
            <p className="font-display text-[32px] leading-none">
              {formatPrice(variation?.price ?? 0)}
            </p>
            <p className="pb-1 text-[14px] text-muted line-through">{formatPrice(compareAt)}</p>
            <span className="mb-1 rounded-full bg-olive-pale px-2.5 py-1 text-[10px] font-semibold text-olive">
              10% OFF transferencia
            </span>
          </div>
          <p className="mt-1 text-[12px] text-muted">
            6 cuotas sin interés de {formatPrice((variation?.price ?? 0) / 6)}
          </p>

          <p
            className={cn(
              'mt-5 whitespace-pre-line text-[14px] leading-relaxed text-muted',
              !expanded && 'line-clamp-4',
            )}
          >
            {product.description ||
              'Una pieza concebida en el atelier con maderas nobles certificadas y terminaciones naturales, pensada para acompañar el paso del tiempo.'}
          </p>
          {product.description.length > 220 && (
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="mt-1 text-[11.5px] font-semibold text-olive underline underline-offset-4"
            >
              {expanded ? 'Leer menos' : 'Leer más'}
            </button>
          )}

          {product.variations.length > 1 && (
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                  Medida
                </p>
                <span className="inline-flex items-center gap-1 text-[10.5px] text-muted">
                  <Ruler className="size-3.5" /> Guía de medidas
                </span>
              </div>
              <div className="mt-2.5 flex flex-wrap gap-2">
                {product.variations.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setVariationId(item.id);
                      setActiveImage(0);
                      setQuantity(1);
                    }}
                    disabled={item.stock <= 0}
                    className={cn(
                      'rounded-lg border px-3.5 py-2 text-[12px] transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                      item.id === variation?.id
                        ? 'border-olive bg-olive-soft/60 font-semibold text-olive-dark'
                        : 'border-line bg-surface text-muted hover:border-olive',
                    )}
                  >
                    {item.attributes?.medida ?? item.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-4 rounded-full border border-line bg-surface px-3.5 py-2.5">
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.max(1, value - 1))}
                disabled={quantity <= 1}
                className="disabled:opacity-30"
                aria-label="Restar"
              >
                <Minus className="size-4" />
              </button>
              <span className="min-w-5 text-center text-[14px] font-semibold">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((value) => Math.min(maxStock, value + 1))}
                disabled={quantity >= maxStock}
                className="disabled:opacity-30"
                aria-label="Sumar"
              >
                <Plus className="size-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={pending || adding || !variation || variation.stock <= 0}
              className="btn btn-primary flex-1 py-3.5 text-[12.5px] uppercase tracking-[0.08em] disabled:opacity-50"
            >
              {added ? (
                <>
                  <Check className="size-4" /> Agregado al carrito
                </>
              ) : (
                <>
                  <ShoppingBag className="size-4" />
                  {adding ? 'Agregando...' : 'Agregar al carrito'}
                </>
              )}
            </button>
          </div>

          <p className="mt-2 text-[11px] text-muted">
            {variation && variation.stock > 0
              ? `${variation.stock} unidades disponibles · Entrega en 4 a 7 días hábiles`
              : 'Consultá disponibilidad y tiempos de producción'}
          </p>

          <a
            href={productInquiryUrl(product.name, variation?.price, variation?.attributes?.material)}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline mt-3 w-full py-3 text-[12px]"
          >
            Consultar por WhatsApp
            <ArrowRight className="size-4" />
          </a>

          <div className="mt-6 grid grid-cols-3 gap-2 border-y border-line py-4 text-center">
            {[
              { icon: TreePine, label: 'Madera FSC®' },
              { icon: Truck, label: 'Envío gratis' },
              { icon: ShieldCheck, label: 'Garantía 5 años' },
            ].map((item) => (
              <div key={item.label} className="flex flex-col items-center gap-1.5">
                <item.icon className="size-5 text-olive" />
                <span className="text-[10px] font-medium text-muted">{item.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 divide-y divide-line">
            <details className="group py-3.5" open>
              <summary className="flex cursor-pointer list-none items-center justify-between text-[12.5px] font-semibold">
                Detalles de la pieza
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <ul className="mt-2.5 space-y-1.5 text-[12px] text-muted">
                {product.specifications.map((spec) => (
                  <li key={spec.label} className="flex justify-between gap-4">
                    <span>{spec.label}</span>
                    <span className="text-ink">{spec.value}</span>
                  </li>
                ))}
                {variation?.attributes &&
                  Object.entries(variation.attributes).map(([key, value]) => (
                    <li key={key} className="flex justify-between gap-4">
                      <span className="capitalize">{key}</span>
                      <span className="text-ink">{value}</span>
                    </li>
                  ))}
              </ul>
            </details>
            <details className="group py-3.5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[12.5px] font-semibold">
                Materiales y cuidados
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2.5 text-[12px] leading-relaxed text-muted">
                Madera maciza con acabado en aceite natural libre de solventes. Limpiar con
                paño seco; evitar exposición directa al sol y productos abrasivos. Cada pieza
                puede variar levemente en veta y tono por su origen natural.
              </p>
            </details>
            <details className="group py-3.5">
              <summary className="flex cursor-pointer list-none items-center justify-between text-[12.5px] font-semibold">
                Envíos y armado
                <ChevronDown className="size-4 transition-transform group-open:rotate-180" />
              </summary>
              <p className="mt-2.5 text-[12px] leading-relaxed text-muted">
                Coordinamos la entrega por WhatsApp en 4 a 7 días hábiles. El armado en
                destino está incluido en CABA y GBA; para el interior se cotiza según
                localidad.
              </p>
            </details>
          </div>
        </div>
      </div>
    </div>
  );
}
