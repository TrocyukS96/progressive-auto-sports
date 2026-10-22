export function isOverlayHeader(pathname: string) {
  const current = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return (
    current === '/' ||
    current === '/contact/' ||
    current === '/about/' ||
    current === '/sales/' ||
    current === '/privacy-policy/' ||
    current.startsWith('/wheels/') ||
    current.startsWith('/galleries/') ||
    current.startsWith('/gallery/')
  );
}
