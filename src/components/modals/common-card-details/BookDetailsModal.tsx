'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { BadgeCheck, BookOpen, Eye, ShoppingCart, Tag, User } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import AddToCartButton from '@/components/ui/AddToCartButton';
import ImageComponent from '@/components/ui/ImageComponent';
import ShareButtons from '@/components/blueprint/ShareButtons';
import { FacebookIcon, LinkedinIcon } from '@/components/ui/AllSVG';
import { useAuth } from '@/hooks/useAuth';
import { VISIBLE } from '@/constants/contentMode';
import { getCartRoutePath, getSeriesRoutePath } from '@/routes/routes';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';


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

    const displayPrice = book?.effectivePrice;
    const canAccessFull = book?.isFree || book?.canRead;

    const openLogin = (action: string, itemType: string) => {
        dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action, itemType } }));
    };

    const goToCart = () => {
        dispatch(closeModal());
        router.push(getCartRoutePath());
    };

    const viewFullDetails = () => {
        onClose();
        router.push(getSeriesRoutePath(book?.slug ?? ''));
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
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-primary/10 text-primary rounded-full px-4 py-1 text-xs border-primary/20">
                            Full Series
                        </Badge>
                        {book?.isFree ? (
                            <Badge className="text-success border-success/20 bg-success/10 rounded-full px-4 py-1 text-xs">
                                Free
                            </Badge>
                        ) : null}
                        {!!book?.chapterCount && (
                            <Badge variant="outline" className="rounded-full px-3 py-1 text-xs">
                                <BookOpen className="h-3 w-3 mr-1 shrink-0" />
                                <span>{book?.chapterCount} blueprints</span>
                            </Badge>
                        )}
                    </div>

                    <div>
                        <h2 className="font-semibold text-xl tracking-tight">{book?.title}</h2>
                        {book?.description && (
                            <p className="text-sm text-muted-foreground mt-1 tracking-tight">{book?.description}</p>
                        )}
                    </div>

                    {book?.mentor && (
                        <div className="border flex items-center gap-3 rounded-md bg-muted/40 p-3">
                            <div className="w-11 h-11 rounded-full overflow-hidden border bg-linear-to-br from-primary/20 to-primary/5 ring-2 ring-background shrink-0 flex items-center justify-center">
                                {book?.mentor?.profile_pic ? (
                                    <ImageComponent src={book?.mentor?.profile_pic} alt={book?.mentor?.name ?? ''} object_cover={true} />
                                ) : (
                                    <User className="h-5 w-5 text-primary" />
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1">
                                    <p className="text-sm font-semibold truncate tracking-tight">{book?.mentor?.name}</p>
                                    {(book?.mentor?.is_verified || book?.mentor?.is_mentor_verified) && (
                                        <BadgeCheck className="h-3.5 w-3.5 text-primary shrink-0" aria-label="Verified mentor" />
                                    )}
                                </div>
                                <p className="text-xs text-muted-foreground">Blueprint Mentor</p>
                            </div>

                            {(book?.mentor?.linkedin || book?.mentor?.facebook) && (
                                <div className="flex items-center gap-1.5 shrink-0">
                                    {book?.mentor?.linkedin && (
                                        <a
                                            href={book?.mentor?.linkedin}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${book?.mentor?.name} on LinkedIn`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 rounded-full bg-white text-muted-foreground border border-border hover:border-primary/40 hover:text-primary transition-colors"
                                        >
                                            <LinkedinIcon className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                    {book?.mentor?.facebook && (
                                        <a
                                            href={book?.mentor?.facebook}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            aria-label={`${book?.mentor?.name} on Facebook`}
                                            onClick={(e) => e.stopPropagation()}
                                            className="p-2 rounded-full bg-white text-muted-foreground border border-border hover:border-primary/40 hover:text-primary transition-colors"
                                        >
                                            <FacebookIcon className="h-3.5 w-3.5" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {book?.tags && book?.tags?.length > 0 && (
                        <div className="space-y-2">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                                <Tag className="h-3.5 w-3.5" />
                                <span>Topics covered</span>
                            </div>
                            <div className="flex items-center gap-2 flex-wrap">
                                {book?.tags?.map((tag: string) => (
                                    <Badge key={tag} variant="secondary" className="rounded-full px-3 py-1 text-xs font-medium">
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="border-t pt-3">
                        <h3 className="font-semibold text-sm mb-2 tracking-tight">Share this Series</h3>
                        <ShareButtons
                            shareableLink={book?.shareable_link ?? ''}
                            title={book?.title ?? ''}
                            description={book?.description}
                            size="sm"
                            showCopyLink={true}
                        />
                    </div>
                </ModalBody>

                <ModalFooter className="flex gap-3 p-4 border-t bg-white shrink-0">
                    {canAccessFull ? (
                        <Button className="global_btn rounded_full bg_primary w-full" onPress={viewFullDetails} startContent={<BookOpen className="h-4 w-4" />}>
                            Start Reading
                        </Button>
                    ) : (
                        <>
                            <Button
                                className="global_btn rounded_full outline_primary shrink-0"
                                onPress={viewFullDetails}
                                startContent={<Eye className="h-4 w-4" />}
                            >
                                View Details
                            </Button>

                            {isAuthenticated
                                ? (book?.isCart
                                    ? <Button
                                        className="global_btn rounded_full bg_primary w-full"
                                        onPress={goToCart}
                                        startContent={<ShoppingCart className="h-4 w-4" />}
                                    >
                                        Go to Cart
                                    </Button>
                                    : <AddToCartButton
                                        id={book?.id}
                                        type={VISIBLE.BOOK}
                                        className="global_btn rounded_full bg_primary w-full"
                                        label={`Add to Cart - KSH ${displayPrice?.toFixed(2) ?? '0.00'}`}
                                        onSuccess={goToCart}
                                    />)
                                : <Button
                                    className="global_btn rounded_full bg_primary w-full"
                                    onPress={() => openLogin('cart', VISIBLE.BOOK)}
                                    startContent={<ShoppingCart className="h-4 w-4" />}
                                >
                                    Add to Cart - KSH {displayPrice?.toFixed(2) ?? '0.00'}
                                </Button>}
                        </>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
