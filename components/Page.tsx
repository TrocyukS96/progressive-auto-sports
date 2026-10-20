import pages from '@/data/pages.json';
import site from '@/data/site.json';
import Content from './Content';

export default function Page({route}: {route: keyof typeof pages}) {
  return (
    <div className={`wrap container ${pages[route].bodyClass}`}>
      <Content html={site.decor} />
      <main>
        <Content html={pages[route].html} />
      </main>
    </div>
  );
}
