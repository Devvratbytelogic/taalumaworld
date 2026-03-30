import { HelpCircle, MessageSquare } from "lucide-react";

export interface bannerProps {
    badgeText: string;
    heading: {
        prefix: string;
        highlight: string;
        suffix: string;
    };
    description: string;
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


export const homeBannerData: bannerProps = {
    badgeText: '📚 Now live and ready to explore!',
    heading: {
        prefix: 'Build Undisputable Career Capacity for the AI',
        highlight: 'Economy',
        suffix: '.',
    },
    description: 'A University degree is just hardware. Install the strategic software used by the top 1% to stay ahead of technological shifts.',
    primaryCta: {
        title: 'Engineer My Path',
        button_status: true,
    },
    secondaryCta: {
        title: 'Browse Categories',
        button_status: true,
    },
    stats: {
        status: true,
        avatars: [
            { label: 'A', bgColor: '#0A66C2' },
            { label: 'B', bgColor: '#8B5CF6' },
            { label: 'C', bgColor: '#10B981' },
            { label: '+5', bgColor: '#004182' },
        ],
        description: '500+ active readers',
    },
    image: {
        src: '/images/banner/home-banner1.png',
        alt: 'Teen reading on laptop',
    },
};

export const aboutBannerData: bannerProps = {
    badgeText: 'About Taaluma.World',
    heading: {
        prefix: 'Build Undisputable Capacity for the AI',
        highlight: 'Economy',
        suffix: '.',
    },
    description:
        "We are on a mission to bridge the gap between academic theory and real-world execution. At Taaluma, you aren't just consuming content—you are upgrading your Career Operating System with validatable proof and strategic blueprints.",
    primaryCta: {
        title: 'Explore Chapters',
        button_status: false,
    },
    secondaryCta: {
        title: 'Browse Categories',
        button_status: false,
    },
    stats: {
        status: false,
        avatars: [
            { label: 'A', bgColor: '#0A66C2' },
            { label: 'B', bgColor: '#8B5CF6' },
            { label: 'C', bgColor: '#10B981' },
            { label: '+5', bgColor: '#004182' },
        ],
        description: '500+ active readers',
    },
    image: {
        src: '/images/common/about-img1.jpg',
        alt: 'About Us Banner',
    },

};

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
        prefix: "We'd love to",
        highlight: "hear from you",
    },
    description:
        "Have a question, suggestion, or just want to say hi? Our team is here to help and would be happy to hear from you.",
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