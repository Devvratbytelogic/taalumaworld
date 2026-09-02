import { IMAGE_UPLOAD_LIMIT_LABEL, PDF_UPLOAD_LIMIT_LABEL } from '@/constants/fileUpload';

type FileUploadLimitHintProps = {
  kind: 'image' | 'pdf';
  className?: string;
};

export function FileUploadLimitHint({ kind, className }: FileUploadLimitHintProps) {
  const label = kind === 'pdf' ? PDF_UPLOAD_LIMIT_LABEL : IMAGE_UPLOAD_LIMIT_LABEL;
  return (
    <span className={`text-xs font-normal text-muted-foreground whitespace-nowrap ${className}`}>
      &nbsp;({label})
    </span>
  );
}
