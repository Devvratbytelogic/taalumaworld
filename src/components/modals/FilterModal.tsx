import { useState, useEffect, type ComponentType, type ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { SlidersHorizontal, Gift, ShoppingBag, Check, Search, X } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@heroui/react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/ui/UserAvatar';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useGetUserAllAuthorsQuery, useGetAllTagsQuery } from '@/store/rtkQueries/userGetAPI';
import FilterModalSkeleton from '@/components/skeleton-loader/FilterModalSkeleton';
import type { LibraryFilters } from '@/components/pages-components/home/FilterOptions';
import { useAuth } from '@/hooks/useAuth';
import { useDebounce } from '@/hooks/useDebounce';
import { cn } from '@/components/ui/utils';
import type { IUserAllAuthorsDataEntity } from '@/types/user/allAuthors';

function SectionLabel({
  children,
  count,
}: {
  children: ReactNode;
  count?: number;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <h3 className="text-[13px] font-semibold text-foreground tracking-tight">{children}</h3>
      {typeof count === 'number' && count > 0 && (
        <span className="text-xs font-medium text-primary tabular-nums">{count} selected</span>
      )}
    </div>
  );
}

function AvailabilityToggle({
  active,
  onClick,
  icon: Icon,
  label,
  description,
}: {
  active: boolean;
  onClick: () => void;
  icon: ComponentType<{ className?: string }>;
  label: string;
  description: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-1 min-w-0 items-start gap-3 rounded-2xl border px-3.5 py-3 text-left transition-colors',
        active
          ? 'border-primary/40 bg-primary/6'
          : 'border-transparent bg-muted/50 hover:bg-muted'
      )}
    >
      <span
        className={cn(
          'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
          active ? 'bg-primary text-white' : 'bg-background text-muted-foreground'
        )}
      >
        <Icon className="h-4 w-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium tracking-tight">{label}</span>
          <span
            className={cn(
              'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors',
              active ? 'border-primary bg-primary text-white' : 'border-border bg-background'
            )}
          >
            {active && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
          </span>
        </span>
        <span className="mt-0.5 block text-xs text-muted-foreground leading-snug">{description}</span>
      </span>
    </button>
  );
}

function TopicChip({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm capitalize transition-colors',
        selected
          ? 'bg-primary text-white shadow-sm'
          : 'bg-background text-foreground ring-1 ring-inset ring-border hover:ring-primary/30 hover:bg-primary/3'
      )}
    >
      {selected && <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} />}
      <span className="truncate max-w-48">{label}</span>
    </button>
  );
}

