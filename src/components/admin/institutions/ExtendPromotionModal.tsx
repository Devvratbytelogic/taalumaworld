'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from '@heroui/react';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { useExtendPromotionalPeriodMutation } from '@/store/rtkQueries/institutionApi';
import type { IInstitution } from '@/types/institution';
import toast from '@/utils/toast';

const inputCls =
    'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary';

function formatDate(iso?: string) {
    if (!iso) return '—';
    return new Date(iso).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export function ExtendPromotionModal() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const institution: IInstitution | null = data?.institution ?? null;

    const currentEnd = institution?.promotional_access?.end_date?.substring(0, 10) ?? '';
    const [newEnd, setNewEnd] = useState(currentEnd);

    const [extendPeriod, { isLoading }] = useExtendPromotionalPeriodMutation();

    const onClose = () => dispatch(closeModal());

    const handleExtend = async () => {
        if (!institution) return;
        try {
            await extendPeriod({ id: institution._id, end_date: newEnd }).unwrap();
            toast.success('Promotional period extended');
            onClose();
        } catch {
            // handled by RTK layer
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            className="modal_container"
            size="md"
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <p className="text-lg font-bold">Extend Promotional Period</p>
                    {institution && (
                        <p className="text-sm font-normal text-muted-foreground">
                            {institution.name}
                        </p>
                    )}
                </ModalHeader>

                <ModalBody className="space-y-4 py-4">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">Current End Date</p>
                        <p className="text-sm font-medium">
                            {formatDate(institution?.promotional_access?.end_date)}
                        </p>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-500 mb-1">
                            New End Date <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="date"
                            min={currentEnd}
                            value={newEnd}
                            onChange={(e) => setNewEnd(e.target.value)}
                            className={inputCls}
                        />
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button variant="bordered" onPress={onClose} isDisabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        color="primary"
                        isDisabled={!newEnd || newEnd <= currentEnd || isLoading}
                        isLoading={isLoading}
                        onPress={handleExtend}
                    >
                        Extend Period
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
