'use client'

import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { BookOpen, User, FileText, DollarSign, ShoppingCart, Layers } from 'lucide-react'
import { Modal, ModalBody, ModalContent, ModalFooter } from '@heroui/react'
import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/Button'
import { getCartRoutePath, getReadBookRoutePath, getReadChapterRoutePath } from '@/routes/routes'
import { closeModal, openModal } from '@/store/slices/allModalSlice'
import AddToCartButton from '@/components/ui/AddToCartButton'
import { RootState } from '@/store/store'
import ImageComponent from '../ui/ImageComponent'
import { useAuth } from '@/hooks/useAuth'
import { IBookChapterItem } from '@/types/user/HomeAllChapters'
import { VISIBLE } from '@/constants/contentMode'

export default function CommonCardDetailsModal() {
  const dispatch = useDispatch()
  const router = useRouter()
  const { isOpen, data } = useSelector((state: RootState) => state.allModal)
  const chapter = data?.chapter
  const { isAuthenticated } = useAuth()

  const isBook = chapter?.type === VISIBLE.BOOK
  const bookChapters: IBookChapterItem[] = isBook ? (chapter?.chapters ?? []) : []

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

  const handleLoginRequired = (action: string, itemType: string) => {
    dispatch(openModal({ componentName: 'LoginRequiredModal', data: { action, itemType } }))
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
    >
      <ModalContent>
        {/* Cover Image */}
        <div className="relative shrink-0">
          <div className="aspect-3/1 overflow-hidden bg-muted">
            <ImageComponent src={chapter.coverImage} alt={chapter.title} object_cover={true} />
          </div>
        </div>

        {isBook ? (
          <BookModalContent
            chapter={chapter}
            bookChapters={bookChapters}
            isAuthenticated={isAuthenticated}
            onLoginRequired={handleLoginRequired}
            onClose={onClose}
            router={router}
            dispatch={dispatch}
          />
        ) : (
          <ChapterModalContent
            chapter={chapter}
            isAuthenticated={isAuthenticated}
            onReadClick={handleReadClick}
            onAddToCart={() => handleLoginRequired('cart', 'chapter')}
            onClose={onClose}
            router={router}
            dispatch={dispatch}
          />
        )}
      </ModalContent>
    </Modal>
  )
}

