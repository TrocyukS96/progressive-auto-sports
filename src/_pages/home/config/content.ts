export type HomeLink = {
  href: string;
  label: string;
  external?: boolean;
};

export type HomeSlide = {
  src: string;
  alt: string;
  objectPosition: string;
  title: string;
  description: string;
};

export type CollectionCard = {
  src: string;
  alt: string;
  eyebrow: string;
  title: string;
  objectPosition: string;
};

export const primaryNav: HomeLink[] = [
  {href: '/motor-sales-2/', label: 'Inventory'},
  {href: '/wheels/', label: 'Wheels & Custom'},
  {href: '/about/', label: 'About'},
];

export const showroomLink: HomeLink = {href: '/contact/', label: 'Visit showroom'};
export const inventoryLink: HomeLink = {href: '/motor-sales-2/', label: 'Explore inventory'};
export const wheelsLink: HomeLink = {href: '/wheels/', label: 'Explore wheels'};

export const heroSlides: HomeSlide[] = [
  {
    src: '/images/home/hero-viper.jpg',
    alt: 'Black 2015 Dodge Viper in side profile under a concrete overpass',
    objectPosition: 'center 50%',
    title: 'Held in a single line.',
    description: 'Black paint, a still profile, and the quiet before the first mile.',
  },
  {
    src: '/images/home/hero-range-rover.jpg',
    alt: 'Black 2015 Range Rover with bronze wheels under a concrete overpass',
    objectPosition: 'center 55%',
    title: 'The road makes room.',
    description: 'Bronze wheels and a calm presence that never has to hurry.',
  },
  {
    src: '/images/home/hero-mclaren.jpg',
    alt: 'Orange 2016 McLaren with the doors raised on a residential drive',
    objectPosition: 'center 40%',
    title: 'Doors up.',
    description: 'The ordinary stays on the ground. This one opens to the sky.',
  },
];

export const collectionCards: CollectionCard[] = [
  {
    src: '/images/home/card-viper.jpg',
    alt: 'Black Dodge Viper photographed from a low front three-quarter angle',
    eyebrow: 'Performance',
    title: 'Built for the drive.',
    objectPosition: 'center 42%',
  },
  {
    src: '/images/home/card-mclaren.jpg',
    alt: 'Orange McLaren Spider in an indoor bay',
    eyebrow: 'Exotics',
    title: 'Anything but ordinary.',
    objectPosition: 'center center',
  },
  {
    src: '/images/home/card-bentley.jpg',
    alt: 'Yellow Bentley Continental GT with custom wheels',
    eyebrow: 'Grand touring',
    title: 'Presence, redefined.',
    objectPosition: 'center center',
  },
];

export const showroomPhoto = {
  src: '/images/home/showroom-bentley.jpg',
  alt: 'Black convertible parked in front of the Progressive Autosports mural',
  objectPosition: 'center center',
};

export const contact = {
  addressLines: ['14037 Stuebner Airline Rd', 'Houston, TX 77069'],
  phoneDisplay: '281-893-1134',
  phoneHref: 'tel:281-893-1134',
  email: 'sales@progressiveautosports.com',
  emailHref: 'mailto:sales@progressiveautosports.com',
};

export const socialLinks: HomeLink[] = [
  {
    href: 'https://www.facebook.com/pages/Progressive-Autosports/162798422240',
    label: 'Facebook',
    external: true,
  },
  {href: 'http://instagram.com/progressiveautosport', label: 'Instagram', external: true},
];

export const footerNav: HomeLink[] = [
  {href: '/motor-sales-2/', label: 'Motor Sales'},
  {href: '/privacy-policy/', label: 'Privacy Policy'},
];

export const copyright = '© 2021 Progressive Autosports, All Rights Reserved.';
