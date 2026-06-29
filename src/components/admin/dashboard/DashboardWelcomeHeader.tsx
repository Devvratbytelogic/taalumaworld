import { Badge } from '../../ui/badge';
import type { ContentMode } from '../../../types/admin';

interface DashboardWelcomeHeaderProps {
  userName: string;
  contentMode: ContentMode;
}

export function DashboardWelcomeHeader({ userName, contentMode }: DashboardWelcomeHeaderProps) {
  return (
    <div className="bg-linear-to-r from-primary to-primary-light rounded-3xl p-8 text-white shadow-lg">
      <h1 className="text-3xl font-bold mb-2">
        Welcome back, {userName}!
      </h1>
      <p className="text-white/90">
        Here&apos;s what&apos;s happening with your platform today.
      </p>
      <div className="mt-4 flex items-center gap-2">
        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
          {contentMode === 'chapters' ? 'Blueprint Mode' : 'Series Mode'}
        </Badge>
        <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Badge>
      </div>
    </div>
  );
}
