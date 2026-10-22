import {Mail, MapPin, Phone} from 'lucide-react';
import {contact, siteFontClass} from '@/src/widgets/site-chrome';
import {privacyContact, privacyHighlights, privacyIntro, privacySections} from '../config/content';
import './privacy-policy.css';

export function PrivacyPolicyPage() {
  return (
    <div
      className={`${siteFontClass} privacy-page flex-1 bg-[#F4F3EF] text-[#111315] antialiased`}
      style={{fontFamily: 'var(--font-body), Inter, sans-serif'}}
    >
      <section aria-labelledby="privacy-title" className="bg-[#111315] text-[#F8F8F8]">
        <div className="mx-auto max-w-[1120px] px-[20px] pt-[40px] pb-[40px] min-[768px]:px-[32px] min-[768px]:pt-[120px] min-[768px]:pb-[56px] min-[1024px]:px-[48px] min-[1024px]:pt-[128px]">
          <p className="text-[12px] font-medium tracking-[0.18em] text-[#C2C4C7] uppercase">{privacyIntro.eyebrow}</p>
          <h1 id="privacy-title" className="mt-[12px] max-w-[12ch] text-[40px] leading-[1.02] font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[56px]">
            {privacyIntro.title}
          </h1>
          <p className="mt-[16px] max-w-[42ch] text-[16px] leading-[1.5] text-[#C2C4C7] min-[1024px]:text-[18px]">{privacyIntro.lede}</p>
          <p className="mt-[22px] text-[14px] text-[#C2C4C7]">
            <span className="font-medium tracking-[0.08em] text-[#F8F8F8] uppercase">{privacyIntro.updatedLabel}</span>
            <span className="px-[8px] text-[#55595E]" aria-hidden>
              /
            </span>
            <time dateTime="2026-10-20">{privacyIntro.updated}</time>
          </p>
        </div>
        <div className="h-[2px] bg-[#ED343B]" />
      </section>

      <div className="mx-auto grid max-w-[1120px] gap-[36px] px-[20px] py-[40px] min-[768px]:px-[32px] min-[768px]:py-[56px] min-[1024px]:grid-cols-[220px_minmax(0,1fr)] min-[1024px]:items-start min-[1024px]:gap-[56px] min-[1024px]:px-[48px] min-[1024px]:py-[72px]">
        <nav aria-label="On this page" className="min-[1024px]:sticky min-[1024px]:top-[108px]">
          <p className="text-[12px] font-medium tracking-[0.16em] text-[#55595E] uppercase">On this page</p>
          <ol className="m-0 mt-[12px] list-none p-0">
            {privacySections.map((section, index) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="privacy-nav flex min-h-[44px] items-center gap-[10px] rounded-[4px] text-[15px] leading-[1.3] font-medium text-[#111315] no-underline"
                >
                  <span className="w-[22px] shrink-0 text-[13px] text-[#55595E] tabular-nums">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="min-w-0">
          <ul className="m-0 grid list-none gap-[12px] p-0 min-[768px]:grid-cols-3">
            {privacyHighlights.map((item) => (
              <li key={item.title} className="rounded-[10px] border border-[#DADAD6] bg-white px-[18px] py-[18px]">
                <p className="text-[16px] leading-[1.3] font-medium text-[#111315]">{item.title}</p>
                <p className="mt-[8px] text-[14px] leading-[1.5] text-[#55595E]">{item.text}</p>
              </li>
            ))}
          </ul>

          <div className="mt-[40px] grid gap-[32px] min-[768px]:mt-[48px] min-[768px]:gap-[40px]">
            {privacySections.map((section, index) => (
              <section key={section.id} id={section.id} className="scroll-mt-[108px] border-t border-[#DADAD6] pt-[28px]">
                <h2 className="flex items-baseline gap-[12px] text-[26px] leading-[1.15] font-medium text-[#111315] [font-family:var(--font-display),sans-serif] min-[768px]:text-[32px]">
                  <span className="text-[14px] text-[#CD202B] tabular-nums">{String(index + 1).padStart(2, '0')}</span>
                  {section.title}
                </h2>
                <div className="mt-[14px] grid max-w-[68ch] gap-[14px]">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="text-[16px] leading-[1.65] text-[#111315] min-[1024px]:text-[17px]">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <section className="privacy-contact mt-[40px] rounded-[10px] bg-[#111315] px-[20px] py-[28px] text-[#F8F8F8] min-[768px]:px-[32px] min-[768px]:py-[36px]">
            <h2 className="text-[26px] leading-[1.15] font-medium text-[#F8F8F8] [font-family:var(--font-display),sans-serif] min-[768px]:text-[32px]">
              {privacyContact.title}
            </h2>
            <p className="mt-[12px] max-w-[52ch] text-[16px] leading-[1.6] text-[#C2C4C7]">{privacyContact.text}</p>
            <address className="mt-[20px] grid gap-[4px] text-[16px] leading-[1.4] text-[#F8F8F8] not-italic">
              <p className="grid min-h-[44px] grid-cols-[20px_1fr] items-center gap-[12px]">
                <MapPin aria-hidden className="size-[16px] text-[#C2C4C7]" />
                <span>
                  {contact.addressLines[0]}<span className="text-[#C2C4C7]">{`, ${contact.addressLines[1]}`}</span>
                </span>
              </p>
              <a href={contact.phoneHref} className="privacy-link grid min-h-[44px] grid-cols-[20px_1fr] items-center gap-[12px] font-medium">
                <Phone aria-hidden className="size-[16px] text-[#C2C4C7]" />
                <span>{contact.phoneDisplay}</span>
              </a>
              <a href={contact.emailHref} className="privacy-link grid min-h-[44px] grid-cols-[20px_1fr] items-center gap-[12px] font-medium">
                <Mail aria-hidden className="size-[16px] text-[#C2C4C7]" />
                <span>{contact.email}</span>
              </a>
            </address>
          </section>
        </article>
      </div>
    </div>
  );
}
