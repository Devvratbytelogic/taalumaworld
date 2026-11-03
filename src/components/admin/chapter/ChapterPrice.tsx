'use client';

import { Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { IChapter } from '@/types/chapter';

type ChapterPriceInput = Pick<IChapter, 'isFree' | 'price' | 'series'>;

export function getChapterPrice(chapter: ChapterPriceInput) {
    const series = chapter.series;
    const pricedBySeries = series?.pricingModel === 'book';
    const amount = pricedBySeries ? Number(series?.price ?? 0) : Number(chapter.price ?? 0);
    const isFree = pricedBySeries ? amount === 0 : chapter.isFree;
    const label = isFree ? 'Free' : `KSH ${amount.toFixed(2)}`;
    const seriesTitle = series?.title?.trim();
    const explanation = pricedBySeries
        ? (seriesTitle
            ? `This amount comes from the series “${seriesTitle}”. That series is priced as a whole (${label}), so this book does not have its own price.`
            : `This amount comes from the series price (${label}). The series is priced as a whole, so this book does not have its own price.`)
        : (seriesTitle
            ? `This amount is set on the book. The series “${seriesTitle}” is priced per book.`
            : 'This amount is set on the book itself.');

    return { pricedBySeries, isFree, label, explanation };
}

function PriceSourceTooltip({ explanation, side }: { explanation: string; side: 'left' | 'top' }) {
    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <span
                    tabIndex={0}
                    aria-label="How this price is set"
                    className="inline-flex shrink-0 cursor-help items-center font-normal text-slate-400 hover:text-slate-600"
                    onClick={(event) => event.stopPropagation()}
                >
                    <Info className="h-3.5 w-3.5" />
                </span>
            </TooltipTrigger>
            <TooltipContent side={side} className="max-w-xs py-2 text-left leading-relaxed">
                <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wide text-slate-300">Price source</p>
                {explanation}
            </TooltipContent>
        </Tooltip>
    );
}

export function ChapterPrice({
    chapter,
    variant = 'table',
}: {
    chapter: ChapterPriceInput;
    variant?: 'table' | 'detail' | 'hero';
}) {
    const { pricedBySeries, isFree, label, explanation } = getChapterPrice(chapter);
    const side = variant === 'table' ? 'left' : 'top';

    return (
        <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            {variant === 'hero' && isFree ? (
                <Badge variant="secondary">{pricedBySeries ? 'Free series' : 'Free Book'}</Badge>
            ) : variant === 'hero' ? (
                <p className="text-xl font-bold text-primary">{label}</p>
            ) : (
                <span className={variant === 'table' ? 'text-sm font-semibold text-primary' : undefined}>
                    {label}
                </span>
            )}
            <PriceSourceTooltip explanation={explanation} side={side} />
        </span>
    );
}
