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
import toast from '@/utils/toast';
import type { CartItem } from '../store/slices/cartSlice';

export type { CartItem };

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
      toast.error('Unable to add to cart. This chapter does not exist.');
      return;
    }

    // Check if already owned
    if (ownedChapters && ownedChapters.includes(chapterId)) {
      toast('Already Owned — You already own this chapter.');
      return;
    }

    // Check if free chapter
    if (chapter.isFree) {
      toast('Free Chapter — No purchase needed!');
      return;
    }

    // Check if already in cart
    if (cartItems.some(item => item.id === chapterId)) {
      toast('Already in Cart — This chapter is already in your cart.');
      return;
    }

    // Add to cart
    dispatch(addToCartAction({ id: chapterId, type: 'chapter', bookId }));
    toast.success(`Added to Cart: ${chapter.title}`);
  };

  const removeFromCart = (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    dispatch(removeFromCartAction(chapterId));
    toast.success(`Removed from Cart: ${chapter?.title ?? 'Chapter'}`);
  };

  const clearCart = () => {
    dispatch(clearCartAction());
    toast.success('Cart cleared');
  };

  const isInCart = (chapterId: string) => {
    return cartItems.some(item => item.id === chapterId);
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