import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  selectCartItems,
  selectCartCount,
  selectIsInCart,
} from '../store/slices/cartSlice';
import { useGetAllChaptersQuery } from '../store/api/chaptersApi';
import { toast } from 'sonner@2.0.3';

export interface CartItem {
  chapterId: string;
  bookId: string;
}

export function useCart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  
  // Get chapters from RTK Query
  const { data: chapters = [] } = useGetAllChaptersQuery();

  const addToCart = (chapterId: string, bookId: string, ownedChapters?: string[]) => {
    // Validate chapter exists using RTK Query data
    const chapter = chapters.find(c => c.id === chapterId);
    if (!chapter) {
      console.error('Chapter not found:', chapterId);
      toast.error('Unable to add to cart', {
        description: 'This chapter does not exist.',
      });
      return;
    }

    // Check if already owned
    if (ownedChapters && ownedChapters.includes(chapterId)) {
      toast.info('Already Owned', {
        description: 'You already own this chapter.',
      });
      return;
    }

    // Check if free chapter
    if (chapter.isFree) {
      toast.info('Free Chapter', {
        description: 'This chapter is free - no purchase needed!',
      });
      return;
    }

    // Check if already in cart
    if (cartItems.some(item => item.chapterId === chapterId)) {
      toast.info('Already in Cart', {
        description: 'This chapter is already in your cart.',
      });
      return;
    }

    // Add to cart
    dispatch(addToCartAction({ chapterId, bookId }));
    toast.success('Added to Cart', {
      description: chapter.title,
    });
  };

  const removeFromCart = (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    dispatch(removeFromCartAction(chapterId));
    toast.success('Removed from Cart', {
      description: chapter?.title || 'Chapter removed',
    });
  };

  const clearCart = () => {
    dispatch(clearCartAction());
  };

  const isInCart = (chapterId: string) => {
    return cartItems.some(item => item.chapterId === chapterId);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart,
    isInCart,
    cartCount,
  };
}