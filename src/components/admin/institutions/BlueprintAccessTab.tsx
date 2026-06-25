'use client';

import { useState } from 'react';
import { Button } from '@heroui/react';
import { Search, BookOpen, CheckCircle, XCircle, Save } from 'lucide-react';
import { useGetAllInstitutionsQuery, useUpdateInstitutionBlueprintAccessMutation } from '@/store/rtkQueries/institutionApi';
import { useGetAllAdminChaptersQuery } from '@/store/rtkQueries/adminGetApi';
import type { IInstitution } from '@/types/institution';
import toast from '@/utils/toast';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export function BlueprintAccessTab() {
    const [selectedInstitutionId, setSelectedInstitutionId] = useState<string>('');
    const [search, setSearch] = useState('');
    const [localSelected, setLocalSelected] = useState<Set<string>>(new Set());
    const [isDirty, setIsDirty] = useState(false);

    const { data: instData, isLoading: loadingInst } = useGetAllInstitutionsQuery();
    const { data: bpData, isLoading: loadingBP } = useGetAllAdminChaptersQuery();
    const [updateAccess, { isLoading: isSaving }] = useUpdateInstitutionBlueprintAccessMutation();

    const institutions: IInstitution[] = instData?.data ?? [];
    const blueprints = bpData?.data ?? [];

    const selectedInstitution = institutions.find((i) => i._id === selectedInstitutionId) ?? null;

    const handleSelectInstitution = (inst: IInstitution) => {
        setSelectedInstitutionId(inst._id);
        setLocalSelected(new Set(inst.blueprint_ids ?? []));
        setIsDirty(false);
        setSearch('');
    };

    const toggleBlueprint = (id: string) => {
        setLocalSelected((prev) => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id); else next.add(id);
            return next;
        });
        setIsDirty(true);
    };

    const toggleAll = (ids: string[]) => {
        const allSelected = ids.every((id) => localSelected.has(id));
        setLocalSelected((prev) => {
            const next = new Set(prev);
            ids.forEach((id) => allSelected ? next.delete(id) : next.add(id));
            return next;
        });
        setIsDirty(true);
    };

    const handleSave = async () => {
        if (!selectedInstitution) return;
        try {
            await updateAccess({
                id: selectedInstitution._id,
                blueprint_ids: Array.from(localSelected),
            }).unwrap();
            toast.success('Blueprint access updated');
            setIsDirty(false);
        } catch { /* handled by RTK */ }
    };

    const q = search.toLowerCase();
    const filteredBP = blueprints.filter(
        (b) =>
            (b.title ?? '').toLowerCase().includes(q) ||
            (b.book?.category ?? '').toLowerCase().includes(q)
    );

    const loading = loadingInst || loadingBP;

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
                <strong>How it works:</strong> Select an institution, then toggle which blueprints are
                available to its verified students during their promotional period. Granular control
                is available at both admin and mentor level.
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Institution list */}
                <div className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
                    <p className="text-sm font-semibold text-gray-700">Select Institution</p>
                    {loading ? (
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
                        ))
                    ) : institutions.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">
                            No institutions registered yet.
                        </p>
                    ) : (
                        institutions.map((inst) => (
                            <button
                                key={inst._id}
                                onClick={() => handleSelectInstitution(inst)}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                                    selectedInstitutionId === inst._id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <p className="text-sm font-medium">{inst.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {(inst.blueprint_ids ?? []).length} blueprint(s) enabled
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
                                    <p className="font-semibold">{selectedInstitution.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {localSelected.size} / {blueprints.length} blueprints enabled
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => toggleAll(filteredBP.map((b) => b._id))}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        {filteredBP.every((b) => localSelected.has(b._id))
                                            ? 'Deselect all'
                                            : 'Select all'}
                                    </button>
                                    {isDirty && (
                                        <Button
                                            size="sm"
                                            color="primary"
                                            isLoading={isSaving}
                                            onPress={handleSave}
                                            startContent={<Save className="h-3.5 w-3.5" />}
                                        >
                                            Save
                                        </Button>
                                    )}
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
                                {filteredBP.length === 0 ? (
                                    <p className="text-sm text-muted-foreground py-4 text-center">
                                        No blueprints match your search.
                                    </p>
                                ) : (
                                    filteredBP.map((bp) => {
                                        const enabled = localSelected.has(bp._id);
                                        return (
                                            <div
                                                key={bp._id}
                                                className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                                                    enabled
                                                        ? 'border-green-300 bg-green-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                                onClick={() => toggleBlueprint(bp._id)}
                                            >
                                                <div
                                                    className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 ${
                                                        enabled ? 'bg-green-500' : 'bg-gray-200'
                                                    }`}
                                                >
                                                    {enabled && (
                                                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                                                    )}
                                                    {!enabled && (
                                                        <XCircle className="h-3.5 w-3.5 text-gray-400" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">
                                                        {bp.title}
                                                    </p>
                                                    {bp.book?.category && (
                                                        <Badge variant="secondary" className="text-xs mt-0.5">
                                                            {bp.book.category}
                                                        </Badge>
                                                    )}
                                                </div>
                                                <span className="text-xs text-muted-foreground whitespace-nowrap">
                                                    {enabled ? 'Enabled' : 'Disabled'}
                                                </span>
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
