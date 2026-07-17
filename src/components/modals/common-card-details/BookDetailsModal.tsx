'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { BookOpen, Eye, Lock, ShoppingCart, User } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import AddToCartButton from '@/components/ui/AddToCartButton';
import ImageComponent from '@/components/ui/ImageComponent';
import { useAuth } from '@/hooks/useAuth';
import { VISIBLE } from '@/constants/contentMode';
import { getBlueprintRoutePath, getCartRoutePath, getSeriesRoutePath } from '@/routes/routes';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { IHomeAllContentItem } from '@/types/user/HomeAllChapters';


const modalClassNames = {
    base: 'max-w-xl rounded-3xl overflow-hidden',
    wrapper: 'px-6 py-12',
    body: 'p-0',
    footer: 'p-0',
    closeButton: 'z-10 bg-white/90 backdrop-blur-sm rounded-full! right-2 top-2',
};

export default function BookDetailsModal() {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isOpen, data } = useSelector((state: RootState) => state.allModal);
    const { isAuthenticated } = useAuth();
    const book = data?.chapter;

    const onClose = () => dispatch(closeModal());
    const bookChapters = book?.chapters ?? [];
    const isFullBook = book?.pricingModel === VISIBLE.BOOK;
    const hasPrice = book?.price > 0;

    const openLogin = (action: string, itemType: string) => {
        dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action, itemType } }));
    };

    const goToCart = () => {
        dispatch(closeModal());
        router.push(getCartRoutePath());
    };

    const viewFullDetails = () => {
        onClose();
        router.push(getSeriesRoutePath(book?.slug ?? book?.id));
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} className="modal_container" size="xl" classNames={modalClassNames}>
            <ModalContent>
                {book?.coverImage && (
                    <div className="relative shrink-0 bg-muted flex justify-center py-6">
                        <div className="w-40 aspect-3/4 rounded-2xl overflow-hidden shadow-lg">
                            <ImageComponent src={book?.coverImage} alt={book?.title} object_cover={false} />
                        </div>
                    </div>
                )}

                <ModalBody className="p-6! space-y-4 overflow-y-auto max-h-[30vh] sm:max-h-[40vh] custom_scrollbar min-w-0">
                    
                </ModalBody>

                <ModalFooter className="flex gap-3 p-4 border-t bg-white shrink-0">
                    
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
