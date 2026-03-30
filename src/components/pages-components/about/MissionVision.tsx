import React from 'react'
import { Sparkles, Target } from 'lucide-react'

export default function MissionVision() {
    return (
        <>
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
                        {/* Mission Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Target className="w-7 h-7 text-primary" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                To bridge the gap between academic theory and real-world execution by providing a high-velocity Career Operating System. We empower the next generation to upgrade their internal muscle through strategic blueprints that build Undisputable Capacity for the AI economy.
                            </p>
                        </div>

                        {/* Vision Card */}
                        <div className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-14 h-14 rounded-full bg-secondary-accent/10 flex items-center justify-center mb-4">
                                <Sparkles className="w-7 h-7 text-secondary-accent" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Vision</h2>
                            <p className="text-muted-foreground leading-relaxed text-lg">
                                A global ecosystem where every professional is an Architect of their own path. We envision a future where the top 1% possess the Perspective Moat and Strategic Resilience required to lead markets and solve humanity's most critical pain points.</p>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
