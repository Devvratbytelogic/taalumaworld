'use client';

import { useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import Button from '@/components/ui/Button';

export default function RestoreConfirmation() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const [isLoading, setIsLoading] = useState(false);

    const handleRestore = async () => {
        if (!data?.onRestore) return;

        setIsLoading(true);
        try {
            await data.onRestore();
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={() => dispatch(closeModal())}
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
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-green-600/10">
                            <RotateCcw className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-1">Restore this item?</h2>
                            <p className="text-sm text-muted-foreground">
                                You are about to restore{' '}
                                <span className="font-medium text-foreground">
                                    &ldquo;{data?.itemName ?? 'this item'}&rdquo;
                                </span>
                                . It will be moved back to the active list.
                            </p>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter className="flex gap-3 mt-4">
                    <Button
                        className="global_btn rounded_full outline_primary flex-1"
                        onPress={() => dispatch(closeModal())}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="global_btn rounded_full bg-green-600 text-white flex-1"
                        onPress={handleRestore}
                        isLoading={isLoading}
                        startContent={<RotateCcw className="h-4 w-4" />}
                    >
                        Restore
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
