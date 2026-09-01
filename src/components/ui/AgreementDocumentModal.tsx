'use client';

import { Loader2, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import MarkdownContent from '@/components/ui/MarkdownContent';
import { useGetUserAgreementByIdOrSlugQuery } from '@/store/rtkQueries/agreementAPIs';

interface AgreementDocumentModalProps {
  open: boolean;
  idOrSlug?: string | null;
  onOpenChange: (open: boolean) => void;
}

export function AgreementDocumentModal({ open, idOrSlug, onOpenChange }: AgreementDocumentModalProps) {
  const { data: agreementResponse, isFetching } = useGetUserAgreementByIdOrSlugQuery(idOrSlug!, {
    skip: !open || !idOrSlug,
  });
  const agreement = agreementResponse?.data;
  const isLoading = isFetching && !agreement;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[90vh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <DialogHeader className="shrink-0 border-b border-slate-100 px-6 pb-4 pt-6 pr-12">
          <DialogTitle>{agreement?.title ?? 'Agreement'}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex flex-1 items-center justify-center py-16">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : agreement ? (
          <div className="custom_scrollbar flex-1 overflow-y-auto p-6">
            {agreement.version ? (
              <p className="mb-4 text-xs text-muted-foreground">Version {agreement.version}</p>
            ) : null}
            <MarkdownContent content={agreement.content} emptyMessage="No agreement content available." />
          </div>
        ) : (
          <div className="flex flex-1 items-center justify-center py-16 text-sm text-slate-500">
            Agreement not found.
          </div>
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
