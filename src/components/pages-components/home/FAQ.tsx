'use client';
import React, { useState } from 'react'
import { useGetFAQQuery } from '@/store/rtkQueries/userGetAPI'
import FAQSkeleton from '@/components/skeleton-loader/FAQSkeleton'

export default function FAQ() {
    const { data, isLoading } = useGetFAQQuery()
    const faqs = data?.data

    return (
        <>
            <section className="py-4 sm:py-16 pb-16 bg-background">
                <div className="container mx-auto sm:px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Everything you need to know about Taaluma
                        </p>
                    </div>

                    <div className="space-y-4">
                        {isLoading
                            ? <FAQSkeleton />
                            : faqs?.map((faq) => (
                                <FAQItem
                                    key={faq._id}
                                    question={faq.question}
                                    answer={faq.answer}
                                />
                            ))
                        }
                    </div>
                </div>
            </section>
        </>
    )
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-border rounded-3xl overflow-hidden bg-white hover:border-primary/30 transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-accent/30 transition-colors"
            >
                <span className="font-semibold pr-4">{question}</span>
                <span className={`shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}>
                    <svg
                        className="w-5 h-5 text-muted-foreground"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </span>
            </button>
            {isOpen && (
                <div className="px-5 pb-5 pt-0">
                    <p className="text-muted-foreground leading-relaxed">{answer}</p>
                </div>
            )}
        </div>
    );
}