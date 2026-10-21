export type AlbumPhoto = {
  id: string;
  src: string;
  fullSrc: string;
  width: number;
  height: number;
  alt: string;
};

export type ParsedAlbum = {
  rawName: string;
  intro: string;
  photos: Array<Omit<AlbumPhoto, 'alt'> & {alt: string}>;
};

export const ALBUM_LEDE = 'A closer look at the details that make each car its own.';
export const ALBUM_PERSPECTIVE = 'A progressive perspective.';
export const INITIAL_VISIBLE = 7;
export const REVEAL_BATCH = 12;

const APPROVED_LEAD: Record<string, string> = {
  ferrari: 'Italian soul.',
};

const PHOTO_CREDIT = /^All Photos Taken By\b/;

const photoPattern = /<a href="([^"]+)"[^>]*>\s*<img src="([^"]+)" alt="([^"]*)"/g;

export type AlbumMode = 'editorial' | 'grid';

export type AlbumViewState = {
  selected: number;
  visible: number;
  mode: AlbumMode;
  lightbox: boolean;
};

export type AlbumAction =
  | {type: 'step'; delta: number}
  | {type: 'select'; index: number; lightbox?: boolean}
  | {type: 'reveal'}
  | {type: 'mode'; mode: AlbumMode}
  | {type: 'lightbox'; open: boolean};

export type MosaicTile = {
  span: number;
  aspect: string;
};

const PATTERN_ROWS: Array<Array<{span: number; aspect: string}>> = [
  [
    {span: 13, aspect: '21 / 9'},
    {span: 7, aspect: '21 / 9'},
  ],
  [
    {span: 8, aspect: '21 / 9'},
    {span: 6, aspect: '21 / 9'},
    {span: 6, aspect: '21 / 9'},
  ],
  [
    {span: 13, aspect: '5 / 2'},
    {span: 7, aspect: '5 / 2'},
  ],
];

