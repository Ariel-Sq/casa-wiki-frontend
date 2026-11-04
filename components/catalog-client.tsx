'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import {
  ChevronDown,
  LayoutGrid,
  List,
  Plus,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { useCart } from './cart-provider';
import type { CatalogProduct } from '@/lib/products';
import type { Category } from '@/lib/types';
import { cn, formatPrice } from '@/lib/utils';

const MATERIALS = [
  { label: 'Álamo', match: 'álamo' },
  { label: 'Petiribí macizo', match: 'petiribí' },
  { label: 'Enchapado petiribí', match: 'enchapado' },
  { label: 'Microcemento', match: 'microcemento' },
];

const PAGE_SIZE = 9;

export function CatalogClient({
  products,
  categories,
  initialCategory = '',
  initialQuery = '',
}: {
  products: CatalogProduct[];
  categories: Category[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const { add, pending } = useCart();
  const [category, setCategory] = useState(initialCategory);
  const [materials, setMaterials] = useState<string[]>([]);
  const [query, setQuery] = useState(initialQuery);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [onlyStock, setOnlyStock] = useState(false);
  const [sort, setSort] = useState('curaduria');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [mobileFilters, setMobileFilters] = useState(false);

  const priceBounds = useMemo(() => {
    const prices = products.map((p) => p.price);
    return {
      min: Math.min(...prices, 0),
      max: Math.max(...prices, 1),
    };
  }, [products]);

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    const list = products.filter((product) => {
      if (category && product.categorySlug !== category) return false;
      if (onlyStock && product.stock <= 0) return false;
      if (maxPrice !== null && product.price > maxPrice) return false;
      if (materials.length) {
        const material = product.material.toLowerCase();
        if (!materials.some((m) => material.includes(m))) return false;
      }
      if (term) {
        const haystack = `${product.name} ${product.material} ${product.category}`.toLowerCase();
        if (!haystack.includes(term)) return false;
      }
      return true;
    });

    switch (sort) {
      case 'precio-asc':
        return list.sort((a, b) => a.price - b.price);
      case 'precio-desc':
        return list.sort((a, b) => b.price - a.price);
      case 'nombre':
        return list.sort((a, b) => a.name.localeCompare(b.name, 'es'));
      default:
        return list.sort((a, b) => Number(b.featured) - Number(a.featured));
    }
  }, [products, category, onlyStock, maxPrice, materials, query, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pages);
  const visible = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  const activeCategory = categories.find((c) => c.slug === category);
  const hasFilters =
    Boolean(category) || materials.length > 0 || Boolean(query) || onlyStock || maxPrice !== null;

  function reset() {
    setCategory('');
    setMaterials([]);
    setQuery('');
    setOnlyStock(false);
    setMaxPrice(null);
    setPage(1);
  }

  function toggleMaterial(match: string) {
    setMaterials((current) =>
      current.includes(match)
        ? current.filter((item) => item !== match)
        : [...current, match],
    );
    setPage(1);
  }

  const filters = (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em]">
          <SlidersHorizontal className="size-4" /> Filtros
        </p>
        {hasFilters && (
          <button type="button" onClick={reset} className="text-[11px] text-olive underline">
            Limpiar
          </button>
        )}
      </div>

      <div>
        <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.13em] text-muted">
          Categoría
        </p>
        <div className="space-y-1.5">
          <label className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-[13px] hover:bg-surface-low">
            <span className="flex items-center gap-2">
              <input
                type="radio"
                name="category"
                checked={!category}
                onChange={() => {
                  setCategory('');
                  setPage(1);
                }}
                className="accent-olive"
              />
              Todas las piezas
            </span>
            <span className="text-[11px] text-muted">{products.length}</span>
          </label>
          {categories.map((item) => {
            const count = products.filter((p) => p.categorySlug === item.slug).length;
            if (!count) return null;
            return (
              <label
                key={item.id}
                className="flex cursor-pointer items-center justify-between rounded-lg px-2 py-1.5 text-[13px] hover:bg-surface-low"
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="category"
                    checked={category === item.slug}
                    onChange={() => {
                      setCategory(item.slug);
                      setPage(1);
                    }}
                    className="accent-olive"
                  />
                  {item.name}
                </span>
                <span className="text-[11px] text-muted">{count}</span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.13em] text-muted">
          Maderas y acabados
        </p>
        <div className="flex flex-wrap gap-1.5">
          {MATERIALS.map((material) => (
            <button
              key={material.match}
              type="button"
              onClick={() => toggleMaterial(material.match)}
              className={cn(
                'rounded-full border px-3 py-1.5 text-[11px] font-medium transition-colors',
                materials.includes(material.match)
                  ? 'border-olive bg-olive text-white'
                  : 'border-line bg-surface text-muted hover:border-olive hover:text-olive',
              )}
            >
              {material.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[10.5px] font-semibold uppercase tracking-[0.13em] text-muted">
            Inversión máxima
          </p>
          <span className="text-[11px] font-medium text-olive">
            {formatPrice(maxPrice ?? priceBounds.max)}
          </span>
        </div>
        <input
          type="range"
          min={priceBounds.min}
          max={priceBounds.max}
          step={10000}
          value={maxPrice ?? priceBounds.max}
          onChange={(event) => {
            setMaxPrice(Number(event.target.value));
            setPage(1);
          }}
          className="w-full accent-olive"
        />
        <div className="mt-1 flex justify-between text-[10px] text-muted">
          <span>{formatPrice(priceBounds.min)}</span>
          <span>{formatPrice(priceBounds.max)}</span>
        </div>
      </div>

      <div>
        <p className="mb-2.5 text-[10.5px] font-semibold uppercase tracking-[0.13em] text-muted">
          Disponibilidad
        </p>
        <label className="flex cursor-pointer items-center gap-2 text-[13px]">
          <input
            type="checkbox"
            checked={onlyStock}
            onChange={(event) => {
              setOnlyStock(event.target.checked);
              setPage(1);
            }}
            className="accent-olive"
          />
          Entrega inmediata (en stock)
        </label>
      </div>

      <div className="rounded-xl bg-olive-pale p-4">
        <p className="text-[12px] font-semibold text-olive-dark">¿Dudas con las medidas?</p>
        <p className="mt-1 text-[11px] leading-snug text-olive-dark/80">
          Nuestros arquitectos te asesoran sin costo en la elección de maderas y
          proporciones.
        </p>
        <a
          href="https://wa.me/5491145892000"
          className="btn btn-primary mt-3 w-full py-2.5 text-[11px] uppercase tracking-[0.08em]"
        >
          Chatear por WhatsApp
        </a>
      </div>
    </div>
  );

  return (
    <div className="shell py-8">
      <nav className="flex items-center gap-2 text-[11px] text-muted">
        <Link href="/" className="hover:text-olive">Inicio</Link>
        <span>/</span>
        <Link href="/catalogo" className="hover:text-olive">Catálogo</Link>
        {activeCategory && (
          <>
            <span>/</span>
            <span className="text-ink">{activeCategory.name}</span>
          </>
        )}
      </nav>

      <header className="mt-6 border-b border-line pb-7">
        <p className="eyebrow text-olive">Curandería otoño 2026</p>
        <h1 className="mt-2 font-display text-[38px] leading-tight md:text-[50px]">
          {activeCategory ? `Colección ${activeCategory.name}` : 'Catálogo de muebles'}
        </h1>
        <div className="mt-3 flex flex-col justify-between gap-3 md:flex-row md:items-end">
          <p className="max-w-2xl text-[13.5px] leading-relaxed text-muted">
            Piezas contemporáneas diseñadas para resistir el paso del tiempo. Explorá
            acabados en madera maciza certificada, lino puro y tapizados de tacto orgánico.
          </p>
          <div className="flex items-center gap-4 text-[11px] text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-olive" />
              {filtered.length} piezas de atelier
            </span>
            <span className="hidden sm:inline">Hecho a mano en Argentina</span>
          </div>
        </div>
      </header>

      <div className="mt-5 flex flex-col gap-3 rounded-xl border border-line bg-surface px-4 py-3 md:flex-row md:items-center md:justify-between">
        <p className="text-[12px] text-muted">
          Mostrando{' '}
          <span className="font-semibold text-ink">
            {filtered.length ? (currentPage - 1) * PAGE_SIZE + 1 : 0}–
            {Math.min(currentPage * PAGE_SIZE, filtered.length)}
          </span>{' '}
          de <span className="font-semibold text-ink">{filtered.length}</span> piezas
          disponibles
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFilters(true)}
            className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[11.5px] font-semibold lg:hidden"
          >
            <SlidersHorizontal className="size-3.5" /> Filtros
          </button>
          <label className="flex items-center gap-2 text-[11.5px] text-muted">
            Ordenar por
            <span className="relative">
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="appearance-none rounded-full border border-line bg-surface py-2 pl-3 pr-8 text-[11.5px] font-semibold text-ink outline-none"
              >
                <option value="curaduria">Curaduría recomendada</option>
                <option value="precio-asc">Menor precio</option>
                <option value="precio-desc">Mayor precio</option>
                <option value="nombre">Nombre A–Z</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted" />
            </span>
          </label>
          <div className="hidden items-center gap-1 rounded-full border border-line p-1 md:flex">
            <button
              type="button"
              onClick={() => setView('grid')}
              className={cn('grid size-7 place-items-center rounded-full', view === 'grid' && 'bg-olive text-white')}
              aria-label="Vista de grilla"
            >
              <LayoutGrid className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              className={cn('grid size-7 place-items-center rounded-full', view === 'list' && 'bg-olive text-white')}
              aria-label="Vista de lista"
            >
              <List className="size-3.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-8 lg:grid-cols-[250px_1fr]">
        <aside className="hidden lg:block">{filters}</aside>

        <div>
          {query && (
            <div className="mb-4 flex items-center justify-between rounded-lg bg-olive-pale px-4 py-2.5 text-[12.5px] text-olive-dark">
              <span>
                Resultados para <strong>“{query}”</strong>
              </span>
              <button type="button" onClick={() => setQuery('')} className="inline-flex items-center gap-1">
                <X className="size-3.5" /> Quitar
              </button>
            </div>
          )}

          {visible.length === 0 ? (
            <div className="rounded-xl border border-line bg-surface py-20 text-center">
              <p className="font-display text-2xl">No encontramos piezas con esos filtros</p>
              <p className="mt-2 text-[13px] text-muted">
                Probá ampliando el rango de inversión o quitando alguna categoría.
              </p>
              <button type="button" onClick={reset} className="btn btn-primary mt-5">
                Ver todo el catálogo
              </button>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-3">
              {visible.map((product) => (
                <article key={product.id} className="group">
                  <div className="relative overflow-hidden rounded-xl bg-surface-mid">
                    <Link href={`/producto/${product.slug}`} className="relative block aspect-[4/5]">
                      {product.image && (
                        <Image
                          src={product.image}
                          alt={product.name}
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                        />
                      )}
                    </Link>
                    <div className="pointer-events-none absolute left-2.5 top-2.5 flex flex-col items-start gap-1">
                      {product.featured && (
                        <span className="rounded-full bg-olive-soft px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.1em] text-olive-dark">
                          Edición de autor
                        </span>
                      )}
                      <span className="rounded-full bg-surface/90 px-2 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.1em] text-olive-dark backdrop-blur">
                        Envío gratis
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => add(product.variationId, 1)}
                      disabled={pending}
                      className="absolute bottom-2.5 right-2.5 grid size-8 place-items-center rounded-full bg-surface/95 text-ink shadow-soft hover:bg-olive hover:text-white disabled:opacity-50"
                      aria-label={`Agregar ${product.name}`}
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                  <div className="pt-3">
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                      {product.category}
                    </p>
                    <Link href={`/producto/${product.slug}`}>
                      <h2 className="mt-0.5 font-display text-[17.5px] leading-snug transition-colors group-hover:text-olive">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="mt-0.5 text-[11px] text-muted">{product.material}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <p className="text-[15px] font-semibold">{formatPrice(product.price)}</p>
                      <p className="text-[10.5px] text-muted line-through">
                        {formatPrice(product.compareAt)}
                      </p>
                    </div>
                    <p className="text-[10px] text-muted">
                      6 cuotas sin interés de {formatPrice(product.price / 6)}
                    </p>
                    <button
                      type="button"
                      onClick={() => add(product.variationId, 1)}
                      disabled={pending}
                      className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-full border border-line bg-surface py-2 text-[10px] font-semibold uppercase tracking-[0.08em] hover:border-olive hover:text-olive disabled:opacity-50"
                    >
                      <Plus className="size-3" /> Agregar al carrito
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((product) => (
                <article
                  key={product.id}
                  className="flex gap-4 rounded-xl border border-line bg-surface p-3"
                >
                  <Link
                    href={`/producto/${product.slug}`}
                    className="relative size-[130px] shrink-0 overflow-hidden rounded-lg bg-surface-mid"
                  >
                    {product.image && (
                      <Image src={product.image} alt={product.name} fill sizes="130px" className="object-cover" />
                    )}
                  </Link>
                  <div className="flex flex-1 flex-col">
                    <p className="text-[9.5px] font-semibold uppercase tracking-[0.12em] text-muted">
                      {product.category}
                    </p>
                    <Link href={`/producto/${product.slug}`}>
                      <h2 className="font-display text-[20px] leading-snug hover:text-olive">
                        {product.name}
                      </h2>
                    </Link>
                    <p className="text-[11.5px] text-muted">{product.material}</p>
                    <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                      <div>
                        <p className="text-[16px] font-semibold">{formatPrice(product.price)}</p>
                        <p className="text-[10.5px] text-muted">
                          6 cuotas de {formatPrice(product.price / 6)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => add(product.variationId, 1)}
                        disabled={pending}
                        className="btn btn-primary px-5 py-2.5 text-[10.5px] uppercase tracking-[0.08em] disabled:opacity-50"
                      >
                        <Plus className="size-3.5" /> Agregar
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}

          {pages > 1 && (
            <div className="mt-9 flex items-center justify-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="rounded-full border border-line px-3.5 py-2 text-[11.5px] disabled:opacity-40"
              >
                Anterior
              </button>
              {Array.from({ length: pages }).slice(0, 7).map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setPage(index + 1)}
                  className={cn(
                    'grid size-9 place-items-center rounded-full border text-[12px]',
                    currentPage === index + 1
                      ? 'border-olive bg-olive text-white'
                      : 'border-line hover:border-olive',
                  )}
                >
                  {index + 1}
                </button>
              ))}
              <button
                type="button"
                disabled={currentPage === pages}
                onClick={() => setPage(currentPage + 1)}
                className="rounded-full border border-line px-3.5 py-2 text-[11.5px] disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}

          <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-xl bg-surface-low p-6 md:flex-row md:items-center">
            <div className="flex items-start gap-3">
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-olive-soft text-olive">
                <SlidersHorizontal className="size-5" />
              </span>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-olive">
                  Servicio atelier Casa Wiki
                </p>
                <p className="mt-1 font-display text-[22px] leading-snug">
                  ¿Dudas con las medidas y proporción de tu espacio?
                </p>
                <p className="mt-1 max-w-xl text-[12px] text-muted">
                  Nuestros arquitectos te asesoran sin costo en la elección de maderas,
                  texturas de lino y modulación personalizada.
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/5491145892000"
              className="btn btn-primary shrink-0 px-6 py-3 text-[11.5px] uppercase tracking-[0.08em]"
            >
              Chatear por WhatsApp
            </a>
          </div>
        </div>
      </div>

      {mobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMobileFilters(false)}
            aria-label="Cerrar filtros"
          />
          <div className="animate-drawer absolute inset-y-0 right-0 w-[86%] max-w-sm overflow-y-auto bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-2xl">Filtros</span>
              <button
                type="button"
                onClick={() => setMobileFilters(false)}
                className="grid size-9 place-items-center rounded-full border border-line"
                aria-label="Cerrar filtros"
              >
                <X className="size-4" />
              </button>
            </div>
            {filters}
            <button
              type="button"
              onClick={() => setMobileFilters(false)}
              className="btn btn-primary mt-6 w-full"
            >
              Ver {filtered.length} piezas
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
