import {siteFontClass} from '@/src/widgets/site-chrome';
import {WheelBrandCatalog} from '@/src/widgets/wheel-brand-catalog';
import {getWheelBrands} from '../model/get-brands';
import {WheelsFitment} from './wheels-fitment';
import {WheelsHero} from './wheels-hero';
import './wheels-display.css';

export function WheelsPage() {
  const brands = getWheelBrands();

  return (
    <div
      className={`${siteFontClass} wheels-page relative box-border flex-1 bg-[#111315] text-[#F8F8F8] antialiased [&_*]:box-border`}
      style={{fontFamily: 'var(--font-body), Inter, sans-serif'}}
    >
      <main>
        <WheelsHero />
        <WheelBrandCatalog brands={brands} />
        <WheelsFitment />
      </main>
    </div>
  );
}
