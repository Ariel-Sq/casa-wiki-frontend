import Link from 'next/link';
import { Leaf, Instagram, Mail, MessageCircle, ShieldCheck, TreePine } from 'lucide-react';
import { NewsletterForm } from './newsletter-form';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-line bg-surface-low">
      <div className="shell grid gap-10 py-14 md:grid-cols-2 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="grid size-9 place-items-center rounded-full bg-olive-soft text-olive">
              <Leaf className="size-4.5" />
            </span>
            <span className="font-display text-2xl">Casa Wiki</span>
          </Link>
          <p className="mt-4 max-w-sm text-[13.5px] leading-relaxed text-muted">
            Atelier de diseño contemporáneo y ebanistería responsable. Creamos piezas
            atemporales concebidas con maderas macizas de origen sustentable y tapizados
            artesanales de tacto sereno.
          </p>
          <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3.5 py-2 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-olive">
            <TreePine className="size-4" />
            Certificación forestal sustentable FSC®
          </div>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
            Enlaces de compra
          </h3>
          <ul className="mt-4 space-y-2.5 text-[13px] text-muted">
            <li><Link href="/catalogo" className="hover:text-olive">Colecciones actuales</Link></li>
            <li><Link href="/catalogo?categoria=sillas" className="hover:text-olive">Sillas y sillones</Link></li>
            <li><Link href="/catalogo?categoria=mesas-de-comedor" className="hover:text-olive">Mesas de comedor</Link></li>
            <li><Link href="/catalogo?categoria=escritorios" className="hover:text-olive">Escritorios</Link></li>
            <li><Link href="/catalogo?categoria=racks" className="hover:text-olive">Racks y vajilleros</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
            Atención al cliente
          </h3>
          <ul className="mt-4 space-y-2.5 text-[13px] text-muted">
            <li><Link href="/#manifiesto" className="hover:text-olive">Nuestro proceso</Link></li>
            <li><Link href="/cuenta" className="hover:text-olive">Mis pedidos</Link></li>
            <li><a href="https://wa.me/5491145892000" className="hover:text-olive">Envíos y entregas</a></li>
            <li><a href="https://wa.me/5491145892000" className="hover:text-olive">Cambios y devoluciones</a></li>
            <li><a href="https://wa.me/5491145892000" className="hover:text-olive">Asesoramiento de medidas</a></li>
          </ul>
        </div>

        <div>
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink">
            Club Casa Wiki
          </h3>
          <p className="mt-4 text-[13px] leading-relaxed text-muted">
            Sumate y obtené 10% OFF en tu primera pieza, acceso a lanzamientos y eventos
            privados en el atelier.
          </p>
          <NewsletterForm />
          <div className="mt-5 flex items-center gap-3 text-muted">
            <a href="https://wa.me/5491145892000" aria-label="WhatsApp" className="hover:text-olive">
              <MessageCircle className="size-4.5" />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" className="hover:text-olive">
              <Instagram className="size-4.5" />
            </a>
            <a href="mailto:hola@casawiki.com" aria-label="Email" className="hover:text-olive">
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
              <TreePine className="size-3.5" /> Compromiso huella cero
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
