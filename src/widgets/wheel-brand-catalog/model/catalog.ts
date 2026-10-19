import type {WheelBrand} from '@/src/entities/wheel-brand';

/** Twelve cards fill the approved four-by-three desktop grid. Further brands start the next page. */
export const BRANDS_PER_PAGE = 12;

export function filterBrands(brands: WheelBrand[], query: string): WheelBrand[] {
  const needle = query.trim().toLowerCase();
  if (!needle) return brands;
  return brands.filter((brand) => brand.name.toLowerCase().includes(needle));
}

export function pageCount(total: number, pageSize: number): number {
  if (total <= 0 || pageSize <= 0) return 0;
  return Math.ceil(total / pageSize);
}

export function clampPage(page: number, count: number): number {
  if (count <= 0) return 1;
  return Math.min(Math.max(1, page), count);
}

export function paginate<T>(items: T[], page: number, pageSize: number): T[] {
  const count = pageCount(items.length, pageSize);
  const current = clampPage(page, count);
  const start = (current - 1) * pageSize;
  return items.slice(start, start + pageSize);
}
