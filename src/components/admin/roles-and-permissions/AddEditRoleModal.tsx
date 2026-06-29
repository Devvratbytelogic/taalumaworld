'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import type { IRole, IRoleFormValues } from '@/types/rolesPermissions';

const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';

function buildInitial(role?: IRole | null): IRoleFormValues {
    return {
        name: role?.name ?? '',
        description: role?.description ?? '',
    };
}

export function AddEditRoleModal() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const role: IRole | null = data?.role ?? null;
    const isEdit = !!role;

    const [values, setValues] = useState<IRoleFormValues>(buildInitial(role));

    useEffect(() => {
        if (isOpen) setValues(buildInitial(role));
    }, [isOpen, role]);

    const onClose = () => dispatch(closeModal());

    const isValid = values.name.trim().length > 0;

    const handleSubmit = () => onClose();

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="lg" scrollBehavior="inside">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-xl font-bold">{isEdit ? 'Edit Role' : 'Create Role'}</p>
                    <p className="text-sm font-normal text-muted-foreground">
                        {isEdit
                            ? 'Update the role name and description.'
                            : 'Define a new role. Permissions can be configured in the Permissions Matrix tab.'}
                    </p>
                </ModalHeader>

                <ModalBody className="space-y-4 py-4">
                    <div>
                        <label className={labelCls}>
                            Role Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls}
                            value={values.name}
                            onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. Content Moderator"
                            disabled={isEdit && role?.is_system}
                        />
                        {isEdit && role?.is_system && (
                            <p className="mt-1 text-xs text-gray-500">System role names cannot be changed.</p>
                        )}
                    </div>
                    <div>
                        <label className={labelCls}>Description</label>
                        <textarea
                            className={`${inputCls} min-h-[80px] resize-y`}
                            value={values.description}
                            onChange={(e) => setValues((p) => ({ ...p, description: e.target.value }))}
                            placeholder="Describe what this role can do..."
                        />
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onPress={onClose}>Cancel</Button>
                    <Button color="primary" onPress={handleSubmit} isDisabled={!isValid}>
                        {isEdit ? 'Save Changes' : 'Create Role'}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
