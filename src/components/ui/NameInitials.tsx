import { getInitials } from '@/utils/getInitials';

interface NameInitialsProps {
  name: string;
  fallback?: string;
  className?: string;
}

export default function NameInitials({ name, fallback, className }: NameInitialsProps) {
  return <div className={className}>{getInitials(name, fallback)}</div>;
}
