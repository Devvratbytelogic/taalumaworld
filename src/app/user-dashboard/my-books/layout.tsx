import { notFoundWhenSeriesHidden } from '@/app/series/requireSeriesVisible';

/** Purchased-series pages 404 when series are hidden site-wide. */
export default async function MyBooksLayout({ children }: { children: React.ReactNode }) {
  await notFoundWhenSeriesHidden();
  return children;
}
