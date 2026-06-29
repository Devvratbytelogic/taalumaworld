'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useGetAllRolesQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import type { IStaffFormValues } from '@/types/rolesPermissions';

const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';
const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const selectCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

const EMPTY: IStaffFormValues = { name: '', email: '', role: '' };

export function AddStaffModal() {
    const dispatch = useDispatch();
    const { isOpen } = useSelector((state: RootState) => state.allModal);
    const [values, setValues] = useState<IStaffFormValues>(EMPTY);

    const { data: rolesData } = useGetAllRolesQuery();
    const roles = rolesData?.data ?? [];

    useEffect(() => {
        if (isOpen) {
            setValues({ ...EMPTY, role: roles[0]?.id ?? '' });
        }
    }, [isOpen, roles]);

    const onClose = () => dispatch(closeModal());

    const isValid = values.name.trim() && values.email.trim() && values.role;

    const handleSubmit = () => onClose();

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="md">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-xl font-bold">Add Staff Member</p>
                    <p className="text-sm font-normal text-muted-foreground">
                        Assign a role to a new administrator or mentor.
                    </p>
                </ModalHeader>

                <ModalBody className="space-y-4 py-4">
                    <div>
                        <label className={labelCls}>
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls}
                            value={values.name}
                            onChange={(e) => setValues((p) => ({ ...p, name: e.target.value }))}
                            placeholder="e.g. Jane Doe"
                        />
                    </div>
                    <div>
                        <label className={labelCls}>
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            className={inputCls}
                            type="email"
                            value={values.email}
                            onChange={(e) => setValues((p) => ({ ...p, email: e.target.value }))}
                            placeholder="name@taaluma.world"
                        />
                    </div>
                    <div>
                        <label className={labelCls}>
                            Role <span className="text-red-500">*</span>
                        </label>
                        <select
                            className={selectCls}
                            value={values.role}
                            onChange={(e) => setValues((p) => ({ ...p, role: e.target.value }))}
                        >
                            {roles.map((r) => (
                                <option key={r.id} value={r.id}>{r.name}</option>
                            ))}
                        </select>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onPress={onClose}>Cancel</Button>
                    <Button color="primary" onPress={handleSubmit} isDisabled={!isValid}>
                        Add Staff
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
