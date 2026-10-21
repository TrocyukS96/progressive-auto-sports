import {ArrowUpRight, Mail, MapPin, Phone} from 'lucide-react';
import {Button} from '@/src/shared/ui/button';
import {contact, siteFontClass} from '@/src/widgets/site-chrome';
import {contactCopy} from '../config/content';
import {ContactForm} from './contact-form';
import './contact-page.css';

const externalLink = {target: '_blank', rel: 'noopener noreferrer'} as const;

export function ContactPage() {
  return (
    <div className={`${siteFontClass} contact-page flex-1`}>
      <main>
        <section className="contact-intro" aria-labelledby="contact-title">
          <div className="contact-shell contact-intro-inner">
            <div className="contact-intro-grid">
              <div className="min-w-0">
                <p className="contact-eyebrow">{contactCopy.heroEyebrow}</p>
                <h1 id="contact-title">
                  {contactCopy.heroLines.map((line) => (
                    <span key={line} className="contact-title-line">
                      {line}<span className="contact-dot">.</span>
                    </span>
                  ))}
                </h1>
              </div>
              <p className="contact-intro-copy">
                {contactCopy.heroDescription.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>
            </div>
          </div>
        </section>

        <div className="contact-body">
          <div className="contact-shell contact-body-inner">
            <div className="contact-columns">
              <section aria-labelledby="contact-form-title" className="min-w-0">
                <ContactForm email={contact.email} emailHref={contact.emailHref} />
              </section>

              <section aria-labelledby="contact-details-title" className="contact-card">
                <p className="contact-eyebrow">{contactCopy.detailsEyebrow}</p>
                <h2 id="contact-details-title">
                  {contactCopy.detailsHeading}<span className="contact-dot">.</span>
                </h2>
                <ul className="contact-details">
                  <li className="contact-detail">
                    <span className="contact-icon">
                      <Phone aria-hidden className="size-[20px]" strokeWidth={1.5} />
                    </span>
                    <div className="contact-detail-copy">
                      <p className="contact-kicker">{contactCopy.callLabel}</p>
                      <a className="contact-detail-link" href={contact.phoneHref}>
                        <span className="contact-detail-text">{contact.phoneDisplay}</span>
                        <ArrowUpRight aria-hidden className="size-[16px] shrink-0" />
                      </a>
                    </div>
                  </li>
                  <li className="contact-detail">
                    <span className="contact-icon">
                      <Mail aria-hidden className="size-[20px]" strokeWidth={1.5} />
                    </span>
                    <div className="contact-detail-copy">
                      <p className="contact-kicker">{contactCopy.emailLabel}</p>
                      <a className="contact-detail-link" href={contact.emailHref}>
                        <span className="contact-detail-text">{contact.email}</span>
                        <ArrowUpRight aria-hidden className="size-[16px] shrink-0" />
                      </a>
                    </div>
                  </li>
                  <li className="contact-detail">
                    <span className="contact-icon">
                      <MapPin aria-hidden className="size-[20px]" strokeWidth={1.5} />
                    </span>
                    <div className="contact-detail-copy">
                      <p className="contact-kicker">{contactCopy.visitLabel}</p>
                      <p className="contact-detail-value">
                        {contact.addressLines.map((line) => (
                          <span key={line} className="contact-address-line">
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  </li>
                </ul>
                <div className="contact-directions-wrap">
                  <Button variant="outline" asChild className="contact-directions">
                    <a href={contact.mapsSearchHref} {...externalLink}>
                      {contactCopy.directions}
                      <ArrowUpRight aria-hidden className="size-[16px]" />
                    </a>
                  </Button>
                </div>
                <p className="contact-city">{contact.cityLabel}</p>
              </section>
            </div>

            <section className="contact-location" aria-labelledby="contact-location-title">
              <div className="min-w-0">
                <p className="contact-eyebrow contact-eyebrow-dark">{contactCopy.locationEyebrow}</p>
                <h2 id="contact-location-title">
                  {contactCopy.locationHeading}<span className="contact-dot">.</span>
                </h2>
                <address className="contact-address">
                  {contact.addressLines.map((line) => (
                    <span key={line} className="contact-address-line">
                      {line}
                    </span>
                  ))}
                </address>
                <a className="contact-maps-link" href={contact.mapsSearchHref} {...externalLink}>
                  {contactCopy.mapsLabel}
                  <ArrowUpRight aria-hidden className="size-[16px]" />
                </a>
              </div>
              <a className="contact-map" href={contact.mapsSearchHref} {...externalLink}>
                <span className="contact-map-pin">
                  <MapPin aria-hidden className="size-[22px]" strokeWidth={1.75} />
                </span>
                <span className="contact-map-copy">
                  <span className="contact-map-name">{contactCopy.mapTitle}</span>
                  <span className="contact-map-address">
                    {contact.addressLines[0]}
                    <br />
                    {contact.addressLines[1]}
                  </span>
                  <span className="contact-map-note">{contactCopy.mapNote}</span>
                </span>
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
