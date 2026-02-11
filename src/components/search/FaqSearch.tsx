'use client';
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { HelpCircle, Search, BookOpen, CreditCard, Users, } from 'lucide-react';
import FAQItem from '../faq/FAQItem';
import Button from '../ui/Button';

export default function FaqSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');


    const categories = [
        { id: 'all', label: 'All Questions', icon: HelpCircle },
        { id: 'reading', label: 'Reading & Chapters', icon: BookOpen },
        { id: 'payments', label: 'Payments & Pricing', icon: CreditCard },
        { id: 'account', label: 'Account & Settings', icon: Users },
    ];

    const faqs = [
        // Reading & Chapters
        {
            category: 'reading',
            question: 'How does chapter purchasing work?',
            answer: 'You can buy individual chapters to learn at your own pace! Each chapter is priced separately, and many books offer the first chapter free so you can try before you buy. If you love the content, you can also purchase all remaining chapters at once.'
        },
        {
            category: 'reading',
            question: 'Can I buy the entire book instead of individual chapters?',
            answer: 'Absolutely! While we focus on modular learning through chapters, many thought leaders also offer a "full book" option. You\'ll see both options on the book detail page. Buying the full book is often a better value if you\'re committed to the full learning journey!'
        },
        {
            category: 'reading',
            question: 'Are there free chapters available?',
            answer: 'Yes! Most books offer their first chapter completely free. This lets you explore different topics, discover new thought leaders, and find content that resonates with your career goals without spending anything upfront.'
        },
        {
            category: 'reading',
            question: 'Can I access my purchased chapters on different devices?',
            answer: 'Yes! Once you purchase a chapter or book, it\'s linked to your account and you can access it from any device where you\'re logged in - your phone, tablet, or computer.'
        },

        // Payments & Pricing
        {
            category: 'payments',
            question: 'What payment methods do you accept?',
            answer: 'We accept all major credit and debit cards, as well as digital payment methods like PayPal and Apple Pay. All transactions are secure and encrypted to protect your information.'
        },
        {
            category: 'payments',
            question: 'How much do chapters cost?',
            answer: 'Chapter prices vary depending on the book and thought leader, typically ranging from $0.99 to $4.99 per chapter. Thought leaders set their own prices to ensure fair compensation for their expertise and insights.'
        },
        {
            category: 'payments',
            question: 'Can I get a refund if I don\'t like a chapter?',
            answer: 'All sales are final. However, most books offer a free first chapter so you can try before you buy. If you experience technical issues preventing access to purchased content, please contact our support team.'
        },

        // Account & Settings
        {
            category: 'account',
            question: 'How do I create an account?',
            answer: 'Click the \"Sign Up\" button in the top right corner. You\'ll need to provide your name, email address, and create a password. Accounts are free and give you access to free chapters, the ability to purchase content, and personalized recommendations.'
        },
        {
            category: 'account',
            question: 'I forgot my password. How do I reset it?',
            answer: 'Click \"Forgot Password\" on the login page. Enter your email address and we\'ll send you a link to reset your password. Make sure to check your spam folder if you don\'t see the email within a few minutes.'
        },
        {
            category: 'account',
            question: 'How do I delete my account?',
            answer: 'Go to Settings > Account > Delete Account. Please note that deleting your account will remove your profile, but you may retain access to previously purchased content in accordance with our Terms of Service.'
        },

        // Privacy & Security
        {
            category: 'privacy',
            question: 'Is my personal information safe?',
            answer: 'Yes! We use industry-standard encryption to protect your personal and payment information. We never share your data with third parties without your permission. Read our Privacy Policy for complete details.'
        },
        {
            category: 'privacy',
            question: 'Can I opt out of marketing emails?',
            answer: 'Absolutely! You can unsubscribe from marketing emails at any time by clicking the \"Unsubscribe\" link at the bottom of any email, or by adjusting your email preferences in Settings > Notifications.'
        },

        // Technical Support
        {
            category: 'technical',
            question: 'The platform isn\'t loading properly. What should I do?',
            answer: 'Try clearing your browser cache and cookies, or try a different browser. If the problem persists, please contact our support team at support@taaluma.world with details about your browser and device.'
        },
        {
            category: 'technical',
            question: 'I purchased a chapter but can\'t access it. Help!',
            answer: 'First, check your purchase history to confirm the transaction completed. If it did, try logging out and back in. If you still can\'t access your chapter, contact support@taaluma.world immediately with your order details.'
        },
    ];

    const filteredFAQs = faqs.filter(faq => {
        const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
        const matchesSearch = searchQuery === '' ||
            faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
            faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });
    return (
        <>
            <section className="container mt-6 mx-auto px-4 pb-16 md:pb-24">
                <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                    <div className="max-w-2xl mx-auto pt-4">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="rounded-full h-14 pl-14 pr-6 text-base"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">
                        <div className="flex flex-wrap gap-3 justify-center mb-12">
                            {categories.map((category) => {
                                const Icon = category.icon;
                                return (
                                    <button
                                        key={category.id}
                                        onClick={() => setSelectedCategory(category.id)}
                                        className={`flex items-center gap-2 px-5 py-3 rounded-full font-medium transition-all ${selectedCategory === category.id
                                            ? 'bg-primary text-white shadow-md'
                                            : 'bg-white text-foreground hover:bg-accent border border-border'
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        {category.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* FAQ List */}
                        <div className="space-y-4">
                            {filteredFAQs.length > 0 ? (
                                filteredFAQs.map((faq, index) => (
                                    <FAQItem
                                        key={index}
                                        question={faq.question}
                                        answer={faq.answer}
                                    />
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                                        <Search className="w-8 h-8 text-muted-foreground" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">No results found</h3>
                                    <p className="text-muted-foreground mb-6">
                                        Try adjusting your search or browse a different category
                                    </p>
                                    <Button
                                        onPress={() => {
                                            setSearchQuery('');
                                            setSelectedCategory('all');
                                        }}
                                        className="global_btn rounded_full outline_primary"
                                    >
                                        Clear filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
