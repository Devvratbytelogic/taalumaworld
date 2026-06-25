'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Button from '../ui/Button'
import { useGetGlobalSettingsQuery } from '@/store/rtkQueries/userGetAPI'
import { useDispatch } from 'react-redux'
import { openModal } from '@/store/slices/allModalSlice'

export default function CommonCTA() {
    const router = useRouter()
    const dispatch = useDispatch();
    useGetGlobalSettingsQuery()

    return (
        <>
            <section className="py-8 mt-8 sm:py-16 sm:mt-16 bg-linear-to-br from-primary/10 to-secondary-accent/10">
                <div className="container mx-auto sm:px-4">
                    <div className="max-w-3xl mx-auto text-center space-y-6">
                        <h2 className="text-3xl md:text-4xl font-bold">Join the Taaluma Community</h2>
                        <p className="text-lg text-muted-foreground">
                            Learn from someone ahead. Mentor someone behind. Build human capacity for the AI Economy.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                            <Button
                                onPress={() => router.push('/')}
                                className='global_btn rounded_full bg_primary hover-lift'
                            >
                                Start Learning
                            </Button>
                            <Button
                                onPress={() => dispatch(openModal({ componentName: 'SignUp', data: '' }))}
                                className='global_btn rounded_full outline_primary hover-lift'
                            >
                                Become a Mentor
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
