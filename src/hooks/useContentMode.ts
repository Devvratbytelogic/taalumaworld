import { useAppSelector, useAppDispatch } from '../store/hooks';
import { selectContentMode, setContentMode as setReduxContentMode, toggleContentMode as toggleReduxContentMode } from '../store/slices/contentModeSlice';

export type ContentMode = 'chapters' | 'books';

/**
 * Hook for managing content mode (chapters vs books)
 * Now uses Redux for state management to ensure consistency across all components
 */
export function useContentMode() {
  const dispatch = useAppDispatch();
  const contentMode = useAppSelector(selectContentMode);

  const setContentMode = (mode: ContentMode) => {
    dispatch(setReduxContentMode(mode));
  };

  const toggleContentMode = () => {
    dispatch(toggleReduxContentMode());
  };

  const setToChaptersMode = () => {
    dispatch(setReduxContentMode('chapters'));
  };
  
  const setToBooksMode = () => {
    dispatch(setReduxContentMode('books'));
  };

  return {
    contentMode,
    setContentMode,
    toggleContentMode,
    setToChaptersMode,
    setToBooksMode,
    isChaptersMode: contentMode === 'chapters',
    isBooksMode: contentMode === 'books',
  };
}
