import React from 'react'
import { closeModal, openModal } from '@/store/slices/allModalSlice';
import { RootState } from '@/store/store';
import { Modal, ModalContent, ModalBody, } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux';
import { BookOpen, ShoppingCart, Lock, LogIn, LogOut } from 'lucide-react';
import Button from '../ui/Button';



export default function LoginRequiredModal() {
  const { isOpen, data } = useSelector((state: RootState) => state.allModal);
  const dispatch = useDispatch();
  const action = data?.action;
  const itemType = data?.itemType;

  const getContent = () => {
    switch (action) {
      case 'cart':
        return {
          icon: <ShoppingCart className="h-12 w-12 text-primary" />,
          title: 'Sign In to Add to Cart',
          description: 'Create an account or sign in to start building your library and unlock amazing stories.',
        };
      case 'read':
        return {
          icon: <BookOpen className="h-12 w-12 text-primary" />,
          title: 'Sign In to Read',
          description: `Sign in to start reading this ${itemType}. All our content requires authentication to ensure the best experience.`,
        };
      case 'view':
        return {
          icon: <Lock className="h-12 w-12 text-primary" />,
          title: 'Sign In to View Details',
          description: `Create an account or sign in to view ${itemType} details and explore our full collection.`,
        };
      default:
        return {
          icon: <LogIn className="h-12 w-12 text-primary" />,
          title: 'Sign In Required',
          description: 'Please sign in to continue.',
        };
    }
  };

  const content = getContent();

  return (
    <>
      <Modal isOpen={isOpen} onClose={() => dispatch(closeModal())} hideCloseButton>
        <ModalContent>
          <ModalBody>
            <div className="flex justify-center my-6">
              <div className="bg-primary/10 rounded-full p-6">
                {content.icon}
              </div>
            </div>

            {/* Content */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold mb-3">{content.title}</h2>
              <p className="text-muted-foreground">
                {content.description}
              </p>
            </div>

            {/* Benefits */}
            <div className="bg-linear-to-br from-primary/5 to-primary/10 rounded-2xl p-4 mb-6">
              <p className="text-sm font-semibold text-foreground mb-2">With a TaalumaWorld account:</p>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Access your purchased chapters and books anytime</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Track your reading progress across devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Build your personal library of stories</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">✓</span>
                  <span>Get personalized recommendations</span>
                </li>
              </ul>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Button
                onPress={() => dispatch(openModal({
                  componentName: 'SignIn',
                  data: (action === 'read' && (data as { chapterId?: string })?.chapterId)
                    ? { redirectTo: `/read-chapter/${(data as { chapterId: string }).chapterId}` }
                    : ''
                }))}
               className='global_btn bg_primary w-full'
               startContent={<LogIn />}
              >
                Sign In
              </Button>
              <Button
                onPress={() => dispatch(closeModal())}
                className='global_btn outline_primary w-full'
              >
                Cancel
              </Button>
            </div>

            {/* Sign Up Link */}
            <div className="text-center my-3">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{' '}
                <button
                  onClick={() => dispatch(openModal({
                  componentName: 'SignUp',
                  data: (action === 'read' && (data as { chapterId?: string })?.chapterId)
                    ? { redirectTo: `/read-chapter/${(data as { chapterId: string }).chapterId}` }
                    : ''
                }))}
                  className="text-primary hover:text-primary/80 transition-colors font-semibold"
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
