import { GraduationCap, Briefcase, Award, Building2 } from 'lucide-react'
import React from 'react'

const audiences = [
    {
        icon: GraduationCap,
        title: "I'm a Student",
        description: 'Explore careers and learn from mentors who have walked the path before you.',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        border: 'hover:border-primary/30',
    },
    {
        icon: Briefcase,
        title: "I'm a Young Professional",
        description: 'Build skills, accelerate growth, and find mentors who can fast-track your journey.',
        iconBg: 'bg-secondary-accent/10',
        iconColor: 'text-secondary-accent',
        border: 'hover:border-secondary-accent/30',
    },
    {
        icon: Award,
        title: "I'm an Experienced Professional",
        description: 'Share your expertise, publish Blueprints, earn from your knowledge and impact the next generation.',
        iconBg: 'bg-success/10',
        iconColor: 'text-success',
        border: 'hover:border-success/30',
    },
    {
        icon: Building2,
        title: "I'm an Organization",
        description: 'Develop talent, support learning communities and connect your people with world-class mentors.',
        iconBg: 'bg-primary/10',
        iconColor: 'text-primary',
        border: 'hover:border-primary/30',
    },
]

export default function AudienceSegmentation() {
    return (
        <section className="bg-accent/30">
            <div className="container mx-auto sm:px-4 pt-6">
                <div className="text-center mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2">Taaluma is Built for Everyone</h2>
                    <p className="text-muted-foreground text-lg">
                        Whether you are here to learn, mentor, or grow — there is a place for you.
                    </p>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
                    {audiences.map(({ icon: Icon, title, description, iconBg, iconColor, border }) => (
                        <div
                            key={title}
                            className={`bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all border border-transparent ${border} flex flex-col gap-4`}
                        >
                            <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center`}>
                                <Icon className={`w-6 h-6 ${iconColor}`} />
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-bold text-lg text-foreground">{title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
