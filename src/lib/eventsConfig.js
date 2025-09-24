export const EVENTS_FEED_URL = import.meta.env.VITE_EVENTS_JSON_FEED_URL || '';
export const FACEBOOK_PAGE_URL = import.meta.env.VITE_FACEBOOK_PAGE_URL || '';

export function hasExternalEventsFeed() {
  return Boolean(EVENTS_FEED_URL);
}

export function hasFacebookPage() {
  return Boolean(FACEBOOK_PAGE_URL);
}