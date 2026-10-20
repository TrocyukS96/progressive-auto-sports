const ACRONYMS = new Set(['AG', 'KSM', 'BM', 'DI']);

export function decodeText(value: string) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#039;|&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

/** Readable label. Short codes stay intact; finish suffixes are spaced, not merged. */
export function displayDesignName(raw: string) {
  const name = decodeText(raw).trim();
  if (!name) return '';
  if (name === name.toLowerCase()) return name.toUpperCase();
  const looksLikeCode = /^[a-z0-9]+$/i.test(name) && /\d/.test(name) && !/[a-z][A-Z]/.test(name) && name.length <= 8;
  if (looksLikeCode) return name.toUpperCase();
  return name
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/(\d)([A-Z])/g, '$1 $2')
    .replace(/([a-z])(\d)/g, '$1 $2')
    .replace(/([A-Z])([A-Z][a-z])/g, '$1 $2');
}

export function formatCategoryLabel(source: string, slug: string) {
  if (slug === 'monoblock') return 'Monoblock';
  if (slug === '3-piece-modular') return '3-piece modular';
  return source
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const upper = word.toUpperCase();
      if (ACRONYMS.has(upper)) return upper;
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    })
    .join(' ');
}

export function catalogSummary(designs: number, images: number, collections: number) {
  const parts: string[] = [];
  if (designs > 0) parts.push(`${designs} ${designs === 1 ? 'design' : 'designs'}`);
  if (images > 0) parts.push(`${images} ${images === 1 ? 'image' : 'images'}`);
  if (parts.length === 0) parts.push('0 designs');
  if (collections > 0) parts.push(`${collections} ${collections === 1 ? 'collection' : 'collections'}`);
  return parts.join(' · ');
}
