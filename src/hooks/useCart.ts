import { useAppSelector, useAppDispatch } from '../store/hooks';
import { 
  addToCart as addToCartAction,
  removeFromCart as removeFromCartAction,
  clearCart as clearCartAction,
  selectCartItems,
  selectCartCount,
} from '../store/slices/cartSlice';
import toast from '@/utils/toast';

export function useCart() {
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  const cartCount = useAppSelector(selectCartCount);
  
  const addToCart = (chapterId: string, bookId: string, ownedChapters?: string[]) => {
    // Check if already owned
    if (ownedChapters && ownedChapters.includes(chapterId)) {
      toast('Already Owned — You already own this chapter.');
      return;
    }
    // Check if already in cart
    dispatch(addToCartAction({ id: chapterId, type: 'chapter', bookId }));
    toast.success(`Added to Cart: ${chapterId}`);
  };

  const removeFromCart = (chapterId: string) => {
    dispatch(removeFromCartAction(chapterId));
    toast.success(`Removed from Cart: ${chapterId}`);
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