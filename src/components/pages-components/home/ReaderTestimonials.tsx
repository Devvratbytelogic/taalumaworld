import React from 'react'

export default function ReaderTestimonials() {
    return (
        <>
            <section className="py-16 bg-accent/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">What Our Readers Say</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Join thousands of young readers discovering amazing stories, one chapter at a time.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {/* Testimonial 1 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-primary" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                "I love that I can buy just one chapter to see if I like a book before getting the whole thing. It's perfect for my budget!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
                                    A
                                </div>
                                <div>
                                    <p className="font-semibold">Alex, 16</p>
                                    <p className="text-sm text-muted-foreground">High School Student</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 2 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-primary" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                "The platform is super easy to use and the stories are amazing! I've discovered so many new authors I wouldn't have found otherwise."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary-accent/10 flex items-center justify-center text-secondary-accent font-semibold">
                                    M
                                </div>
                                <div>
                                    <p className="font-semibold">Maya, 14</p>
                                    <p className="text-sm text-muted-foreground">Middle School Reader</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 3 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-primary" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                "As a busy student, reading chapter by chapter works perfectly with my schedule. I can take breaks and come back whenever I want!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success font-semibold">
                                    J
                                </div>
                                <div>
                                    <p className="font-semibold">Jordan, 17</p>
                                    <p className="text-sm text-muted-foreground">Senior Year Student</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 4 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-primary" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                "The free first chapters are awesome! I can try different genres without spending money and find what I really enjoy reading."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary-dark/10 flex items-center justify-center text-primary-dark font-semibold">
                                    S
                                </div>
                                <div>
                                    <p className="font-semibold">Sam, 15</p>
                                    <p className="text-sm text-muted-foreground">Avid Reader</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 5 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-primary" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                "Great selection of books! The categories make it really easy to find exactly what I'm looking for. Highly recommend!"
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold">
                                    E
                                </div>
                                <div>
                                    <p className="font-semibold">Emma, 13</p>
                                    <p className="text-sm text-muted-foreground">Book Enthusiast</p>
                                </div>
                            </div>
                        </div>

                        {/* Testimonial 6 */}
                        <div className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-1 mb-3">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="w-4 h-4 fill-primary" viewBox="0 0 20 20">
                                        <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                    </svg>
                                ))}
                            </div>
                            <p className="text-muted-foreground mb-4 leading-relaxed">
                                "This platform has helped me read more than ever! I love supporting authors directly and reading at my own pace."
                            </p>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-secondary-accent/20 flex items-center justify-center text-secondary-accent font-semibold">
                                    R
                                </div>
                                <div>
                                    <p className="font-semibold">Riley, 18</p>
                                    <p className="text-sm text-muted-foreground">College Freshman</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
