'use client';

import { Printer } from 'lucide-react';

export function PrintButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-[11.5px] font-semibold hover:border-olive hover:text-olive"
    >
      <Printer className="size-3.5" /> Descargar resumen
    </button>
  );
}
