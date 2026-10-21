export const motorSalesCopy = {
  breadcrumbHome: 'Home',
  breadcrumbCurrent: 'Motor Sales',
  hero: {
    eyebrow: 'Progressive Motorsports',
    headingLines: ['Extraordinary cars.', 'Individual character.'] as const,
    description: 'Discover luxury and custom vehicles in Houston, Texas.',
  },
  panel: {
    eyebrow: 'Motor Sales',
    headingLines: ['Find your', 'next car.'] as const,
    paragraph:
      'Progressive Motorsports offers distinctive vehicles with carefully considered custom details. Explore the current selection and speak with the team about your next car.',
    cta: 'View inventory',
    question: 'Have a question?',
    email: 'sales@progressivemotorsports.net',
    emailHref: 'mailto:sales@progressivemotorsports.net',
  },
} as const;

/** Full inventory URL from the existing /motor-sales-2/ page body. */
export const inventoryHref = 'http://progressivemotorsports.net';

export const motorSalesHero = {
  src: '/images/motor-sales/blue-ferrari-airfield.png',
  alt: 'Blue Ferrari coupe parked on an airfield with a helicopter behind it.',
  width: 1711,
  height: 919,
} as const;
