import { Globe } from 'lucide-react';
import { Card } from '../../ui/card';
import { Switch } from '../../ui/switch';
import { cn } from '../../ui/utils';
import type { ContentMode } from '../../../types/admin';

interface ContentModeSettingsCardProps {
  contentMode: ContentMode;
  onContentModeChange: (checked: boolean) => void;
}

export function ContentModeSettingsCard({ contentMode, onContentModeChange }: ContentModeSettingsCardProps) {
  return (
    <Card className="p-6 rounded-3xl">
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 bg-primary/10 rounded-xl">
          <Globe className="h-6 w-6 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg mb-1">Content Mode</h3>
          <p className="text-sm text-muted-foreground">
            Control whether the platform operates in Chapter-focused or Book-focused mode
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
          <div>
            <p className="font-medium">Current Mode</p>
            <p className="text-sm text-muted-foreground">
              Platform is currently in {contentMode === 'chapters' ? 'Chapter' : 'Book'} Mode
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className={cn(
              'text-sm font-medium transition-all duration-200',
              contentMode === 'chapters' ? 'text-primary' : 'text-muted-foreground'
            )}>
              Chapters
            </span>
            <Switch
              checked={contentMode === 'books'}
              onCheckedChange={onContentModeChange}
            />
            <span className={cn(
              'text-sm font-medium transition-all duration-200',
              contentMode === 'books' ? 'text-primary' : 'text-muted-foreground'
            )}>
              Books
            </span>
          </div>
        </div>
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <p className="text-sm text-blue-900">
            <strong>Note:</strong> Changing the content mode will affect how content is displayed
            across the entire platform. Users will see {contentMode === 'chapters' ? 'individual chapters' : 'complete books'}
            as the primary content type.
          </p>
        </div>
      </div>
    </Card>
  );
}
