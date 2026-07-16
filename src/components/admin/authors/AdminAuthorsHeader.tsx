'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@heroui/react';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import { useInviteMentorMutation } from '@/store/rtkQueries/adminPostApi';
import { InviteMentorModal, type InviteMentorFormValues } from './InviteMentorModal';
import toast from '@/utils/toast';

export function AdminAuthorsHeader() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteMentor] = useInviteMentorMutation();

  const handleInviteMentor = async (values: InviteMentorFormValues) => {
    const formData = new FormData();
    formData.append('email', values.email.trim());
    if (values.fullName.trim()) formData.append('name', values.fullName.trim());
    const res = await inviteMentor(formData).unwrap();
    if (res?.http_status_code === 200 || res?.http_status_code === 201) {
      toast.success(res.message ?? 'Invitation sent successfully');
    }
  };

  return (
    <>
      <AdminPageHeader
        title="Mentor management"
        description="Review and manage mentors on the platform"
      >
        <Button
          className="global_btn bg_primary rounded_full"
          onPress={() => setIsInviteModalOpen(true)}
          startContent={<Mail className="h-4 w-4" />}
        >
          Invite mentor
        </Button>
      </AdminPageHeader>

      <InviteMentorModal
        open={isInviteModalOpen}
        onOpenChange={setIsInviteModalOpen}
        onSubmitForm={handleInviteMentor}
      />
    </>
  );
}
