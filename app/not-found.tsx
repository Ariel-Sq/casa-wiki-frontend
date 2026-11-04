import Link from 'next/link';
import { Leaf } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="shell flex min-h-[55vh] flex-col items-center justify-center py-20 text-center">
      <span className="grid size-16 place-items-center rounded-full bg-olive-soft text-olive">
        <Leaf className="size-7" />
      </span>
      <p className="mt-6 eyebrow text-olive">Pieza no encontrada</p>
      <h1 className="mt-2 font-display text-[40px] leading-tight">
        Esta página se fue al taller
      </h1>
      <p className="mt-3 max-w-md text-[13.5px] leading-relaxed text-muted">
        Puede que la pieza ya no esté disponible o que el enlace haya cambiado. Te
        invitamos a recorrer la colección vigente.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link href="/catalogo" className="btn btn-primary px-6">
          Ver catálogo
        </Link>
        <Link href="/" className="btn btn-outline px-6">
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
