import Image, {getImageProps} from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {Button} from '@/src/shared/ui/button';
import {siteFontClass} from '@/src/widgets/site-chrome';
import {aboutCopy, aboutImages} from '../config/content';
import './about-page.css';

function HeadingLines({
  as: Tag,
  id,
  lines,
}: {
  as: 'h1' | 'h2';
  id: string;
  lines: readonly [string, string];
}) {
  return (
    <Tag id={id}>
      {lines.map((line, index) => {
        const accent = index === lines.length - 1 && line.endsWith('.');
        const text = accent ? line.slice(0, -1) : line;
        return (
          <span key={line} className="about-line">
            {text}{accent ? <span className="about-dot">.</span> : null}
          </span>
        );
      })}
    </Tag>
  );
}

function AboutHeroMedia() {
  const alt = aboutImages.hero.alt;
  const shared = {alt, sizes: '100vw'} as const;
  const {
    props: {srcSet: desktopSrcSet},
  } = getImageProps({
    ...shared,
    width: aboutImages.hero.width,
    height: aboutImages.hero.height,
    src: aboutImages.hero.src,
  });
  const {props: mobile} = getImageProps({
    ...shared,
    width: aboutImages.heroMobile.width,
    height: aboutImages.heroMobile.height,
    src: aboutImages.heroMobile.src,
  });

  return (
    <div className="about-hero-media">
      <picture>
        <source media="(min-width: 768px)" srcSet={desktopSrcSet} />
        <img
          alt={alt}
          src={mobile.src}
          srcSet={mobile.srcSet}
          sizes="100vw"
          width={aboutImages.heroMobile.width}
          height={aboutImages.heroMobile.height}
          fetchPriority="high"
          decoding="async"
          className="about-hero-image"
        />
      </picture>
    </div>
  );
}

export function AboutPage() {
  const {story, approach, brands, cta} = aboutCopy;

  return (
    <div className={`${siteFontClass} about-page flex-1`}>
      <main>
        <figure className="about-hero">
          <AboutHeroMedia />
          <div className="about-plaque-wrap">
            <div className="about-shell">
              <figcaption className="about-plaque">
                <p className="about-plaque-place">{aboutCopy.plaque.place}</p>
                <p className="about-plaque-title">
                  {aboutCopy.plaque.lines.map((line, index) => {
                    const accent = index === aboutCopy.plaque.lines.length - 1 && line.endsWith('.');
                    const text = accent ? line.slice(0, -1) : line;
                    return (
                      <span key={line} className="about-plaque-title-line">
                        {text}
                        {accent ? <span className="about-dot">.</span> : null}
                      </span>
                    );
                  })}
                </p>
              </figcaption>
            </div>
          </div>
        </figure>

        <section className="about-story" aria-labelledby="about-story-title">
          <div className="about-shell about-story-grid">
            <div>
              <p className="about-kicker">{story.eyebrow}</p>
              <HeadingLines as="h1" id="about-story-title" lines={story.headingLines} />
              <p className="about-year">{story.year}</p>
              <span className="about-year-rule" aria-hidden="true" />
              <p className="about-year-caption">{story.yearCaption}</p>
            </div>
            <div className="about-story-copy">
              {story.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </div>
          <div className="about-shell">
            <hr className="about-divider" />
          </div>
        </section>

        <section className="about-approach" aria-labelledby="about-approach-title">
          <div className="about-shell about-approach-grid">
            <figure className="about-wheel">
              <Image
                src={aboutImages.wheel.src}
                alt={aboutImages.wheel.alt}
                width={aboutImages.wheel.width}
                height={aboutImages.wheel.height}
                sizes="(min-width: 900px) 560px, 100vw"
                style={{width: '100%', height: 'auto'}}
              />
            </figure>
            <div>
              <p className="about-kicker">{approach.eyebrow}</p>
              <HeadingLines as="h2" id="about-approach-title" lines={approach.headingLines} />
              <ol className="about-principles">
                {approach.principles.map((item) => (
                  <li key={item.number} className="about-principle">
                    <span className="about-principle-number">{item.number}</span>
                    <div>
                      <p className="about-principle-title">{item.title}</p>
                      <p className="about-principle-text">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="about-brands" aria-labelledby="about-brands-label">
          <div className="about-shell">
            <div className="about-brands-panel">
              <p id="about-brands-label" className="about-kicker">
                {brands.eyebrow}
              </p>
              <ul className="about-brand-list">
                {brands.names.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="about-cta" aria-labelledby="about-cta-title">
          <div className="about-shell about-cta-inner about-cta-grid">
            <div className="about-cta-lead">
              <p className="about-eyebrow">{cta.eyebrow}</p>
              <h2 id="about-cta-title">
                {cta.heading.endsWith('.') ? cta.heading.slice(0, -1) : cta.heading}{cta.heading.endsWith('.') ? <span className="about-dot">.</span> : null}
              </h2>
              <p className="about-cta-copy">{cta.description}</p>
              <div className="about-cta-action">
                <Button variant="accent" asChild className="about-cta-button h-[48px] px-[22px] text-[15px]">
                  <Link href={cta.href}>
                    {cta.button}
                    <ArrowUpRight aria-hidden className="size-[16px]" />
                  </Link>
                </Button>
              </div>
            </div>
            <figure className="about-cta-photo">
              <Image
                src={aboutImages.cta.src}
                alt={aboutImages.cta.alt}
                fill
                sizes="(min-width: 900px) 620px, 100vw"
                className="about-cta-image"
              />
            </figure>
          </div>
        </section>
      </main>
    </div>
  );
}
