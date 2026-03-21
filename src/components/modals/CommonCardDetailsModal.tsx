'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { BookOpen, User, FileText, DollarSign, ShoppingCart } from 'lucide-react'
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react'
import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/Button'
import { getCartRoutePath, getReadChapterRoutePath } from '@/routes/routes'
import { closeModal, openModal } from '@/store/slices/allModalSlice'
import { RootState } from '@/store/store'
import ImageComponent from '../ui/ImageComponent'


export default function CommonCardDetailsModal() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isOpen, data } = useSelector((state: RootState) => state.allModal)
  console.log('data', data)
  const chapter = data?.chapter
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const bookData = chapter?.bookId
  const authorName = chapter?.author ?? bookData?.thoughtLeader?.fullName

  const onClose = () => dispatch(closeModal())

  const handleReadClick = () => {
    if (!chapter) return
    if (!isAuthenticated) {
      dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action: 'read', itemType: 'chapter', chapterId: chapter.id } }))
    } else {
      dispatch(closeModal())
      router.push(getReadChapterRoutePath(chapter.id))
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action: 'cart', itemType: 'chapter' } }))
    } else {
      router.push(getCartRoutePath())
    }
  }

  if (!chapter) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="modal_container"
      size="xl"
      classNames={{
        base: 'max-w-xl rounded-3xl overflow-hidden',
        wrapper: 'px-6 py-12',
        body: 'p-0',
        footer: 'p-0',
        closeButton: 'z-10 bg-white/90 backdrop-blur-sm rounded-full! right-2 top-2',
      }}
    // hideCloseButton
    >
      <ModalContent>
        {/* Header with Featured Image */}
        <div className="relative shrink-0">
          <div className="aspect-3/1 overflow-hidden bg-muted">
            <ImageComponent
              src={chapter.coverImage}
              alt={chapter.title}
              object_cover={true}
            />
          </div>
        </div>

        <ModalBody className="p-6! space-y-4 overflow-y-auto max-h-[25vh] custom_scrollbar min-w-0">
          {/* Chapter Header */}
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-xs font-medium">
                Chapter {chapter.chapterNumber}
              </Badge>
              {chapter.isFree && (
                <Badge className="bg-success/10 text-success border-success/20 rounded-full px-3 py-1 text-xs font-medium">
                  Free
                </Badge>
              )}
              {chapter.bookTitle && (
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium max-w-50">
                  <BookOpen className="h-3 w-3 mr-1.5 shrink-0" />
                  <span className="truncate">{chapter.bookTitle}</span>
                </Badge>
              )}
            </div>

            <h2 className="text-2xl font-semibold leading-tight tracking-tight wrap-break-word">
              {chapter.title}
            </h2>

            {authorName && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm tracking-tight min-w-0">
                <User className="h-4 w-4 shrink-0" />
                <span className="truncate">{authorName}</span>
              </div>
            )}
          </div>

          {/* Description */}
          {chapter.description && (
            <div className="min-w-0">
              <h3 className="font-semibold text-sm mb-1.5 tracking-tight">About this Chapter</h3>
              <p className="text-sm text-muted-foreground leading-relaxed tracking-tight wrap-break-word">
                {chapter.description}
              </p>
            </div>
          )}

          {/* Chapter Details - More Compact Grid */}
          <div className="grid grid-cols-3 gap-3 p-3 bg-accent/30 rounded-2xl">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground tracking-tight">Pages</div>
                <div className="font-semibold text-sm tracking-tight">{chapter.pageCount ?? 0}</div>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <DollarSign className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground tracking-tight">Price</div>
                <div className="font-semibold text-sm tracking-tight">
                  {chapter.isFree ? 'Free' : `$${chapter.price?.toFixed(2) ?? '0.00'}`}
                </div>
              </div>
            </div>
            {chapter.bookTitle && (
              <div className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground tracking-tight">Part of</div>
                  <div className="font-semibold text-sm line-clamp-1 tracking-tight">
                    {chapter.bookTitle}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Book Context - More Compact */}
          {bookData && (
            <div className="border-t pt-3">
              <h3 className="font-semibold text-sm mb-2 tracking-tight">About the Book</h3>
              <div className="flex gap-3">
                {bookData.coverImage && (
                  <div className='w-16 h-20 object-cover rounded-2xl shrink-0 overflow-hidden'>
                    <ImageComponent
                      src={bookData.coverImage}
                      alt={bookData.title}
                      object_cover={true}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 tracking-tight">{bookData.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed tracking-tight">
                    {bookData.description}
                  </p>
                  {bookData.tags && bookData.tags.filter(Boolean).length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {(bookData.tags as unknown as string[]).filter(Boolean).slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="rounded-full px-2 py-0 text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </ModalBody>

        <ModalFooter className="flex gap-3 p-4 border-t bg-white shrink-0">
          {chapter.isFree ? (
            <Button className='global_btn rounded_full bg_primary w-full' onPress={handleReadClick} startContent={<BookOpen className="h-4 w-4" />}>
              Read Free Chapter
            </Button>
          ) : (
            <Button className='global_btn rounded_full bg_primary w-full' onPress={handleAddToCart} startContent={<ShoppingCart className="h-4 w-4" />}>
              Add to Cart - ${chapter.price?.toFixed(2) ?? '0.00'}
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
