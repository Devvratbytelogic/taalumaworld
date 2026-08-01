import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Button from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import { cn } from '@/components/ui/utils';

interface AdminCouponsHeaderProps {
  isTrashView: boolean;
  onToggleTrash: () => void;
  onCreateCoupon: () => void;
  canAdd?: boolean;
}

export function AdminCouponsHeader({
  isTrashView,
  onToggleTrash,
  onCreateCoupon,
  canAdd = true,
}: AdminCouponsHeaderProps) {
  return (
    <AdminPageHeader
      eyebrow="Commerce"
      title={isTrashView ? 'Coupons Trash' : 'Coupons'}
      description={
        isTrashView
          ? 'View and restore deleted coupons.'
          : 'Create and manage discount coupons for events, campaigns, universities, and general use.'
      }
    >
      <Button
        className={cn('global_btn rounded_full', isTrashView ? 'outline_primary' : 'danger_outline')}
        onPress={onToggleTrash}
        startContent={isTrashView ? <ArrowLeft className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
      >
        {isTrashView ? 'Back to coupons' : 'Trash'}
      </Button>
      {!isTrashView && canAdd ? (
        <Button className="global_btn rounded_full bg_primary" onPress={onCreateCoupon} startContent={<Plus className="h-4 w-4" />}>
          Add coupon
        </Button>
      ) : null}
    </AdminPageHeader>
  );
}
