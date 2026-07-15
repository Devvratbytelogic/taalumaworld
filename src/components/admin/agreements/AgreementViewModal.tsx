'use client';

import { Loader2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { RichTextEditor } from '@/components/editor/RichTextEditor';
import { AGREEMENT_TOUCHPOINT_OPTIONS, AGREEMENT_VISIBLE_USER_TYPE_OPTIONS } from '@/constants/agreements';
import { useGetAgreementByIdQuery } from '@/store/rtkQueries/agreementAPIs';

const STATUS_BADGE_CLASS: Record<string, string> = {
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',
};

function labelFor(options: { value: string; label: string }[], value: string) {
  return options.find((opt) => opt.value === value)?.label ?? value;
}

interface AgreementViewModalProps {
  open: boolean;
  agreementId?: string | null;
  onOpenChange: (open: boolean) => void;
}

export function AgreementViewModal({ open, agreementId, onOpenChange }: AgreementViewModalProps) {
  const { data: agreementResponse, isFetching } = useGetAgreementByIdQuery(agreementId!, {
    skip: !open || !agreementId,
  });
  const agreement = agreementResponse?.data;
  const isLoading = isFetching && !agreement;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>{agreement?.title ?? 'Agreement details'}</DialogTitle>
          <DialogDescription>Read-only view of the agreement content and settings.</DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : agreement ? (
          <div className="custom_scrollbar flex-1 space-y-5 overflow-y-auto p-6!">
            <dl className="grid gap-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Slug</dt>
                <dd className="mt-1 text-sm text-slate-700">{agreement.slug}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Text</dt>
                <dd className="mt-1 text-sm text-slate-700">{agreement.text || '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Agreement type</dt>
                <dd className="mt-1 text-sm text-slate-700">{agreement.agreementType?.name ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Version</dt>
                <dd className="mt-1 text-sm text-slate-700">{agreement.version ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">Status</dt>
                <dd className="mt-1">
                  <Badge variant="outline" className={STATUS_BADGE_CLASS[agreement.status] ?? 'border-slate-200 text-slate-600'}>
                    {agreement.status}
                  </Badge>
                </dd>
              </div>
            </dl>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className={agreement.is_required ? STATUS_BADGE_CLASS.active : STATUS_BADGE_CLASS.inactive}>
                {agreement.is_required ? 'Required' : 'Optional'}
              </Badge>
              <Badge variant="outline" className={agreement.can_block ? STATUS_BADGE_CLASS.active : STATUS_BADGE_CLASS.inactive}>
                Can block: {agreement.can_block ? 'Yes' : 'No'}
              </Badge>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Visible to</p>
              <div className="flex flex-wrap gap-2">
                {agreement.visible_to?.length ? (
                  agreement.visible_to.map((value) => (
                    <Badge key={value} variant="outline" className="border-slate-200 text-slate-600">
                      {labelFor(AGREEMENT_VISIBLE_USER_TYPE_OPTIONS, value)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">None</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Touchpoints</p>
              <div className="flex flex-wrap gap-2">
                {agreement.touchpoints?.length ? (
                  agreement.touchpoints.map((value) => (
                    <Badge key={value} variant="outline" className="border-slate-200 text-slate-600">
                      {labelFor(AGREEMENT_TOUCHPOINT_OPTIONS, value)}
                    </Badge>
                  ))
                ) : (
                  <span className="text-sm text-slate-400">None</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Agreement content</p>
              <RichTextEditor value={agreement.content ?? ''} onChange={() => {}} disabled minHeight="200px" />
            </div>
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-16 text-sm text-slate-500">Agreement not found.</div>
        )}

        <DialogFooter className="shrink-0 border-t border-slate-100 px-6 py-4">
          <Button
            type="button"
            className="global_btn rounded_full outline_primary"
            onPress={() => onOpenChange(false)}
            startContent={<X className="h-4 w-4" />}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
