'use client'

import { Trash2 } from 'lucide-react'
import { Modal, ModalBody, ModalContent, ModalFooter, addToast } from '@heroui/react'
import { useDispatch, useSelector } from 'react-redux'
import { closeModal } from '@/store/slices/allModalSlice'
import { RootState } from '@/store/store'
import Button from '@/components/ui/Button'
import { useRemoveCartItemMutation } from '@/store/rtkQueries/userPostAPI'

export default function ConfirmRemoveCartModal() {
    const dispatch = useDispatch()
    const { isOpen, data } = useSelector((state: RootState) => state.allModal)
    const [removeCartItem, { isLoading }] = useRemoveCartItemMutation()

    const itemId: string = data?.itemId
    const chapterTitle: string = data?.chapterTitle ?? 'this item'

    const onClose = () => dispatch(closeModal())

    const handleConfirm = async () => {
        try {
            await removeCartItem(itemId).unwrap()
            addToast({ title: 'Removed', description: 'Item removed from cart.', color: 'success', timeout: 2000 })
            dispatch(closeModal())
        } catch {
            // error toast handled globally in rtkQuerieSetup
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            classNames={{
                base: 'rounded-3xl',
                wrapper: 'px-4',
                body: 'py-2',
                footer: 'pt-0 pb-5 px-5',
            }}
        >
            <ModalContent>
                <ModalBody className="pt-6! px-5!">
                    <div className="flex flex-col items-center text-center gap-3">
                        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-danger/10">
                            <Trash2 className="h-6 w-6 text-danger" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold mb-1">Remove from Cart?</h2>
                            <p className="text-sm text-muted-foreground leading-relaxed">
                                Are you sure you want to remove{' '}
                                <span className="font-medium text-foreground">&ldquo;{chapterTitle}&rdquo;</span>{' '}
                                from your cart?
                            </p>
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter className="flex gap-3">
                    <Button
                        className="global_btn rounded_full outline_primary flex-1"
                        onPress={onClose}
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="global_btn rounded_full bg-danger text-white flex-1"
                        onPress={handleConfirm}
                        isLoading={isLoading}
                        startContent={!isLoading && <Trash2 className="h-4 w-4" />}
                    >
                        Remove
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}
