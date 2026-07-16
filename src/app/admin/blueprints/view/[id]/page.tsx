import { ChapterDetailView } from '@/components/admin/chapter/ChapterDetailView';

type Props = { params: Promise<{ id: string }> };

export default async function ViewChapterPage({ params }: Props) {
  const { id } = await params;

  return <ChapterDetailView chapterId={id} />;
}
