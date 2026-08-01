'use client'

import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { HelpCircle, BookOpen, CreditCard, Users, Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import FAQItem from '../faq/FAQItem'
import Button from '../ui/Button'
import { cn } from '@/components/ui/utils'
import type { IFAQAPIResponseDataEntity } from '@/types/user/testimonial'

const categories = [
    { id: 'all', label: 'All Questions', icon: HelpCircle },
    { id: 'reading', label: 'Reading & Blueprints', icon: BookOpen },
    { id: 'payment', label: 'Payments & Pricing', icon: CreditCard },
    { id: 'account', label: 'Account & Settings', icon: Users },
]

type FaqSearchProps = {
    faqs: IFAQAPIResponseDataEntity[]
}

export default function FaqSearch({ faqs }: FaqSearchProps) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const selectedCategory = searchParams.get('type') ?? 'all'
    const searchFromUrl = searchParams.get('search') ?? ''
    const [searchQuery, setSearchQuery] = useState(searchFromUrl)

    useEffect(() => {
        setSearchQuery(searchFromUrl)
    }, [searchFromUrl])

    useEffect(() => {
        const timeout = setTimeout(() => {
            const next = searchQuery.trim()
            if (next === searchFromUrl) return

            const params = new URLSearchParams(searchParams.toString())
            if (next) params.set('search', next)
            else params.delete('search')

            const query = params.toString()
            router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
        }, 300)

        return () => clearTimeout(timeout)
    }, [searchQuery, searchFromUrl, searchParams, pathname, router])

    function setCategory(type: string) {
        const params = new URLSearchParams(searchParams.toString())
        if (type === 'all') params.delete('type')
        else params.set('type', type)

        const query = params.toString()
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false })
    }

    function clearFilters() {
        setSearchQuery('')
        router.replace(pathname, { scroll: false })
    }

    return (
        <div id="faq-content" style={{ scrollMarginTop: '120px' }} className="container">
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-1.5 rounded-full mb-4">
                    <span className="text-sm font-medium text-primary">Browse Answers</span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">
                    Everything you need to know
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Search by topic or browse categories to find answers about Taaluma.World.
                </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">
                {/* Search */}
                <div className="max-w-2xl mx-auto">
                    <div className="relative">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search for answers..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="rounded-md h-12 pl-12 pr-5 text-base border border-border bg-white"
                        />
                    </div>
                </div>

                {/* Category filters */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {categories.map((category) => {
                        const Icon = category.icon
                        const isActive = selectedCategory === category.id
                        return (
                            <Button
                                key={category.id}
                                type="button"
                                onPress={() => setCategory(category.id)}
                                className={cn(
                                    'global_btn rounded_full shrink-0',
                                    isActive ? 'bg_primary' : 'outline_primary',
                                )}
                                startContent={<Icon className="w-4 h-4" />}
                            >
                                {category.label}
                            </Button>
                        )
                    })}
                </div>

                {/* FAQ List */}
                <div className="space-y-4">
                    {faqs.length > 0 ? (
                        faqs.map((faq) => (
                            <FAQItem
                                key={faq._id}
                                question={faq.question}
                                answer={faq.answer}
                            />
                        ))
                    ) : (
                        <div className="flex flex-col items-center text-center py-12 px-6 border border-border rounded-md bg-white">
                            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                                <Search className="w-7 h-7 text-primary" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No results found</h3>
                            <p className="text-muted-foreground mb-6 max-w-md">
                                Try a different search term or browse another category.
                            </p>
                            <Button
                                onPress={clearFilters}
                                className="global_btn rounded_full outline_primary w_fit"
                            >
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
