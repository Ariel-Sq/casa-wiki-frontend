'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Leaf,
  LogOut,
  Menu,
  Package,
  Search,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useCart } from './cart-provider';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Inicio', href: '/' },
  { label: 'Catálogo & Colecciones', href: '/catalogo' },
  { label: 'Nuestro atelier', href: '/#manifiesto' },
  { label: 'Club Casa Wiki', href: '/ingresar' },
];

export function SiteHeader({
  user,
}: {
  user: { name: string; email: string } | null;
}) {
  const { cart, setOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [term, setTerm] = useState('');
  const pathname = usePathname();
  const router = useRouter();
  const userRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
    setUserOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (userRef.current && !userRef.current.contains(event.target as Node)) {
        setUserOpen(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  function submitSearch(event: React.FormEvent) {
    event.preventDefault();
    const value = term.trim();
    router.push(value ? `/catalogo?buscar=${encodeURIComponent(value)}` : '/catalogo');
    setSearchOpen(false);
  }

  return (
    <header className="sticky top-0 z-40">
      <div className="bg-olive-dark text-white">
        <div className="shell flex h-8 items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.18em] md:text-[11px]">
          <span className="hidden md:inline">Envíos gratis a todo el país</span>
          <span className="hidden md:inline text-white/40">·</span>
          <span>6 cuotas sin interés con todos los bancos</span>
          <span className="hidden md:inline text-white/40">·</span>
          <span className="hidden md:inline">Coordinación por WhatsApp</span>
        </div>
      </div>

      <div className="border-b border-line bg-background/95 backdrop-blur">
        <div className="shell flex h-[74px] items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-10 place-items-center rounded-full border border-line text-ink lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu className="size-5" />
            </button>

            <Link href="/" className="flex items-center gap-2.5">
              <span className="grid size-9 place-items-center rounded-full bg-olive-soft text-olive">
                <Leaf className="size-4.5" />
              </span>
              <span className="leading-none">
                <span className="block font-display text-[22px] tracking-tight">
                  Casa Wiki
                </span>
                <span className="mt-1 block text-[8.5px] font-semibold uppercase tracking-[0.28em] text-muted">
                  Mobiliario · Atelier
                </span>
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-7 lg:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-[13px] font-medium text-muted transition-colors hover:text-olive',
                  pathname === item.href && 'text-olive',
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1.5">
            <form
              onSubmit={submitSearch}
              className={cn(
                'hidden items-center gap-2 rounded-full border border-line bg-surface-low px-3.5 py-2 md:flex',
                searchOpen && 'flex',
              )}
            >
              <Search className="size-4 text-muted" />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Buscar sofás, mesas, luminarias..."
                className="w-[210px] bg-transparent text-[12.5px] outline-none placeholder:text-muted/70"
                aria-label="Buscar productos"
              />
            </form>

            <button
              type="button"
              onClick={() => setSearchOpen((value) => !value)}
              className="grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface-low md:hidden"
              aria-label="Buscar"
            >
              <Search className="size-5" />
            </button>

            {user ? (
              <div ref={userRef} className="relative">
                <button
                  type="button"
                  onClick={() => setUserOpen((value) => !value)}
                  className="flex items-center gap-1.5 rounded-full py-1 pl-1 pr-2 transition-colors hover:bg-surface-low"
                >
                  <span className="grid size-8 place-items-center rounded-full bg-olive text-[12px] font-semibold text-white">
                    {(user.name || user.email).slice(0, 1).toUpperCase()}
                  </span>
                  <ChevronDown className="hidden size-3.5 text-muted sm:block" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 top-11 w-56 overflow-hidden rounded-xl border border-line bg-surface p-1.5 shadow-lift">
                    <p className="px-3 py-2 text-[11px] uppercase tracking-widest text-muted">
                      {user.email}
                    </p>
                    <Link
                      href="/cuenta"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-low"
                    >
                      <User className="size-4" /> Mi cuenta
                    </Link>
                    <Link
                      href="/cuenta#pedidos"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-surface-low"
                    >
                      <Package className="size-4" /> Mis pedidos
                    </Link>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-terracotta hover:bg-surface-low"
                    >
                      <LogOut className="size-4" /> Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/ingresar"
                className="hidden size-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface-low sm:grid"
                aria-label="Ingresar"
              >
                <User className="size-5" />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpen(true)}
              className="relative grid size-10 place-items-center rounded-full text-ink transition-colors hover:bg-surface-low"
              aria-label="Abrir carrito"
            >
              <ShoppingBag className="size-5" />
              {cart.itemCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid min-w-4 place-items-center rounded-full bg-olive px-1 text-[10px] font-semibold leading-4 text-white">
                  {cart.itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {searchOpen && (
          <form onSubmit={submitSearch} className="shell pb-3 md:hidden">
            <div className="flex items-center gap-2 rounded-full border border-line bg-surface-low px-4 py-2.5">
              <Search className="size-4 text-muted" />
              <input
                value={term}
                onChange={(event) => setTerm(event.target.value)}
                placeholder="Buscar piezas..."
                className="w-full bg-transparent text-sm outline-none"
                autoFocus
              />
            </div>
          </form>
        )}
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          />
          <div className="animate-drawer absolute inset-y-0 left-0 w-[84%] max-w-sm bg-background p-6">
            <div className="flex items-center justify-between">
              <span className="font-display text-2xl">Casa Wiki</span>
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="grid size-9 place-items-center rounded-full border border-line"
                aria-label="Cerrar menú"
              >
                <X className="size-4" />
              </button>
            </div>
            <nav className="mt-10 flex flex-col gap-1">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="border-b border-line py-4 font-display text-2xl"
                >
                  {item.label}
                </Link>
              ))}
              <Link href="/cuenta" className="border-b border-line py-4 font-display text-2xl">
                Mi cuenta
              </Link>
            </nav>
            <p className="mt-8 text-sm leading-relaxed text-muted">
              Atelier de diseño contemporáneo y ebanistería responsable en Buenos Aires.
            </p>
            <a
              href="https://wa.me/5491145892000"
              className="btn btn-primary mt-6 w-full"
              target="_blank"
              rel="noreferrer"
            >
              Coordinar por WhatsApp
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
