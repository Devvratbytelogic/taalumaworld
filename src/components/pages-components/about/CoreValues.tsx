import { BookOpen, Users, Heart, Target, Award, Sparkles } from 'lucide-react';
import React from 'react'

export default function CoreValues() {
    return (
        <>
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">What We Stand For</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Our core values guide everything we do at Taaluma
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* Value 1 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <BookOpen className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Strategic Subsistence</h3>
                            <p className="text-muted-foreground leading-relaxed">
                            We prioritize high-velocity skills that secure your financial foundation, allowing you the stability to engineer your long-term masterpiece.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-secondary-accent/10 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-secondary-accent" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Irreducible Capacity                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                            We focus on building the depth of character, critical thinking, and empathy that no algorithm or competitor can replicate.</p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-success" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Learning Velocity</h3>
                            <p className="text-muted-foreground leading-relaxed">
                            We empower you to out-pace the noise of the AI revolution by mastering the art of rapid tool deployment and first-principles thinking.</p>
                        </div>

                        {/* Value 4 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Award className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Validatable Proof                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                            We reject "Paper Profiles" in favor of a portfolio of capacity that provides undisputable evidence of the value you offer the world.
                            </p>
                        </div>

                        {/* Value 5 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-secondary-accent/10 flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-secondary-accent" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Strategic Exposure                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                            We leverage global mentorship and digital tools to bypass local limitations and architect your career on a global stage.
                            </p>
                        </div>

                        {/* Value 6 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-success" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Market Creation                            </h3>
                            <p className="text-muted-foreground leading-relaxed">
                            We shift your mindset from being a spectator in an existing system to being the creator who engineers new markets and solves critical pain points.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-16 bg-accent/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {/* Stat 1 */}
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">500+</div>
                                <p className="text-muted-foreground font-medium">Career Architects.                                </p>
                            </div>

                            {/* Stat 2 */}
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-secondary-accent mb-2">150+</div>
                                <p className="text-muted-foreground font-medium">Strategic Mentors.                                </p>
                            </div>

                            {/* Stat 3 */}
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-success mb-2">1,200+</div>
                                <p className="text-muted-foreground font-medium">Strategic Blueprints.                             </p>
                            </div>

                            {/* Stat 4 */}
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</div>
                                <p className="text-muted-foreground font-medium">Industry Roadmaps.                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
