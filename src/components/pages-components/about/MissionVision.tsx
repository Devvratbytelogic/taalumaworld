import React from 'react'
import { Sparkles, Target } from 'lucide-react'

export default function MissionVision() {
    return (
        <>
            <section className=" bg-background">
                <div className="container mx-auto sm:px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Mission Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Target className="w-7 h-7 text-primary" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                To democratize access to mentorship, practical knowledge, and career guidance by
                                connecting learners and mentors across generations.
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-full bg-secondary-accent/10 flex items-center justify-center mb-4">
                                <Sparkles className="w-7 h-7 text-secondary-accent" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                A world where every person can access the wisdom, experience, and networks needed to
                                reach their full potential.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
