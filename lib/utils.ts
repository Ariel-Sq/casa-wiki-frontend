import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ars = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
});

export function formatPrice(value: number | string): string {
  return ars.format(Number(value));
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

/**
 * Removes any mention of petiribí from customer-facing copy. Casa Wiki sells
 * álamo only for now, so tint lists like "(petiribí, nogal o nogal oscuro)"
 * should render as "(nogal o nogal oscuro)".
 */
export function removePetiribi(value: string): string {
  return value
    .normalize('NFC')
    .replace(/\(\s*petirib[ií]\s*,\s*/gi, '(')
    .replace(/,\s*petirib[ií]\s*/gi, '')
    .replace(/petirib[ií]\s*,\s*/gi, '')
    .replace(/petirib[ií]/gi, '')
    .replace(/\(\s*\)/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([.,;])/g, '$1')
    .trim();
}
