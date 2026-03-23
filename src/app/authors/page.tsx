'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Users, ArrowLeft, BookOpen, User } from 'lucide-react';
import { useGetUserAllAuthorsQuery, useGetAllChaptersQuery, useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI';
import { getAuthorsRoutePath, getHomeRoutePath } from '@/routes/routes';
import ImageComponent from '@/components/ui/ImageComponent';
import Button from '@/components/ui/Button';
import { useAppDispatch } from '@/store/hooks';
import { openModal } from '@/store/slices/allModalSlice';
import { VISIBLE } from '@/constants/contentMode';
import { IBookItem, IChapterItem } from '@/types/user/HomeAllChapters';

export default function AuthorsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <AuthorsContent />
    </Suspense>
  );
}

function AuthorsContent() {
  const searchParams = useSearchParams();
  const authorId = searchParams.get('id');

  return authorId ? <AuthorDetail id={authorId} /> : <AuthorsList />;
}

function AuthorsList() {
  const { data, isLoading } = useGetUserAllAuthorsQuery();
  const authors = data?.data?.items ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Thought Leaders</h1>
          <p className="text-muted-foreground">Discover the authors behind our content</p>
        </div>

        {authors.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No thought leaders available yet.</p>
            <Link href={getHomeRoutePath()}>
              <Button className="global_btn rounded_full outline_primary mt-4">
                Back to Home
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={getAuthorsRoutePath({ id: author.id })}
                className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all p-6 flex flex-col items-center text-center gap-4 group"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-muted shrink-0 ring-2 ring-transparent group-hover:ring-primary transition-all">
                  {author.avatar ? (
                    <ImageComponent src={author.avatar} alt={author.fullName} object_cover={true} />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-primary/10">
                      <User className="h-10 w-10 text-primary/50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-lg leading-tight">{author.fullName}</h3>
                  <p className="text-xs text-muted-foreground mt-1">{author.followersCount} followers</p>
                  {author.professionalBio && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-3">{author.professionalBio}</p>
                  )}
                </div>
                <span className="text-sm font-medium text-primary group-hover:underline">
                  View profile →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AuthorDetail({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const { data: authorsData, isLoading: isLoadingAuthor } = useGetUserAllAuthorsQuery();
  const { data: globalSettings } = useGetGlobalSettingsQuery();
  const contentMode = globalSettings?.data?.visible;

  const { data: contentData, isLoading: isLoadingContent } = useGetAllChaptersQuery(
    { thoughtLeaderId: id },
  );

  const author = authorsData?.data?.items?.find((a) => a.id === id);
  const items = contentData?.data?.items ?? [];

  if (isLoadingAuthor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!isLoadingAuthor && !author) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Link
            href={getAuthorsRoutePath()}
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Thought Leaders
          </Link>
          <div className="text-center py-16">
            <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">Thought leader not found.</p>
            <Link href={getAuthorsRoutePath()}>
              <Button className="global_btn rounded_full outline_primary mt-4">
                Browse all Thought Leaders
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link
          href={getAuthorsRoutePath()}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Thought Leaders
        </Link>

        {/* Author profile card */}
        <div className="bg-white rounded-3xl shadow-sm p-8 mb-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-muted shrink-0">
            {author?.avatar ? (
              <ImageComponent src={author.avatar} alt={author.fullName} object_cover={true} />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <User className="h-12 w-12 text-primary/50" />
              </div>
            )}
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-bold">{author?.fullName}</h1>
            <p className="text-sm text-muted-foreground mt-1">{author?.followersCount} followers</p>
            {author?.professionalBio && (
              <p className="text-muted-foreground mt-3 max-w-2xl">{author.professionalBio}</p>
            )}
          </div>
        </div>

        {/* Content section */}
        <div className="mb-6">
          <h2 className="text-xl font-bold">
            {contentMode === VISIBLE.BOOK ? 'Books' : 'Chapters'}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Content by {author?.fullName}</p>
        </div>

        {isLoadingContent ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white rounded-3xl h-64 animate-pulse" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No content available from this author yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((item) => {
              const isBook = item.type === 'book';
              const contentItem = item as IBookItem | IChapterItem;
              return (
                <button
                  key={contentItem.id}
                  onClick={() => {
                    dispatch(
                      openModal({
                        componentName: 'CommonCardDetailsModal',
                        data: { chapter: contentItem },
                      }),
                    );
                  }}
                  className="bg-white rounded-3xl shadow-sm hover:shadow-lg transition-all overflow-hidden text-left flex flex-col group"
                >
                  <div className="aspect-3/4 overflow-hidden bg-muted relative">
                    <div className="w-full h-full transition-transform duration-300 group-hover:scale-105">
                      <ImageComponent
                        src={contentItem.coverImage}
                        alt={contentItem.title}
                        object_cover={true}
                      />
                    </div>
                  </div>
                  <div className="p-4 flex flex-col gap-1 flex-1">
                    <h3 className="font-bold line-clamp-1">{contentItem.title}</h3>
                    {!isBook && (
                      <p className="text-xs text-muted-foreground">
                        Ch. {(contentItem as IChapterItem).chapterNumber} · {(contentItem as IChapterItem).bookTitle}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {contentItem.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