export default function FilterModal() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const { isAuthenticated } = useAuth();
  const modalFilters = data?.filters as LibraryFilters | undefined;
  const onApply = data?.onApply as ((next: LibraryFilters) => void) | undefined;

  const [tempMentorIds, setTempMentorIds] = useState<string[]>([]);
  const [selectedMentors, setSelectedMentors] = useState<IUserAllAuthorsDataEntity[]>([]);
  const [tempTags, setTempTags] = useState<string[]>([]);
  const [isFree, setIsFree] = useState(false);
  const [isPurchased, setIsPurchased] = useState(false);
  const [mentorSearch, setMentorSearch] = useState('');
  const debouncedMentorSearch = useDebounce(mentorSearch.trim(), 400);

  useEffect(() => {
    if (!isOpen) return;
    setTempMentorIds(modalFilters?.mentorIds ?? []);
    setSelectedMentors([]);
    setTempTags(modalFilters?.tags ?? []);
    setIsFree(Boolean(modalFilters?.isFree));
    setIsPurchased(isAuthenticated && Boolean(modalFilters?.isPurchased));
    setMentorSearch('');
  }, [isOpen, modalFilters, isAuthenticated]);

  const { data: authorsResponse, isLoading: isLoadingAuthors, isFetching: isFetchingAuthors } = useGetUserAllAuthorsQuery(
    debouncedMentorSearch ? { search: debouncedMentorSearch } : undefined,
  );
  const { data: tagsResponse, isLoading: isLoadingTags } = useGetAllTagsQuery();

  const isLoadingFilters = (isLoadingAuthors && !authorsResponse) || isLoadingTags;
  const authors = authorsResponse?.data?.data ?? [];
  const allTags = tagsResponse?.data ?? [];

  useEffect(() => {
    setSelectedMentors((prev) => {
      const next = tempMentorIds
        .map((id) => authors.find((author) => author.id === id) ?? prev.find((mentor) => mentor.id === id))
        .filter((mentor): mentor is IUserAllAuthorsDataEntity => Boolean(mentor));
      const unchanged =
        next.length === prev.length &&
        next.every((mentor, index) => mentor.id === prev[index]?.id);
      return unchanged ? prev : next;
    });
  }, [tempMentorIds, authors]);

  const handleMentorToggle = (author: IUserAllAuthorsDataEntity) => {
    setTempMentorIds((prev) =>
      prev.includes(author.id) ? prev.filter((id) => id !== author.id) : [...prev, author.id]
    );
    setSelectedMentors((prev) =>
      prev.some((mentor) => mentor.id === author.id)
        ? prev.filter((mentor) => mentor.id !== author.id)
        : [...prev, author]
    );
  };

  const handleTagToggle = (tag: string) => {
    setTempTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const currentFilters = (): LibraryFilters => ({
    isFree,
    isPurchased: isAuthenticated && isPurchased,
    mentorIds: tempMentorIds,
    tags: tempTags,
  });

  const handleApply = () => {
    onApply?.(currentFilters());
    dispatch(closeModal());
  };

  const handleReset = () => {
    setTempMentorIds([]);
    setSelectedMentors([]);
    setTempTags([]);
    setIsFree(false);
    setIsPurchased(false);
    setMentorSearch('');
    onApply?.({ isFree: false, isPurchased: false, mentorIds: [], tags: [] });
  };

  const activeFilterCount =
    (isFree ? 1 : 0) +
    (isAuthenticated && isPurchased ? 1 : 0) +
    tempMentorIds.length +
    tempTags.length;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => dispatch(closeModal())}
      className="modal_container"
      size="lg"
      scrollBehavior="inside"
    >
      <ModalContent className="max-h-[min(90dvh,760px)] w-[min(100vw-1.5rem,32rem)] max-w-full mx-auto overflow-hidden flex flex-col">
        <ModalHeader className="flex flex-row items-center gap-3 px-5 py-4 border-b shrink-0">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 shrink-0">
            <SlidersHorizontal className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold tracking-tight leading-none">Filters</h2>
              {activeFilterCount > 0 && (
                <Badge className="bg-primary/10 text-primary border-0 rounded-full h-5 min-w-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground mt-1.5 font-normal">
              Refine by availability, mentors, and topics
            </p>
          </div>
        </ModalHeader>

        <ModalBody className="overflow-y-auto flex-1 min-h-0 px-5 py-5 gap-0">
          {isLoadingFilters ? (
            <FilterModalSkeleton />
          ) : (
            <div className="space-y-6">
              <section className="space-y-2.5">
                <SectionLabel>Availability</SectionLabel>
                <div className={cn('grid gap-2.5', isAuthenticated ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1')}>
                  <AvailabilityToggle
                    active={isFree}
                    onClick={() => setIsFree((v) => !v)}
                    icon={Gift}
                    label="Free"
                    description="Only free content"
                  />
                  {isAuthenticated ? (
                    <AvailabilityToggle
                      active={isPurchased}
                      onClick={() => setIsPurchased((v) => !v)}
                      icon={ShoppingBag}
                      label="Purchased"
                      description="Content you own"
                    />
                  ) : null}
                </div>
              </section>

              <section className="space-y-2.5">
                <SectionLabel count={tempMentorIds.length}>Mentor</SectionLabel>

                {authors.length > 0 || mentorSearch.trim() ? (
                  <div className="rounded-2xl border border-border/80 bg-background overflow-hidden">
                    <div className="relative border-b border-border/70">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        value={mentorSearch}
                        onChange={(e) => setMentorSearch(e.target.value)}
                        placeholder="Search mentors..."
                        className="h-11 rounded-none border-0 shadow-none pl-10 pr-10 focus-visible:ring-0"
                        aria-label="Search mentors"
                      />
                      {mentorSearch && (
                        <button
                          type="button"
                          onClick={() => setMentorSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                          aria-label="Clear mentor search"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>

                    {selectedMentors.length > 0 ? (
                      <div className="flex flex-wrap gap-1.5 px-3 py-2.5 border-b border-border/70 bg-muted/30">
                        {selectedMentors.map((mentor) => (
                          <button
                            key={mentor.id}
                            type="button"
                            onClick={() => handleMentorToggle(mentor)}
                            className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary pl-2.5 pr-1.5 py-1 text-xs font-medium capitalize"
                          >
                            <span className="truncate max-w-36">{mentor.name}</span>
                            <span className="flex h-4 w-4 items-center justify-center rounded-full hover:bg-primary/15">
                              <X className="h-3 w-3" />
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : null}

                    {authors.length > 0 ? (
                      <ul className={`max-h-52 overflow-y-auto divide-y divide-border/60 ${isFetchingAuthors ? 'opacity-60' : ''}`}>
                        {authors.map((author) => {
                          const selected = tempMentorIds.includes(author.id);
                          return (
                            <li key={author.id}>
                              <button
                                type="button"
                                onClick={() => handleMentorToggle(author)}
                                className={cn(
                                  'flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition-colors',
                                  selected ? 'bg-primary/4' : 'hover:bg-muted/50'
                                )}
                              >
                                <UserAvatar
                                  userName={author.name}
                                  userPhoto={author.profile_pic}
                                  size="sm"
                                />
                                <span className="min-w-0 flex-1 text-sm font-medium capitalize truncate">
                                  {author.name}
                                </span>
                                <span
                                  className={cn(
                                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors',
                                    selected
                                      ? 'border-primary bg-primary text-white'
                                      : 'border-border bg-background'
                                  )}
                                >
                                  {selected && <Check className="h-3 w-3" strokeWidth={3} />}
                                </span>
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    ) : (
                      <p className="px-4 py-6 text-sm text-center text-muted-foreground">
                        No mentors match “{mentorSearch.trim()}”
                      </p>
                    )}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground rounded-2xl border border-dashed border-border px-4 py-6 text-center">
                    No mentors available
                  </p>
                )}
              </section>

              <section className="space-y-2.5">
                <SectionLabel count={tempTags.length}>Genres & topics</SectionLabel>
                {allTags.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <TopicChip
                        key={tag}
                        label={tag}
                        selected={tempTags.includes(tag)}
                        onClick={() => handleTagToggle(tag)}
                      />
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground rounded-2xl border border-dashed border-border px-4 py-6 text-center">
                    No genres available yet
                  </p>
                )}
              </section>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="gap-2 px-5 py-4 border-t bg-background w-full min-w-0 shrink-0">
          <Button
            onPress={handleReset}
            disabled={activeFilterCount === 0}
            className="global_btn outline_primary rounded_full flex-1 sm:flex-initial"
          >
            Reset
          </Button>
          <div className="flex-1 hidden sm:block" />
          <Button
            onPress={() => dispatch(closeModal())}
            className="global_btn outline_primary rounded_full flex-1 sm:flex-initial"
          >
            Cancel
          </Button>
          <Button
            onPress={handleApply}
            className="global_btn bg_primary rounded_full flex-[1.4] sm:flex-initial min-w-0"
          >
            <span className="inline-flex items-center justify-center gap-2">
              Apply
              {activeFilterCount > 0 && (
                <Badge className="shrink-0 bg-white text-primary rounded-full h-5 min-w-5 px-1.5">
                  {activeFilterCount}
                </Badge>
              )}
            </span>
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
