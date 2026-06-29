'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useGetAllRolesQuery } from '@/store/rtkQueries/rolesPermissionsApi';
import type { IStaffMember } from '@/types/rolesPermissions';

const labelCls = 'block text-sm font-medium text-gray-700 mb-1';
const selectCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

export function AssignStaffRoleModal() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const staff: IStaffMember | null = data?.staff ?? null;

    const [roleId, setRoleId] = useState(staff?.role ?? '');
    const { data: rolesData } = useGetAllRolesQuery();
    const roles = rolesData?.data ?? [];

    useEffect(() => {
        if (isOpen && staff) setRoleId(staff.role);
    }, [isOpen, staff]);

    const onClose = () => dispatch(closeModal());

    const handleSubmit = () => onClose();

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="md">
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-xl font-bold">Assign Role</p>
                    <p className="text-sm font-normal text-muted-foreground">
                        Change the role for {staff?.name ?? 'this staff member'}.
                    </p>
                </ModalHeader>

                <ModalBody className="py-4">
                    <label className={labelCls}>Role</label>
                    <select
                        className={selectCls}
                        value={roleId}
                        onChange={(e) => setRoleId(e.target.value)}
                    >
                        {roles.map((r) => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </ModalBody>

                <ModalFooter>
                    <Button variant="light" onPress={onClose}>Cancel</Button>
                    <Button color="primary" onPress={handleSubmit} isDisabled={!roleId}>
                        Assign Role
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
