'use client';
import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Search, HelpCircle, BookOpen, CreditCard, Users } from 'lucide-react';
import FAQItem from '../faq/FAQItem';
import Button from '../ui/Button';
import { useGetFAQQuery } from '@/store/rtkQueries/userGetAPI';

const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'reading', label: 'Reading & Chapters', icon: BookOpen },
    { id: 'payment', label: 'Payments & Pricing', icon: CreditCard },
    { id: 'account', label: 'Account & Settings', icon: Users },
];

export default function FaqSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const { data, isLoading, isError } = useGetFAQQuery(
        selectedCategory !== 'all' ? { type: selectedCategory } : undefined
    );
    const faqs = data?.data ?? [];

    const filteredFAQs = faqs.filter(faq => {
        if (searchQuery === '') return true;
        const q = searchQuery.toLowerCase();
        return (
            faq.question.toLowerCase().includes(q) ||
            faq.answer.toLowerCase().includes(q)
        );
    });

    return (
        <>
            <section className="container mt-6 mx-auto px-4">
                <div className="max-w-4xl mx-auto text-center space-y-6 animate-fade-in">
                    <div className="max-w-2xl mx-auto pt-4">
                        <div className="relative">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search for answers..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="rounded-full h-14 pl-14 pr-6 text-base border border-input-border bg-white shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 bg-background">
                <div className="container mx-auto px-4">
                    <div className="max-w-5xl mx-auto">

                        {/* Category Tabs */}
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

                        {/* Loading skeletons */}
                        {isLoading && (
                            <div className="space-y-4">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="h-20 rounded-3xl bg-muted animate-pulse" />
                                ))}
                            </div>
                        )}

                        {/* Error state */}
                        {isError && (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
                                    <Search className="w-8 h-8 text-destructive" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Failed to load FAQs</h3>
                                <p className="text-muted-foreground">Please try refreshing the page.</p>
                            </div>
                        )}

                        {/* FAQ List */}
                        {!isLoading && !isError && (
                            <div className="space-y-4">
                                {filteredFAQs.length > 0 ? (
                                    filteredFAQs.map((faq) => (
                                        <FAQItem
                                            key={faq._id}
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
                                            Try adjusting your search query
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
                        )}
                    </div>
                </div>
            </section>
        </>
    )
}
