import Image from 'next/image';
import Link from 'next/link';
import { Instagram, Mail, MessageCircle, ShieldCheck, Hammer } from 'lucide-react';
import { NewsletterForm } from './newsletter-form';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface-low">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" aria-label="Casa Wiki" className="inline-flex">
            <Image
              src="/casa-wiki-logo-azul.png"
              alt="Casa Wiki"
              width={1774}
              height={887}
              className="h-16 w-auto"
            />
          </Link>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted">
            Mueblería de álamo macizo con fabricación nacional. Muebles simples,
            resistentes y terminados con laca poliuretánica.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-olive-dark">
            <Hammer className="size-4" />
            Fabricación nacional
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
            Enlaces de compra
          </h3>
          <ul className="mt-4 space-y-2.5 text-[13px] text-muted">
            <li><Link href="/catalogo" className="hover:text-olive-dark">Colecciones actuales</Link></li>
            <li><Link href="/catalogo?categoria=comodas" className="hover:text-olive-dark">Cómodas</Link></li>
            <li><Link href="/catalogo?categoria=mesas-de-comedor" className="hover:text-olive-dark">Mesas de comedor</Link></li>
            <li><Link href="/catalogo?categoria=escritorios" className="hover:text-olive-dark">Escritorios</Link></li>
            <li><Link href="/catalogo?categoria=racks" className="hover:text-olive-dark">Racks y vajilleros</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
            Atención al cliente
          </h3>
          <ul className="mt-4 space-y-2.5 text-[13px] text-muted">
            <li><Link href="/#manifiesto" className="hover:text-olive-dark">Nosotros</Link></li>
            <li><Link href="/cuenta" className="hover:text-olive-dark">Mis pedidos</Link></li>
            <li><a href="https://wa.me/5491145892000" className="hover:text-olive-dark">Envíos y entregas</a></li>
            <li><a href="https://wa.me/5491145892000" className="hover:text-olive-dark">Cambios y devoluciones</a></li>
            <li><a href="https://wa.me/5491145892000" className="hover:text-olive-dark">Asesoramiento de medidas</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
            Novedades
          </h3>
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Enterate de nuevas piezas, lanzamientos y novedades de Casa Wiki.
          </p>
          <NewsletterForm />
          <div className="mt-5 flex items-center gap-3 text-muted">
            <a href="https://wa.me/5491145892000" aria-label="WhatsApp" className="hover:text-olive-dark">
              <MessageCircle className="size-4.5" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-olive-dark">
              <Instagram className="size-4.5" />
            </a>
            <a href="mailto:hola@casawiki.com" aria-label="Email" className="hover:text-olive-dark">
              <Mail className="size-4.5" />
            </a>
          </div>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col items-center justify-between gap-3 py-5 text-[10.5px] text-muted md:flex-row">
          <p>© 2026 Casa Wiki Muebles & Diseño. Todos los derechos reservados.</p>
          <div className="flex items-center gap-5">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5" /> Pago seguro SSL
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Hammer className="size-3.5" /> Fabricación nacional
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
