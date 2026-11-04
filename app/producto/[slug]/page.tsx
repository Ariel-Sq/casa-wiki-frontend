import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductDetail, type ProductView } from '@/components/product-detail';
import { ProductCard } from '@/components/product-card';
import { backendImageUrl } from '@/lib/backend';
import { getCatalogProducts, getTemplate } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = await getTemplate(slug);
  if (!template) return { title: 'Pieza no encontrada' };
  return {
    title: template.name,
    description:
      template.description ??
      `${template.name} — mobiliario artesanal Casa Wiki en maderas nobles certificadas.`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const template = await getTemplate(slug);
  if (!template || !template.is_active) notFound();

  const variations = template.variations
    .filter((variation) => variation.is_active)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((variation) => ({
      id: variation.id,
      name: variation.name,
      price: Number(variation.price),
      stock: variation.stock,
      attributes: variation.attributes ?? {},
      images: (variation.images ?? [])
        .slice()
        .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        .map((image) => backendImageUrl(image))
        .filter(Boolean),
    }));

  if (!variations.length) notFound();

  const category = template.categories?.[0];
  const product: ProductView = {
    id: template.id,
    slug: template.slug,
    name: template.name,
    description: template.description ?? '',
    category: category?.name ?? 'Muebles',
    categorySlug: category?.slug ?? 'muebles',
    specifications: Object.entries(template.specifications ?? {}).map(
      ([label, value]) => ({ label, value: String(value) }),
    ),
    variations,
  };

  const related = (await getCatalogProducts())
    .filter(
      (item) =>
        item.id !== template.id &&
        (!category || item.categorySlug === category.slug),
    )
    .slice(0, 4);

  return (
    <>
      <ProductDetail product={product} />

      {related.length > 0 && (
        <section className="shell pb-10">
          <div className="flex items-end justify-between border-t border-line pt-10">
            <div>
              <p className="eyebrow text-olive">Completá tu espacio</p>
              <h2 className="mt-2 font-display text-[30px] leading-tight md:text-[36px]">
                Piezas que dialogan entre sí
              </h2>
            </div>
            <Link
              href={`/catalogo?categoria=${product.categorySlug}`}
              className="text-[12px] font-semibold text-olive underline underline-offset-4"
            >
              Ver colección
            </Link>
          </div>
          <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
