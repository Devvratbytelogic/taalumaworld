'use client';
import React, { useState } from 'react'

export default function FAQ() {
    return (
        <>
            <section className="py-16 bg-background">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3">Frequently Asked Questions</h2>
                        <p className="text-lg text-muted-foreground">
                            Everything you need to know about Taaluma
                        </p>
                    </div>

                    <div className="space-y-4">
                        <FAQItem
                            question="How does chapter-by-chapter purchasing work?"
                            answer="You can buy individual chapters to read at your own pace! Each chapter is priced separately, and many books offer the first chapter free so you can try before you buy. If you love the book, you can also purchase all remaining chapters at once."
                        />
                        <FAQItem
                            question="Can I buy the entire book instead of individual chapters?"
                            answer="Absolutely! While we focus on chapter-by-chapter reading, many authors also offer a 'full book' option. You'll see both options on the book detail page. Buying the full book is often a better value if you're already hooked!"
                        />
                        <FAQItem
                            question="Are there free chapters available?"
                            answer="Yes! Most books offer their first chapter completely free. This lets you explore different genres, discover new authors, and find stories you love without spending anything upfront."
                        />
                        <FAQItem
                            question="How do I know which books are right for me?"
                            answer="Use our filtering system to browse by category, author, or tags. Each book and chapter has a detailed description, and you can read reviews from other readers. Plus, with free first chapters, you can try before you commit!"
                        />
                        <FAQItem
                            question="What payment methods do you accept?"
                            answer="We accept all major credit and debit cards, as well as digital payment methods like PayPal and Apple Pay. All transactions are secure and encrypted to protect your information."
                        />
                        <FAQItem
                            question="Can I access my purchased chapters on different devices?"
                            answer="Yes! Once you purchase a chapter or book, it's linked to your account and you can access it from any device where you're logged in - your phone, tablet, or computer."
                        />
                        <FAQItem
                            question="How do authors benefit from this platform?"
                            answer="Authors earn money every time someone purchases their chapters or books. We provide them with tools to manage their content, set their own prices, and connect directly with readers like you. When you buy, you're directly supporting the authors you love!"
                        />
                        <FAQItem
                            question="Is my information safe?"
                            answer="Yes! We take your privacy seriously. We use industry-standard encryption to protect your personal and payment information. We never share your data with third parties without your permission."
                        />
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