'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Heart } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import { useAddToWishlistMutation, useRemoveFromWishlistMutation } from '@/store/rtkQueries/userPostAPI';
import { useAuth } from '@/hooks/useAuth';
import { openModal } from '@/store/slices/allModalSlice';
import { VISIBLE } from '@/constants/contentMode';

interface WishlistButtonProps {
    itemId: string;
    type?: string;
    isWishlisted?: boolean;
    className?: string;
}

export default function WishlistButton({
    itemId,
    type = 'book',
    isWishlisted = false,
    className = 'absolute top-3.5 left-3.5 z-2 backdrop-blur-sm bg-white/90 rounded-full h-9! w-9! min-w-9! p-0!',
}: WishlistButtonProps) {
    const dispatch = useDispatch();
    const { isAuthenticated } = useAuth();
    const [wishlisted, setWishlisted] = useState(isWishlisted);
    const [addToWishlist, { isLoading: isAdding }] = useAddToWishlistMutation();
    const [removeFromWishlist, { isLoading: isRemoving }] = useRemoveFromWishlistMutation();

    const handleToggle = async () => {
        if (!isAuthenticated) {
            dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action: 'wishlist', itemType: type } }));
            return;
        }

        try {
            if (wishlisted) {
                await removeFromWishlist({wishlistItemId: itemId, type}).unwrap();
                setWishlisted(false);
                toast.success('Removed from wishlist');
            } else {
                await addToWishlist({
                    type,
                    item_id: itemId,
                }).unwrap();
                setWishlisted(true);
                toast.success('Added to wishlist');
            }
        } catch (error) {
            console.error('Error adding to wishlist', error);
        }
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Button
                isIconOnly
                onPress={handleToggle}
                className={className}
                isLoading={isAdding || isRemoving}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
            >
                <Heart className={`h-4 w-4 ${wishlisted ? 'fill-red-500 text-red-500' : 'text-gray-700'}`} />
            </Button>
        </div>
    );
}
