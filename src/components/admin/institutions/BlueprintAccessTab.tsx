'use client';

import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@heroui/react';
import { Search, BookOpen, CheckCircle, XCircle, Save, X } from 'lucide-react';
import { useGetAllInstitutionsQuery, useGetInstitutionAccessQuery, useAddInstitutionAccessMutation, useDeleteInstitutionAccessMutation } from '@/store/rtkQueries/institutionApi';
import { useGetAllAdminChaptersQuery } from '@/store/rtkQueries/adminGetApi';
import type { IAllInstitutionsDataEntity } from '@/types/institution';
import type { IChapter } from '@/types/chapter';
import toast from '@/utils/toast';
import { Input } from '@/components/ui/input';
import { useDebounce } from '@/hooks/useDebounce';
import { useAdminPermissions } from '@/hooks/useAdminPermissions';
import BlueprintAccessSkeleton from '@/components/skeleton-loader/BlueprintAccessSkeleton';
import { openModal, closeModal } from '@/store/slices/allModalSlice';

const INSTITUTION_ACCESS_MODEL = 'Institution Access';

export function BlueprintAccessTab() {
    const dispatch = useDispatch();
    const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('');
    const [search, setSearch] = useState('');
    const [localSelected, setLocalSelected] = useState<string[]>([]);
    const { hasPermission } = useAdminPermissions();

    const canEdit = hasPermission(INSTITUTION_ACCESS_MODEL, 'edit');
    const canDelete = hasPermission(INSTITUTION_ACCESS_MODEL, 'delete');

    const debouncedSearch = useDebounce(search, 500);

    const { data: instData, isLoading: loadingInst } = useGetAllInstitutionsQuery();
    const { data: bpData, isLoading: loadingBP } = useGetAllAdminChaptersQuery({ search: debouncedSearch });
    const { data: accessData, isFetching: loadingAccess } = useGetInstitutionAccessQuery(
        { institutionId: selectedInstitutionId },
        { skip: !selectedInstitutionId }
    );
    const [addAccess, { isLoading: isAdding }] = useAddInstitutionAccessMutation();
    const [deleteAccess] = useDeleteInstitutionAccessMutation();

    const institutions: IAllInstitutionsDataEntity[] = instData?.data?.data ?? [];
    const blueprints = bpData?.data?.data ?? [];
    const accessEntries = accessData?.data?.data ?? [];

    const selectedInstitution = institutions.find((i) => i._id === selectedInstitutionId) ?? null;
    const activeBookIds = accessEntries.map((e) => e.chapter_id);
    const isDirty =
        !!selectedInstitution &&
        (localSelected.length !== activeBookIds.length || !activeBookIds.every((id) => localSelected.includes(id)));

    useEffect(() => {
        if (!selectedInstitutionId || loadingAccess) return;
        setLocalSelected(accessEntries.map((e) => e.chapter_id));
    }, [selectedInstitutionId, loadingAccess]);

    const handleSelectInstitution = (inst: IAllInstitutionsDataEntity) => {
        setSelectedInstitutionId(inst._id);
        setSearch('');
    };

    const toggleBlueprint = (id: string) => {
        if (!canEdit) return;
        setLocalSelected((prev) =>
            prev.includes(id) ? prev.filter((existingId) => existingId !== id) : [...prev, id]
        );
    };

    const handleRemoveAccess = (bp: IChapter) => {
        if (!selectedInstitution) return;
        const existing = accessEntries.find((e) => e.chapter_id === bp._id);

        dispatch(
            openModal({
                componentName: 'DeleteConfirmation',
                data: {
                    itemName: bp.title,
                    onDelete: async () => {
                        try {
                            const res = existing
                                ? await deleteAccess({
                                    institutionId: selectedInstitution._id,
                                    accessId: existing._id,
                                }).unwrap()
                                : null;
                            if (!existing || res?.http_status_code === 200 || res?.http_status_code === 201) {
                                setLocalSelected((prev) => prev.filter((id) => id !== bp._id));
                                toast.success(res?.message ?? 'Blueprint access removed');
                                dispatch(closeModal());
                            }
                        } catch (error) {
                            console.error('Error removing blueprint access', error);
                            toast.error('Failed to remove blueprint access');
                        }
                    },
                },
            })
        );
    };

    const handleSave = async () => {
        if (!selectedInstitution || !isDirty) return;
        try {
            const res = await addAccess({
                institutionId: selectedInstitution._id,
                values: { chapter_ids: localSelected },
            }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success('Blueprint access updated');
            }
        } catch (error) {
            console.error('Error saving blueprint access', error);
            toast.error('Failed to save blueprint access');
        }
    };

    const isSaving = isAdding;

    if (loadingInst) {
        return <BlueprintAccessSkeleton />;
    }

    return (
        <div className="space-y-6">
            {/* <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <strong>How it works:</strong> Select an institution, then toggle which blueprints are
                available to its verified students during their promotional period. Granular control
                is available at both admin and mentor level.
            </div> */}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Institution list */}
                <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Select Institution</p>
                    {loadingInst ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                        ))
                    ) : institutions?.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                            No institutions registered yet.
                        </p>
                    ) : (
                        institutions?.length > 0 && institutions?.map((inst) => (
                            <button
                                key={inst?._id}
                                type="button"
                                onClick={() => handleSelectInstitution(inst)}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${selectedInstitutionId === inst._id
                                    ? 'border-primary bg-primary/5'
                                    : 'border-gray-200 hover:border-gray-300'
                                    }`}
                            >
                                <p className="text-sm font-medium">{inst?.name}</p>
                                <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                    {selectedInstitutionId === inst?._id
                                        ? `${localSelected?.length} blueprint(s) enabled`
                                        : inst?.contact_email}
                                </p>
                            </button>
                        ))
                    )}
                </div>

                {/* Blueprint selector */}
                <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-4 space-y-4">
                    {!selectedInstitution ? (
                        <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
                            <BookOpen className="h-12 w-12 text-gray-300" />
                            <p className="text-muted-foreground text-sm">
                                Select an institution to configure blueprint access
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-semibold">{selectedInstitution?.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {localSelected?.length} / {blueprints?.length ?? 0} blueprints enabled
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    {canEdit && isDirty ? (
                                        <Button
                                            size="sm"
                                            color="primary"
                                            isLoading={isSaving}
                                            onPress={handleSave}
                                            startContent={<Save className="h-3.5 w-3.5" />}
                                        >
                                            Save
                                        </Button>
                                    ) : null}
                                </div>
                            </div>

                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search blueprints..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>

                            <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                                {loadingBP || loadingAccess ? (
                                    Array.from({ length: 4 }).map((_, i) => (
                                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                                    ))
                                ) : blueprints?.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-4 text-center">
                                        No blueprints match your search.
                                    </p>
                                ) : (
                                    blueprints?.length > 0 && blueprints?.map((bp) => {
                                        const enabled = localSelected?.includes(bp?._id);
                                        return (
                                            <div
                                                key={bp?._id}
                                                onClick={() => toggleBlueprint(bp?._id)}
                                                className={`group flex items-center gap-3.5 rounded-md border p-3 transition-all ${canEdit ? 'cursor-pointer' : 'cursor-default'} ${enabled
                                                    ? 'border-green-200! bg-green-50/60'
                                                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50/60'
                                                    }`}
                                            >
                                                {/* Cover image */}
                                                <div className="relative h-14 w-14 shrink-0">
                                                    <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-md bg-slate-100 ring-1 ring-inset ring-black/5">
                                                        <BookOpen className="h-5 w-5 text-slate-300" />
                                                        {bp?.coverImage && (
                                                            <img
                                                                src={bp?.coverImage ?? ''}
                                                                alt={bp?.title}
                                                                className="absolute inset-0 h-full w-full object-cover transition-transform group-hover:scale-105"
                                                                onError={(e) => {
                                                                    e.currentTarget.style.display = 'none';
                                                                }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div
                                                        className={`absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white ${enabled ? 'bg-green-500' : 'bg-gray-300'}`}
                                                    >
                                                        {enabled ? <CheckCircle className="h-3 w-3 text-white" /> : <XCircle className="h-3 w-3 text-white" />}
                                                    </div>
                                                </div>

                                                {/* Details */}
                                                <div className="flex-1 min-w-0 space-y-1.5">
                                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                                        {bp?.title}
                                                    </p>

                                                    {(bp?.series?.title || bp?.createdBy?.name) && (
                                                        <div className="flex flex-wrap items-center gap-1 text-[11px] text-muted-foreground">
                                                            {bp?.series?.title && (
                                                                <span className="truncate">
                                                                    Series: <span className="text-slate-600">{bp.series.title}</span>
                                                                </span>
                                                            )}
                                                            {bp?.series?.title && bp?.createdBy?.name && (
                                                                <span className="text-slate-300">•</span>
                                                            )}
                                                            {bp?.createdBy?.name && (
                                                                <span className="flex items-center gap-1 truncate">
                                                                    {bp.createdBy.profile_pic ? (
                                                                        <img
                                                                            src={bp.createdBy.profile_pic}
                                                                            alt={bp.createdBy.name}
                                                                            className="h-4 w-4 shrink-0 rounded-full border object-cover"
                                                                            onError={(e) => {
                                                                                e.currentTarget.style.display = 'none';
                                                                            }}
                                                                        />
                                                                    ) : null}
                                                                    <span className="truncate">By {bp.createdBy.name}</span>
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}

                                                    <div className="flex flex-wrap items-center gap-1.5">
                                                        {bp?.price != null && (
                                                            <span
                                                                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${Number(bp.price) > 0 ? 'bg-primary/10 text-primary' : 'bg-emerald-50 text-emerald-600'
                                                                    }`}
                                                            >
                                                                {Number(bp.price) > 0 ? `KSH ${Number(bp.price).toFixed(2)}` : 'Free'}
                                                            </span>
                                                        )}
                                                        {bp?.status && (
                                                            <span
                                                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium whitespace-nowrap ${bp.status === 'Published'
                                                                    ? 'bg-blue-50 text-blue-600'
                                                                    : 'bg-amber-50 text-amber-600'
                                                                    }`}
                                                            >
                                                                {bp.status}
                                                            </span>
                                                        )}
                                                        {bp?.series?.pricingModel && (
                                                            <span className="rounded-full bg-purple-50 px-2 py-0.5 text-[11px] font-medium capitalize whitespace-nowrap text-purple-600">
                                                                {bp.series.pricingModel}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status */}
                                                <div className="flex shrink-0 items-center gap-1.5">
                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${enabled ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                                                    >
                                                        {enabled ? 'Enabled' : 'Disabled'}
                                                    </span>
                                                    {enabled && canDelete ? (
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemoveAccess(bp);
                                                            }}
                                                            className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600 transition-colors hover:bg-red-100 hover:text-red-600"
                                                            aria-label="Remove blueprint access"
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </button>
                                                    ) : null}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
