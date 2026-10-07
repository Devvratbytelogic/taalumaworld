export const OPEN_GLOBAL_SEARCH_EVENT = 'open-global-search';

export function openGlobalSearch() {
  window.dispatchEvent(new CustomEvent(OPEN_GLOBAL_SEARCH_EVENT));
}
