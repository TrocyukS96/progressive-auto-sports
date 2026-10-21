import Link from 'next/link';
import Image from 'next/image';
import {notFound} from 'next/navigation';
import {ArrowUpRight} from 'lucide-react';
import {Button} from '@/src/shared/ui/button';
import {siteFontClass} from '@/src/widgets/site-chrome';
import {FEATURED_SLUG} from '../model/catalog';
import {getGalleryCatalog} from '../model/get-albums';
import {AlbumCatalog} from './album-catalog';
import './galleries-display.css';

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
          {featured ? (
            <Image
              src={featured.image.src}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : null}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(17,19,21,0.62)_0%,rgba(17,19,21,0.18)_34%,rgba(17,19,21,0.22)_62%,rgba(17,19,21,0.74)_100%)]"
          />
          <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1320px] flex-col justify-end px-[20px] pt-[112px] pb-[28px] min-[768px]:px-[32px] min-[768px]:pt-[120px] min-[960px]:px-[48px] min-[1024px]:pt-[128px] min-[1024px]:pb-[40px]">
            <div className="w-fit max-w-full rounded-[20px] border border-white/30 bg-[#111315]/78 px-[28px] py-[26px] backdrop-blur-[18px] min-[768px]:rounded-[22px] min-[768px]:px-[40px] min-[768px]:py-[34px] min-[1024px]:px-[48px] min-[1024px]:py-[40px]">
              <p className="m-0 text-[12px] font-medium tracking-[0.16em] text-[#C2C4C7] uppercase min-[768px]:text-[13px]">The Progressive Gallery</p>
              <h1
                id="gallery-intro-title"
                className="m-0 mt-[14px] text-[40px] leading-[1.05] font-medium tracking-[-0.025em] text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:mt-[18px] min-[768px]:text-[52px] min-[960px]:text-[60px]"
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
          <div className="relative mx-auto w-full max-w-[1320px] px-[20px] min-[768px]:px-[32px] min-[960px]:px-[50px]">
            <div className="relative aspect-[1024/372] w-full">
              <Image
                src="/images/gallery/gallery-cta-showroom.jpg"
                alt=""
                fill
                sizes="(min-width: 1320px) 1220px, 100vw"
                quality={90}
                className="object-contain object-center"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 hidden bg-[linear-gradient(90deg,rgba(17,19,21,0.42)_0%,rgba(17,19,21,0.1)_34%,rgba(17,19,21,0)_56%)] min-[768px]:block"
              />
            </div>
            <div className="px-[20px] pt-[8px] pb-[32px] min-[768px]:absolute min-[768px]:inset-0 min-[768px]:flex min-[768px]:items-center min-[768px]:px-[40px] min-[768px]:py-[24px] min-[1024px]:px-[56px]">
            <div className="min-w-0 max-w-[340px] min-[1024px]:max-w-[380px]">
              <p className="m-0 text-[11px] font-medium tracking-[0.22em] text-[#C2C4C7] uppercase min-[768px]:text-[12px]">The Progressive Touch</p>
              <h2
                id="gallery-cta-title"
                className="m-0 mt-[10px] text-[36px] leading-[0.92] font-semibold tracking-[-0.04em] text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[40px] min-[1024px]:text-[44px]"
              >
                Make it
                <br />
                yours<span className="text-[#ED343B]">.</span>
              </h2>
              <p className="m-0 mt-[14px] text-[16px] leading-[1.35] font-medium text-[#F8F8F8] min-[768px]:mt-[18px] min-[768px]:text-[18px]">
                Let’s find the right look
                <br />
                for your car.
              </p>
              <div className="mt-[20px] min-[768px]:mt-[26px]">
                <Button variant="accent" asChild className="h-[48px] px-[22px] text-[15px]">
                  <Link href="/contact/">
                    Discuss your car
                    <ArrowUpRight aria-hidden className="size-[16px]" />
                  </Link>
                </Button>
              </div>
            </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
