'use client'
import React from 'react'
import { useDispatch } from 'react-redux'
import { Card, CardContent } from '../ui/card'
import ImageComponent from '../ui/ImageComponent'
import { Badge } from '../ui/badge'
import { BookOpen, FileText, User } from 'lucide-react'
import { openModal } from '@/store/slices/allModalSlice'
import { IContentItem } from '@/types/user/HomeAllChapters'
import { VISIBLE } from '@/constants/contentMode'

interface CommonCardProps {
    data: IContentItem;
}

export default function CommonCard({ data }: CommonCardProps) {
    const dispatch = useDispatch()
    const isBook = data.type === VISIBLE.BOOK

    return (
        <Card
            className="overflow-hidden cursor-pointer hover-lift transition-all hover:border-primary/50 rounded-3xl flex flex-col h-full"
            onClick={() => dispatch(openModal({ componentName: 'CommonCardDetailsModal', data: { chapter: data } }))}
        >
            {/* Cover Image */}
            <div className="aspect-2/1 overflow-hidden bg-muted relative shrink-0">
                <div className="transition-transform hover:scale-105">
                    <ImageComponent src={data.coverImage} alt={data.title} object_cover={true} />
                </div>

                {/* Top-right badge */}
                <div className="absolute top-3.5 right-3.5">
                    {isBook ? (
                        <Badge className={`backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-xs font-medium ${data.pricingModel === VISIBLE.BOOK ? 'text-primary border-primary/20' : 'text-gray-700 border-gray-200'}`}>
                            {data.pricingModel === VISIBLE.BOOK ? 'Full Book' : 'By Chapter'}
                        </Badge>
                    ) : data.isFree ? (
                        <Badge className="text-success border-success/20 backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-xs font-medium">
                            Free
                        </Badge>
                    ) : null}
                </div>
            </div>

            <CardContent className="px-4 space-y-1.5 flex flex-col flex-1">
                {isBook ? (
                    /* Book mode — category + subcategory tags */
                    <div className="flex items-center gap-2 flex-wrap">
                        {data.category?.name && (
                            <Badge variant="outline" className="text-xs font-medium rounded-full px-3 py-1">
                                {data.category.name}
                            </Badge>
                        )}
                        {/* {data.subcategory?.name && (
                            <Badge variant="outline" className="text-xs font-medium rounded-full px-3 py-1">
                                {data.subcategory.name}
                            </Badge>
                        )} */}
                    </div>
                ) : (
                    /* Chapter mode — book title + chapter number */
                    <div className="flex items-center gap-2 flex-wrap">
                        {data.bookTitle && (
                            <Badge variant="outline" className="text-xs font-medium rounded-full px-3 py-1 max-w-37">
                                <BookOpen className="h-3 w-3 mr-1.5 shrink-0" />
                                <span className="truncate">{data.bookTitle}</span>
                            </Badge>
                        )}
                        <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-xs font-medium">
                            Chapter {data.chapterNumber}
                        </Badge>
                    </div>
                )}

                {/* Title */}
                <h3 className="font-semibold text-lg line-clamp-2 tracking-tight">{data.title}</h3>

                {/* Description */}
                {data.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2 tracking-tight h-10">
                        {data.description}
                    </p>
                )}

                {/* Author */}
                {data.author && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground tracking-tight">
                        <User className="h-4 w-4" />
                        <span>{data.author}</span>
                    </div>
                )}

                <div className="flex-1" />

                {/* Footer */}
                <div className="flex items-center justify-between pt-2 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground tracking-tight">
                        {isBook ? (
                            <>
                                <BookOpen className="h-4 w-4" />
                                <span>{data.chapterCount} chapters</span>
                            </>
                        ) : (
                            <>
                                <FileText className="h-4 w-4" />
                                <span>{data.pageCount} pages</span>
                            </>
                        )}
                    </div>

                    {isBook ? (
                        data.price > 0 ? (
                            <span className="font-semibold text-lg text-primary">${data.price.toFixed(2)}</span>
                        ) : (
                            <span className="text-primary text-sm tracking-tight">View Chapters</span>
                        )
                    ) : (
                        data.isFree ? (
                            <span className="font-medium text-success tracking-tight">Free to Read</span>
                        ) : data.price > 0 ? (
                            <span className="font-semibold text-lg text-primary">${data.price.toFixed(2)}</span>
                        ) : null
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
