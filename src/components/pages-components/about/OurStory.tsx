import { BookOpen, MessageCircle, LayoutDashboard } from 'lucide-react'
import React from 'react'

const phases = [
    {
        number: '01',
        phase: 'Phase 1',
        title: 'Learn',
        description: 'Access mentor-created Blueprints.',
        status: 'Current',
        statusStyle: 'bg-success/10 text-success border border-success/20',
        icon: BookOpen,
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        numberColor: 'text-primary',
        cardBorder: 'border-primary/20',
    },
    {
        number: '02',
        phase: 'Phase 2',
        title: 'Interact',
        description: 'Join live mentoring sessions and learning experiences.',
        status: 'Coming Soon',
        statusStyle: 'bg-secondary-accent/10 text-secondary-accent border border-secondary-accent/20',
        icon: MessageCircle,
        iconBg: 'bg-secondary-accent/10',
        iconColor: 'text-secondary-accent',
        numberColor: 'text-secondary-accent',
        cardBorder: 'border-secondary-accent/20',
    },
    {
        number: '03',
        phase: 'Phase 3',
        title: 'Build',
        description: 'Create and track your personal Vision Board.',
        status: 'Coming Soon',
        statusStyle: 'bg-muted text-muted-foreground border border-border',
        icon: LayoutDashboard,
        iconBg: 'bg-success/10',
        iconColor: 'text-success',
        numberColor: 'text-success',
        cardBorder: 'border-success/20',
    },
]

export default function OurStory() {
    return (
        <section className="bg-background overflow-hidden">
            <div className="container mx-auto sm:px-4">
                <div className="max-w-6xl mx-auto">

                    {/* Section Header */}
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-4">
                            <span className="text-sm font-medium text-primary">The Journey</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">How Taaluma Works</h2>
                        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                            A three-phase roadmap — from learning to mentoring to building your future.
                        </p>
                    </div>

                    {/* Phase Cards */}
                    <div className="grid md:grid-cols-3 gap-6 relative">

                        {/* Connector line (desktop) */}
                        <div className="hidden md:block absolute top-10 left-[calc(33.33%+12px)] right-[calc(33.33%+12px)] h-0.5 bg-border z-0" />

                        {phases.map(({ number, phase, title, description, status, statusStyle, icon: Icon, iconBg, iconColor, numberColor, cardBorder }) => (
                            <div
                                key={phase}
                                className={`relative bg-white rounded-3xl p-7 shadow-sm hover:shadow-md transition-shadow border ${cardBorder} flex flex-col gap-5 z-10`}
                            >
                                {/* Phase number + status */}
                                <div className="flex items-center justify-between">
                                    <span className={`text-4xl font-black ${numberColor} opacity-20 leading-none`}>{number}</span>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyle}`}>
                                        {status}
                                    </span>
                                </div>

                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-2xl ${iconBg} flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${iconColor}`} />
                                </div>

                                {/* Text */}
                                <div className="space-y-1">
                                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{phase}</p>
                                    <h3 className="text-2xl font-bold text-foreground">{title}</h3>
                                    <p className="text-base text-muted-foreground leading-relaxed pt-1">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        </section>
    )
}
