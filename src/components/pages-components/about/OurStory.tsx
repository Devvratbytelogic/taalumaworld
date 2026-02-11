import ImageComponent from '@/components/ui/ImageComponent'
import React from 'react'

export default function OurStory() {
    return (
        <>
            <section className="py-16 bg-accent/30">
                <div className="container mx-auto px-4">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold mb-3">Our Story</h2>
                            <p className="text-lg text-muted-foreground">
                                How Taaluma came to be
                            </p>
                        </div>

                        <div className="grid lg:grid-cols-2 gap-8">
                            {/* Story Image */}
                            <div className="relative">
                                <div className="relative z-10 rounded-3xl overflow-hidden shadow-lg h-full max-h-75">
                                    <ImageComponent
                                        src="/images/common/img1.jpeg"
                                        alt="Colorful stack of books"
                                        object_cover={true}
                                        priority={true}
                                    />
                                </div>
                                {/* Decorative circle */}
                                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-secondary-accent/20 rounded-full blur-2xl"></div>
                                <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/20 rounded-full blur-2xl"></div>
                            </div>

                            {/* Story Text */}
                            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm space-y-4">
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    Taaluma was born from a simple observation: teens love stories, but traditional book
                                    buying doesn't always fit their lives. Whether it's budget constraints, wanting to
                                    sample before committing, or preferring bite-sized reading sessions, the old model
                                    wasn't working.
                                </p>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    We asked ourselves: what if you could try a book for the price of a coffee? What if
                                    you could read at your own pace, buying chapters as you go? What if authors could
                                    connect directly with their readers and earn fairly for their work?
                                </p>
                                <p className="text-base text-muted-foreground leading-relaxed">
                                    Today, Taaluma is a thriving platform where thousands of young readers discover
                                    amazing stories every day. We're proud to support independent authors, offer flexible
                                    reading options, and build a community that celebrates the joy of reading.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
