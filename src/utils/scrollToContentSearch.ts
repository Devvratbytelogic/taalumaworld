export function scrollToContentSearch(event: React.MouseEvent<HTMLAnchorElement>) {
  const searchInput = document.getElementById('content-search');
  if (!searchInput) return;

  event.preventDefault();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  searchInput.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  searchInput.focus({ preventScroll: true });
}
