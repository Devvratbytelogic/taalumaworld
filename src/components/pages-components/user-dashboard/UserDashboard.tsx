'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, Book, Clock, User, Settings, Home } from 'lucide-react';
import { DashboardHome } from './DashboardHome';
import { MyChaptersPage } from './MyChaptersPage';
import { MyBooksPage } from './MyBooksPage';
import { ReadingHistory } from './ReadingHistory';
import { ProfilePage } from './ProfilePage';
import { SettingsPage } from './SettingsPage';
import { cn } from '@/components/ui/utils';
import { clearAuthCookies } from '@/utils/authCookies';
import UserDashboardSkeleton from '@/components/skeleton-loader/UserDashboardSkeleton';
import { getHomeRoutePath, getUserDashboardRoutePath } from '@/routes/routes';

type DashboardPage = 'dashboard' | 'my-chapters' | 'my-books' | 'history' | 'profile' | 'settings';

const VALID_PAGES: DashboardPage[] = ['dashboard', 'my-chapters', 'my-books', 'history', 'profile', 'settings'];

function UserDashboardInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [displayMode, setDisplayMode] = useState<'chapters' | 'books'>('chapters');

  const tabParam = searchParams.get('tab') as DashboardPage | null;
  const currentPage: DashboardPage = tabParam && VALID_PAGES.includes(tabParam) ? tabParam : 'dashboard';

  useEffect(() => {
    const savedMode = localStorage.getItem('display-mode');
    if (savedMode === 'books' || savedMode === 'chapters') {
      setDisplayMode(savedMode);
    }

    const handleDisplayModeChange = (event: Event) => {
      const customEvent = event as CustomEvent<{ mode: 'chapters' | 'books' }>;
      setDisplayMode(customEvent.detail.mode);
    };

    window.addEventListener('display-mode-changed', handleDisplayModeChange as EventListener);
    return () => {
      window.removeEventListener('display-mode-changed', handleDisplayModeChange as EventListener);
    };
  }, []);

  const handleLogout = () => {
    clearAuthCookies();
    window.location.href = getHomeRoutePath();
  };

  const setCurrentPage = (page: DashboardPage) => {
    router.push(`${getUserDashboardRoutePath()}?tab=${page}`);
  };

  const navItems = [
    { id: 'dashboard' as DashboardPage, label: 'Dashboard', icon: Home, show: true },
    { id: 'profile' as DashboardPage, label: 'Profile', icon: User, show: true },
    { id: 'my-chapters' as DashboardPage, label: 'My Chapters', icon: BookOpen, show: displayMode === 'chapters' },
    { id: 'my-books' as DashboardPage, label: 'My Books', icon: Book, show: displayMode === 'books' },
    { id: 'history' as DashboardPage, label: 'Reading History', icon: Clock, show: true },
    { id: 'settings' as DashboardPage, label: 'Settings', icon: Settings, show: true },
  ].filter(item => item.show);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardHome />;
      case 'my-chapters':
        return <MyChaptersPage />;
      case 'my-books':
        return <MyBooksPage />;
      case 'history':
        return <ReadingHistory />;
      case 'profile':
        return <ProfilePage />;
      case 'settings':
        return <SettingsPage onLogout={handleLogout} />;
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

export function UserDashboard() {
  return (
    <Suspense fallback={<UserDashboardSkeleton />}>
      <UserDashboardInner />
    </Suspense>
  );
}
