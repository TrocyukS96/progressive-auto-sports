export type NamedWheelDesign = {
  kind: 'named-design';
  id: string;
  name: string;
  label: string;
  category: string | null;
  categoryLabel: string | null;
  image: string;
  thumbnail: string;
};

export type GalleryWheelImage = {
  kind: 'gallery-image';
  id: string;
  image: string;
  thumbnail: string;
  alt: string;
};

export type WheelCatalogItem = NamedWheelDesign | GalleryWheelImage;

export type WheelCategory = {
  slug: string;
  label: string;
  count: number;
};
