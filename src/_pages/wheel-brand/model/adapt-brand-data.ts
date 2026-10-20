import type {GalleryWheelImage, NamedWheelDesign, WheelCatalogItem, WheelCategory} from '@/src/entities/wheel-design';
import {catalogSummary, decodeText, displayDesignName, formatCategoryLabel} from './format';

const LAYOUT_CLASS = /^(mix|wheel-pic|col-\S+)$/;

export type ConstructionGuidance = {
  kind: 'construction';
  monoblockImage: string;
  monoblockAlt: string;
};

export type NotesGuidance = {
  kind: 'notes';
};

export type WheelBrandView = {
  slug: string;
  route: string;
  name: string;
  eyebrow: string;
  headline: string;
  description: string[];
  summary: string;
  hero: {src: string; alt: string; cutout: boolean} | null;
  categories: WheelCategory[];
  showFilters: boolean;
  items: WheelCatalogItem[];
  searchable: boolean;
  guidance: ConstructionGuidance | NotesGuidance;
};

type SourcePage = {html?: string};

function categorySlug(className: string) {
  const token = className.split(/\s+/).find((part) => part && !LAYOUT_CLASS.test(part));
  return token ?? null;
}

function galleryAlt(alt: string) {
  const clean = decodeText(alt).replace(/\s+/g, ' ').trim();
  if (!clean || /\.(png|jpe?g|webp|gif)$/i.test(clean)) return 'Wheel photograph';
  return clean;
}

function brandName(html: string, slug: string) {
  const heading = html.match(/<h1>([\s\S]*?)<\/h1>/i);
  const name = heading ? decodeText(heading[1]).replace(/\s+/g, ' ').trim() : '';
  return name || slug;
}

export function adaptBrandHtml(input: {route: string; slug: string; html: string}): WheelBrandView {
  const name = brandName(input.html, input.slug);
  const labelBySlug = new Map<string, string>();
  const filterOrder: string[] = [];

  for (const match of input.html.matchAll(/data-filter="([^"]+)"[^>]*>([^<]+)/g)) {
    const slug = match[1].replace(/^\./, '').trim();
    const label = decodeText(match[2]).replace(/\s+/g, ' ').trim();
    if (!slug || slug === 'all' || /^all$/i.test(label)) continue;
    if (!labelBySlug.has(slug)) {
      labelBySlug.set(slug, formatCategoryLabel(label, slug));
      filterOrder.push(slug);
    }
  }

  const items: WheelCatalogItem[] = [];
  const seen = new Map<string, number>();
  const block = /<div class="([^"]*\bwheel-pic\b[^"]*)">([\s\S]*?)<\/div>/g;

  for (const match of input.html.matchAll(block)) {
    const body = match[2];
    const href = body.match(/<a\b[^>]*\bhref="([^"]+)"/i)?.[1];
    const thumb = body.match(/<img\b[^>]*\bsrc="([^"]+)"/i)?.[1];
    if (!href || !thumb) continue;
    const title = decodeText(body.match(/<a\b[^>]*\btitle="([^"]*)"/i)?.[1] ?? '').trim();
    const heading = decodeText(body.match(/<h3>([^<]*)<\/h3>/i)?.[1] ?? '').trim();
    const sourceName = heading || title;
    const alt = body.match(/<img\b[^>]*\balt="([^"]*)"/i)?.[1] ?? '';
    const category = categorySlug(match[1]);
    const count = seen.get(href) ?? 0;
    seen.set(href, count + 1);
    const id = count === 0 ? href : `${href}#${count}`;

    if (!sourceName) {
      const image: GalleryWheelImage = {
        kind: 'gallery-image',
        id,
        image: href,
        thumbnail: thumb,
        alt: galleryAlt(alt),
      };
      items.push(image);
      continue;
    }

    const categoryLabel = category ? (labelBySlug.get(category) ?? formatCategoryLabel(category.replace(/-/g, ' '), category)) : null;
    const design: NamedWheelDesign = {
      kind: 'named-design',
      id,
      name: sourceName,
      label: displayDesignName(sourceName),
      category,
      categoryLabel,
      image: href,
      thumbnail: thumb,
    };
    items.push(design);
  }

  const counts = new Map<string, number>();
  for (const item of items) {
    if (item.kind === 'named-design' && item.category) counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  const orderedSlugs = [...filterOrder.filter((slug) => (counts.get(slug) ?? 0) > 0)];
  for (const slug of counts.keys()) {
    if (!orderedSlugs.includes(slug)) orderedSlugs.push(slug);
  }
  const categories: WheelCategory[] = orderedSlugs.map((slug) => ({
    slug,
    label: labelBySlug.get(slug) ?? formatCategoryLabel(slug.replace(/-/g, ' '), slug),
    count: counts.get(slug) ?? 0,
  }));

  const designs = items.filter((item) => item.kind === 'named-design').length;
  const images = items.length - designs;
  const first = items[0];
  const hero = first
    ? {
        src: first.image,
        alt: first.kind === 'named-design' ? `${name} ${first.label} wheel` : `${name} wheel`,
        cutout: first.image.toLowerCase().endsWith('.png'),
      }
    : null;

  const hasMonoblock = categories.some((category) => category.slug === 'monoblock');
  const hasModular = categories.some((category) => category.slug === '3-piece-modular');
  const klassenCopy = input.slug === 'klassen' && hasMonoblock && hasModular;
  const monoblock = items.find((item): item is NamedWheelDesign => item.kind === 'named-design' && item.category === 'monoblock');

  return {
    slug: input.slug,
    route: input.route,
    name,
    eyebrow: klassenCopy ? name : 'Wheel collection',
    headline: klassenCopy ? 'Distinct by design.' : name,
    description: klassenCopy
      ? ['Explore the Klassen wheel collection.', 'Monoblock and 3-piece modular designs.']
      : [`Explore the ${name} wheel collection.`],
    summary: catalogSummary(designs, images, categories.length),
    hero,
    categories,
    showFilters: categories.length >= 2,
    items,
    searchable: designs > 0,
    guidance:
      klassenCopy && monoblock
        ? {
            kind: 'construction',
            monoblockImage: monoblock.image,
            monoblockAlt: `${name} ${monoblock.label} wheel, shown as an example of monoblock construction`,
          }
        : {kind: 'notes'},
  };
}

export function resolveWheelBrand(route: string, source: Record<string, SourcePage> | undefined) {
  const parts = route.split('/').filter(Boolean);
  if (parts.length !== 2 || (parts[0] !== 'wheel' && parts[0] !== 'wheels')) return null;
  const slug = parts[1];
  const entry = source?.[`/wheel/${slug}/`];
  if (!entry?.html) return null;
  return adaptBrandHtml({route: `/wheels/${slug}/`, slug, html: entry.html});
}
