'use client';

import { useState } from 'react';
import { Award, Crown, Plus, Tags, Users } from 'lucide-react';
import { Button } from '@heroui/react';
import toast from '@/utils/toast';
import {
  AdminPage,
  AdminPageHeader,
  AdminSearchInput,
  AdminSearchPanel,
  AdminStatCard,
} from '@/components/admin/layout/AdminContent';
import { INITIAL_MENTOR_TYPES, type MentorType } from '@/components/admin/mentor-types/data/mentorTypesData';
import { MentorTypeListing } from './MentorTypeListing';
import { MentorTypeModal, type MentorTypeFormValues } from './MentorTypeModal';

function toSlug(name: string) {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export function AdminMentorTypesTab() {
  const [types, setTypes] = useState<MentorType[]>(INITIAL_MENTOR_TYPES);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingType, setEditingType] = useState<MentorType | null>(null);

  const searchText = searchQuery.trim().toLowerCase();
  const filteredTypes = searchText
    ? types.filter(
        (type) =>
          type.name.toLowerCase().includes(searchText) ||
          type.slug.toLowerCase().includes(searchText) ||
          type.badgeLabel.toLowerCase().includes(searchText),
      )
    : types;

  const foundingType = types.find((type) => type.slug === 'founding-mentor');

  const handleSave = (values: MentorTypeFormValues, id?: string) => {
    const slug = toSlug(values.name);

    if (id) {
      setTypes((prev) =>
        prev.map((type) =>
          type.id === id
            ? {
                ...type,
                name: values.name.trim(),
                slug,
                mentorSharePercent: values.mentorSharePercent,
                taalumaSharePercent: values.taalumaSharePercent,
                badgeLabel: values.badgeLabel.trim(),
                eligibilityCriteria: values.eligibilityCriteria.trim(),
                startDate: values.startDate || undefined,
                endDate: values.endDate || undefined,
                isActive: values.isActive,
                maxActiveMentors: values.maxActiveMentors,
                agreementVersion: values.agreementVersion.trim(),
              }
            : type,
        ),
      );
      toast.success('Mentor type updated');
      return;
    }

    if (types.some((type) => type.slug === slug)) {
      toast.error('A mentor type with this name already exists');
      return;
    }

    setTypes((prev) => [
      ...prev,
      {
        id: `mt_${slug}`,
        name: values.name.trim(),
        slug,
        mentorSharePercent: values.mentorSharePercent,
        taalumaSharePercent: values.taalumaSharePercent,
        badgeLabel: values.badgeLabel.trim(),
        eligibilityCriteria: values.eligibilityCriteria.trim(),
        startDate: values.startDate || undefined,
        endDate: values.endDate || undefined,
        isActive: values.isActive,
        maxActiveMentors: values.maxActiveMentors,
        agreementVersion: values.agreementVersion.trim(),
        schedules: ['Schedule A – Revenue Share'],
        activeMentorCount: 0,
      },
    ]);
    toast.success('Mentor type created');
  };

  return (
    <AdminPage>
      <AdminPageHeader
        eyebrow="Mentor Management"
        title="Mentor Types"
        description="Configure mentor categories, revenue share, badges, and agreement requirements."
      >
        <Button
          color="primary"
          className="rounded-xl"
          onPress={() => setIsCreateOpen(true)}
          startContent={<Plus className="h-4 w-4" />}
        >
          Add mentor type
        </Button>
      </AdminPageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard label="Active types" value={types.filter((t) => t.isActive).length} icon={Award} tone="blue" />
        <AdminStatCard
          label="Mentors assigned"
          value={types.reduce((sum, t) => sum + t.activeMentorCount, 0)}
          icon={Users}
          tone="green"
        />
        <AdminStatCard
          label="Founding mentors"
          value={foundingType ? `${foundingType.activeMentorCount} / ${foundingType.maxActiveMentors ?? '—'}` : '—'}
          icon={Crown}
          tone="orange"
        />
        <AdminStatCard
          label="Inactive types"
          value={types.filter((t) => !t.isActive).length}
          icon={Tags}
          tone="slate"
        />
      </div>

      <AdminSearchPanel>
        <AdminSearchInput value={searchQuery} onChange={setSearchQuery} placeholder="Search mentor types..." />
      </AdminSearchPanel>

      <MentorTypeListing
        types={filteredTypes}
        totalCount={types.length}
        searchQuery={searchQuery}
        onCreateType={() => setIsCreateOpen(true)}
        onEdit={setEditingType}
      />

      <MentorTypeModal open={isCreateOpen} onOpenChange={setIsCreateOpen} onSubmit={handleSave} />
      <MentorTypeModal
        open={!!editingType}
        mentorType={editingType}
        onOpenChange={(open) => !open && setEditingType(null)}
        onSubmit={handleSave}
      />
    </AdminPage>
  );
}
