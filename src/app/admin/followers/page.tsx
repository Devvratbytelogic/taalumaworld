import { MentorFollowersTab } from '@/components/admin/mentor/followers/MentorFollowersTab';

export default function AdminFollowersPage() {
  return (
    <MentorFollowersTab
      description="People following mentors across TaalumaWorld."
      showMentor
    />
  );
}
