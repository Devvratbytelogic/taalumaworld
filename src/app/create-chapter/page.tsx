import { redirect } from 'next/server';
import { getCreateChapterRoutePath } from '@/routes/routes';

export default function CreateChapterRedirect() {
  redirect(getCreateChapterRoutePath());
}
