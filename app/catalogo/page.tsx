import type { Metadata } from 'next';
import { CatalogClient } from '@/components/catalog-client';
import { getCatalogProducts, getCategories } from '@/lib/products';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catálogo de muebles',
  description:
    'Explorá la colección completa de muebles artesanales Casa Wiki: maderas nobles certificadas, tapizados orgánicos y piezas hechas a mano.',
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; buscar?: string }>;
}) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getCatalogProducts(),
    getCategories(),
  ]);

  return (
    <CatalogClient
      products={products}
      categories={categories}
      initialCategory={params.categoria ?? ''}
      initialQuery={params.buscar ?? ''}
    />
  );
}
