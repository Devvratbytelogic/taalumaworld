import React from 'react'
import { Sparkles, Target } from 'lucide-react'

const cards = [
    {
        icon: Target,
        title: 'Our Mission',
        description:
            'To democratize access to mentorship, practical knowledge, and career guidance by connecting learners and mentors across generations.',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        border: 'hover:border-primary/30',
    },
    {
        icon: Sparkles,
        title: 'Our Vision',
        description:
            'A world where every person can access the wisdom, experience, and networks needed to reach their full potential.',
        iconBg: 'bg-secondary-accent/10',
        iconColor: 'text-secondary-accent',
        border: 'hover:border-secondary-accent/30',
    },
]

export default function MissionVision() {
    return (
        <div className="container">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-4">
                    <span className="text-sm font-medium text-primary">Our Purpose</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Mission &amp; Vision</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    The purpose that drives everything we build at Taaluma.World.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-6xl mx-auto">
                {cards.map(({ icon: Icon, title, description, iconBg, iconColor, border }) => (
                    <div
                        key={title}
                        className={`bg-white rounded-md border p-8 transition-colors ${border}`}
                    >
                        <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mb-4`}>
                            <Icon className={`w-6 h-6 ${iconColor}`} />
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
                        <p className="text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
