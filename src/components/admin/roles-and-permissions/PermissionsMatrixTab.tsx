'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@heroui/react';
import { Save, RotateCcw, ShieldCheck, Grid3X3, Loader2 } from 'lucide-react';
import {
    useGetAllRolesQuery,
    useGetAllModelsQuery,
    useGetAllPermissionsQuery,
    useGetRolePermissionsQuery,
    useAddUpdateRolePermissionsMutation,
} from '@/store/rtkQueries/rolesPermissionsApi';
import type { IAllRolesEntity } from '@/types/rolesPermissions';
import { AdminSearchInput, adminPanelClass } from '@/components/admin/layout/AdminContent';
import { USER_TYPE } from '@/constants/common';
import { cn } from '@/components/ui/utils';
import toast from '@/utils/toast';
import { useDebounce } from '@/hooks/useDebounce';

type PermissionMatrix = Record<string, string[]>;

const EXCLUDED_ROLE_NAMES = new Set<string>(Object.values(USER_TYPE));

function isExcludedRole(name?: string | null) {
    return EXCLUDED_ROLE_NAMES.has(String(name ?? '').trim());
}

function formatLabel(value: string): string {
    return value
        .replace(/[_-]+/g, ' ')
        .trim()
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function matrixKey(matrix: PermissionMatrix): string {
    return JSON.stringify(
        Object.keys(matrix)
            .sort()
            .map((model) => [model, [...matrix[model]].sort()]),
    );
}

export function PermissionsMatrixTab() {
    const [selectedRoleId, setSelectedRoleId] = useState('');
    const [roleSearch, setRoleSearch] = useState('');
    const [modelSearch, setModelSearch] = useState('');
    const [matrix, setMatrix] = useState<PermissionMatrix>({});
    const [originalMatrix, setOriginalMatrix] = useState<PermissionMatrix>({});
    const debouncedRoleSearch = useDebounce(roleSearch, 500);

    const { data: rolesRes, isLoading: isLoadingRoles, isFetching: isFetchingRoles } = useGetAllRolesQuery({
        limit: 100,
        search: debouncedRoleSearch,
    });
    const { data: modelsRes, isLoading: isLoadingModels } = useGetAllModelsQuery();
    const { data: permissionsRes, isLoading: isLoadingPermissions } = useGetAllPermissionsQuery();
    const { data: rolePermissionsRes, isFetching: isFetchingRolePermissions } = useGetRolePermissionsQuery(
        selectedRoleId,
        { skip: !selectedRoleId },
    );
    const [saveRolePermissions, { isLoading: isSaving }] = useAddUpdateRolePermissionsMutation();

    const roles: IAllRolesEntity[] = useMemo(
        () => (rolesRes?.data?.data ?? []).filter((role) => !isExcludedRole(role.name)),
        [rolesRes?.data?.data],
    );
    const models = modelsRes?.data ?? [];
    const permissions = permissionsRes?.data ?? [];

    const filteredModels = useMemo(() => {
        const q = modelSearch.trim().toLowerCase();
        if (!q) return models;
        return models.filter((model) => model.toLowerCase().includes(q));
    }, [models, modelSearch]);

    const viewPermission = useMemo(
        () => permissions.find((p) => p.toLowerCase() === 'view'),
        [permissions],
    );

    const hasNonViewPermission = (list: string[]) =>
        list.some((p) => p.toLowerCase() !== 'view');

    // Any permission beyond "view" implies view — keep it selected.
    const withViewDependency = (list: string[]): string[] => {
        if (!viewPermission || list.includes(viewPermission)) return list;
        return hasNonViewPermission(list) ? [...list, viewPermission] : list;
    };

    const isViewLocked = (list: string[]) =>
        Boolean(viewPermission && hasNonViewPermission(list));

    const selectedRole: IAllRolesEntity | null = roles.find((role) => role._id === selectedRoleId) ?? null;

    useEffect(() => {
        if (!roles.length) {
            if (selectedRoleId) setSelectedRoleId('');
            return;
        }
        if (!selectedRoleId || !roles.some((role) => role._id === selectedRoleId)) {
            setSelectedRoleId(roles[0]._id);
        }
    }, [roles, selectedRoleId]);

    useEffect(() => {
        if (!selectedRoleId || isFetchingRolePermissions) return;
        const built: PermissionMatrix = {};
        (rolePermissionsRes?.data ?? []).forEach((entry) => {
            built[entry.model] = withViewDependency(entry.permission ?? []);
        });
        setMatrix(built);
        setOriginalMatrix(built);
    }, [selectedRoleId, rolePermissionsRes, isFetchingRolePermissions, viewPermission]);

    const isDirty = matrixKey(matrix) !== matrixKey(originalMatrix);

    const toggleCell = (model: string, permission: string) => {
        setMatrix((prev) => {
            const current = prev[model] ?? [];
            const isChecked = current.includes(permission);
            const isView = permission.toLowerCase() === 'view';

            // View cannot be unchecked while any other permission is selected.
            if (isChecked && isView && isViewLocked(current)) {
                return prev;
            }

            const next = isChecked
                ? current.filter((p) => p !== permission)
                : withViewDependency([...current, permission]);

            return { ...prev, [model]: next };
        });
    };

    const toggleRow = (model: string) => {
        setMatrix((prev) => {
            const current = prev[model] ?? [];
            const allGranted = permissions.every((p) => current.includes(p));
            return { ...prev, [model]: allGranted ? [] : [...permissions] };
        });
    };

    const toggleColumn = (permission: string) => {
        const isView = permission.toLowerCase() === 'view';
        setMatrix((prev) => {
            const allGranted = models.every((model) => (prev[model] ?? []).includes(permission));
            const next: PermissionMatrix = { ...prev };
            models.forEach((model) => {
                const current = next[model] ?? [];
                if (allGranted) {
                    // Don't strip View from rows that still have other permissions.
                    if (isView && isViewLocked(current)) return;
                    next[model] = current.filter((p) => p !== permission);
                } else if (!current.includes(permission)) {
                    next[model] = withViewDependency([...current, permission]);
                }
            });
            return next;
        });
    };

    const handleSelectRole = (roleId: string) => {
        if (roleId === selectedRoleId) return;
        setSelectedRoleId(roleId);
        setModelSearch('');
    };

    const handleDiscard = () => setMatrix(originalMatrix);

    const handleSave = async () => {
        if (!selectedRoleId || !isDirty) return;
        try {
            const data = models.map((model) => ({ model, permissions: matrix[model] ?? [] }));
            const res = await saveRolePermissions({ roleId: selectedRoleId, data }).unwrap();
            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res?.message ?? 'Permissions updated successfully');
                setOriginalMatrix(matrix);
            }
        } catch (error) {
            console.error('Error saving role permissions', error);
        }
    };

    const isInitialLoading = isLoadingRoles || isLoadingModels || isLoadingPermissions;

    if (isInitialLoading) {
        return (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="space-y-2 lg:col-span-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="h-16 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="lg:col-span-3 h-96 bg-gray-100 rounded-xl animate-pulse" />
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className={cn(adminPanelClass, 'lg:col-span-1 p-4 space-y-3 h-fit')}>
                <p className="text-sm font-semibold text-slate-700">Select Role</p>
                <AdminSearchInput value={roleSearch} onChange={setRoleSearch} placeholder="Search roles..." />
                <div className="space-y-1.5 max-h-130 overflow-y-auto pr-1">
                    {isFetchingRoles ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="h-14 bg-gray-100 rounded-lg animate-pulse" />
                        ))
                    ) : roles.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4 text-center">No roles found.</p>
                    ) : (
                        roles.map((role) => (
                            <button
                                key={role._id}
                                type="button"
                                onClick={() => handleSelectRole(role._id)}
                                className={cn(
                                    'w-full text-left px-3.5 py-2.5 rounded-lg border transition-all',
                                    selectedRoleId === role._id
                                        ? 'border-primary bg-primary/5'
                                        : 'border-transparent hover:border-slate-200 hover:bg-slate-50',
                                )}
                            >
                                <div className="flex items-center gap-2">
                                    <ShieldCheck className="h-4 w-4 text-primary shrink-0" />
                                    <span className="text-sm font-medium truncate">{role.name}</span>
                                </div>
                                {role.description ? (
                                    <p className="text-xs text-muted-foreground truncate mt-0.5 ml-6">{role.description}</p>
                                ) : null}
                            </button>
                        ))
                    )}
                </div>
            </div>

            <div className={cn(adminPanelClass, 'lg:col-span-3 p-4 space-y-4')}>
                {!selectedRole ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center gap-3">
                        <Grid3X3 className="h-12 w-12 text-gray-300" />
                        <p className="text-muted-foreground text-sm">Select a role to configure its permissions</p>
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="font-semibold text-slate-900">{selectedRole.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {models.length} models &middot; {permissions.length} permission types
                                </p>
                            </div>
                            <div className="flex items-center gap-2">
                                {isDirty ? (
                                    <Button
                                        variant="light"
                                        size="sm"
                                        onPress={handleDiscard}
                                        isDisabled={isSaving}
                                        startContent={<RotateCcw className="h-3.5 w-3.5" />}
                                    >
                                        Discard
                                    </Button>
                                ) : null}
                                <Button
                                    color="primary"
                                    size="sm"
                                    onPress={handleSave}
                                    isDisabled={!isDirty || isSaving}
                                    isLoading={isSaving}
                                    startContent={<Save className="h-3.5 w-3.5" />}
                                >
                                    Save Changes
                                </Button>
                            </div>
                        </div>

                        <AdminSearchInput value={modelSearch} onChange={setModelSearch} placeholder="Search models..." />

                        <div className="relative border border-gray-200 rounded-md overflow-auto max-h-130">
                            {isFetchingRolePermissions ? (
                                <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
                                    <Loader2 className="h-6 w-6 text-primary animate-spin" />
                                </div>
                            ) : null}
                            <table className="w-full text-sm border-collapse">
                                <thead className="sticky top-0 z-1 bg-slate-50">
                                    <tr>
                                        <th className="sticky left-0 z-2 bg-slate-50 text-left px-4 py-2.5 font-semibold text-slate-600 border-b border-gray-200 min-w-45">
                                            Model
                                        </th>
                                        {permissions.map((permission) => (
                                            <th
                                                key={permission}
                                                className="px-3 py-2.5 text-center font-semibold text-slate-600 border-b border-l border-gray-200 whitespace-nowrap"
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => toggleColumn(permission)}
                                                    className="hover:text-primary transition-colors"
                                                    title={`Toggle ${formatLabel(permission)} for all models`}
                                                >
                                                    {formatLabel(permission)}
                                                </button>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredModels.length === 0 ? (
                                        <tr>
                                            <td colSpan={permissions.length + 1} className="text-center text-muted-foreground py-8">
                                                No models match your search.
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredModels.map((model, idx) => {
                                            const granted = matrix[model] ?? [];
                                            return (
                                                <tr key={model} className={idx % 2 === 1 ? 'bg-slate-50/50' : undefined}>
                                                    <td className="sticky left-0 z-1 bg-white px-4 py-2 border-b border-gray-100 font-medium text-slate-800 whitespace-nowrap">
                                                        <button
                                                            type="button"
                                                            onClick={() => toggleRow(model)}
                                                            className="hover:text-primary transition-colors text-left"
                                                            title={`Toggle all permissions for ${formatLabel(model)}`}
                                                        >
                                                            {formatLabel(model)}
                                                        </button>
                                                    </td>
                                                    {permissions.map((permission) => {
                                                        const checked = granted.includes(permission);
                                                        const lockedView =
                                                            permission.toLowerCase() === 'view' &&
                                                            checked &&
                                                            isViewLocked(granted);
                                                        return (
                                                            <td key={permission} className="border-b border-l border-gray-100 px-3 py-2 text-center">
                                                                <input
                                                                    type="checkbox"
                                                                    className={cn(
                                                                        'h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary/40',
                                                                        lockedView ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
                                                                    )}
                                                                    checked={checked}
                                                                    disabled={lockedView}
                                                                    title={
                                                                        lockedView
                                                                            ? 'View is required while other permissions are selected'
                                                                            : undefined
                                                                    }
                                                                    onChange={() => toggleCell(model, permission)}
                                                                />
                                                            </td>
                                                        );
                                                    })}
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
