import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { getHomeRoutePath } from '@/routes/routes';

export default function NotFound() {
  return (
    <div className="min-h-[60vh] bg-gray-50 py-8 sm:py-12">
      <div className="container mx-auto max-w-4xl px-4 sm:px-6">
        <div className="py-10 text-center sm:py-16">
          <div className="rounded-2xl bg-white p-8 shadow-sm sm:rounded-3xl sm:p-12">
            <FileQuestion className="mx-auto mb-6 h-16 w-16 text-muted-foreground/30 sm:h-24 sm:w-24" />
            <h1 className="mb-3 text-xl font-bold sm:text-2xl">Page not found</h1>
            <p className="mb-6 text-sm text-muted-foreground sm:text-base">
              The blueprint you are looking for does not exist or may have been removed.
            </p>
            <Link href={getHomeRoutePath()} className="global_btn rounded_full inline-flex items-center justify-center px-6 py-2">
              Browse Blueprints
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
