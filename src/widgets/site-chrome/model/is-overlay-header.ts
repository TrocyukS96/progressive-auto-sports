export function isOverlayHeader(pathname: string) {
  const current = pathname.endsWith('/') ? pathname : `${pathname}/`;
  return current === '/' || current === '/privacy-policy/' || current.startsWith('/wheels/');
}
