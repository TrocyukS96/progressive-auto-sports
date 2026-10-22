export type SiteLink = {
  href: string;
  label: string;
  external?: boolean;
};

export const primaryNav: SiteLink[] = [
  {href: '/wheels/', label: 'Wheels'},
  {href: '/galleries/', label: 'Gallery'},
  {href: '/about/', label: 'About'},
  {href: '/contact/', label: 'Contact'},
];

export const showroomLink: SiteLink = {href: '/contact/', label: 'Visit showroom'};

export const onlineStoreLink: SiteLink = {
  href: 'http://progressivemotorsports.net/',
  label: 'Online store',
  external: true,
};

const addressLines = ['14037 Stuebner Airline Rd', 'Houston, TX 77069'];
const addressQuery = encodeURIComponent(addressLines.join(', '));
const showroomPin = '29.989045,-95.499824';
// Centered west of the pin so the marker stays in the open part of the card.
const mapPreviewCenter = '29.989045,-95.506824';

export const contact = {
  addressLines,
  cityLabel: 'Houston, Texas',
  phoneDisplay: '281-893-1134',
  phoneHref: 'tel:281-893-1134',
  email: 'sales@progressiveautosports.com',
  emailHref: 'mailto:sales@progressiveautosports.com',
  mapsSearchHref: `https://www.google.com/maps/search/?api=1&query=${addressQuery}`,
  mapsEmbedHref: `https://maps.google.com/maps?ll=${mapPreviewCenter}&q=${showroomPin}&hl=en&z=15&output=embed`,
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
  {href: '/sales/', label: 'Motor Sales'},
  {href: '/privacy-policy/', label: 'Privacy Policy'},
];

export const copyright = '© 2021 Progressive Autosports, All Rights Reserved.';
