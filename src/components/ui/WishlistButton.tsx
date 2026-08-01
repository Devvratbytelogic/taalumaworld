'use client';

import { useDispatch } from 'react-redux';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/store/rtkQueries/userPostAPI';
import { useGetWishlistQuery } from '@/store/rtkQueries/userGetAPI';
import { useAuth } from '@/hooks/useAuth';
import { openModal } from '@/store/slices/allModalSlice';

interface WishlistButtonProps {
    itemId: string;
    type?: string;
    className?: string;
}

export default function WishlistButton({
    itemId,
    type = 'Book',
    className = 'absolute top-3.5 left-3.5 z-2 backdrop-blur-sm bg-white/90 rounded-full h-9! w-9! min-w-9! p-0!',
}: WishlistButtonProps) {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
    const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();
    const { data: wishlistResponse } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });

    const wishlistItems = wishlistResponse?.data?.data ?? [];
    const isWishlisted = !!itemId && wishlistItems.some(
        (item) => item.item_id === itemId && item.type === type,
    );

    const openLogin = () => {
        dispatch(openModal({
            componentName: 'LoginRequiredModal',
            data: {
                action: 'wishlist',
                itemType: type,
                onSuccess: handleToggle,
            },
        }));
    };

    const handleToggle = async () => {
        try {
            if (isWishlisted) {
                const res = await removeFromWishlist({ wishlistItemId: itemId, type }).unwrap();
                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    toast.success(res.message ?? 'Removed from wishlist');
                }
            } else {
                const res = await addToWishlist({
                    type,
                    item_id: itemId,
                }).unwrap();
                if (res?.http_status_code === 200 || res?.http_status_code === 201) {
                    toast.success(res.message ?? 'Added to wishlist');
                }
            }
        } catch (error) {
            console.error('Error updating wishlist', error);
        }
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Button
                isIconOnly
                onPress={isAuthenticated ? handleToggle : openLogin}
                className={className}
                isLoading={isAdding || isRemoving}
                aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </Button>
        </div>
    );
}
