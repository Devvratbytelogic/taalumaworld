'use client';
import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, Book, Clock, User, Settings } from 'lucide-react';
import { DashboardHome } from './DashboardHome';
import { MyChaptersPage } from './MyChaptersPage';
import { MyBooksPage } from './MyBooksPage';
import { ReadingHistory } from './ReadingHistory';
import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { cn } from '@/components/ui/utils';
import { signOut } from '@/store/slices/authSlice';
import { selectReadingProgress } from '@/store/slices/readingSlice';
import { useGetPurchasedItemsQuery } from '@/store/api/userApi';
import type { RootState } from '@/store/store';

type DashboardPage = 'home' | 'my-chapters' | 'my-books' | 'history' | 'profile' | 'settings';

export function UserDashboard() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState<DashboardPage>('home');
  const [displayMode, setDisplayMode] = useState<'chapters' | 'books'>('chapters');

  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const readingProgressRaw = useSelector(selectReadingProgress);
  const { data: purchasedItems = [] } = useGetPurchasedItemsQuery(undefined, { skip: !isAuthenticated });

  const readingProgress = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(readingProgressRaw).map(([id, data]) => [id, data.progress])
      ),
    [readingProgressRaw]
  );

  const ownedChapters = useMemo(
    () => purchasedItems.map((p) => p.chapterId).filter((id): id is string => !!id),
    [purchasedItems]
  );

  const ownedBooks = useMemo(() => {
    if (typeof window === 'undefined') return [];
    try {
      return JSON.parse(localStorage.getItem('owned_books') || '[]');
    } catch {
      return [];
    }
  }, []);

  const handleNavigate = (page: string, id?: string) => {
    if (page === 'home') router.push('/');
    else if (page === 'books') router.push('/');
    else if (page === 'read-chapter' && id) router.push(`/read-chapter/${id}`);
    else if (page === 'read-book') router.push('/');
    else router.push('/');
  };

  const handleLogout = () => {
    dispatch(signOut());
    router.push('/');
  };

  // Load display mode from localStorage
  useEffect(() => {
    const loadDisplayMode = () => {
      const savedMode = localStorage.getItem('display-mode');
      if (savedMode === 'books' || savedMode === 'chapters') {
        setDisplayMode(savedMode);
      }
    };

    loadDisplayMode();

    const handleDisplayModeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ mode: 'chapters' | 'books' }>;
      setDisplayMode(customEvent.detail.mode);
    };

    window.addEventListener('display-mode-changed', handleDisplayModeChange as EventListener);

    return () => {
      window.removeEventListener('display-mode-changed', handleDisplayModeChange as EventListener);
    };
  }, []);

  // Navigation items based on display mode
  const navItems = [
    { id: 'profile' as DashboardPage, label: 'Profile', icon: User, show: true },
    { id: 'my-chapters' as DashboardPage, label: 'My Chapters', icon: BookOpen, show: displayMode === 'chapters' },
    { id: 'my-books' as DashboardPage, label: 'My Books', icon: Book, show: displayMode === 'books' },
    { id: 'history' as DashboardPage, label: 'Reading History', icon: Clock, show: true },
    { id: 'settings' as DashboardPage, label: 'Settings', icon: Settings, show: true },
  ].filter(item => item.show);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <DashboardHome
            userName={user?.fullName ?? ''}
            displayMode={displayMode}
            ownedChapters={ownedChapters}
            ownedBooks={ownedBooks}
            readingProgress={readingProgress}
            onNavigate={handleNavigate}
            onPageChange={setCurrentPage}
          />
        );
      case 'my-chapters':
        return (
          <MyChaptersPage
            ownedChapters={ownedChapters}
            readingProgress={readingProgress}
            onNavigate={handleNavigate}
            isAuthenticated={isAuthenticated}
          />
        );
      case 'my-books':
        return (
          <MyBooksPage
            ownedBooks={ownedBooks}
            readingProgress={readingProgress}
            onNavigate={handleNavigate}
          />
        );
      case 'history':
        return (
          <ReadingHistory
            readingProgress={readingProgress}
            displayMode={displayMode}
            onNavigate={handleNavigate}
          />
        );
      case 'profile':
        return (
          <ProfilePage
            userEmail={user?.email ?? ''}
            userName={user?.fullName ?? ''}
            userPhoto={user?.photo ?? ''}
          />
        );
      case 'settings':
        return (
          <SettingsPage
            onLogout={handleLogout}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-3xl p-6 shadow-sm sticky top-24">
              <nav className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentPage(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all",
                        currentPage === item.id
                          ? "bg-primary text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {renderPage()}
          </div>
        </div>
      </div>
    </div>
  );
}