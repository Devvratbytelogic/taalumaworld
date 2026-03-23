import ImageComponent from '@/components/ui/ImageComponent'
import React from 'react'

export default function MeetOurTeam() {
    return (
        <>
            <section className="py-16 bg-accent/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">Meet the Visionary</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                The architect behind Taaluma.world
                            </p>
                        </div>

                        {/* Top: Photo + Bio */}
                        <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
                            {/* Photo */}
                            <div className="relative">
                                <div className="relative z-10 rounded-3xl overflow-hidden shadow-lg">
                                    <div className="h-80 md:h-96">
                                        <ImageComponent
                                            src="https://images.unsplash.com/photo-1624555130296-e551faf8969b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkaXZlcnNlJTIwdGVhbSUyMHdvcmtpbmd8ZW58MXx8fHwxNzY3OTM4Mjg1fDA&ixlib=rb-4.1.0&q=80&w=1080"
                                            alt="Daniel Muchika"
                                            object_cover={true}
                                            priority={true}
                                        />
                                    </div>
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-2xl"></div>
                                <div className="absolute -top-6 -left-6 w-24 h-24 bg-secondary-accent/20 rounded-full blur-2xl"></div>
                            </div>

                            {/* Bio */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-foreground mb-1">Daniel Muchika</h3>
                                    <p className="text-primary font-medium mb-4">Founder & Visionary · Taaluma.world</p>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    Daniel Muchika is the architect behind Taaluma.world. A high-impact Fintech Executive and Digital Finance Strategist, Daniel has spent nearly two decades at the intersection of global finance and human potential.
                                </p>
                                <p className="text-muted-foreground leading-relaxed">
                                    His journey is a blend of academic excellence and &quot;real-world&quot; scars. As a mentor to hundreds and a strategic advisor to founders, Daniel&apos;s mission is clear: to equip you with the internal resilience and strategic tools needed to own your destiny in the Gen AI era.
                                </p>
                            </div>
                        </div>

                        {/* Bottom: Three highlight cards spanning full width */}
                        <div className="grid sm:grid-cols-3 gap-6">
                            {/* Academic Foundation */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <span className="text-2xl">🎓</span>
                                </div>
                                <h4 className="font-semibold text-foreground mb-2">Academic Foundation</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Alumnus of Friends School Kamusinga, University of Nairobi, Strathmore University, IESE Barcelona, and Stockholm School of Economics.
                                </p>
                            </div>

                            {/* Global Leadership */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-secondary-accent/10 flex items-center justify-center mb-4">
                                    <span className="text-2xl">🌍</span>
                                </div>
                                <h4 className="font-semibold text-foreground mb-2">Global Leadership</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    Leadership experience at some of the world&apos;s most influential financial institutions across global finance and digital strategy.
                                </p>
                            </div>

                            {/* Entrepreneurial Grit */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                                    <span className="text-2xl">🔥</span>
                                </div>
                                <h4 className="font-semibold text-foreground mb-2">Entrepreneurial Grit</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    A seasoned founder of over a dozen businesses who has lived the &quot;System Architect&quot; journey—experiencing the highs of innovation and the necessity of pivoting through failure.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
