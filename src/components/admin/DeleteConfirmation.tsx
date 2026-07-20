'use client';

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import Button from '@/components/ui/Button';

export default function DeleteConfirmation() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const returnTo = data?.returnTo as { componentName: string; data?: unknown } | undefined;
    const [isLoading, setIsLoading] = useState(false);

    const onClose = () => {
        if (returnTo?.componentName) {
            dispatch(openModal({ componentName: returnTo.componentName, data: returnTo.data }));
            return;
        }
        dispatch(closeModal());
    };

    const handleDelete = async () => {
        if (!data?.onDelete) return;

        setIsLoading(true);
        try {
            await data.onDelete();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            classNames={{
                base: 'rounded-3xl',
                wrapper: 'px-4',
                body: 'py-2',
                footer: 'pt-0 pb-5 px-5',
            }}
        >
            <ModalContent>
                <ModalBody className="pt-6! px-5!">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-danger/10">
                            <Trash2 className="h-6 w-6 text-danger" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-1">Are you sure?</h2>
                            <p className="text-sm text-muted-foreground">
                                You are about to delete{' '}
                                <span className="font-medium text-foreground">
                                    &ldquo;{data?.itemName ?? 'this item'}&rdquo;
                                </span>
                                . This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter className="flex gap-3 mt-4">
                    <Button
                        className="global_btn rounded_full outline_primary flex-1"
                        onPress={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="global_btn rounded_full bg-danger text-white flex-1"
                        onPress={handleDelete}
                        isLoading={isLoading}
                        startContent={<Trash2 className="h-4 w-4" />}
                    >
                        Delete
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
