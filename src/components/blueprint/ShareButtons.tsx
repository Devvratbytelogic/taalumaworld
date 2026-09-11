'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { FacebookIcon, LinkedinIcon, TwitterIcon, WhatsAppIcon } from '@/components/ui/AllSVG';
import { VISIBLE } from '@/constants/contentMode';
import { useAuth } from '@/hooks/useAuth';
import { getBlueprintRoutePath, getSeriesRoutePath } from '@/routes/routes';
import { useGetUserProfileQuery } from '@/store/rtkQueries/userGetAPI';
import { APP_SITE_URL } from '@/utils/config';

interface ShareButtonsProps {
    referralCode?: string | null;
    type: string;
    slug: string;
    title?: string | null;
    size?: 'sm' | 'md' | 'lg';
    showCopyLink?: boolean;
}

const hitAreaClasses = {
    sm: 'h-11 w-11 -m-1.5',
    md: 'h-11 w-11 -m-1',
    lg: 'h-11 w-11 -m-0.5',
};
const visualSizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
};

export default function ShareButtons({
    referralCode,
    type,
    size = 'md',
    slug,
    title,
    showCopyLink = true,
}: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const { isAuthenticated } = useAuth();
    const { data: profileRes } = useGetUserProfileQuery(undefined, { skip: !isAuthenticated });
    const loggedInReferralCode = isAuthenticated ? (profileRes?.data?.short_code?.trim() || '') : '';
    const effectiveReferralCode = loggedInReferralCode || referralCode?.trim() || '';
    const basePath = type === (VISIBLE.BOOK) ? getSeriesRoutePath(slug) : getBlueprintRoutePath(slug);
    const shareableLink = effectiveReferralCode
        ? `${APP_SITE_URL}${basePath}?referralCode=${effectiveReferralCode}`
        : `${APP_SITE_URL}${basePath}`;
    const shareTitle = title?.trim() ?? '';
    const xShareHref = shareTitle
        ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}&text=${encodeURIComponent(shareTitle)}`
        : `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}`;

    const shareLinks = [
        {
            label: 'LinkedIn',
            icon: LinkedinIcon,
            href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareableLink)}`,
        },
        {
            label: 'Facebook',
            icon: FacebookIcon,
            href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareableLink)}`,
        },
        {
            label: 'WhatsApp',
            icon: WhatsAppIcon,
            href: `https://wa.me/?text=${encodeURIComponent(`${shareableLink}`)}`,
        },
        {
            label: 'X',
            icon: TwitterIcon,
            href: xShareHref,
        },
    ];

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareableLink);
            setCopied(true);
            toast.success('Link copied to clipboard', { description: shareableLink });
            setTimeout(() => setCopied(false), 2000);
        } catch {
            toast.error('Failed to copy link');
        }
    };

    return (
        <div className="flex flex-wrap items-center gap-2">
            {shareLinks.map(({ label, icon: Icon, href }) => (
                <button
                    key={label}
                    type="button"
                    aria-label={`Share on ${label}`}
                    onClick={() => window.open(href, '_blank', 'noopener,noreferrer')}
                    className={`${hitAreaClasses[size]} group flex items-center justify-center text-muted-foreground hover:text-primary`}
                >
                    <span className={`${visualSizeClasses[size]} flex items-center justify-center rounded-full border border-border bg-white transition-colors group-hover:border-primary/30`}>
                        <Icon className="h-4 w-4" />
                    </span>
                </button>
            ))}
            {showCopyLink && (
                <button
                    type="button"
                    aria-label="Copy link"
                    onClick={copyLink}
                    className={`${hitAreaClasses[size]} group flex items-center justify-center text-muted-foreground hover:text-primary`}
                >
                    <span className={`${visualSizeClasses[size]} flex items-center justify-center rounded-full border border-border bg-white transition-colors group-hover:border-primary/30`}>
                        {copied ? <Check className="h-4 w-4 text-success" /> : <Link2 className="h-4 w-4" />}
                    </span>
                </button>
            )}
        </div>
    );
}