/* ─────────────────────────── Book view ─────────────────────────── */
function BookModalContent({
  chapter,
  bookChapters,
  isAuthenticated,
  onLoginRequired,
  onClose,
  router,
  dispatch,
}: {
  chapter: any
  bookChapters: IBookChapterItem[]
  isAuthenticated: boolean
  onLoginRequired: (action: string, itemType: string) => void
  onClose: () => void
  router: any
  dispatch: any
}) {
  const isFullBook = chapter.pricingModel === VISIBLE.BOOK
  const hasPrice = chapter.price > 0

  const handleReadBook = () => {
    onClose()
    router.push(getReadBookRoutePath(chapter.id))
  }

  const handleBuyBook = () => {
    if (!isAuthenticated) {
      onLoginRequired('cart', 'book')
      return
    }
  }

  return (
    <>
      <ModalBody className="p-6! space-y-4 overflow-y-auto max-h-[45vh] custom_scrollbar min-w-0">
        {/* Category tags + Title + Author */}
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            {chapter.category?.name && (
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                {chapter.category.name}
              </Badge>
            )}
            {/* {chapter.subcategory?.name && (
              <Badge variant="outline" className="rounded-full px-3 py-1 text-xs font-medium">
                {chapter.subcategory.name}
              </Badge>
            )} */}
            {/* <Badge className={`rounded-full px-3 py-1 text-xs font-medium backdrop-blur-sm bg-white border ${isFullBook ? 'text-blue-600 border-blue-200' : 'text-gray-700 border-gray-200'}`}>
              {isFullBook ? 'Full Book' : 'By Chapter'}
            </Badge> */}
          </div>

          <h2 className="text-2xl font-semibold leading-tight tracking-tight wrap-break-word">
            {chapter.title}
          </h2>

          {chapter.description && (
            <p className="text-sm text-muted-foreground leading-relaxed tracking-tight wrap-break-word line-clamp-3">
              {chapter.description}
            </p>
          )}

          {chapter.author && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground tracking-tight">
              {chapter.authorAvatar ? (
                <div className="h-7 w-7 rounded-full object-cover overflow-hidden shrink-0">
                  <ImageComponent src={chapter.authorAvatar} alt={chapter.author} object_cover={true} />
                </div>
              ) : (
                <User className="h-4 w-4 shrink-0" />
              )}
              <span className="truncate">{chapter.author}</span>
            </div>
          )}
        </div>

        {/* Full Book pricing box */}
        {isFullBook && hasPrice && (
          <div className="flex items-center justify-between p-4 bg-accent/40 rounded-2xl border border-border">
            <div>
              <p className="font-semibold text-sm tracking-tight">Complete Book</p>
              <p className="text-xs text-muted-foreground">Access all {chapter.chapterCount} chapters</p>
            </div>
            <span className="font-bold text-2xl text-primary">${chapter.price.toFixed(2)}</span>
          </div>
        )}

        {/* By Chapter pricing note */}
        {!isFullBook && (
          <div className="p-4 bg-accent/40 rounded-2xl border border-border">
            <p className="font-semibold text-sm tracking-tight mb-0.5">Purchase Options</p>
            <p className="text-xs text-muted-foreground">Purchase individual chapters below</p>
          </div>
        )}

        {/* Chapters list */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            <h3 className="font-semibold text-sm tracking-tight">
              Chapters {chapter.chapterCount > 0 ? `(${chapter.chapterCount})` : bookChapters.length > 0 ? `(${bookChapters.length})` : ''}
            </h3>
          </div>

          {bookChapters.length > 0 ? (
            <div className="space-y-2">
              {bookChapters.map((ch) => (
                <BookChapterRow
                  key={ch._id}
                  chapter={ch}
                  isAuthenticated={isAuthenticated}
                  onLoginRequired={() => onLoginRequired('read', 'chapter')}
                  onRead={() => {
                    dispatch(closeModal())
                    router.push(getReadChapterRoutePath(ch._id))
                  }}
                  onAddToCart={() => {
                    if (!isAuthenticated) onLoginRequired('cart', 'chapter')
                  }}
                  bookId={chapter.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground py-2">No chapters available yet.</p>
          )}
        </div>

        {/* About the Author */}
        {chapter.author && (
          <div className="border-t pt-3">
            <h3 className="font-semibold text-sm mb-2 tracking-tight">About the Author</h3>
            <div className="flex items-start gap-3">
              {chapter.authorAvatar ? (
                <img src={chapter.authorAvatar} alt={chapter.author} className="h-10 w-10 rounded-full object-cover shrink-0" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-primary" />
                </div>
              )}
              <div className="min-w-0">
                <p className="font-medium text-sm tracking-tight">{chapter.author}</p>
                {chapter.authorBio && (
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{chapter.authorBio}</p>
                )}
              </div>
            </div>
          </div>
        )}
      </ModalBody>

      <ModalFooter className="flex gap-3 p-4 border-t bg-white shrink-0">
        {isFullBook && hasPrice ? (
          chapter.isPurchased ? (
            <Button className="global_btn rounded_full bg_primary w-full" onPress={handleReadBook} startContent={<BookOpen className="h-4 w-4" />}>
              Read Book
            </Button>
          ) : !isAuthenticated ? (
            <Button
              className="global_btn rounded_full bg_primary w-full"
              onPress={handleBuyBook}
              startContent={<ShoppingCart className="h-4 w-4" />}
            >
              Buy Complete Book - ${chapter.price.toFixed(2)}
            </Button>
          ) : (
            <AddToCartButton
              chapterId={chapter.id}
              bookId={chapter.id}
              type="book"
              price={chapter.price}
              className="global_btn rounded_full bg_primary w-full"
              label={`Buy Complete Book - $${chapter.price.toFixed(2)}`}
              onSuccess={() => {
                dispatch(closeModal())
                router.push(getCartRoutePath())
              }}
            />
          )
        ) : (
          <Button className="global_btn rounded_full bg_primary w-full" onPress={handleReadBook} startContent={<BookOpen className="h-4 w-4" />}>
            Read Book
          </Button>
        )}
      </ModalFooter>
    </>
  )
}

/* ─────────────────────── Book chapter row ─────────────────────── */
function BookChapterRow({
  chapter,
  isAuthenticated,
  onLoginRequired,
  onRead,
  onAddToCart,
  bookId,
}: {
  chapter: IBookChapterItem
  isAuthenticated: boolean
  onLoginRequired: () => void
  onRead: () => void
  onAddToCart: () => void
  bookId: string
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl border border-border hover:bg-accent/30 transition-colors">
      {chapter.coverImage && (
        <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-muted">
          <ImageComponent src={chapter.coverImage} alt={chapter.title} object_cover={true} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
          <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-2 py-0 text-xs">
            Chapter {chapter.number}
          </Badge>
          {/* {chapter.isFree && (
            <Badge className="bg-success/10 text-success border-success/20 rounded-full px-2 py-0 text-xs">
              Free
            </Badge>
          )} */}
        </div>
        <p className="font-medium text-sm line-clamp-1 tracking-tight">{chapter.title}</p>
        {chapter.description && (
          <p className="text-xs text-muted-foreground line-clamp-1 tracking-tight">{chapter.description}</p>
        )}
      </div>
      <div className="shrink-0">
        {chapter.canRead ? (
          <Button
            className="global_btn rounded_full bg_primary text-xs px-3 py-1 h-auto min-h-0"
            onPress={onRead}
          >
            Read
          </Button>
        ) : !isAuthenticated ? (
          <Button
            className="global_btn rounded_full outline_primary text-xs px-3 py-1 h-auto min-h-0"
            onPress={onLoginRequired}
          >
            ${chapter.price?.toFixed(2) ?? '0.00'}
          </Button>
        ) : (
          <AddToCartButton
            chapterId={chapter._id}
            bookId={bookId}
            type="chapter"
            price={chapter.price}
            className="global_btn rounded_full outline_primary text-xs px-3 py-1 h-auto min-h-0"
            label={`$${chapter.price?.toFixed(2) ?? '0.00'}`}
          />
        )}
      </div>
    </div>
  )
}

/* ─────────────────────── Chapter view ─────────────────────────── */
function ChapterModalContent({
  chapter,
  isAuthenticated,
  onReadClick,
  onAddToCart,
  onClose,
  router,
  dispatch,
}: {
  chapter: any
  isAuthenticated: boolean
  onReadClick: () => void
  onAddToCart: () => void
  onClose: () => void
  router: any
  dispatch: any
}) {
  const bookData = chapter?.bookId

  return (
    <>
      <ModalBody className="p-6! space-y-4 overflow-y-auto max-h-[55vh] custom_scrollbar min-w-0">
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

          {chapter.author && (
            <div className="flex items-center gap-2 text-muted-foreground text-sm tracking-tight min-w-0">
              <User className="h-4 w-4 shrink-0" />
              <span className="truncate">{chapter.author}</span>
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

        {/* Stats grid */}
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
                <div className="font-semibold text-sm line-clamp-1 tracking-tight">{chapter.bookTitle}</div>
              </div>
            </div>
          )}
        </div>

        {/* Book context */}
        {bookData && (
          <div className="border-t pt-3">
            <h3 className="font-semibold text-sm mb-2 tracking-tight">About the Book</h3>
            <div className="flex gap-3">
              {bookData.coverImage && (
                <div className="w-16 h-20 object-cover rounded-2xl shrink-0 overflow-hidden">
                  <ImageComponent src={bookData.coverImage} alt={bookData.title} object_cover={true} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm mb-1 tracking-tight">{bookData.title}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed tracking-tight">
                  {bookData.description}
                </p>
                {bookData.tags && bookData.tags.filter(Boolean).length > 0 && (
                  <div className="flex gap-1 mt-1.5 flex-wrap">
                    {(bookData.tags as unknown as string[]).filter(Boolean).slice(0, 3).map((tag: string) => (
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
        {(chapter.isFree || chapter.canRead) ? (
          <Button className="global_btn rounded_full bg_primary w-full" onPress={onReadClick} startContent={<BookOpen className="h-4 w-4" />}>
            {chapter.isFree ? 'Read Free Chapter' : 'Read Chapter'}
          </Button>
        ) : !isAuthenticated ? (
          <Button className="global_btn rounded_full bg_primary w-full" onPress={onAddToCart} startContent={<ShoppingCart className="h-4 w-4" />}>
            Add to Cart - ${chapter.price?.toFixed(2) ?? '0.00'}
          </Button>
        ) : (
          <AddToCartButton
            chapterId={chapter.id}
            bookId={bookData?.id}
            type={chapter.type}
            price={chapter.price}
            className="global_btn rounded_full bg_primary w-full"
            label={`Add to Cart - $${chapter.price?.toFixed(2) ?? '0.00'}`}
            onSuccess={() => {
              dispatch(closeModal())
              router.push(getCartRoutePath())
            }}
          />
        )}
      </ModalFooter>
    </>
  )
}
