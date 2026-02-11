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
                            <h3 className="font-semibold text-lg mb-2">Accessibility First</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Reading should be accessible to everyone. Our chapter-by-chapter model ensures
                                cost is never a barrier to discovering great stories.
                            </p>
                        </div>

                        {/* Value 2 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-secondary-accent/10 flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-secondary-accent" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Community Driven</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We're building a vibrant community where readers and authors connect, share,
                                and grow together through their love of storytelling.
                            </p>
                        </div>

                        {/* Value 3 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                                <Heart className="w-6 h-6 text-success" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Author Support</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We believe in fair compensation for creators. Authors earn directly from every
                                chapter sold, supporting their craft and encouraging more great content.
                            </p>
                        </div>

                        {/* Value 4 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Award className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Quality Content</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                Every book on our platform is carefully curated to ensure high-quality,
                                age-appropriate content that resonates with teen readers.
                            </p>
                        </div>

                        {/* Value 5 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-secondary-accent/10 flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6 text-secondary-accent" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Innovation</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                We're constantly evolving our platform with new features and improvements
                                based on feedback from our amazing community of readers.
                            </p>
                        </div>

                        {/* Value 6 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mb-4">
                                <Target className="w-6 h-6 text-success" />
                            </div>
                            <h3 className="font-semibold text-lg mb-2">Reader Empowerment</h3>
                            <p className="text-muted-foreground leading-relaxed">
                                You're in control. Read at your pace, choose what you buy, and discover
                                stories that truly speak to you without commitment or pressure.
                            </p>
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
                                <p className="text-muted-foreground font-medium">Active Readers</p>
                            </div>

                            {/* Stat 2 */}
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-secondary-accent mb-2">150+</div>
                                <p className="text-muted-foreground font-medium">Authors</p>
                            </div>

                            {/* Stat 3 */}
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-success mb-2">1,200+</div>
                                <p className="text-muted-foreground font-medium">Chapters Available</p>
                            </div>

                            {/* Stat 4 */}
                            <div className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-primary mb-2">50+</div>
                                <p className="text-muted-foreground font-medium">Genres</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
