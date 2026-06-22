'use client'
import { useGetAllChaptersQuery } from '@/store/rtkQueries/userGetAPI'
import { useRouter } from 'next/navigation'
import { BookOpen } from 'lucide-react'
import CommonCard from '@/components/cards/CommonCard'
import Button from '@/components/ui/Button'
import React from 'react'

export default function BlueprintShowcase() {
    const router = useRouter()
    const { data, isLoading } = useGetAllChaptersQuery({})
    const blueprints = data?.data?.items?.slice(0, 3) ?? []

    return (
        <section className="pt-8 sm:pt-16 bg-accent/30 overflow-hidden">
            <div className="container mx-auto sm:px-4">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-4">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="text-sm font-medium text-primary">The Product</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Featured Blueprints</h2>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            People trust products more than promises.
                        </p>
                    </div>

                    {/* Blueprint Cards */}
                    {isLoading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
                                    <div className="h-48 bg-muted" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-muted rounded-full w-3/4" />
                                        <div className="h-3 bg-muted rounded-full w-full" />
                                        <div className="h-3 bg-muted rounded-full w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : blueprints.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {blueprints.map((blueprint) => (
                                <CommonCard key={blueprint.id} data={blueprint} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-base">Blueprints coming soon.</p>
                        </div>
                    )}

                    {/* CTA */}
                    <div className="text-center mt-10 pb-8">
                        <Button
                            className="global_btn rounded_full bg_primary"
                            onPress={() => router.push('/')}
                        >
                            Browse All Blueprints
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
