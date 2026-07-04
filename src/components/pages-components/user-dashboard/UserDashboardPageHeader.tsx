import { cn } from '@/components/ui/utils';

export function UserDashboardPageHeader({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-lg border border-gray-200 bg-white px-5 py-4 sm:px-6 sm:py-5',
        children ? 'sm:flex sm:items-center sm:justify-between sm:gap-6' : '',
        className,
      )}
    >
      <div className="min-w-0 border-l-2 border-primary pl-4">
        <h1 className="text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">{title}</h1>
        {description ? (
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500">{description}</p>
        ) : null}
      </div>

      {children ? (
        <div className="mt-4 flex shrink-0 flex-wrap items-center gap-2 border-t border-gray-100 pt-4 sm:mt-0 sm:border-t-0 sm:pt-0">
          {children}
        </div>
      ) : null}
    </div>
  );
}
