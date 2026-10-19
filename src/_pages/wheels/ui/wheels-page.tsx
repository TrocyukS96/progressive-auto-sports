import {SiteFooter, SiteHeader, siteFontClass} from '@/src/widgets/site-chrome';
import {WheelBrandCatalog} from '@/src/widgets/wheel-brand-catalog';
import {getWheelBrands} from '../model/get-brands';
import {WheelsFitment} from './wheels-fitment';
import {WheelsHero} from './wheels-hero';
import './wheels-display.css';

export function WheelsPage() {
  const brands = getWheelBrands();

  return (
    <div
      className={`${siteFontClass} wheels-page relative box-border min-h-screen bg-[#111315] text-[#F8F8F8] antialiased [&_*]:box-border`}
      style={{fontFamily: 'var(--font-body), Inter, sans-serif'}}
    >
      <SiteHeader variant="bar" />
      <main className="pt-[72px] min-[1024px]:pt-[84px]">
        <WheelsHero />
        <WheelBrandCatalog brands={brands} />
        <WheelsFitment />
      </main>
      <SiteFooter />
    </div>
  );
}
