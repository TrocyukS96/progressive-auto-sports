export type SiteLink = {
  href: string;
  label: string;
  external?: boolean;
};

export const primaryNav: SiteLink[] = [
  {href: '/wheels/', label: 'Wheels'},
  {href: '/galleries/', label: 'Gallery'},
  {href: '/about/', label: 'About'},
];

export const showroomLink: SiteLink = {href: '/contact/', label: 'Visit showroom'};

export const contact = {
  addressLines: ['14037 Stuebner Airline Rd', 'Houston, TX 77069'],
  phoneDisplay: '281-893-1134',
  phoneHref: 'tel:281-893-1134',
  email: 'sales@progressiveautosports.com',
  emailHref: 'mailto:sales@progressiveautosports.com',
};

export const socialLinks: SiteLink[] = [
  {
    href: 'https://www.facebook.com/pages/Progressive-Autosports/162798422240',
    label: 'Facebook',
    external: true,
  },
  {href: 'http://instagram.com/progressiveautosport', label: 'Instagram', external: true},
];

export const footerNav: SiteLink[] = [
  {href: '/motor-sales-2/', label: 'Motor Sales'},
  {href: '/privacy-policy/', label: 'Privacy Policy'},
];

export const copyright = '© 2021 Progressive Autosports, All Rights Reserved.';
