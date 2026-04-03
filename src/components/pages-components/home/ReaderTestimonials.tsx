'use client';
import React from 'react'
import { useGetTestimonialsQuery } from '@/store/rtkQueries/userGetAPI'
import ReaderTestimonialsSkeleton from '@/components/skeleton-loader/ReaderTestimonialsSkeleton'

export default function ReaderTestimonials() {
    const { data, isLoading } = useGetTestimonialsQuery()
    const testimonials = data?.data

    return (
        <>
            <section className="py-4 sm:py-16 bg-accent/30">
                <div className="container mx-auto sm:px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Insights from the Career Architects</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            See how thousands of young professionals are upgrading their Career Operating Systems to stay ahead of the AI shift.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                        {isLoading
                            ? <ReaderTestimonialsSkeleton />
                            : testimonials?.map((testimonial) => (
                                <div
                                    key={testimonial._id}
                                    className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-center gap-1 mb-3">
                                        {[...Array(5)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className={`w-4 h-4 ${i < testimonial.rating ? 'fill-primary' : 'fill-gray-200'}`}
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-muted-foreground mb-4 leading-relaxed">
                                        &ldquo;{testimonial.message}&rdquo;
                                    </p>
                                    <div className="flex items-center gap-3">
                                        {testimonial.photo ? (
                                            <img
                                                src={testimonial.photo}
                                                alt={testimonial.name}
                                                className="w-10 h-10 rounded-full object-cover shrink-0"
                                            />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold shrink-0">
                                                {testimonial.name.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-semibold">{testimonial.name}</p>
                                            <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>
            </section>
        </>
    )
}
