import Image from 'next/image';
import {collectionCards} from '../config/content';

export function HomeCollection() {
  return (
    <section className="bg-[#F4F3EF] text-[#111315]">
      <div className="mx-auto max-w-[1280px] px-[16px] py-[64px] min-[768px]:px-[32px] min-[1024px]:py-[84px]">
        <p className="m-0 text-[12px] font-medium tracking-[0.16em] text-[#55595E] uppercase">The collection</p>
        <h2 className="m-0 mt-[12px] max-w-[16ch] text-[34px] leading-[1.08] font-medium text-[#111315] [font-family:var(--font-display),sans-serif] min-[768px]:text-[46px]">
          Find your kind of extraordinary.
        </h2>
        <ul className="m-0 mt-[32px] grid list-none grid-cols-1 gap-[28px] p-0 min-[768px]:grid-cols-2 min-[1024px]:mt-[40px] min-[1024px]:grid-cols-3 min-[1024px]:gap-[24px]">
          {collectionCards.map((card) => (
            <li key={card.eyebrow}>
              <article>
                <div className="relative aspect-[19/10] overflow-hidden rounded-[8px] bg-[#E7E4DE]">
                  <Image
                    src={card.src}
                    alt={card.alt}
                    fill
                    sizes="(min-width: 1024px) 380px, (min-width: 768px) 46vw, 100vw"
                    className="object-cover"
                    style={{objectPosition: card.objectPosition}}
                  />
                </div>
                <p className="m-0 mt-[14px] text-[12px] font-medium tracking-[0.16em] text-[#55595E] uppercase">
                  {card.eyebrow}
                </p>
                <h3 className="m-0 mt-[6px] text-[26px] leading-[1.15] font-medium text-[#111315] [font-family:var(--font-display),sans-serif]">
                  {card.title}
                </h3>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
