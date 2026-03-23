import { PackageOpen } from 'lucide-react';

interface NoDataFoundProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
}

export default function NoDataFound({
  title = 'No results found',
  description = 'Try adjusting your filters or check back later.',
  icon,
}: NoDataFoundProps) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 text-center">
      <div className="bg-muted/50 rounded-full p-6 mb-5">
        {icon ?? <PackageOpen className="h-12 w-12 text-muted-foreground/50" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}
