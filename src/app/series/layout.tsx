import { notFoundWhenSeriesHidden } from './requireSeriesVisible';

export const revalidate = 300;

export default async function SeriesLayout({ children }: { children: React.ReactNode }) {
  await notFoundWhenSeriesHidden();
  return children;
}
