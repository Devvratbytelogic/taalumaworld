import { HelpCircle, MessageSquare } from "lucide-react";

export interface bannerProps {
    badgeText: string;
    heading: {
        prefix: string;
        highlight: string;
        suffix: string;
    };
    description: string;
    tagline?: string;
    primaryCta: {
        title: string;
        button_status: boolean;
    };
    secondaryCta?: {
        title: string;
        button_status: boolean;
    };
    stats?: {
        status?: boolean;
        avatars: {
            label: string;
            bgColor: string;
        }[];
        description: string;
    };
    image: {
        src: string;
        alt: string;
    };
}


export interface normalBannerData {
    badge: {
        text: string
        icon: React.ElementType
    }
    heading: {
        prefix: string
        highlight: string
    }
    description: string
}
export const contactUsBannerData: normalBannerData = {
    badge: {
        text: "Get in Touch",
        icon: MessageSquare,
    },
    heading: {
        prefix: "Connect With the Taaluma",
        highlight: "Community.",
    },
    description:
        `Whether you're looking for guidance, interested in becoming a mentor, exploring partnerships, or simply have a question, we'd love to hear from you.`,
}
export const faqBannerData: normalBannerData = {
    badge: {
        text: "Help Center",
        icon: HelpCircle,
    },
    heading: {
        prefix: "Frequently Asked",
        highlight: "Questions",
    },
    description:
        "Find quick answers to common questions about Taaluma. Can't find what you're looking for? Contact our support team.",
}