import pages from '@/data/pages.json';
import {notFound} from 'next/navigation';
import {getWheelBrandPage, WheelBrandPage} from '@/src/_pages/wheel-brand';

type RouteParams = {slug: string};

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages)
    .map((route) => route.split('/').filter(Boolean))
    .filter((parts) => parts[0] === 'wheel' && parts.length === 2)
    .map((parts) => ({slug: parts[1]}));
}

export async function generateMetadata({params}: {params: Promise<RouteParams>}) {
  const {slug} = await params;
  const source = pages[`/wheel/${slug}/` as keyof typeof pages];
  const brand = getWheelBrandPage(`/wheel/${slug}/`);
  if (!brand) return {title: 'Progressive Autosports'};
  return {
    title: source?.title || `${brand.name} - Progressive Autosports`,
    description: brand.description[0],
  };
}

export default async function WheelBrandRoute({params}: {params: Promise<RouteParams>}) {
  const {slug} = await params;
  const brand = getWheelBrandPage(`/wheel/${slug}/`);
  if (!brand) notFound();
  return <WheelBrandPage data={brand} />;
}
