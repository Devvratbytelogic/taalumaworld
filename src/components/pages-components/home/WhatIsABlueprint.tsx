import { Clock, Zap, Target } from 'lucide-react'
import React from 'react'

const readTimes = [
    {
        icon: Zap,
        duration: '5-min read',
        label: 'Quick Insights',
        description: 'Bite-sized wisdom you can apply today.',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
    },
    {
        icon: Clock,
        duration: '15-min read',
        label: 'Deep Dives',
        description: 'Structured frameworks for real decisions.',
        iconBg: 'bg-secondary-accent/10',
        iconColor: 'text-secondary-accent',
    },
    {
        icon: Target,
        duration: '30-min read',
        label: 'Comprehensive Guides',
        description: 'Complete playbooks from people who\'ve done it.',
        iconBg: 'bg-success/10',
        iconColor: 'text-success',
    },
]

const attributes = [
    'Practical',
    'Actionable',
    'Experience-based',
    'Immediately useful',
]

export default function WhatIsABlueprint() {
    return (
        <section className="bg-background overflow-hidden">
            <div className="container mx-auto sm:px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-4">
                            <span className="text-sm font-medium text-primary">Understanding the Product</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">What is a Blueprint?</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            A Blueprint is a short, practical guide written by experienced practitioners to help you solve a
                            specific career, business, life, or leadership challenge.
                        </p>
                    </div>

                    {/* Read Time Cards */}
                    <div className="grid md:grid-cols-3 gap-5 mb-10">
                        {readTimes.map(({ icon: Icon, duration, label, description, iconBg, iconColor }) => (
                            <div key={duration} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-4">
                                <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                                    <Icon className={`w-6 h-6 ${iconColor}`} />
                                </div>
                                <div>
                                    <span className={`text-sm font-bold ${iconColor}`}>{duration}</span>
                                    <h3 className="font-semibold text-lg text-foreground mt-0.5">{label}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Attributes */}
                    <div className="bg-primary rounded-3xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="flex-1">
                            <p className="text-white/70 text-sm font-medium uppercase tracking-widest mb-2">Every Blueprint is</p>
                            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                                {attributes.map((attr) => (
                                    <span
                                        key={attr}
                                        className="bg-white/15 text-white text-sm font-semibold px-4 py-2 rounded-full"
                                    >
                                        {attr}
                                    </span>
                                ))}
                            </div>
                        </div>
                        <div className="md:border-l md:border-white/20 md:pl-8">
                            <p className="text-white/80 text-base leading-relaxed max-w-xs">
                                Written by people who have lived it — not textbooks, not assumptions.
                                <span className="block mt-2 text-white font-semibold">Just authentic wisdom from real careers.</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
