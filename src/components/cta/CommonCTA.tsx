'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Button from '../ui/Button'
import { useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI'
import { VISIBLE } from '@/constants/contentMode'

export default function CommonCTA() {
    const router = useRouter()
    const { data: globalSettings } = useGetGlobalSettingsQuery()
    const isChapterMode = globalSettings?.data?.visible === VISIBLE.CHAPTER

    return (
        <>
            <section className="py-16 bg-linear-to-br from-primary/10 to-secondary-accent/10">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Join the Global Ecosystem of Career Architects</h2>
                        <p className="text-lg text-muted-foreground">
                        Start your transformation today with blueprints that bridge the gap between academic theory and real-world execution. Your future as a high-value creator is just one strategic move away.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <Button
                                onPress={() => router.push('/#content-section')}
                                className='global_btn rounded_full bg_primary hover-lift'
                            >
                                {isChapterMode ? 'Build My Blueprint' : 'Explore Books'}
                            </Button>
                            <Button
                                onPress={() => router.push('/#content-section')}
                                className='global_btn rounded_full outline_primary hover-lift'
                            >
                                {isChapterMode ? 'Access the OS' : 'Browse Content'}
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
