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

    const isBook = data?.type === 'series'
    const isPricingModelChapter = isBook
        ? (data?.pricingModel === VISIBLE.CHAPTER)
        : (data?.series?.pricingModel === VISIBLE.CHAPTER)

    const displayPrice = isBook
        ? (data?.effectivePrice)
        : (isPricingModelChapter ? data?.effectivePrice : data?.series?.effectivePrice)

    const handleOpen = () => {
        dispatch(
            openModal({
                componentName: isBook ? 'BookDetailsModal' : 'ChapterDetailsModal',
                data: { chapter: data },
            })
        )
    }

    return (
        <Card
            className="group/card overflow-hidden cursor-pointer hover-lift gap-4 transition-all hover:border-primary/50 rounded-md flex flex-col h-full"
            onClick={handleOpen}
        >
            {/* Cover Image */}
            <div className="aspect-2/2 overflow-hidden bg-muted relative shrink-0">
                <div className="w-full h-full transition-transform group-hover/card:scale-105">
                    <ImageComponent src={data?.coverImage ?? ''} alt={data?.title ?? ''} object_cover={true} />
                </div>

                <MentorCardReveal
                    name={data?.mentor?.name}
                    avatar={data?.mentor?.profile_pic ?? undefined}
                    bio={data?.mentor?.professionalBio}
                    social={{ linkedin: data?.mentor?.linkedin ?? '', facebook: data?.mentor?.facebook ?? '' }}
                    ctaLabel={isBook ? 'View Series' : 'View Blueprint'}
                    onCtaClick={handleOpen}
                />

                {/* Wishlist */}
                <WishlistButton
                    itemId={data?.id}
                    type={isBook ? 'Book' : 'Chapter'}
                />
            </div>

            <CardContent className="last:pb-4 px-4 space-y-1.5 flex flex-col flex-1">
                <div className="flex items-center gap-2 flex-wrap">

                    <Badge className={`backdrop-blur-sm bg-white/90 rounded-full px-4 py-1 text-xs text-primary border-primary/20`}>
                        {isPricingModelChapter ? 'By Blueprint' : 'Full Series'}
                    </Badge>
                    {data?.isFree ? (
                        <Badge className="text-success border-success/20 backdrop-blur-sm bg-white/90 rounded-full px-4 py-1 text-xs">
                            Free
                        </Badge>
                    ) : null}

                    {!isBook && data?.seriesTitle && (
                        <Badge variant="outline" className="backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-xs max-w-40">
                            <BookOpen className="h-3 w-3 mr-1 shrink-0" />
                            <span className="truncate">{data?.seriesTitle}</span>
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

                    {isBook
                        ? (displayPrice > 0
                            ? <p className="font-semibold text-lg text-primary">KSH {displayPrice.toFixed(2)}</p>
                            : <p className="font-semibold text-lg text-primary">FREE</p>
                        )
                        : (data?.isFree
                            ? <p className="font-medium text-success tracking-tight">Free to Read</p>
                            : displayPrice > 0 ? (
                                <p className="font-semibold text-lg text-primary">KSH {displayPrice.toFixed(2)} {data?.series?.pricingModel === VISIBLE.BOOK && <span className="text-xs font-normal text-muted-foreground">(complete series)</span>}</p>
                            ) : <p className="font-semibold text-lg text-primary">
                                FREE{' '}<span className="text-xs font-normal text-muted-foreground">(via institutional access)</span>
                            </p>
                        )}
                </div>
            </CardContent>
        </Card>
    )
}
