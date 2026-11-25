import { backendFetch, backendImageUrl } from './backend';
import type { Category, ProductTemplate, ProductVariation } from './types';

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  material: string;
  category: string;
  categorySlug: string;
  image: string;
  images: string[];
  stock: number;
  featured: boolean;
  variationCount: number;
  variationId: string;
}


function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Casa Wiki sells álamo only for now. Any template that mentions petiribí
 * (in its name, description or variation materials) is hidden from the
 * storefront, including direct product URLs.
 */
export function isAlamoTemplate(template: ProductTemplate): boolean {
  if (normalize(template.name).includes('petiribi')) return false;

  const variations = template.variations ?? [];
  if (
    variations.some((variation) =>
      normalize(variation.attributes?.material ?? '').includes('petiribi'),
    )
  ) {
    return false;
  }

  const active = variations.filter((v) => v.is_active && v.stock > 0);
  return (
    active.length > 0 &&
    active.every((v) => normalize(v.attributes?.material ?? '').includes('alamo'))
  );
}

function activeVariations(template: ProductTemplate): ProductVariation[] {
  return (template.variations ?? []).filter((v) => v.is_active && v.stock > 0);
}

export function toCatalogProduct(
  template: ProductTemplate,
): CatalogProduct | null {
  const variations = activeVariations(template);
  if (!variations.length) return null;

  const cheapest = variations.reduce((min, v) =>
    Number(v.price) < Number(min.price) ? v : min,
  );

  // Some variants may be missing photos: borrow the first one that has them.
  const withImages = variations.find((v) => v.images?.length);
  const images = (withImages?.images ?? [])
    .slice()
    .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
    .map((img) => backendImageUrl(img))
    .filter(Boolean);

  const price = Number(cheapest.price);
  const category = template.categories?.[0];

  return {
    id: template.id,
    slug: template.slug,
    name: template.name,
    price,
    material: cheapest.attributes?.material ?? '',
    category: category?.name ?? 'Muebles',
    categorySlug: category?.slug ?? 'muebles',
    image: images[0] ?? '',
    images,
    stock: variations.reduce((sum, v) => sum + v.stock, 0),
    featured: template.is_featured,
    variationCount: variations.length,
    variationId: cheapest.id,
  };
}

export async function getCatalogProducts(): Promise<CatalogProduct[]> {
  const templates = await backendFetch<ProductTemplate[]>('/api/product-templates');
  return templates
    .filter((t) => t.is_active && isAlamoTemplate(t))
    .map(toCatalogProduct)
    .filter((p): p is CatalogProduct => p !== null);
}

export async function getFeaturedProducts(limit = 8): Promise<CatalogProduct[]> {
  const products = await getCatalogProducts();
  const featured = products.filter((p) => p.featured);
  return (featured.length ? featured : products).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return backendFetch<Category[]>('/api/categories/tree');
}

export async function getTemplate(
  slugOrId: string,
): Promise<ProductTemplate | null> {
  try {
    const template = await backendFetch<ProductTemplate>(
      `/api/product-templates/by-slug/${encodeURIComponent(slugOrId)}`,
    );
    return isAlamoTemplate(template) ? template : null;
  } catch {
    return null;
  }
}
