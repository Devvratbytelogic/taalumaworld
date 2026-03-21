'use client';

import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import Button from '@/components/ui/Button';
import { useAddChapterToCartMutation } from '@/store/rtkQueries/userPostAPI';

interface AddToCartButtonProps {
    chapterId: string;
    bookId?: string;
    type?: string;
    price?: number;
    className?: string;
    label?: string;
    onSuccess?: () => void;
}

export default function AddToCartButton({
    chapterId,
    bookId,
    type = 'book',
    price,
    className = 'global_btn rounded_full outline_primary w-full',
    label = 'Add to Cart',
    onSuccess,
}: AddToCartButtonProps) {
    const [addChapterToCart, { isLoading }] = useAddChapterToCartMutation();

    const handleAddToCart = async () => {
        try {
            await addChapterToCart({
                chapter_id: chapterId,
                ...(bookId && { book_id: bookId }),
                type,
                ...(price !== undefined && { price: String(price) }),
            }).unwrap();

            toast.success('Added to cart!');
            onSuccess?.();
        } catch {
            // toast.error('Failed to add to cart', {
            //     description: 'Please try again or contact support.',
            // });
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
