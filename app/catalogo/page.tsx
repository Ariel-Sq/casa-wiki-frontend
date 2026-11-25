import type { Metadata } from 'next';
import { CatalogClient } from '@/components/catalog-client';
import { getCatalogProducts, getCategories } from '@/lib/products';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Catálogo de muebles',
  description:
    'Explorá la colección de muebles de álamo macizo de Casa Wiki: fabricación nacional, terminación en laca poliuretánica y entrega coordinada.',
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
