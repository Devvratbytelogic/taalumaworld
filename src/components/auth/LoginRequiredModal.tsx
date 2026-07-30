import React from 'react'
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { Modal, ModalContent, ModalBody, } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, ShoppingCart, Lock, LogIn, UserPlus, Heart } from 'lucide-react';
import Button from '../ui/Button';



export default function LoginRequiredModal() {
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const dispatch = useDispatch();
  const action = data?.action;
  const itemType = data?.itemType;
  const onCancel = data?.onCancel;
  const onSuccess = data?.onSuccess;

  const itemLabel = itemType === 'chapter' ? 'blueprint' : itemType === 'book' ? 'series' : itemType;

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
      return;
    }
    dispatch(closeModal());
  };

  const authModalData = {
    ...(typeof onSuccess === 'function' ? { onSuccess } : {}),
    ...(typeof onCancel === 'function' ? { onCancel } : {}),
  };

  const openSignIn = () => {
    dispatch(openModal({ componentName: 'SignIn', data: authModalData }));
  };

  const openSignUp = () => {
    dispatch(openModal({ componentName: 'SignUp', data: authModalData }));
  };

  const getContent = () => {
    switch (action) {
      case 'cart':
        return {
          icon: <ShoppingCart className="h-6 w-6 text-primary" />,
          title: 'Sign In to Add to Cart',
          description: 'Create an account or sign in to start building your library and unlock amazing stories.',
        };
      case 'read':
        return {
          icon: <BookOpen className="h-6 w-6 text-primary" />,
          title: 'Sign In to Read',
          description: `Sign in to start reading this ${itemLabel}. All our content requires authentication to ensure the best experience.`,
        };
      case 'view':
        return {
          icon: <Lock className="h-6 w-6 text-primary" />,
          title: 'Sign In to View Details',
          description: `Create an account or sign in to view ${itemLabel} details and explore our full collection.`,
        };
      case 'follow':
        return {
          icon: <UserPlus className="h-6 w-6 text-primary" />,
          title: 'Sign In to Follow',
          description: 'Create an account or sign in to follow mentors and stay updated with their Blueprints.',
        };
      case 'wishlist':
        return {
          icon: <Heart className="h-6 w-6 text-primary" />,
          title: 'Sign In to Add to Wishlist',
          description: 'Create an account or sign in to add items to your wishlist and save them for later.',
        };
      default:
        return {
          icon: <LogIn className="h-6 w-6 text-primary" />,
          title: 'Sign In Required',
          description: 'Please sign in to continue.',
        };
    }
  };

  const content = getContent();

  return (
    <>
      <Modal isOpen={isOpen} onClose={handleCancel} hideCloseButton size="md">
        <ModalContent>
          <ModalBody className="gap-0 px-4 py-4 sm:px-5 sm:py-5">
            <div className="mb-3 flex justify-center">
              <div className="rounded-full bg-primary/10 p-2.5">
                {content.icon}
              </div>
            </div>

            <div className="mb-3 text-center">
              <h2 className="mb-1 text-lg font-bold">{content.title}</h2>
              <p className="text-sm text-muted-foreground">
                {content.description}
              </p>
            </div>

            <div className="mb-3 rounded-md bg-linear-to-br from-primary/5 to-primary/10 p-3">
              <p className="mb-1.5 text-xs font-semibold text-foreground">With a TaalumaWorld account:</p>
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Access your purchased blueprints and series anytime</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Track your reading progress across devices</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Build your personal library of stories</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="mt-0.5 text-primary">✓</span>
                  <span>Get personalized recommendations</span>
                </li>
              </ul>
            </div>

            <div className="space-y-2">
              <Button
                onPress={openSignIn}
                className="global_btn bg_primary w-full"
                startContent={<LogIn className="h-4 w-4" />}
              >
                Sign In
              </Button>
              <Button
                onPress={handleCancel}
                className="global_btn outline_primary w-full"
              >
                Cancel
              </Button>
            </div>

            <div className="mt-2.5 text-center">
              <p className="text-xs text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={openSignUp}
                  className="font-semibold text-primary transition-colors hover:text-primary/80"
                >
                  Sign Up
                </button>
              </p>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
