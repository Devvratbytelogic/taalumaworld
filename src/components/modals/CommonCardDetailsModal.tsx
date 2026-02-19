'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { X, BookOpen, User, FileText, DollarSign, ShoppingCart } from 'lucide-react'
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react'
import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/Button'
import type { Chapter } from '@/data/mockData'
import { books, authors } from '@/data/mockData'
import { closeModal, openModal } from '@/store/slices/allModalSlice'
import { RootState } from '@/store/store'
import ImageComponent from '../ui/ImageComponent'


export default function CommonCardDetailsModal() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isOpen, data } = useSelector((state: RootState) => state.allModal)
  const chapter = (data as { chapter?: Chapter })?.chapter
  const { isAuthenticated } = useSelector((state: RootState) => state.auth)

  const fullBook = chapter ? books.find((b) => b.id === chapter.bookId) : undefined
  const author =
    chapter?.book?.author ??
    (fullBook ? authors.find((a) => a.id === fullBook.authorId) : undefined)

  const onClose = () => dispatch(closeModal())

  const handleReadClick = () => {
    if (!chapter) return
    if (!isAuthenticated) {
      dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action: 'read', itemType: 'chapter', chapterId: chapter.id } }))
    } else {
      dispatch(closeModal())
      router.push(`/read-chapter/${chapter.id}`)
    }
  }

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action: 'cart', itemType: 'chapter' } }))
    } else {
      dispatch(closeModal())
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
          {chapter.featuredImage && (
            <div className="aspect-3/1 overflow-hidden bg-muted">
              <ImageComponent
                src={chapter.featuredImage}
                alt={chapter.title}
                object_cover={true}
              />
            </div>
          )}
        </div>

        <ModalBody className="p-5 space-y-4 overflow-y-auto max-h-[25vh] custom_scrollbar min-w-0">
          {/* Chapter Header */}
          <div className="space-y-2 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-xs font-medium">
                Chapter {chapter.sequence}
              </Badge>
              {chapter.isFree && (
                <Badge className="bg-success/10 text-success border-success/20 rounded-full px-3 py-1 text-xs font-medium">
                  Free
                </Badge>
              )}
              {(fullBook || chapter.book) && (
                <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium max-w-50">
                  <BookOpen className="h-3 w-3 mr-1.5 shrink-0" />
                  <span className="truncate">{(fullBook ?? chapter.book)?.title}</span>
                </Badge>
              )}
            </div>

            <h2 className="text-2xl font-semibold leading-tight tracking-tight wrap-break-word">
              {chapter.title}
            </h2>

            {author && (
              <div className="flex items-center gap-2 text-muted-foreground text-sm tracking-tight min-w-0">
                <User className="h-4 w-4 shrink-0" />
                <span className="truncate">{author.name}</span>
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
            {(fullBook || chapter.book) && (
              <div className="flex items-start gap-2">
                <BookOpen className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <div className="text-xs text-muted-foreground tracking-tight">Part of</div>
                  <div className="font-semibold text-sm line-clamp-1 tracking-tight">
                    {(fullBook ?? chapter.book)?.title}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Book Context - More Compact */}
          {fullBook && (
            <div className="border-t pt-3">
              <h3 className="font-semibold text-sm mb-2 tracking-tight">About the Book</h3>
              <div className="flex gap-3">
                {fullBook.coverImage && (
                  <img
                    src={fullBook.coverImage}
                    alt={fullBook.title}
                    className="w-16 h-20 object-cover rounded-2xl shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm mb-1 tracking-tight">{fullBook.title}</h4>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed tracking-tight">
                    {fullBook.description}
                  </p>
                  {fullBook.tags && fullBook.tags.length > 0 && (
                    <div className="flex gap-1 mt-1.5 flex-wrap">
                      {fullBook.tags.slice(0, 3).map((tag) => (
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
