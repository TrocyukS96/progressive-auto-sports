import Link from 'next/link';
import Image, {getImageProps} from 'next/image';
import {notFound} from 'next/navigation';
import {ArrowUpRight} from 'lucide-react';
import {Button} from '@/src/shared/ui/button';
import {siteFontClass} from '@/src/widgets/site-chrome';
import {FEATURED_SLUG} from '../model/catalog';
import {getGalleryCatalog} from '../model/get-albums';
import {AlbumCatalog} from './album-catalog';
import './galleries-display.css';

const galleryMobileHero = {
  src: '/images/gallery/gallery-intro-mobile.jpg',
  width: 576,
  height: 1024,
};

function GalleryIntroMedia({image}: {image: {src: string; width: number; height: number}}) {
  const shared = {alt: '', sizes: '100vw'} as const;
  const {
    props: {srcSet: mobileSrcSet},
  } = getImageProps({...shared, ...galleryMobileHero});
  const {props: desktop} = getImageProps({...shared, width: image.width, height: image.height, src: image.src});

  return (
    <div className="gallery-intro-media">
      <picture>
        <source media="(max-width: 767px)" srcSet={mobileSrcSet} />
        <img
          alt=""
          src={desktop.src}
          srcSet={desktop.srcSet}
          sizes="100vw"
          width={image.width}
          height={image.height}
          fetchPriority="high"
          decoding="async"
        />
      </picture>
    </div>
  );
}

export function GalleriesPage({page}: {page: number}) {
  const catalog = getGalleryCatalog();
  const current = catalog.pages.find((entry) => entry.page === page);
  if (!current) notFound();

  const featured = catalog.albums.find((album) => album.slug === FEATURED_SLUG) ?? null;

  return (
    <div
      className={`${siteFontClass} galleries-page relative box-border flex-1 bg-[#111315] text-[#F8F8F8] antialiased [&_*]:box-border`}
      style={{fontFamily: 'var(--font-body), Inter, sans-serif'}}
    >
      <main>
        <section aria-labelledby="gallery-intro-title" className="relative min-h-[100dvh] overflow-hidden bg-[#111315] text-[#F8F8F8]">
          {featured ? <GalleryIntroMedia image={featured.image} /> : null}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,21,0.62)_0%,rgba(17,19,21,0.18)_34%,rgba(17,19,21,0.22)_62%,rgba(17,19,21,0.74)_100%)]"
          />
          <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1320px] flex-col justify-end px-[20px] pt-[108px] pb-[32px] min-[768px]:px-[32px] min-[768px]:pt-[120px] min-[768px]:pb-[88px] min-[960px]:px-[48px] min-[1024px]:pt-[128px]">
            <div className="w-fit max-w-full rounded-[18px] border border-white/30 bg-[#111315]/78 px-[22px] py-[20px] backdrop-blur-[18px] min-[768px]:rounded-[22px] min-[768px]:px-[40px] min-[768px]:py-[34px] min-[1024px]:px-[48px] min-[1024px]:py-[40px]">
              <p className="m-0 text-[12px] font-medium tracking-[0.16em] text-[#C2C4C7] uppercase min-[768px]:text-[13px]">The Progressive Gallery</p>
              <h1
                id="gallery-intro-title"
                className="m-0 mt-[14px] text-[32px] leading-[1.2] font-medium tracking-[-0.025em] text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:mt-[18px] min-[768px]:text-[60px] min-[768px]:leading-[1.12]"
              >
                Built to
                <br />
                stand out<span className="text-[#ED343B]">.</span>
              </h1>
            </div>
          </div>
        </section>

        <AlbumCatalog
          albums={catalog.albums}
          pageAlbums={current.albums}
          pages={catalog.pages}
          page={page}
          featuredSlug={featured?.slug ?? null}
        />

        <section aria-labelledby="gallery-cta-title" className="bg-[#111315] text-[#F8F8F8]">
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-center gap-[28px] px-[20px] py-[64px] min-[768px]:px-[32px] min-[960px]:px-[50px] min-[1024px]:grid-cols-2 min-[1024px]:gap-[56px] min-[1024px]:py-[84px]">
            <div className="order-2 max-w-[520px] min-[1024px]:order-1">
              <p className="m-0 text-[12px] font-medium tracking-[0.16em] text-[#C2C4C7] uppercase">The Progressive Touch</p>
              <h2
                id="gallery-cta-title"
                className="m-0 mt-[12px] text-[36px] leading-[1.05] font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[48px]"
              >
                Make it
                <br />
                yours<span className="text-[#ED343B]">.</span>
              </h2>
              <p className="m-0 mt-[18px] text-[16px] leading-[1.5] text-[#F8F8F8]">Let’s find the right look for your car.</p>
              <div className="mt-[24px]">
                <Button variant="accent" asChild className="h-[48px] px-[22px] text-[15px]">
                  <Link href="/contact/">
                    Discuss your car
                    <ArrowUpRight aria-hidden className="size-[16px]" />
                  </Link>
                </Button>
              </div>
            </div>
            <div className="relative order-1 aspect-[1024/372] overflow-hidden rounded-[8px] bg-[#111315] min-[768px]:aspect-[19/10] min-[1024px]:order-2">
              <Image
                src="/images/gallery/gallery-cta-showroom.jpg"
                alt="Silver Ferrari coupe parked in a dark showroom"
                fill
                sizes="(min-width: 1024px) 600px, 100vw"
                quality={90}
                className="object-contain object-center min-[768px]:object-cover min-[768px]:object-right"
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
