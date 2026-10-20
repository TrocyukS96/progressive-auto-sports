import type {WheelCatalogItem} from '@/src/entities/wheel-design';

export const DESIGNS_PER_PAGE = 12;

export function filterCatalogItems(items: WheelCatalogItem[], query: string, category: string | null) {
  const needle = query.trim().toLowerCase();
  return items.filter((item) => {
    if (category) {
      if (item.kind !== 'named-design' || item.category !== category) return false;
    }
    if (!needle) return true;
    if (item.kind !== 'named-design') return false;
    const haystack = `${item.name} ${item.label} ${item.categoryLabel ?? ''}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export function pageCount(total: number, pageSize: number) {
  if (total <= 0 || pageSize <= 0) return 0;
  return Math.ceil(total / pageSize);
}

export function clampPage(page: number, count: number) {
  if (count <= 0) return 1;
  return Math.min(Math.max(1, page), count);
}

export function paginate<T>(items: T[], page: number, pageSize: number) {
  const count = pageCount(items.length, pageSize);
  const current = clampPage(page, count);
  const start = (current - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

export function paginationItems(current: number, count: number): Array<number | 'gap'> {
  if (count <= 1) return [];
  if (count <= 7) return Array.from({length: count}, (_, index) => index + 1);
  const wanted = new Set([1, count, current - 1, current, current + 1]);
  const pages = [...wanted].filter((page) => page >= 1 && page <= count).sort((a, b) => a - b);
  const result: Array<number | 'gap'> = [];
  for (let index = 0; index < pages.length; index += 1) {
    const page = pages[index];
    const previous = pages[index - 1];
    if (previous !== undefined && page - previous > 1) result.push('gap');
    result.push(page);
  }
  return result;
}

export function resultNoun(items: WheelCatalogItem[]) {
  const named = items.some((item) => item.kind === 'named-design');
  const gallery = items.some((item) => item.kind === 'gallery-image');
  if (named && gallery) return items.length === 1 ? 'result' : 'results';
  if (gallery) return items.length === 1 ? 'image' : 'images';
  return items.length === 1 ? 'design' : 'designs';
}

export function showingLabel(visible: number, total: number, noun: string) {
  return `Showing ${visible} of ${total} ${noun}`;
}
