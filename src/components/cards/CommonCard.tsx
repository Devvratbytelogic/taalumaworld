'use client'
import { useDispatch } from 'react-redux'
import { Card, CardContent } from '../ui/card'
import ImageComponent from '../ui/ImageComponent'
import { Badge } from '../ui/badge'
import { BookOpen } from 'lucide-react'
import { openModal } from '@/store/slices/allModalSlice'
import { VISIBLE } from '@/constants/contentMode'
import MentorCardReveal from './MentorCardReveal'
import WishlistButton from '@/components/ui/WishlistButton'
import { IHomeAllChaptersItemsEntity } from '@/types/user/HomeAllChapters'

interface CommonCardProps {
    data: IHomeAllChaptersItemsEntity;
}

export default function CommonCard({ data }: CommonCardProps) {
    const dispatch = useDispatch()
    // `type` can be 'series' for series/book listings, so fall back to `legacyType` ('book' | 'chapter') to stay backward compatible
    const isBook = data?.type === VISIBLE.BOOK
    const isChapterPriced = isBook && (data?.pricingModel === VISIBLE.CHAPTER || !!data?.isChapterPricing)
    const displayPrice = data?.effectivePrice ?? data?.price ?? 0
    const hasDiscount = (data?.price ?? 0) > displayPrice

    return (
        <Card
            className="group/card overflow-hidden cursor-pointer hover-lift transition-all hover:border-primary/50 rounded-md flex flex-col h-full"
            onClick={() =>
                dispatch(
                    openModal({
                        componentName: isBook ? 'BookDetailsModal' : 'ChapterDetailsModal',
                        data: { chapter: data },
                    })
                )
            }
        >
            {/* Cover Image */}
            <div className="aspect-2/2 overflow-hidden bg-muted relative shrink-0">
                <div className="w-full h-full transition-transform group-hover/card:scale-105">
                    <ImageComponent src={data?.coverImage ?? ''} alt={data?.title ?? ''} object_cover={true} />
                </div>

                {data?.mentor && (
                    <MentorCardReveal
                        name={data?.mentor?.name ?? 'Mentor'}
                        avatar={data?.mentor?.profile_pic ?? undefined}
                        bio={data?.mentor?.bio ?? 'Mentor bio'}
                        social={{ linkedin: data?.mentor?.linkedin ?? '', facebook: data?.mentor?.facebook ?? '' }}
                    />
                )}

                {/* Wishlist */}
                <WishlistButton
                    chapterId={!isBook ? data?.id : undefined}
                    bookId={isBook ? data?.id : data?.bookId}
                    type={data?.legacyType}
                    isWishlisted={data?.isWishlisted}
                />

                {/* Top-right badge */}
                <div className="absolute top-3.5 right-3.5 z-2">
                    {isBook ? (
                        <Badge className={`backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-sm font-medium ${!isChapterPriced ? 'text-primary border-primary/20' : 'text-gray-700 border-gray-200'}`}>
                            {!isChapterPriced ? 'Full Series' : 'By Blueprint'}
                        </Badge>
                    ) : data?.isFree ? (
                        <Badge className="text-success border-success/20 backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-sm font-medium">
                            Free
                        </Badge>
                    ) : null}
                </div>
            </div>

            <CardContent className="px-4 space-y-1.5 flex flex-col flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                    {isBook
                        ? data?.tags?.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-sm font-medium rounded-full px-3 py-1">
                                {tag}
                            </Badge>
                        ))
                        : data?.bookTitle && (
                            <Badge variant="outline" className="text-sm font-medium rounded-full px-3 py-1 max-w-37">
                                <BookOpen className="h-3 w-3 mr-1.5 shrink-0" />
                                <span className="truncate">{data?.bookTitle}</span>
                            </Badge>
                        )}
                </div>

                {/* Title */}
                <h3 className="font-semibold text-lg line-clamp-2 tracking-tight">{data?.title}</h3>

                {/* Description */}
                {data?.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 tracking-tight h-10">
                        {data?.description}
                    </p>
                )}

                <div className="flex-1" />

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground tracking-tight">
                        {isBook && !!data?.chapterCount &&
                            <>
                                <BookOpen className="h-4 w-4" />
                                <span>{data?.chapterCount} blueprints</span>
                            </>
                        }
                    </div>

                    {isBook ? (
                        isChapterPriced ? (
                            <div className="text-right leading-tight">
                                <span className="font-semibold text-lg text-primary">
                                    KSH {(data?.fromPrice ?? displayPrice).toFixed(2)}
                                </span>
                                <p className="text-xs text-muted-foreground">{data?.priceLabel ?? 'Per chapter'}</p>
                            </div>
                        ) : displayPrice > 0 ? (
                            <div className="flex items-center gap-2">
                                {hasDiscount && (
                                    <span className="text-sm text-muted-foreground line-through">KSH {data?.price?.toFixed(2)}</span>
                                )}
                                <span className="font-semibold text-lg text-primary">KSH {displayPrice.toFixed(2)}</span>
                            </div>
                        ) : (
                            <span className="text-primary text-sm tracking-tight">View Blueprints</span>
                        )
                    ) : (
                        data?.isFree ? (
                            <span className="font-medium text-success tracking-tight">Free to Read</span>
                        ) : displayPrice > 0 ? (
                            <div className="flex items-center gap-2">
                                {hasDiscount && (
                                    <span className="text-sm text-muted-foreground line-through">KSH {data?.price?.toFixed(2)}</span>
                                )}
                                <span className="font-semibold text-lg text-primary">KSH {displayPrice.toFixed(2)}</span>
                            </div>
                        ) : null
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
