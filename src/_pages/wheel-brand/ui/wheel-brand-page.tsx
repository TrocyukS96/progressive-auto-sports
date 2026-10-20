import {contact, siteFontClass} from '@/src/widgets/site-chrome';
import {WheelDesignCatalog} from '@/src/widgets/wheel-design-catalog';
import type {WheelBrandView} from '../model/adapt-brand-data';
import {BrandHero} from './brand-hero';
import {BrandInformation} from './brand-information';
import {FitmentCallout} from './fitment-callout';
import './wheel-brand.css';

export function WheelBrandPage({data}: {data: WheelBrandView}) {
  return (
    <div
      className={`${siteFontClass} wheel-brand-page relative box-border flex-1 bg-[#F4F3EF] text-[#111315] antialiased [&_*]:box-border`}
      style={{fontFamily: 'var(--font-body), Inter, sans-serif'}}
    >
      <main>
        <BrandHero data={data} />
        <WheelDesignCatalog
          key={data.slug}
          brandName={data.name}
          categories={data.categories}
          showFilters={data.showFilters}
          items={data.items}
          searchable={data.searchable}
          contactEmail={contact.email}
        />
        <BrandInformation data={data} />
        <FitmentCallout />
      </main>
    </div>
  );
}
