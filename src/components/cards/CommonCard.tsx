'use client'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Card, CardContent } from '../ui/card'
import ImageComponent from '../ui/ImageComponent'
import { Badge } from '../ui/badge'
import { Chapter } from '@/data/mockData'
import { BookOpen, FileText, User } from 'lucide-react'
import { openModal } from '@/store/slices/allModalSlice'
import { RootState } from '@/store/store'

interface CommonCardProps {
    data: Chapter;
}

export default function CommonCard({ data }: CommonCardProps) {
    const dispatch = useDispatch()

    return (
        <>
            <Card
                className="overflow-hidden cursor-pointer hover-lift transition-all hover:border-primary/50 rounded-3xl flex flex-col h-full"
                onClick={() => dispatch(openModal({ componentName: 'CommonCardDetailsModal', data: { chapter: data } }))}
            >
                {/* Chapter Featured Image with Free Badge Overlay */}
                {data?.featuredImage && (
                    <div className="aspect-2/1 overflow-hidden bg-muted relative shrink-0">
                        <div className="transition-transform hover:scale-105 rounded-[-214px]">
                            <ImageComponent
                                src={data?.featuredImage}
                                alt={data?.title}
                                object_cover={true}
                            />
                        </div>
                        {/* Free Badge on Image */}
                        {data?.isFree && (
                            <div className="absolute top-3.5 right-3.5">
                                <Badge className="text-success border-success/20 backdrop-blur-sm bg-white/90 rounded-full px-3 py-1 text-xs font-medium">
                                    Free
                                </Badge>
                            </div>
                        )}
                    </div>
                )}

                <CardContent className="px-4 space-y-1.5 flex flex-col flex-1">
                    {/* Book Title and Chapter Number Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {data?.book && (
                            <Badge variant="outline" className="text-xs font-medium rounded-full px-3 py-1 max-w-37">
                                <BookOpen className="h-3 w-3 mr-1.5 shrink-0" />
                                <span className="truncate">{data?.book?.title}</span>
                            </Badge>
                        )}
                        <Badge className="bg-primary/10 text-primary border-primary/20 rounded-full px-3 py-1 text-xs font-medium">
                            Chapter {data?.sequence}
                        </Badge>
                    </div>

                    {/* Chapter Title */}
                    <h3 className="font-semibold text-lg line-clamp-2 tracking-tight">
                        {data?.title}
                    </h3>

                    {/* Description */}
                    {data.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2 tracking-tight h-10">
                            {data?.description}
                        </p>
                    )}

                    {/* Author */}
                    {data?.book?.author && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground tracking-tight">
                            <User className="h-4 w-4" />
                            <span>{data?.book?.author?.name}</span>
                        </div>
                    )}

                    {/* Spacer to push footer to bottom */}
                    <div className="flex-1" />

                    {/* Footer with Page Count and Price */}
                    <div className="flex items-center justify-between pt-2 border-t border-border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground tracking-tight">
                            <FileText className="h-4 w-4" />
                            <span>{data?.pageCount || 0} pages</span>
                        </div>

                        {data?.isFree ? (
                            <span className="font-medium text-success tracking-tight">Free to Read</span>
                        ) : data?.price ? (
                            <span className="font-semibold text-lg text-primary">${data?.price.toFixed(2)}</span>
                        ) : null}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
