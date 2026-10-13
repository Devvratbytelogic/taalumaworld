'use client';

import { useState } from 'react';
import { Mail, BellRing } from 'lucide-react';
import { Button } from '@heroui/react';
import GlobalButton from '@/components/ui/Button';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import { useInviteMentorMutation } from '@/store/rtkQueries/adminPostApi';
import { useSendMentorProfileReminderToAllMutation } from '@/store/rtkQueries/mentorApis';
import { InviteMentorModal, type InviteMentorFormValues } from './InviteMentorModal';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import toast from '@/utils/toast';

const MENTORS_MODEL = 'Mentors';

export function AdminAuthorsHeader() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isSendAllDialogOpen, setIsSendAllDialogOpen] = useState(false);
  const [inviteMentor] = useInviteMentorMutation();
  const [sendProfileReminderToAll, { isLoading: isSendingAllReminders }] = useSendMentorProfileReminderToAllMutation();
  const { hasPermission } = useAdminPermissions();
  const canAdd = hasPermission(MENTORS_MODEL, 'add');
  const canEdit = hasPermission(MENTORS_MODEL, 'edit');

  const handleInviteMentor = async (values: InviteMentorFormValues) => {
    const formData = new FormData();
    formData.append('email', values.email.trim());
    if (values.fullName.trim()) formData.append('name', values.fullName.trim());
    const res = await inviteMentor(formData).unwrap();
    if (res?.http_status_code === 200 || res?.http_status_code === 201) {
      toast.success(res.message ?? 'Invitation sent successfully');
    }
  };

  const handleSendAllReminders = async () => {
    try {
      const res = await sendProfileReminderToAll().unwrap();
      if (res?.http_status_code === 200 || res?.http_status_code === 201) {
        toast.success(res.message ?? 'Profile completion reminders sent to all mentors');
      }
    } catch {
      // Error toast handled by API layer
    } finally {
      setIsSendAllDialogOpen(false);
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Mentor management"
        description="Review and manage mentors on the platform"
      >
        <div className="flex flex-wrap items-center gap-3">
          {canEdit ? (
            <Button
              className="global_btn outline_primary rounded_full"
              onPress={() => setIsSendAllDialogOpen(true)}
              startContent={<BellRing className="h-4 w-4" />}
            >
              Send reminder to all
            </Button>
          ) : null}
          {canAdd ? (
            <Button
              className="global_btn bg_primary rounded_full"
              onPress={() => setIsInviteModalOpen(true)}
              startContent={<Mail className="h-4 w-4" />}
            >
              Invite mentor
            </Button>
          ) : null}
        </div>
      </AdminPageHeader>

      {canAdd ? (
        <InviteMentorModal
          open={isInviteModalOpen}
          onOpenChange={setIsInviteModalOpen}
          onSubmitForm={handleInviteMentor}
        />
      ) : null}

      {canEdit ? (
        <Dialog open={isSendAllDialogOpen} onOpenChange={setIsSendAllDialogOpen}>
          <DialogContent className="admin_panel max-w-sm">
            <DialogHeader>
              <DialogTitle>Send reminder to all mentors</DialogTitle>
              <DialogDescription>
                This will send a profile completion reminder to every mentor on the platform
                with an incomplete profile. Continue?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <GlobalButton
                onPress={() => setIsSendAllDialogOpen(false)}
                className="global_btn rounded_full outline_primary"
                isDisabled={isSendingAllReminders}
              >
                Cancel
              </GlobalButton>
              <GlobalButton
                onPress={handleSendAllReminders}
                className="global_btn rounded_full bg_primary"
                isLoading={isSendingAllReminders}
                isDisabled={isSendingAllReminders}
              >
                Send to all
              </GlobalButton>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      ) : null}
    </>
  );
}
