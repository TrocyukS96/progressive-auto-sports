export const wheelHeroWidth = 1942;
export const wheelHeroHeight = 809;

export type WheelHero = {
  src: string;
  width: number;
  height: number;
};

const wheelHeroBySlug = {
  'avant-garde': '/images/wheel-brands/hero-avant-garde.png',
  'beyern-wheels': '/images/wheel-brands/hero-beyern-wheels.png',
  'black-rhino': '/images/wheel-brands/hero-black-rhino.png',
  cray: '/images/wheel-brands/hero-cray.png',
  huntington: '/images/wheel-brands/hero-huntington.png',
  klassen: '/images/wheel-brands/hero-klassen.png',
  mandrus: '/images/wheel-brands/hero-mandrus.png',
  petrol: '/images/wheel-brands/hero-petrol.png',
  redbourne: '/images/wheel-brands/hero-redbourne.png',
  'savini-wheels': '/images/wheel-brands/hero-savini-wheels.png',
  tsw: '/images/wheel-brands/hero-tsw.png',
  'vellano-wheels': '/images/wheel-brands/hero-vellano-wheels.png',
  'victor-equipment': '/images/wheel-brands/hero-victor-equipment.png',
} as const satisfies Record<string, string>;

export type WheelHeroSlug = keyof typeof wheelHeroBySlug;

export const wheelHeroSlugs = Object.keys(wheelHeroBySlug) as WheelHeroSlug[];

export function getWheelHero(slug: string): WheelHero | null {
  if (!Object.prototype.hasOwnProperty.call(wheelHeroBySlug, slug)) return null;
  const src = wheelHeroBySlug[slug as WheelHeroSlug];
  return {src, width: wheelHeroWidth, height: wheelHeroHeight};
}
