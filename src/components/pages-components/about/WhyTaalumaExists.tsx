import { BookOpen, GraduationCap, Users } from 'lucide-react'
import React from 'react'

const questions = [
    'What skills are required?',
    'What challenges do they face?',
    'What do they enjoy most?',
    'How did they get there?',
]

const notList = ['Not job descriptions.', 'Not stereotypes.', 'Not assumptions.']

const placeCards = [
    {
        icon: GraduationCap,
        text: 'A high school student can learn from a university student.',
        color: 'bg-primary/10',
        iconColor: 'text-primary',
    },
    {
        icon: Users,
        text: 'A young professional can learn from an industry leader.',
        color: 'bg-secondary-accent/10',
        iconColor: 'text-secondary-accent',
    },
    {
        icon: BookOpen,
        text: 'An entrepreneur can learn from someone who has already built and scaled a business.',
        color: 'bg-success/10',
        iconColor: 'text-success',
    },
]

export default function WhyTaalumaExists() {
    return (
        <section className="bg-accent/30 overflow-hidden">
            <div className="container mx-auto sm:px-4">
                <div className="max-w-5xl mx-auto space-y-6">

                    {/* Section Header */}
                    <div className="text-center space-y-3">
                        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                            Why Taaluma.World Exists
                        </h2>
                    </div>

                    {/* Opening Hook */}
                    <p className="text-xl md:text-2xl text-center text-muted-foreground leading-relaxed max-w-3xl mx-auto">
                        Every year, millions of people leave school with qualifications but{' '}
                        <span className="text-foreground font-semibold">without clarity.</span>
                    </p>

                    {/* Problem Statement */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4">
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Students are expected to make some of the most important decisions of their lives with limited exposure to the careers they are choosing. Career days, while valuable, often become sessions where people are introduced to popular professions or careers that speakers themselves once aspired to pursue. What is frequently missing is a practical, honest view of what those careers actually look like in the real world.
                        </p>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            What does a day in the life of a Software Engineer, Nurse, Pilot, Farmer, Lawyer, Plumber, Teacher, Designer, Entrepreneur, or CEO actually look like?
                        </p>

                        {/* Questions Grid */}
                        <div className="grid sm:grid-cols-2 gap-3 pt-2">
                            {questions.map((q) => (
                                <div key={q} className="flex items-center gap-3 bg-primary/5 border border-primary/10 rounded-2xl px-4 py-3">
                                    <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                                    <span className="text-sm font-medium text-primary">{q}</span>
                                </div>
                            ))}
                        </div>

                        <p className="text-base text-muted-foreground leading-relaxed pt-2">
                            Most young people choose careers based on job titles. Few get to understand the reality behind those titles.
                        </p>
                    </div>

                    {/* The Gap */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-4">
                        <p className="text-base text-muted-foreground leading-relaxed">
                            The challenge does not end after graduation. Professionals at every stage of life often make career, business, and life decisions without access to mentors who have already walked the path ahead of them. At the same time, some of the world&apos;s most valuable knowledge remains locked away in the minds of experienced practitioners, leaders, entrepreneurs, and specialists who rarely have a platform to share what they have learned.
                        </p>
                        <div className="border-l-4 border-primary pl-5 py-1">
                            <p className="text-lg font-semibold text-foreground">
                                Taaluma.World was created to bridge that gap.
                            </p>
                        </div>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            We are building a global marketplace for mentorship, learning, and career architecture where knowledge moves across generations and across borders.
                        </p>
                    </div>

                    {/* A Place Where — Cards */}
                    <div className="space-y-6">
                        <p className="text-center text-lg font-semibold text-foreground">A place where…</p>
                        <div className="grid md:grid-cols-3 gap-5">
                            {placeCards.map(({ icon: Icon, text, color, iconColor }) => (
                                <div key={text} className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow space-y-4">
                                    <div className={`w-12 h-12 rounded-full ${color} flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${iconColor}`} />
                                    </div>
                                    <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-center text-base text-muted-foreground max-w-2xl mx-auto">
                            And where every learner can, in turn, become a mentor to someone earlier in their journey.
                        </p>
                    </div>

                    {/* Through Blueprints + Not List */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm space-y-6">
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Through Blueprints, mentorship, and practical learning experiences, we make real-world wisdom accessible to anyone, anywhere.
                        </p>

                        <div className="flex flex-wrap gap-3">
                            {notList.map((item) => (
                                <span key={item} className="inline-flex items-center gap-2 bg-destructive/5 border border-destructive/20 text-destructive text-sm font-medium px-4 py-2 rounded-full">
                                    <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
                                    {item}
                                </span>
                            ))}
                        </div>

                        <p className="text-base text-foreground font-medium">
                            Just authentic insights from real people living real careers.
                        </p>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            Because sometimes a five-minute story can change the direction of a lifetime.
                        </p>
                        <p className="text-base text-muted-foreground leading-relaxed">
                            At Taaluma.World, we believe everyone has something to learn and something to teach.
                        </p>
                    </div>

                    {/* Closing Mission Statement */}
                    <div className="bg-primary rounded-3xl p-8 text-center space-y-2">
                        <p className="text-white/70 text-sm font-medium uppercase tracking-widest">Our Promise</p>
                        <p className="text-white text-xl md:text-2xl font-bold leading-snug">
                            Learn from someone ahead. Mentor someone behind.<br />
                            Build human capacity for the AI Economy.
                        </p>
                    </div>

                </div>
            </div>
        </section>
    )
}
