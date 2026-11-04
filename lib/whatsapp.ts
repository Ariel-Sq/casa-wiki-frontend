import { WHATSAPP_PHONE } from './env';

export const WHATSAPP_DISPLAY = '+54 9 11 4589-2000';

export function whatsappUrl(message: string, phone = WHATSAPP_PHONE) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function productInquiryUrl(name: string, price?: number, material?: string) {
  const details = [material, price ? `$${price.toLocaleString('es-AR')}` : '']
    .filter(Boolean)
    .join(' · ');
  return whatsappUrl(
    `Hola Casa Wiki, me interesa "${name}"${details ? ` (${details})` : ''}. ¿Me pasan más información?`,
  );
}
