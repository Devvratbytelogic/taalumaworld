'use client';

import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { useAddChapterToCartMutation } from '@/store/rtkQueries/userPostAPI';
import { useGetCartQuery } from '@/store/rtkQueries/userGetAPI';
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { useAuth } from '@/hooks/useAuth';
import { getCartRoutePath } from '@/routes/routes';
import { VISIBLE } from '@/constants/contentMode';

interface AddToCartButtonProps {
    id?: string;
    type?: string;
    className?: string;
    label?: string;
    goToCartLabel?: string;
    onSuccess?: () => void;
    /** Called when user cancels the login-required modal (e.g. reopen chapter details). */
    onLoginCancel?: () => void;
}

export default function AddToCartButton({
    id,
    type,
    className = 'global_btn rounded_full outline_primary w-full',
    label = 'Add to Cart',
    goToCartLabel = 'Go to Cart',
    onSuccess,
    onLoginCancel,
}: AddToCartButtonProps) {
    const dispatch = useDispatch();
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [addChapterToCart, { isLoading }] = useAddChapterToCartMutation();
    const { data: cartResponse } = useGetCartQuery(undefined, { skip: !isAuthenticated });

    const cartItems = cartResponse?.data?.[0]?.cart_item ?? [];
    const isInCart = !!id && cartItems.some((item) => type === VISIBLE.CHAPTER ? item.chapter_id === id : item.book_id === id);

    const handleGoToCart = () => {
        dispatch(closeModal());
        router.push(getCartRoutePath());
    };

    const openLogin = () => {
        dispatch(openModal({
            componentName: 'LoginRequiredModal',
            data: {
                action: 'cart',
                itemType: type,
                onSuccess: handleAddToCart,
                ...(onLoginCancel ? { onCancel: onLoginCancel } : {}),
            },
        }));
    };

    const handleAddToCart = async () => {
        try {
            const res = await addChapterToCart({
                ...(id && type === VISIBLE.CHAPTER ? { chapter_id: id } : { book_id: id }),
                type,
            }).unwrap();

            if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                toast.success(res.message ?? 'Added to cart!');
                onSuccess?.();
            }
        } catch (error) {
            console.log('error adding to cart', error);
        }
    };

    if (isInCart) {
        return (
            <Button
                onPress={handleGoToCart}
                className={className}
                startContent={<ShoppingCart className="h-5 w-5" />}
            >
                {goToCartLabel}
            </Button>
        );
    }

    return (
        <Button
            onPress={isAuthenticated ? handleAddToCart : openLogin}
            className={className}
            isLoading={isLoading}
            startContent={!isLoading && <ShoppingCart className="h-5 w-5" />}
        >
            {label}
        </Button>
    );
}
