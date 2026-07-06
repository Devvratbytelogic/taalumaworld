import type { Metadata } from 'next';
import BlueprintPublicHero from '@/components/blueprint/BlueprintPublicHero';
import BlueprintPublicDetails from '@/components/blueprint/BlueprintPublicDetails';
import { getSingleBlueprintServerAPI } from '@/store/server-api/serverSideAPIs';
import ImageComponent from '@/components/ui/ImageComponent';
import { BookOpen, FileText } from 'lucide-react';
import BlueprintShareButtons from '@/components/blueprint/BlueprintShareButtons';
import { getSeriesRoutePath } from '@/routes/routes';
import Link from 'next/link';

type PageProps = {
    params: Promise<{ slug: string }>;
};

// export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
//     const { slug } = await params;
//     const response = await getSingleBlueprintServerAPI({ slug });
//     const data = response?.data;

//     if (!data) {
//         return { title: 'Blueprint not found' };
//     }

//     return {
//         title: data.metaTitle || data.title,
//         description: data.metaDescription || data.description,
//         openGraph: {
//             title: data.ogTitle || data.title,
//             description: data.ogDescription || data.description,
//             images: data.ogImage ? [{ url: data.ogImage }] : data.coverImage ? [{ url: data.coverImage }] : [],
//         },
//     };
// }

export default async function SingleBlueprintPage({ params }: PageProps) {
    const { slug } = await params;
    const response = await getSingleBlueprintServerAPI({ slug });
    const data = response?.data;
    const priceLabel = data?.isFree ? 'Free' : `KSH ${data?.price?.toFixed(2) ?? '0.00'}`;


    return (
        <>
            <div className="space-y-10 space_top">
                <BlueprintPublicHero data={data ?? null} />

                <BlueprintPublicDetails data={data ?? null} />
            </div>
        </>
    );
}
