'use client'
import { Compass, BookOpen, Users, TrendingUp } from 'lucide-react'
import React from 'react'
import { useDispatch } from 'react-redux'
import { openModal } from '@/store/slices/allModalSlice'
import Button from '@/components/ui/Button'

const traits = [
    {
        icon: Compass,
        title: 'Intentional',
        description: 'They do not leave their future to chance. They actively design it.',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
    },
    {
        icon: BookOpen,
        title: 'Continuously Learning',
        description: 'They seek knowledge from those ahead of them — through Blueprints, mentors and real-world experience.',
        iconBg: 'bg-secondary-accent/10',
        iconColor: 'text-secondary-accent',
    },
    {
        icon: Users,
        title: 'Connected',
        description: 'They build relationships across generations — learning from mentors while mentoring others.',
        iconBg: 'bg-success/10',
        iconColor: 'text-success',
    },
    {
        icon: TrendingUp,
        title: 'Adaptable',
        description: 'They evolve with the economy — building skills that remain valuable in an AI-driven world.',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
    },
]

export default function CareerArchitectSection() {
    const dispatch = useDispatch()

    return (
        <section className="bg-accent/30">
            <div className="container mx-auto sm:px-4">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Left: Identity Block */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full">
                            <span className="text-sm font-medium text-primary">A New Identity</span>
                        </div>

                        <div className="space-y-3">
                            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                                What is a{' '}
                                <span className="relative inline-block">
                                    <span className="relative z-10">Career Architect?</span>
                                    <span className="absolute bottom-2 left-0 w-full h-4 bg-primary/30 -rotate-1" />
                                </span>
                            </h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                A Career Architect is someone who takes deliberate ownership of designing their future.
                            </p>
                            <p className="text-base text-muted-foreground leading-relaxed">
                                Rather than leaving career growth to chance, Career Architects actively learn, seek mentorship,
                                build skills, experiment with new opportunities, and continuously adapt to changes in the economy
                                and technology.
                            </p>
                            <p className="text-base font-semibold text-foreground">
                                At Taaluma, every learner is a Career Architect.
                            </p>
                        </div>

                        <Button
                            className="global_btn rounded_full bg_primary"
                            onPress={() => dispatch(openModal({ componentName: 'SignUp', data: '' }))}
                        >
                            Become a Career Architect
                        </Button>
                    </div>

                    {/* Right: Trait Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {traits.map(({ icon: Icon, title, description, iconBg, iconColor }) => (
                            <div key={title} className="bg-white rounded-3xl p-5 shadow-sm hover:shadow-md transition-shadow space-y-3">
                                <div className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center`}>
                                    <Icon className={`w-5 h-5 ${iconColor}`} />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-foreground">{title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
