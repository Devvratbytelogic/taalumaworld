'use client';

import { useEffect, useState } from 'react';
import { Save, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useUpdateMentorEquityMutation } from '@/store/rtkQueries/mentorEquityApis';
import toast from '@/utils/toast';
import type { IMentorEquityEntity } from '@/types/mentorEquity';

interface MentorEquityGrantModalProps {
  open: boolean;
  mentor?: IMentorEquityEntity | null;
  granted: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MentorEquityGrantModal({
  open,
  mentor,
  granted,
  onOpenChange,
}: MentorEquityGrantModalProps) {
  const [notes, setNotes] = useState('');
  const [updateMentorEquity, { isLoading }] = useUpdateMentorEquityMutation();
  const mentorName = mentor?.user?.name || 'this mentor';

  useEffect(() => {
    if (!open) {
      setNotes('');
      return;
    }
    setNotes(granted ? (mentor?.equity?.notes ?? '') : '');
  }, [open, granted, mentor]);

  const handleSubmit = async () => {
    if (!mentor?.mentor_id) return;
    try {
      const res = await updateMentorEquity({
        mentorId: mentor.mentor_id,
        granted,
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      }).unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201 || res?.success) {
        toast.success(res?.message ?? (granted ? 'Legal grant recorded' : 'Grant flag cleared'));
        onOpenChange(false);
      }
    } catch (error) {
      console.error('Failed to update mentor equity', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="admin_panel sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{granted ? 'Mark legal grant' : 'Clear grant'}</DialogTitle>
          <DialogDescription>
            {granted
              ? `Record that legal finished for ${mentorName}. This does not issue shares.`
              : `Clear the offline grant flag for ${mentorName}. This does not change eligibility.`}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="equity-grant-notes">Notes {granted ? '(recommended)' : '(optional)'}</Label>
          <Textarea
            id="equity-grant-notes"
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={granted ? 'SHA signed 2026-09-01' : 'Grant reversed'}
            disabled={isLoading}
          />
        </div>

        <DialogFooter className="gap-3">
          <Button type="button" className="global_btn outline_primary rounded_full" onPress={() => onOpenChange(false)} disabled={isLoading}>
            <X className="h-4 w-4" />
            Cancel
          </Button>
          <Button
            type="button"
            className={`global_btn rounded_full ${granted ? 'bg_primary' : 'danger_btn'}`}
            isLoading={isLoading}
            isDisabled={isLoading || !mentor?.mentor_id}
            onPress={handleSubmit}
          >
            <Save className="h-4 w-4" />
            {granted ? 'Mark granted' : 'Clear grant'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