function decode(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function sizeOf(src: string) {
  const match = src.match(/-(\d+)x(\d+)\./);
  if (!match) return {width: 1170, height: 520};
  return {width: Number(match[1]), height: Number(match[2])};
}

export function perspectiveLead(slug: string) {
  return APPROVED_LEAD[slug] ?? null;
}

export function splitIntro(intro: string) {
  const text = decode(intro).replace(/\s+/g, ' ').trim();
  if (!text) return {about: null, credit: null};
  if (PHOTO_CREDIT.test(text)) return {about: null, credit: text};
  return {about: text, credit: null};
}

export function photoAlt(name: string, index: number, rawAlt: string) {
  const alt = decode(rawAlt).replace(/\s+/g, ' ').trim();
  if (alt && !/^[a-z0-9_-]+\d*$/i.test(alt)) return alt;
  return `${name} photograph ${index + 1}`;
}

export function parseAlbumHtml(html: string): ParsedAlbum {
  const rawName = decode(html.match(/class="entry-title">([^<]*)</)?.[1] ?? '').trim();
  const intro = html.match(/class="intro-content">([^<]*)</)?.[1] ?? '';
  const photos: ParsedAlbum['photos'] = [];
  const seen = new Map<string, number>();

  for (const match of html.matchAll(photoPattern)) {
    const fullSrc = match[1] ?? '';
    const src = match[2] ?? '';
    if (!fullSrc.startsWith('/assets/') || !src.startsWith('/assets/')) continue;
    const count = seen.get(fullSrc) ?? 0;
    seen.set(fullSrc, count + 1);
    const size = sizeOf(src);
    photos.push({
      id: count === 0 ? fullSrc : `${fullSrc}#${count}`,
      src,
      fullSrc,
      width: size.width,
      height: size.height,
      alt: decode(match[3] ?? '').trim(),
    });
  }

  return {rawName, intro, photos};
}

export function formatPhotoNumber(index: number) {
  return String(index + 1).padStart(2, '0');
}

export function initialVisible(total: number) {
  if (total <= 0) return 0;
  return Math.min(INITIAL_VISIBLE, total);
}

export function revealCount(visible: number, total: number) {
  if (visible >= total) return total;
  return Math.min(total, visible + REVEAL_BATCH);
}

export function stepIndex(index: number, delta: number, total: number) {
  if (total <= 1) return 0;
  return ((index + delta) % total + total) % total;
}

export function createAlbumState(total: number): AlbumViewState {
  return {selected: 0, visible: initialVisible(total), mode: 'editorial', lightbox: false};
}

export function reduceAlbumView(state: AlbumViewState, action: AlbumAction, total: number): AlbumViewState {
  switch (action.type) {
    case 'step': {
      if (total < 2) return state;
      return {...state, selected: stepIndex(state.selected, action.delta, total)};
    }
    case 'select': {
      if (total <= 0 || action.index < 0 || action.index >= total) return state;
      return {...state, selected: action.index, lightbox: action.lightbox ?? state.lightbox};
    }
    case 'reveal':
      return {...state, visible: revealCount(state.visible, total)};
    case 'mode':
      return state.mode === action.mode ? state : {...state, mode: action.mode};
    case 'lightbox':
      return state.lightbox === action.open ? state : {...state, lightbox: action.open};
    default:
      return state;
  }
}

function evenTiles(count: number): MosaicTile[] {
  const base = Math.floor(20 / count);
  let extra = 20 % count;
  return Array.from({length: count}, () => {
    const span = base + (extra > 0 ? 1 : 0);
    if (extra > 0) extra -= 1;
    return {span, aspect: '21 / 9'};
  });
}

export function mosaicTiles(count: number): MosaicTile[] {
  if (count <= 0) return [];
  const tiles: MosaicTile[] = [];
  let remaining = count;

  while (remaining >= 7) {
    for (const row of PATTERN_ROWS) tiles.push(...row);
    remaining -= 7;
  }

  let rowIndex = 0;
  while (remaining > 0 && rowIndex < PATTERN_ROWS.length) {
    const row = PATTERN_ROWS[rowIndex];
    if (remaining >= row.length) {
      tiles.push(...row);
      remaining -= row.length;
      rowIndex += 1;
    } else {
      tiles.push(...evenTiles(remaining));
      remaining = 0;
    }
  }

  if (remaining > 0) tiles.push(...evenTiles(remaining));
  return tiles;
}

export type AlbumNeighbor = {
  href: string;
  name: string;
  image: {
    src: string;
    width: number;
    height: number;
  };
};

export type GalleryAlbumDetail = {
  slug: string;
  href: string;
  name: string;
  pageTitle: string;
  lede: string;
  perspective: string;
  lead: string | null;
  about: string | null;
  credit: string | null;
  photos: AlbumPhoto[];
  next: AlbumNeighbor | null;
};

export function buildGalleryAlbum(input: {
  slug: string;
  href: string;
  name: string;
  title: string;
  html: string;
  albums: Array<AlbumNeighbor & {slug: string}>;
}): GalleryAlbumDetail {
  const parsed = parseAlbumHtml(input.html);
  const intro = splitIntro(parsed.intro);
  const index = input.albums.findIndex((album) => album.slug === input.slug);
  const next = index >= 0 ? input.albums[index + 1] : undefined;

  return {
    slug: input.slug,
    href: input.href,
    name: input.name,
    pageTitle: input.title || `${input.name} - Progressive Autosports`,
    lede: ALBUM_LEDE,
    perspective: ALBUM_PERSPECTIVE,
    lead: perspectiveLead(input.slug),
    about: intro.about,
    credit: intro.credit,
    photos: parsed.photos.map((photo, photoIndex) => ({
      ...photo,
      alt: photoAlt(input.name, photoIndex, photo.alt),
    })),
    next: next ? {href: next.href, name: next.name, image: next.image} : null,
  };
}

export function mosaicRows(tiles: MosaicTile[]) {
  const rows: MosaicTile[][] = [];
  let current: MosaicTile[] = [];
  let sum = 0;
  for (const tile of tiles) {
    current.push(tile);
    sum += tile.span;
    if (sum === 20) {
      rows.push(current);
      current = [];
      sum = 0;
    } else if (sum > 20) {
      return null;
    }
  }
  if (sum !== 0) return null;
  return rows;
}
