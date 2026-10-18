import Link from 'next/link';
import {Mail, MapPin, Phone} from 'lucide-react';
import type {SVGProps} from 'react';
import {contact, copyright, footerNav, socialLinks, type HomeLink} from '../config/content';
import {HomeLogo} from './home-logo';

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M14.6 8.4h2.3V5.1h-2.3c-2.4 0-4 1.6-4 4.1V11H8.2v3.2h2.4V21h3.1v-6.8h2.5l.5-3.2h-3v-1.7c0-.7.4-1.1 1.5-1.1h1.4z" />
    </svg>
  );
}

function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        d="M7.5 3.2h9A4.3 4.3 0 0 1 20.8 7.5v9a4.3 4.3 0 0 1-4.3 4.3h-9a4.3 4.3 0 0 1-4.3-4.3v-9A4.3 4.3 0 0 1 7.5 3.2zm4.5 4.1a4.7 4.7 0 1 0 0 9.4 4.7 4.7 0 0 0 0-9.4zm0 2.1a2.6 2.6 0 1 1 0 5.2 2.6 2.6 0 0 1 0-5.2zm5.05-2.55a1.05 1.05 0 1 0 0 2.1 1.05 1.05 0 0 0 0-2.1z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const socialIcons = {
  Facebook: FacebookIcon,
  Instagram: InstagramIcon,
} as const;

function FooterLink({item}: {item: HomeLink}) {
  const className =
    'inline-flex min-h-[44px] items-center text-[15px] font-medium leading-none text-[#F8F8F8] no-underline hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#F8F8F8]';

  if (item.external) {
    return (
      <a href={item.href} className={className} target="_blank" rel="noopener noreferrer">
        {item.label}
      </a>
    );
  }

  return (
    <Link href={item.href} className={className}>
      {item.label}
    </Link>
  );
}

function SocialLink({item}: {item: HomeLink}) {
  const Icon = socialIcons[item.label as keyof typeof socialIcons];
  if (!Icon) return null;

  return (
    <a
      href={item.href}
      aria-label={item.label}
      target="_blank"
      rel="noopener noreferrer"
      className="home-social inline-flex h-[48px] w-[48px] items-center justify-center rounded-full border border-[#F8F8F8] bg-transparent text-[#F8F8F8] no-underline transition-colors duration-[400ms] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#F8F8F8] motion-reduce:transition-none"
    >
      <Icon aria-hidden className="block h-[22px] w-[22px] shrink-0" />
    </a>
  );
}

const eyebrow = 'm-0 text-[12px] font-medium uppercase tracking-[0.18em] text-[#C2C4C7]';

export function HomeFooter() {
  return (
    <footer className="home-footer bg-[#111315] text-[#F8F8F8]">
      <div className="h-[2px] bg-[#ED343B]" />
      <div className="mx-auto max-w-[1280px] px-[16px] pt-[36px] pb-[28px] min-[768px]:px-[32px] min-[1024px]:pt-[48px] min-[1024px]:pb-[32px]">
        <div className="flex items-center justify-between gap-[16px] border-b border-white/10 pb-[28px]">
          <HomeLogo imageClassName="h-[28px] min-[1024px]:h-[32px]" />
          <div className="flex items-center gap-[10px]">
            {socialLinks.map((item) => (
              <SocialLink key={item.label} item={item} />
            ))}
          </div>
        </div>

        <div className="grid items-start gap-[28px] pt-[28px] min-[768px]:grid-cols-2 min-[1024px]:grid-cols-[1.2fr_1fr] min-[1024px]:gap-[48px] min-[1024px]:pt-[36px]">
          <div>
            <p className={eyebrow}>Showroom</p>
            <address className="mt-[12px] grid gap-[2px] text-[15px] leading-[1.4] text-[#F8F8F8] not-italic">
              <p className="m-0 grid min-h-[44px] grid-cols-[20px_1fr] items-center gap-[12px]">
                <MapPin aria-hidden className="size-[16px] text-[#C2C4C7]" />
                <span>{`${contact.addressLines[0]}, `}<span className="text-[#C2C4C7]">{contact.addressLines[1]}</span></span>
              </p>
              <a
                href={contact.phoneHref}
                className="grid min-h-[44px] grid-cols-[20px_1fr] items-center gap-[12px] font-medium text-[#F8F8F8] no-underline hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#F8F8F8]"
              >
                <Phone aria-hidden className="size-[16px] text-[#C2C4C7]" />
                <span>{contact.phoneDisplay}</span>
              </a>
              <a
                href={contact.emailHref}
                className="grid min-h-[44px] grid-cols-[20px_1fr] items-center gap-[12px] font-medium text-[#F8F8F8] no-underline hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#F8F8F8]"
              >
                <Mail aria-hidden className="size-[16px] text-[#C2C4C7]" />
                <span>{contact.email}</span>
              </a>
            </address>
          </div>

          <nav aria-label="Footer">
            <p className={eyebrow}>Explore</p>
            <div className="mt-[12px] flex flex-col">
              {footerNav.map((item) => (
                <FooterLink key={item.label} item={item} />
              ))}
            </div>
          </nav>
        </div>

        <p className="m-0 mt-[28px] border-t border-white/10 pt-[20px] text-[13px] leading-[1.5] text-[#C2C4C7]">{copyright}</p>
      </div>
    </footer>
  );
}
