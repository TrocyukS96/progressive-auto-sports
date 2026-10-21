import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import type {CSSProperties} from 'react';
import {cn} from '@/src/shared/lib/cn';
import type {GalleryAlbum} from '../model/catalog';

type AlbumCardProps = {
  album: GalleryAlbum;
  prominent?: boolean;
  sizes: string;
};

export function AlbumCard({album, prominent = false, sizes}: AlbumCardProps) {
  const mediaStyle = {'--album-aspect': `${album.image.width} / ${album.image.height}`} as CSSProperties;

  return (
    <Link
      href={album.href}
      className={cn(
        'gallery-card flex h-full min-w-0 flex-col overflow-hidden rounded-[2px] border border-[#DEDED9] bg-white no-underline transition-colors duration-[400ms] motion-reduce:transition-none',
        prominent && 'gallery-card-prominent',
      )}
    >
      <span className="gallery-card-media relative block overflow-hidden bg-[#E7E4DE]" style={mediaStyle}>
        <Image
          src={album.image.src}
          alt={album.name}
          fill
          sizes={sizes}
          className="object-cover object-center"
        />
      </span>
      <span className="flex min-h-[44px] shrink-0 flex-wrap items-center justify-between gap-x-[8px] gap-y-[4px] px-[12px] py-[8px]">
        <h3 className="m-0 max-w-full min-w-0 text-[15px] leading-[1.2] font-semibold break-words text-[#111315] [font-family:var(--font-display),sans-serif]">
          {album.name}
        </h3>
        <span className="inline-flex shrink-0 items-center gap-[8px] text-[13px] leading-none font-medium whitespace-nowrap text-[#55595E]">
          Explore album
          <span aria-hidden className="inline-flex size-[26px] shrink-0 items-center justify-center rounded-full border border-[#111315] text-[#111315]">
            <ArrowUpRight aria-hidden className="size-[14px]" />
          </span>
        </span>
      </span>
    </Link>
  );
}
