import ImageComponent from '@/components/ui/ImageComponent'
import React from 'react'

export default function MeetOurTeam() {
    return (
        <>
            <section className="py-16 bg-accent/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">The Visionary Bio                            </h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                The Architect of Irreplaceable Careers
                            </p>
                        </div>

                        {/* Top: Photo + Bio */}
                        <div className="grid lg:grid-cols-2 gap-8 items-center mb-8">
                            {/* Photo */}
                            <div className="relative">
                                <div className="relative z-10 rounded-3xl overflow-hidden shadow-lg">
                                    <div className="h-80 md:h-96">
                                        <ImageComponent
                                            src="/images/common/about-img3.png"
                                            alt="Daniel Muchika"
                                            object_cover={false}
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
                                    <p className="text-primary font-medium mb-4">Founder & Principal Strategist · Taaluma.world                                    </p>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    Daniel Muchika is the strategist behind Taaluma.world, engineered from twenty years of experience at the intersection of global finance and human potential. His journey is a rare blend of elite academic credentials and 'real-world' scars. Daniel's mission is to equip the next generation of professionals with the <b>internal muscle</b> and <b>strategic blueprints</b> required to out-pace the noise of the AI revolution and own their professional destiny.</p>
                            </div>
                        </div>

                        {/* Bottom: Three highlight cards spanning full width */}
                        <div className="grid sm:grid-cols-3 gap-6">
                            {/* Academic Foundation */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                                    <span className="text-2xl">🎓</span>
                                </div>
                                <h4 className="font-semibold text-foreground mb-2">Global Academic Blueprint</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Alumnus of Friends School Kamusinga, University of Nairobi, Strathmore, IESE Barcelona, and Stockholm School of Economics.
</p>
                            </div>

                            {/* Global Leadership */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-secondary-accent/10 flex items-center justify-center mb-4">
                                    <span className="text-2xl">🌍</span>
                                </div>
                                <h4 className="font-semibold text-foreground mb-2">Executive Perspective Moat</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">Extensive leadership at global financial institutions, specializing in digital finance strategy and the future of cross-border payments.</p>
                            </div>

                            {/* Entrepreneurial Grit */}
                            <div className="bg-white rounded-3xl p-6 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-success/10 flex items-center justify-center mb-4">
                                    <span className="text-2xl">🔥</span>
                                </div>
                                <h4 className="font-semibold text-foreground mb-2">The Entrepreneur’s Resiliency</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">A veteran founder who has navigated the 'Auctioneer’s Edge,' turning high-stakes failure into a masterclass on market survival and creation.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
