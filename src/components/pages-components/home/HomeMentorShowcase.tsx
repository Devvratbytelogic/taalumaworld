'use client'
import { useGetUserAllAuthorsQuery } from '@/store/rtkQueries/userGetAPI'
import { useRouter } from 'next/navigation'
import { Users } from 'lucide-react'
import ImageComponent from '@/components/ui/ImageComponent'
import Button from '@/components/ui/Button'
import { useDispatch } from 'react-redux'
import { openModal } from '@/store/slices/allModalSlice'
import React from 'react'

const avatarColors = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626']

export default function HomeMentorShowcase() {
    const router = useRouter()
    const dispatch = useDispatch()
    const { data, isLoading } = useGetUserAllAuthorsQuery()
    const mentors = data?.data?.items?.slice(0, 4) ?? []

    if (!isLoading && mentors.length === 0) return null

    return (
        <section className="bg-background overflow-hidden">
            <div className="container mx-auto sm:px-4">
                <div className="max-w-6xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-secondary-accent/10 border border-secondary-accent/20 px-4 py-1.5 rounded-full mb-4">
                            <Users className="w-4 h-4 text-secondary-accent" />
                            <span className="text-sm font-medium text-secondary-accent">The Mentors</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Learn From Mentors Around the World</h2>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            People trust people — not platforms. Meet the experts behind the Blueprints.
                        </p>
                    </div>

                    {/* Mentor Cards */}
                    {isLoading ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-3xl p-6 shadow-sm animate-pulse">
                                    <div className="w-16 h-16 rounded-full bg-muted mb-4" />
                                    <div className="h-4 bg-muted rounded-full w-2/3 mb-2" />
                                    <div className="h-3 bg-muted rounded-full w-full mb-1" />
                                    <div className="h-3 bg-muted rounded-full w-4/5" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            {mentors.map((mentor, index) => (
                                <div
                                    key={mentor.id}
                                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center gap-3"
                                >
                                    {mentor.avatar ? (
                                        <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-border shrink-0">
                                            <ImageComponent src={mentor.avatar} alt={mentor.fullName} object_cover={true} />
                                        </div>
                                    ) : (
                                        <div
                                            className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold shrink-0"
                                            style={{ backgroundColor: avatarColors[index % avatarColors.length] }}
                                        >
                                            {mentor.fullName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <h3 className="font-semibold text-foreground leading-tight">{mentor.fullName}</h3>
                                        {mentor.professionalBio && (
                                            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                                {mentor.professionalBio}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* CTAs */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
                        <Button
                            className="global_btn rounded_full outline_primary"
                            onPress={() => router.push('/authors')}
                        >
                            View All Mentors
                        </Button>
                        <Button
                            className="global_btn rounded_full bg_primary"
                            onPress={() => dispatch(openModal({ componentName: 'SignUp', data: '' }))}
                        >
                            Become a Mentor
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
