'use client';

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { Button } from '@heroui/react';
import { AdminPageHeader } from '@/components/admin/layout/AdminContent';
import { useInviteAuthorLeaderMutation } from '@/store/rtkQueries/adminPostApi';
import { InviteMentorModal, type InviteMentorFormValues } from './InviteMentorModal';

export function AdminAuthorsHeader() {
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteAuthorLeader] = useInviteAuthorLeaderMutation();

  const handleInviteMentor = async (values: InviteMentorFormValues) => {
    await inviteAuthorLeader({
      email: values.email.trim(),
      ...(values.fullName.trim() ? { fullName: values.fullName.trim() } : {}),
    }).unwrap();
  };

  return (
    <>
      <AdminPageHeader
        title="Mentor management"
        description="Review and manage mentors on the platform"
      >
        <Button
          color="primary"
          className="rounded-xl"
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
