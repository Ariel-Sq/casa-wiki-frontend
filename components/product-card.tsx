'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowUpRight, Plus } from 'lucide-react';
import { useCart } from './cart-provider';
import type { CatalogProduct } from '@/lib/products';
import { formatPrice } from '@/lib/utils';

export function ProductCard({
  product,
  priority = false,
}: {
  product: CatalogProduct;
  priority?: boolean;
}) {
  const { add, pending } = useCart();
  const [adding, setAdding] = useState(false);

  async function handleAdd() {
    setAdding(true);
    await add(product.variationId, 1);
    setAdding(false);
  }

  return (
    <article className="group flex flex-col">
      <div className="relative overflow-hidden rounded-xl bg-surface-mid">
        <Link
          href={`/producto/${product.slug}`}
          className="relative block aspect-[4/5] w-full"
        >
          {product.image ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
            />
          ) : (
            <div className="grid h-full place-items-center text-[12px] text-muted">
              Sin imagen
            </div>
          )}
        </Link>

        <div className="pointer-events-none absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {product.featured && (
            <span className="rounded-full bg-olive-soft px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-olive-dark">
              Edición de autor
            </span>
          )}
          <span className="rounded-full bg-surface/90 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-olive-dark backdrop-blur">
            Envío gratis
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={pending || adding}
          className="absolute bottom-3 right-3 grid size-9 place-items-center rounded-full bg-surface/95 text-ink shadow-soft backdrop-blur transition-all hover:bg-olive hover:text-white disabled:opacity-50"
          aria-label={`Agregar ${product.name} al carrito`}
        >
          <Plus className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 flex-col px-0.5 pt-3.5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.13em] text-muted">
          {product.category}
        </p>
        <Link href={`/producto/${product.slug}`} className="mt-1 flex items-start justify-between gap-2">
          <h3 className="font-display text-[19px] leading-snug text-ink transition-colors group-hover:text-olive">
            {product.name}
          </h3>
          <ArrowUpRight className="mt-1 size-4 shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100" />
        </Link>
        {product.material && (
          <p className="mt-0.5 text-[11.5px] text-muted">{product.material}</p>
        )}

        <div className="mt-2.5 flex items-baseline gap-2">
          <p className="text-[16px] font-semibold">{formatPrice(product.price)}</p>
          <p className="text-[11.5px] text-muted line-through">
            {formatPrice(product.compareAt)}
          </p>
        </div>
        <p className="mt-0.5 text-[10.5px] text-muted">
          6 cuotas sin interés de {formatPrice(product.price / 6)}
        </p>

        <button
          type="button"
          onClick={handleAdd}
          disabled={pending || adding}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-line bg-surface py-2.5 text-[11px] font-semibold uppercase tracking-[0.08em] transition-colors hover:border-olive hover:text-olive disabled:opacity-50"
        >
          <Plus className="size-3.5" />
          {adding ? 'Agregando...' : 'Agregar al carrito'}
        </button>
      </div>
    </article>
  );
}
