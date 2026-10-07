import type { Metadata } from 'next';
import ContactUsContent from '@/components/pages-components/contact/ContactUsContent';
import { getGlobalSettingsServerAPI } from '@/store/server-api/serverSideAPIs';

export const revalidate = 300;

const title = 'Help & Trust Center | TaalumaWorld';
const description =
    "Whether you're looking for guidance, interested in becoming a mentor, exploring partnerships, or simply have a question, we'd love to hear from you.";

export async function generateMetadata(): Promise<Metadata> {
    const settings = (await getGlobalSettingsServerAPI())?.data;
    const image = settings?.og_image || settings?.logo || undefined;

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            ...(image ? { images: [{ url: image }] } : {}),
        },
        twitter: {
            card: image ? 'summary_large_image' : 'summary',
            title,
            description,
            ...(image ? { images: [image] } : {}),
        },
    };
}

export default function ContactUsPage() {
    return <ContactUsContent />
}
