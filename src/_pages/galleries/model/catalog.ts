export type GalleryAlbum = {
  slug: string;
  href: string;
  name: string;
  rawName: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
  page: number;
};

export type GalleryPage = {
  page: number;
  href: string;
  albums: GalleryAlbum[];
};

const DISPLAY_NAMES: Record<string, string> = {
  porche: 'Porsche',
  'mercedes-benz': 'Mercedes-Benz',
  bmw: 'BMW',
  trucks: 'Trucks – Jeeps -SUV',
};

export const FEATURED_SLUG = 'ferrari';

export type GalleryBlock = {
  href: string;
  slug: string;
  rawName: string;
  src: string;
};

const albumPattern =
  /<a href="([^"]+)" title="Explore more on ([^"]+)">[\s\S]*?<h2 class="gallery-title">([^<]+)<\/h2>[\s\S]*?<img[^>]*src="([^"]+)"[^>]*alt="([^"]*)"/g;

function decode(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function slugFromHref(href: string) {
  const parts = href.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? href;
}

export function parseGalleryBlocks(html: string): GalleryBlock[] {
  const blocks: GalleryBlock[] = [];
  const seen = new Set<string>();

  for (const match of html.matchAll(albumPattern)) {
    const href = match[1];
    if (!href || seen.has(href)) continue;
    seen.add(href);
    blocks.push({
      href,
      slug: slugFromHref(href),
      rawName: decode((match[3] || match[2] || '').trim()),
      src: match[4] || '',
    });
  }

  return blocks;
}

export function displayName(slug: string, rawName: string) {
  const mapped = DISPLAY_NAMES[slug];
  if (mapped) return mapped;

  return rawName
    .trim()
    .toLowerCase()
    .split(/(\s+|–|-)/)
    .map((part) => {
      if (part.toLowerCase() === 'suv') return 'SUV';
      if (part.toLowerCase() === 'bmw') return 'BMW';
      if (!/[a-z]/i.test(part)) return part;
      return part.charAt(0).toUpperCase() + part.slice(1);
    })
    .join('');
}

export function isFiltering(query: string, marque: string | null) {
  return query.trim().length > 0 || marque !== null;
}

export function filterAlbums(albums: GalleryAlbum[], query: string, marque: string | null) {
  const needle = query.trim().toLowerCase();
  return albums.filter((album) => {
    if (marque && album.slug !== marque) return false;
    if (!needle) return true;
    return [album.name, album.rawName].some((value) => value.toLowerCase().includes(needle));
  });
}

export type EditorialLayout = {
  prominent: GalleryAlbum | null;
  stack: GalleryAlbum[];
  bottom: GalleryAlbum[];
};

export function editorialLayout(albums: GalleryAlbum[]): EditorialLayout {
  const bySlug = new Map(albums.map((album) => [album.slug, album]));
  const pick = (slug: string) => bySlug.get(slug) ?? null;
  return {
    prominent: pick('porche'),
    stack: ['lamborghini', 'bentley'].flatMap((slug) => {
      const album = pick(slug);
      return album ? [album] : [];
    }),
    bottom: ['mercedes-benz', 'bmw', 'audi'].flatMap((slug) => {
      const album = pick(slug);
      return album ? [album] : [];
    }),
  };
}

export type CatalogView = {
  mode: 'editorial' | 'compact';
  layout: EditorialLayout;
  rest: GalleryAlbum[];
};

function omitSlugs(albums: GalleryAlbum[], slugs: Array<string | null | undefined>) {
  const hidden = new Set(slugs.filter((slug): slug is string => Boolean(slug)));
  if (hidden.size === 0) return albums;
  return albums.filter((album) => !hidden.has(album.slug));
}

export function catalogView(options: {
  all: GalleryAlbum[];
  pageAlbums: GalleryAlbum[];
  query: string;
  marque: string | null;
  featuredSlug: string | null;
  page: number;
}): CatalogView {
  const reserved = [options.featuredSlug];
  if (isFiltering(options.query, options.marque)) {
    return {
      mode: 'compact',
      layout: {prominent: null, stack: [], bottom: []},
      rest: filterAlbums(options.all, options.query, options.marque),
    };
  }

  if (options.page !== 1) {
    return {
      mode: 'compact',
      layout: {prominent: null, stack: [], bottom: []},
      rest: options.pageAlbums,
    };
  }

  const pool = omitSlugs(options.pageAlbums, reserved);
  const layout = editorialLayout(pool);
  const placed = [layout.prominent, ...layout.stack, ...layout.bottom].filter((album): album is GalleryAlbum => album !== null);

  if (placed.length === 0) {
    return {
      mode: 'compact',
      layout: {prominent: null, stack: [], bottom: []},
      rest: options.pageAlbums,
    };
  }

  return {
    mode: 'editorial',
    layout,
    rest: [],
  };
}
