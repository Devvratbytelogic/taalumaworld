import { Brain, Users, BookOpen } from 'lucide-react';
import React from 'react'
import TodayOnTaaluma from './TodayOnTaaluma'

const values = [
    {
        icon: Brain,
        title: 'Capacity',
        description: 'Build skills that remain valuable in the AI Economy.',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
    },
    {
        icon: Users,
        title: 'Mentorship',
        description: 'Learn from people who have already walked the path.',
        iconBg: 'bg-secondary-accent/10',
        iconColor: 'text-secondary-accent',
    },
    {
        icon: BookOpen,
        title: 'Lifelong Learning',
        description: 'Continuously adapt and grow in a changing world. Simple beats clever.',
        iconBg: 'bg-success/10',
        iconColor: 'text-success',
    },
]

export default function CoreValues() {
    return (
        <div className="space-y-16">
            <div className="container">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">What We Stand For</h2>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Our core values guide everything we do at Taaluma
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                    {values.map(({ icon: Icon, title, description, iconBg, iconColor }) => (
                        <div key={title} className="bg-white rounded-md border p-6 hover:border-primary/30 transition-colors">
                            <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center mb-4`}>
                                <Icon className={`w-6 h-6 ${iconColor}`} />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{title}</h3>
                            <p className="text-muted-foreground leading-relaxed">{description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Today on Taaluma */}
            <TodayOnTaaluma />
        </div>
    )
}
