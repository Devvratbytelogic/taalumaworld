'use client';

import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import { useAddChapterToCartMutation } from '@/store/rtkQueries/userPostAPI';
import { VISIBLE } from '@/constants/contentMode';

interface AddToCartButtonProps {
    id?: string;
    bookId?: string;
    type?: string;
    className?: string;
    label?: string;
    onSuccess?: () => void;
}

export default function AddToCartButton({
    id,
    type,
    className = 'global_btn rounded_full outline_primary w-full',
    label = 'Add to Cart',
    onSuccess,
}: AddToCartButtonProps) {
    const [addChapterToCart, { isLoading }] = useAddChapterToCartMutation();

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

    return (
        <Button
            onPress={handleAddToCart}
            className={className}
            isLoading={isLoading}
            startContent={!isLoading && <ShoppingCart className="h-5 w-5" />}
        >
            {label}
        </Button>
    );
}
