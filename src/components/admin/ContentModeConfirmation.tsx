'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import Button from '@/components/ui/Button';

export default function ContentModeConfirmation() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const [isLoading, setIsLoading] = useState(false);
    const modeLabel = data?.modeLabel ?? 'Books';

    const onClose = () => {
        if (!isLoading) dispatch(closeModal());
    };

    const handleConfirm = async () => {
        if (!data?.onConfirm) return;

        setIsLoading(true);
        try {
            await data.onConfirm();
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
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-primary/10">
                            <BookOpen className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-1">Confirm Mode Change</h2>
                            <p className="text-sm text-muted-foreground">
                                Are you sure you want to switch to {modeLabel} Mode? This will change the content displayed to visitors on the website.
                            </p>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter className="flex gap-3 mt-4">
                    <Button
                        className="global_btn rounded_full outline_primary flex-1"
                        onPress={onClose}
                        isDisabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="global_btn rounded_full bg_primary flex-1"
                        onPress={handleConfirm}
                        isLoading={isLoading}
                    >
                        Confirm
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
