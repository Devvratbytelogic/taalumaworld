'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@heroui/react';
import { RotateCcw, Save, Search, Shield, Lock } from 'lucide-react';
import { useGetPermissionsMatrixQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import type { IPermission } from '@/types/rolesPermissions';
import { Badge } from '@/components/ui/badge';
import toast from '@/utils/toast';

export function PermissionsMatrixTab() {
    const { data, isLoading, isFetching } = useGetPermissionsMatrixQuery();

    const matrixData = data?.data;
    const roles = matrixData?.roles ?? [];
    const permissions = matrixData?.permissions ?? [];

    const [localMatrix, setLocalMatrix] = useState<Record<string, string[]>>({});
    const [dirty, setDirty] = useState(false);
    const [selectedRoleId, setSelectedRoleId] = useState<string>('');
    const [roleSearch, setRoleSearch] = useState('');
    const [permSearch, setPermSearch] = useState('');

    useEffect(() => {
        if (matrixData?.matrix) {
            setLocalMatrix(matrixData.matrix);
            setDirty(false);
        }
    }, [matrixData]);

    useEffect(() => {
        if (roles.length && !selectedRoleId) {
            setSelectedRoleId(roles[0].id);
        }
    }, [roles, selectedRoleId]);

    const permissionsByCategory = useMemo(() => {
        const grouped: Record<string, IPermission[]> = {};
        for (const p of permissions) {
            if (!grouped[p.category]) grouped[p.category] = [];
            grouped[p.category].push(p);
        }
        return grouped;
    }, [permissions]);

    const filteredRoles = useMemo(() => {
        const q = roleSearch.trim().toLowerCase();
        if (!q) return roles;
        return roles.filter((r) => r.name.toLowerCase().includes(q));
    }, [roles, roleSearch]);

    const selectedRole = roles.find((r) => r.id === selectedRoleId);
    const rolePermissions = localMatrix[selectedRoleId] ?? [];

    const filteredPermissionsByCategory = useMemo(() => {
        const q = permSearch.trim().toLowerCase();
        if (!q) return permissionsByCategory;

        const filtered: Record<string, IPermission[]> = {};
        for (const [category, perms] of Object.entries(permissionsByCategory)) {
            const matches = perms.filter(
                (p) =>
                    p.name.toLowerCase().includes(q) ||
                    p.description.toLowerCase().includes(q) ||
                    category.toLowerCase().includes(q)
            );
            if (matches.length) filtered[category] = matches;
        }
        return filtered;
    }, [permissionsByCategory, permSearch]);

    const toggle = (permissionId: string) => {
        if (!selectedRoleId) return;
        setDirty(true);
        setLocalMatrix((prev) => {
            const current = prev[selectedRoleId] ?? [];
            const next = current.includes(permissionId)
                ? current.filter((id) => id !== permissionId)
                : [...current, permissionId];
            return { ...prev, [selectedRoleId]: next };
        });
    };

    const toggleCategory = (categoryPerms: IPermission[], enable: boolean) => {
        if (!selectedRoleId) return;
        setDirty(true);
        const ids = categoryPerms.map((p) => p.id);
        setLocalMatrix((prev) => {
            const current = prev[selectedRoleId] ?? [];
            const next = enable
                ? [...new Set([...current, ...ids])]
                : current.filter((id) => !ids.includes(id));
            return { ...prev, [selectedRoleId]: next };
        });
    };

    const handleSave = () => {
        toast.success('Permissions updated (preview only — API not connected)');
        setDirty(false);
    };

    const handleReset = () => {
        if (matrixData?.matrix) {
            setLocalMatrix(matrixData.matrix);
            setDirty(false);
        }
    };

    const loading = isLoading || isFetching;

    if (loading) {
        return (
            <div className="bg-white rounded-3xl shadow-sm p-8 space-y-4">
                {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 bg-gray-100 rounded animate-pulse" />
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">
                        Select a role, then toggle permissions. Works cleanly with any number of roles.
                    </p>
                    <p className="text-xs text-muted-foreground">
                        {roles.length} roles · {permissions.length} permissions
                    </p>
                </div>
                <div className="flex gap-2 shrink-0">
                    <Button
                        variant="bordered"
                        className="rounded-xl"
                        startContent={<RotateCcw className="h-4 w-4" />}
                        onPress={handleReset}
                        isDisabled={!dirty}
                    >
                        Reset
                    </Button>
                    <Button
                        color="primary"
                        className="rounded-xl"
                        startContent={<Save className="h-4 w-4" />}
                        onPress={handleSave}
                        isDisabled={!dirty}
                    >
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 min-h-[520px]">
                {/* Role list */}
                <div className="lg:w-72 shrink-0 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    <div className="p-4 border-b border-gray-100 space-y-3">
                        <p className="text-sm font-semibold text-gray-800">Roles</p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <input
                                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                                placeholder="Search roles..."
                                value={roleSearch}
                                onChange={(e) => setRoleSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto max-h-[420px] lg:max-h-none p-2 space-y-1">
                        {filteredRoles.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-8">No roles found</p>
                        ) : (
                            filteredRoles.map((role) => {
                                const count = (localMatrix[role.id] ?? []).length;
                                const isSelected = role.id === selectedRoleId;
                                return (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setSelectedRoleId(role.id)}
                                        className={`w-full text-left rounded-xl px-3 py-2.5 transition-colors ${
                                            isSelected
                                                ? 'bg-primary/10 border border-primary/20'
                                                : 'hover:bg-gray-50 border border-transparent'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            {role.is_system ? (
                                                <Lock className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                            ) : (
                                                <Shield className="h-3.5 w-3.5 text-muted-foreground mt-0.5 shrink-0" />
                                            )}
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm font-medium text-gray-900 leading-snug truncate">
                                                    {role.name}
                                                </p>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {count} of {permissions.length} enabled
                                                </p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })
                        )}
                    </div>
                </div>

                {/* Permission editor */}
                <div className="flex-1 min-w-0 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                    {!selectedRole ? (
                        <div className="flex-1 flex items-center justify-center p-8 text-muted-foreground text-sm">
                            Select a role to manage its permissions
                        </div>
                    ) : (
                        <>
                            <div className="p-4 sm:p-5 border-b border-gray-100 space-y-3">
                                <div className="flex flex-wrap items-center gap-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{selectedRole.name}</h3>
                                    {selectedRole.is_system && (
                                        <Badge variant="secondary" className="text-xs">System</Badge>
                                    )}
                                    <Badge variant="outline" className="text-xs ml-auto">
                                        {rolePermissions.length} / {permissions.length} permissions
                                    </Badge>
                                </div>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        placeholder="Filter permissions..."
                                        value={permSearch}
                                        onChange={(e) => setPermSearch(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-6">
                                {Object.keys(filteredPermissionsByCategory).length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-8">
                                        No permissions match your search
                                    </p>
                                ) : (
                                    Object.entries(filteredPermissionsByCategory).map(([category, perms]) => {
                                        const enabledInCategory = perms.filter((p) =>
                                            rolePermissions.includes(p.id)
                                        ).length;
                                        const allEnabled = enabledInCategory === perms.length;

                                        return (
                                            <div key={category}>
                                                <div className="flex items-center justify-between gap-3 mb-2">
                                                    <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">
                                                        {category}
                                                        <span className="ml-2 font-normal normal-case">
                                                            ({enabledInCategory}/{perms.length})
                                                        </span>
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleCategory(perms, !allEnabled)}
                                                        className="text-xs text-primary hover:underline shrink-0"
                                                    >
                                                        {allEnabled ? 'Clear all' : 'Enable all'}
                                                    </button>
                                                </div>
                                                <div className="rounded-xl border border-gray-100 divide-y divide-gray-50">
                                                    {perms.map((perm) => {
                                                        const checked = rolePermissions.includes(perm.id);
                                                        return (
                                                            <label
                                                                key={perm.id}
                                                                className="flex items-start gap-3 p-3 cursor-pointer hover:bg-gray-50/60 transition-colors"
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={checked}
                                                                    onChange={() => toggle(perm.id)}
                                                                    className="h-4 w-4 mt-0.5 rounded border-gray-300 text-primary focus:ring-primary shrink-0"
                                                                />
                                                                <div className="min-w-0">
                                                                    <p className="text-sm font-medium text-gray-800">
                                                                        {perm.name}
                                                                    </p>
                                                                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                                                                        {perm.description}
                                                                    </p>
                                                                </div>
                                                            </label>
                                                        );
                                                    })}
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
