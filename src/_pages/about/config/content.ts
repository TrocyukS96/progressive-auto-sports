export const aboutCopy = {
  plaque: {
    place: 'Houston, Texas',
    lines: ['One car', 'Full attention.'] as const,
  },
  story: {
    eyebrow: 'OUR STORY',
    headingLines: ['Built on passion.', 'Defined by quality.'] as const,
    year: '1996',
    yearCaption: 'WHERE IT ALL BEGAN.',
    paragraphs: [
      'Progressive Autosports began in 1996 with one vision: to personalize automobiles using the finest quality products. We treat every vehicle as if it were our own, combining thoughtful ideas, skilled people and advanced equipment.',
      'From Mercedes-Benz and BMW to Ferrari and Lamborghini, we bring an individual approach to every car. Our focus is on quality, attention to detail and authentic products.',
    ] as const,
  },
  approach: {
    eyebrow: 'OUR APPROACH',
    headingLines: ['One car.', 'Our full attention.'] as const,
    principles: [
      {
        number: '01',
        title: 'Original brands',
        text: 'Authentic products. No inferior copies.',
      },
      {
        number: '02',
        title: 'Quality materials',
        text: 'Carefully selected components and considered design.',
      },
      {
        number: '03',
        title: 'Personal attention',
        text: 'Detail first. Quality over quantity.',
      },
    ] as const,
  },
  brands: {
    eyebrow: 'BRANDS WE WORK WITH',
    names: ['VELLANO', 'BRABUS', 'WALD', 'TSW', 'VREDESTEIN', 'ALPINE', 'ECLIPSE'] as const,
  },
  cta: {
    eyebrow: 'THE PROGRESSIVE TOUCH',
    heading: 'Make it yours.',
    description: 'Let’s talk about your car.',
    button: 'Book an appointment',
    href: '/contact/',
  },
} as const;

export const aboutImages = {
  hero: {
    src: '/assets/5cb36fbbede6-about-progressive-header.jpg',
    width: 1170,
    height: 600,
    alt: 'Black Bentley convertible with gold wheels in front of the Progressive Autosports mural',
  },
  heroMobile: {
    src: '/images/about/hero-mobile.jpg',
    width: 576,
    height: 1024,
  },
  wheel: {
    src: '/images/about-reference/wheel-detail.webp',
    width: 452,
    height: 346,
    alt: 'Close-up of a gold wheel on a black Bentley',
  },
  cta: {
    src: '/images/home/card-bentley.jpg',
    alt: 'Yellow Bentley Continental GT with custom silver and yellow wheels',
  },
} as const;
