import { IMAGE_UPLOAD_LIMIT_LABEL, PDF_UPLOAD_LIMIT_LABEL } from '@/constants/fileUpload';
import { cn } from '@/components/ui/utils';

type FileUploadLimitHintProps = {
  kind: 'image' | 'pdf';
  className?: string;
};

export function FileUploadLimitHint({ kind, className }: FileUploadLimitHintProps) {
  const label = kind === 'pdf' ? PDF_UPLOAD_LIMIT_LABEL : IMAGE_UPLOAD_LIMIT_LABEL;
  return (
    <span className={cn('text-xs font-normal whitespace-nowrap text-muted-foreground', className)}>
      &nbsp;({label})
    </span>
  );
}
