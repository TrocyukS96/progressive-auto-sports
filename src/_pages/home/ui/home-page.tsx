import {siteFontClass} from '@/src/widgets/site-chrome';
import {HeroSlider} from '@/src/widgets/hero-slider';
import './home-display.css';
import {heroSlides} from '../config/content';
import {HomeCollection} from './home-collection';
import {HomeCustomization} from './home-customization';
import {HomeIntro} from './home-intro';

export function HomePage() {
  return (
    <div
      className={`${siteFontClass} relative box-border flex-1 bg-[#111315] text-[#F8F8F8] antialiased [&_*]:box-border`}
      style={{fontFamily: 'var(--font-body), Inter, sans-serif'}}
    >
      <main>
        <HeroSlider slides={heroSlides} />
        <HomeIntro />
        <HomeCollection />
        <HomeCustomization />
      </main>
    </div>
  );
}
