import Image from 'next/image';
import Link from 'next/link';
import {ArrowUpRight} from 'lucide-react';
import {Button} from '@/src/shared/ui/button';
import {siteFontClass} from '@/src/widgets/site-chrome';
import {inventoryHref, motorSalesCopy, motorSalesHero} from '../config/content';
import './motor-sales-page.css';

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
          <span key={line} className="sales-line">
            {text}{accent ? <span className="sales-dot">.</span> : null}
          </span>
        );
      })}
    </Tag>
  );
}

export function MotorSalesPage() {
  const {hero, panel} = motorSalesCopy;

  return (
    <div className={`${siteFontClass} sales-page flex-1`}>
      <main>
        <section className="sales-hero" aria-labelledby="sales-hero-title">
          <div className="sales-hero-copy">
            <div className="sales-shell">
              <nav aria-label="Breadcrumb">
                <ol className="sales-crumbs">
                  <li>
                    <Link href="/" className="sales-crumb">
                      {motorSalesCopy.breadcrumbHome}
                    </Link>
                  </li>
                  <li aria-hidden="true">/</li>
                  <li aria-current="page" className="sales-crumb-current">
                    {motorSalesCopy.breadcrumbCurrent}
                  </li>
                </ol>
              </nav>
              <div className="sales-hero-lead">
                <p className="sales-hero-eyebrow">{hero.eyebrow}</p>
                <HeadingLines as="h1" id="sales-hero-title" lines={hero.headingLines} />
                <p className="sales-hero-description">{hero.description}</p>
              </div>
            </div>
          </div>
          <div
            className="sales-hero-media"
            style={{aspectRatio: `${motorSalesHero.width} / ${motorSalesHero.height}`}}
          >
            <Image
              src={motorSalesHero.src}
              alt={motorSalesHero.alt}
              fill
              priority
              sizes="100vw"
              quality={90}
              className="sales-hero-image"
            />
            <div className="sales-hero-shade" aria-hidden="true" />
          </div>
        </section>

        <section className="sales-panel" aria-labelledby="sales-panel-title">
          <div className="sales-shell sales-panel-grid">
            <div className="sales-panel-intro">
              <p className="sales-panel-eyebrow">{panel.eyebrow}</p>
              <HeadingLines as="h2" id="sales-panel-title" lines={panel.headingLines} />
            </div>
            <div className="sales-panel-aside">
              <p className="sales-copy">{panel.paragraph}</p>
              <div className="sales-cta-wrap">
                <Button variant="accent" asChild className="sales-cta">
                  <a
                    href={inventoryHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${panel.cta} on progressivemotorsports.net, opens in a new tab`}
                  >
                    {panel.cta}
                    <ArrowUpRight aria-hidden className="sales-icon" />
                  </a>
                </Button>
              </div>
              <hr className="sales-rule" />
              <p className="sales-question">{panel.question}</p>
              <a className="sales-email" href={panel.emailHref}>
                <span className="sales-email-text">{panel.email}</span>
                <ArrowUpRight aria-hidden className="sales-icon" />
              </a>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
