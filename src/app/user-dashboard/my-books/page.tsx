import { MyBooksPage } from '@/components/pages-components/user-dashboard/MyBooksPage';
import { notFoundWhenSeriesHidden } from '@/app/series/requireSeriesVisible';

export default async function UserMyBooksPage() {
  await notFoundWhenSeriesHidden();
  return <MyBooksPage />;
}
