import { backendFetch, backendImageUrl } from './backend';
import { MERCADOPAGO_SURCHARGE_RATE } from './constants';
import type { Category, ProductTemplate, ProductVariation } from './types';

export interface CatalogProduct {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAt: number;
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
    compareAt: Math.round(price * (1 + MERCADOPAGO_SURCHARGE_RATE)),
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
    .filter((t) => t.is_active)
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
    return await backendFetch<ProductTemplate>(
      `/api/product-templates/by-slug/${encodeURIComponent(slugOrId)}`,
    );
  } catch {
    return null;
  }
}
