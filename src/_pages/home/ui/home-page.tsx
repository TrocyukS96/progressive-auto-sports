import {HeroSlider} from '@/src/widgets/hero-slider';
import './home-display.css';
import {heroSlides} from '../config/content';
import {homeFontClass} from '../config/fonts';
import {HomeCollection} from './home-collection';
import {HomeCustomization} from './home-customization';
import {HomeFooter} from './home-footer';
import {HomeHeader} from './home-header';
import {HomeIntro} from './home-intro';

export function HomePage() {
  return (
    <div
      className={`${homeFontClass} relative box-border min-h-screen bg-[#111315] text-[#F8F8F8] antialiased [&_*]:box-border`}
      style={{fontFamily: 'var(--font-body), Inter, sans-serif'}}
    >
      <HomeHeader />
      <main>
        <HeroSlider slides={heroSlides} />
        <HomeIntro />
        <HomeCollection />
        <HomeCustomization />
      </main>
      <HomeFooter />
    </div>
  );
}
