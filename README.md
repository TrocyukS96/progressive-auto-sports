# Progressive Autosports — full public-site source, media excluded

Next.js App Router, React and Tailwind CSS v4. This archive contains the captured public pages, routing, navigation, shared components and original theme CSS. It does not contain WordPress PHP, the original database or private/admin content.

## Run

Requires Node.js 20.9+.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. `npm run build` generates a static export in `out/`.

## Add photographs and video later

All image/video files are intentionally absent. Page markup still points to local `/assets/...` URLs, so images remain missing until you restore them. `data/media-manifest.json` maps each expected `public/assets/...` path to its original public URL. Save each file at the listed path, or change the corresponding references in `data/pages.json`, `data/site.json` and `styles/original.css`.

Small web-font files are included. The archive excludes raster images, image SVGs, audio, videos, source `.bin` captures, `.git`, `.next`, `node_modules`, runtime state and build output.

## Structure

- `app/[[...slug]]/page.tsx` generates the captured routes and page titles.
- `data/pages.json` contains page content indexed by route.
- `data/site.json` contains shared branding, navigation and footer.
- `data/capture-report.json` records page count and capture errors.
- `data/media-manifest.json` lists omitted media and their source URLs.
- `components/Content.tsx` converts sanitized archive content to React.
- `components/Slider.tsx` replaces the legacy Home/gallery slider.
- `components/Navigation.tsx` provides responsive navigation.
- `styles/original.css` retains the original visual theme; Tailwind styles the new controls.

The contact form prepares a mailto draft, without a server-side mail service. Legacy tracking, jQuery plugins, WordPress comment/search backends and private business integrations are not included. Search/comment forms are removed. External partner, inventory, map, video and social links remain external. Historical text, dates and source notices are preserved; the copy is marked noindex.
