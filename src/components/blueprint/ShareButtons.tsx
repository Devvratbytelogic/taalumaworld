'use client';

import { useState } from 'react';
import { Check, Link2 } from 'lucide-react';
import { toast } from 'sonner';
import { FacebookIcon, LinkedinIcon, TwitterIcon, WhatsAppIcon } from '@/components/ui/AllSVG';
import { VISIBLE } from '@/constants/contentMode';
import { getBlueprintRoutePath, getSeriesRoutePath } from '@/routes/routes';
import { APP_SITE_URL } from '@/utils/config';

interface ShareButtonsProps {
    referralCode?: string | null;
    type: string;
    slug: string;
    size?: 'sm' | 'md' | 'lg';
    showCopyLink?: boolean;
}

const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-9 w-9',
    lg: 'h-10 w-10',
};

export default function ShareButtons({
    referralCode,
    type,
    size = 'md',
    slug,
    showCopyLink = true,
}: ShareButtonsProps) {
    const [copied, setCopied] = useState(false);
    const basePath = type === VISIBLE.BOOK ? getSeriesRoutePath(slug) : getBlueprintRoutePath(slug);
    const shareableLink = referralCode ? `${APP_SITE_URL}${basePath}?referralCode=${referralCode}` : `${APP_SITE_URL}${basePath}`;

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
            href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareableLink)}`,
        },
    ];

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareableLink);
            setCopied(true);
            toast.success('Link copied to clipboard');
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
                    onClick={() => window.open(href, '_blank', 'noopener,noreferrer,width=600,height=500')}
                    className={`${sizeClasses[size]} flex items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors`}
                >
                    <Icon className="h-4 w-4" />
                </button>
            ))}
            {showCopyLink && (
                <button
                    type="button"
                    aria-label="Copy link"
                    onClick={copyLink}
                    className={`${sizeClasses[size]} flex items-center justify-center rounded-full border border-border bg-white text-muted-foreground hover:text-primary hover:border-primary/30 transition-colors`}
                >
                    {copied ? <Check className="h-4 w-4 text-success" /> : <Link2 className="h-4 w-4" />}
                </button>
            )}
        </div>
    );
}
