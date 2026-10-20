import pages from '@/data/pages.json';
import {resolveWheelBrand} from './adapt-brand-data';

export function getWheelBrandPage(route: string) {
  return resolveWheelBrand(route, pages);
}
