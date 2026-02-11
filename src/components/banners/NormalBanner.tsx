import { normalBannerData } from '@/data/data'
import { MessageSquare } from 'lucide-react'
import React from 'react'

interface NormalBannerProps {
    data: normalBannerData
}
export default function NormalBanner({ data }: NormalBannerProps) {
    const Icon = data.badge.icon

    return (
        <>
            <div className="container mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">

                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full">
                        <Icon className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">
                            {data.badge.text}
                        </span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                        {data.heading.prefix}{" "}
                        <span className="relative inline-block">
                            <span className="relative z-10">{data.heading.highlight}</span>
                            <span className="absolute bottom-2 left-0 w-full h-4 bg-primary/30 -rotate-1"></span>
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                        {data.description}
                    </p>
                </div>
            </div>
        </>
    )
}
