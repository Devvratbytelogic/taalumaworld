'use client';
import { useRouter } from 'next/navigation';
import { BookOpen, Book, Clock, ArrowRight } from 'lucide-react';
import DashboardHomeSkeleton from '@/components/skeleton-loader/DashboardHomeSkeleton';
import { useGetGlobalSettingsQuery, useGetMyBooksQuery, useGetMyChaptersQuery, useGetUserProfileQuery } from '@/store/rtkQueries/userGetAPI';

export function DashboardHome() {
  const router = useRouter();

  const { data: globalSettingsData, isLoading: globalSettingsLoading } = useGetGlobalSettingsQuery();
  const { data: myChaptersData, isLoading: chaptersLoading } = useGetMyChaptersQuery();
  const { data: myBooksData, isLoading: booksLoading } = useGetMyBooksQuery();
  const { data: profileData } = useGetUserProfileQuery();

  const displayMode = globalSettingsData?.data?.visible === 'book' ? 'books' : 'chapters';

  const userName = profileData?.data?.name ?? 'User';
  const firstName = userName.split(' ')[0] || userName;

  const ownedChapters = myChaptersData?.data?.items ?? [];
  const ownedBooks = myBooksData?.data?.items ?? [];

  const onPageChange = (page: string) => {
    router.push(`/user-dashboard?tab=${page}`);
  };

  const onNavigate = (page: string, id?: string) => {
    if (page === 'home') {
      router.push('/');
    } else if (page === 'read-chapter' && id) {
      router.push(`/read-chapter/${id}`);
    } else if (page === 'read-book') {
      router.push('/books');
    }
  };

  if (globalSettingsLoading || booksLoading || chaptersLoading) {
    return <DashboardHomeSkeleton />;
  }


  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="bg-white rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Welcome back, {firstName}! 👋
        </h1>
        <p className="text-muted-foreground">
          {displayMode === 'chapters'
            ? "Continue your reading journey or explore new chapters"
            : "Continue your reading journey or explore new books"}
        </p>
      </div>

      

      {/* Quick Access Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* My Library Card */}
        {displayMode === 'chapters' ? (
          <button
            onClick={() => onPageChange('my-chapters')}
            className="bg-linear-to-br from-primary/10 to-primary/5 rounded-3xl p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary rounded-2xl">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-bold mb-2">My Chapters</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {ownedChapters.length} {ownedChapters.length === 1 ? 'chapter' : 'chapters'} owned
            </p>
            <p className="text-xs text-muted-foreground">
              Access all your purchased chapters
            </p>
          </button>
        ) : (
          <button
            onClick={() => onPageChange('my-books')}
            className="bg-linear-to-br from-primary/10 to-primary/5 rounded-3xl p-6 hover:shadow-lg transition-all text-left group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-primary rounded-2xl">
                <Book className="h-6 w-6 text-white" />
              </div>
              <ArrowRight className="h-5 w-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="text-xl font-bold mb-2">My Books</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {ownedBooks.length} {ownedBooks.length === 1 ? 'book' : 'books'} owned
            </p>
            <p className="text-xs text-muted-foreground">
              Access all your purchased books
            </p>
          </button>
        )}

        {/* Reading History Card */}
        <button
          onClick={() => onPageChange('history')}
          className="bg-linear-to-br from-blue-50 to-blue-100/50 rounded-3xl p-6 hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-500 rounded-2xl">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <ArrowRight className="h-5 w-5 text-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-xl font-bold mb-2">Reading History</h3>
          <p className="text-sm text-muted-foreground mb-3">
            Track your reading activity
          </p>
          <p className="text-xs text-muted-foreground">
            View all your recently read items
          </p>
        </button>

        {/* Explore More Card */}
        <button
          onClick={() => onNavigate('home')}
          className="bg-linear-to-br from-purple-50 to-purple-100/50 rounded-3xl p-6 hover:shadow-lg transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-500 rounded-2xl">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <ArrowRight className="h-5 w-5 text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <h3 className="text-xl font-bold mb-2">
            {displayMode === 'chapters' ? 'Explore Chapters' : 'Explore Books'}
          </h3>
          <p className="text-sm text-muted-foreground mb-3">
            Discover new stories
          </p>
          <p className="text-xs text-muted-foreground">
            Browse and find your next read
          </p>
        </button>
      </div>

    </div>
  );
}
