'use client';

import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { BookOpen, Lock, ShoppingCart, User } from 'lucide-react';
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react';
import { Badge } from '@/components/ui/badge';
import Button from '@/components/ui/Button';
import AddToCartButton from '@/components/ui/AddToCartButton';
import ImageComponent from '@/components/ui/ImageComponent';
import { useAuth } from '@/hooks/useAuth';
import { VISIBLE } from '@/constants/contentMode';
import { getCartRoutePath, getReadBookRoutePath, getReadChapterRoutePath } from '@/routes/routes';
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

    const readBook = () => {
        onClose();
        router.push(getReadBookRoutePath(book?.id));
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
                    <div className="space-y-2 min-w-0">
                        {book.category?.name && (
                            <Badge variant="outline" className="rounded-full px-3 py-1 text-sm font-medium">
                                {book?.category?.name}
                            </Badge>
                        )}
                        <h2 className="text-2xl font-semibold leading-tight tracking-tight wrap-break-word">{book?.title}</h2>
                        {book?.description && (
                            <p className="text-sm text-muted-foreground leading-relaxed tracking-tight wrap-break-word line-clamp-3">
                                {book?.description}
                            </p>
                        )}
                        {book?.author && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground tracking-tight">
                                {book?.authorAvatar ? (
                                    <div className="h-7 w-7 rounded-full overflow-hidden shrink-0">
                                        <ImageComponent src={book?.authorAvatar} alt={book?.author} object_cover={true} />
                                    </div>
                                ) : (
                                    <User className="h-4 w-4 shrink-0" />
                                )}
                                <span className="truncate">{book?.author}</span>
                            </div>
                        )}
                    </div>

                    {isFullBook && hasPrice && (
                        <div className="flex items-center justify-between p-4 bg-accent/40 rounded-2xl border border-border">
                            <div>
                                <p className="font-semibold text-sm tracking-tight">Complete Series</p>
                                <p className="text-sm text-muted-foreground">Access all {book?.chapterCount} blueprints</p>
                            </div>
                            <span className="font-bold text-2xl text-primary">KSH {book?.price?.toFixed(2) ?? '0.00'}</span>
                        </div>
                    )}

                    {!isFullBook && (
                        <div className="p-4 bg-accent/40 rounded-2xl border border-border">
                            <p className="font-semibold text-sm tracking-tight mb-0.5">Purchase Options</p>
                            <p className="text-sm text-muted-foreground">Purchase individual blueprints below</p>
                        </div>
                    )}

                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <BookOpen className="h-4 w-4 text-primary" />
                            <h3 className="font-semibold text-sm tracking-tight">
                                Blueprints {book.chapterCount > 0 ? `(${book.chapterCount})` : bookChapters.length > 0 ? `(${bookChapters.length})` : ''}
                            </h3>
                        </div>

                        {bookChapters && bookChapters?.length > 0 ? (
                            <div className="space-y-2">
                                {bookChapters?.map((item: IHomeAllContentItem, index: number) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-2xl border border-border hover:bg-accent/30 transition-colors">
                                        {item?.coverImage && (
                                            <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
                                                <ImageComponent src={item?.coverImage} alt={item?.title} object_cover={true} />
                                            </div>
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-2 py-0 text-sm mb-0.5">
                                                Blueprint {item?.chapterNumber ?? item?.blueprintNumber}
                                            </Badge>
                                            <p className="font-medium text-sm line-clamp-1 tracking-tight">{item?.title}</p>
                                            {item?.description && (
                                                <p className="text-sm text-muted-foreground line-clamp-1 tracking-tight">{item?.description}</p>
                                            )}
                                        </div>
                                        <div className="shrink-0">
                                            {item?.canRead ? (
                                                <Button
                                                    className="global_btn rounded_full bg_primary text-sm px-3 py-1 h-auto min-h-0"
                                                    onPress={() => {
                                                        dispatch(closeModal());
                                                        router.push(getReadChapterRoutePath(item?.slug ?? item?.id));
                                                    }}
                                                >
                                                    Read
                                                </Button>
                                            ) : isFullBook ? (
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-muted">
                                                    <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                                                </div>
                                            ) : !isAuthenticated ? (
                                                <Button
                                                    className="global_btn rounded_full outline_primary text-sm px-3 py-1 h-auto min-h-0"
                                                    onPress={() => openLogin('read', 'chapter')}
                                                >
                                                    KSH {item?.price?.toFixed(2) ?? '0.00'}
                                                </Button>
                                            ) : item?.isCart ? (
                                                <Button
                                                    className="global_btn rounded_full outline_primary text-sm px-3 py-1 h-auto min-h-0"
                                                    onPress={goToCart}
                                                    startContent={<ShoppingCart className="h-3.5 w-3.5" />}
                                                >
                                                    Go to Cart
                                                </Button>
                                            ) : (
                                                <AddToCartButton
                                                    chapterId={item?.id}
                                                    bookId={book?.id}
                                                    type="chapter"
                                                    price={item?.price}
                                                    className="global_btn rounded_full outline_primary text-sm px-3 py-1 h-auto min-h-0"
                                                    label={`KSH ${item?.price?.toFixed(2) ?? '0.00'}`}
                                                    onSuccess={goToCart}
                                                />
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-muted-foreground py-2">No blueprints available yet.</p>
                        )}
                    </div>

                    {book?.author && (
                        <div className="border-t pt-3">
                            <h3 className="font-semibold text-sm mb-2 tracking-tight">About the Mentor</h3>
                            <div className="flex items-start gap-3">
                                {book?.authorAvatar ? (
                                    <div className="h-10 w-10 rounded-full object-cover shrink-0">
                                        <ImageComponent src={book?.authorAvatar} alt={book?.author} object_cover={true} />
                                    </div>
                                ) : (
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                        <User className="h-5 w-5 text-primary" />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="font-medium text-sm tracking-tight">{book?.author}</p>
                                    {book?.authorBio && (
                                        <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">{book?.authorBio}</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </ModalBody>

                <ModalFooter className="flex gap-3 p-4 border-t bg-white shrink-0">
                    {isFullBook && hasPrice ? (
                        book?.isPurchased ? (
                            <Button className="global_btn rounded_full bg_primary w-full" onPress={readBook} startContent={<BookOpen className="h-4 w-4" />}>
                                Read Series
                            </Button>
                        ) : !isAuthenticated ? (
                            <Button
                                className="global_btn rounded_full bg_primary w-full"
                                onPress={() => openLogin('cart', 'book')}
                                startContent={<ShoppingCart className="h-4 w-4" />}
                            >
                                Buy Complete Series - KSH {book.price.toFixed(2)}
                            </Button>
                        ) : book?.isCart ? (
                            <Button className="global_btn rounded_full bg_primary w-full" onPress={goToCart} startContent={<ShoppingCart className="h-4 w-4" />}>
                                Go to Cart
                            </Button>
                        ) : (
                            // complete series add to cart button
                            <AddToCartButton
                                bookId={book?.id}
                                type="book"
                                price={book?.price}
                                className="global_btn rounded_full bg_primary w-full"
                                label={`Buy Complete Series - KSH ${book?.price?.toFixed(2) ?? '0.00'}`}
                                onSuccess={goToCart}
                            />
                        )
                    ) : (
                        <Button className="global_btn rounded_full bg_primary w-full" onPress={readBook} startContent={<BookOpen className="h-4 w-4" />}>
                            Read Series
                        </Button>
                    )}
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}
