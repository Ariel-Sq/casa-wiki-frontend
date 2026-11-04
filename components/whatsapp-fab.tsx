'use client';

import { usePathname } from 'next/navigation';
import { MessageCircle } from 'lucide-react';
import { whatsappUrl } from '@/lib/whatsapp';

export function WhatsAppFab() {
  const pathname = usePathname();
  if (pathname.startsWith('/checkout')) return null;

  return (
    <a
      href={whatsappUrl(
        'Hola Casa Wiki, quisiera asesoramiento sobre una pieza del catálogo.',
      )}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-5 right-5 z-30 inline-flex items-center gap-2.5 rounded-full bg-olive px-4 py-3 text-[12.5px] font-semibold text-white shadow-lift transition-transform hover:-translate-y-0.5 hover:bg-olive-dark"
      aria-label="Escribir por WhatsApp"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Asesoramiento WhatsApp</span>
    </a>
  );
}
