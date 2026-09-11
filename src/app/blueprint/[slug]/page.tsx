import type { Metadata } from 'next';
import BlueprintPageClient from '@/components/blueprint/BlueprintPageClient';
import { getBlueprintListServerAPI, getSingleBlueprintServerAPI } from '@/store/server-api/serverSideAPIs';

export const revalidate = 300;
export const dynamicParams = true;

type PageProps = {
    params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
    const response = await getBlueprintListServerAPI();
    const blueprints = response?.data ?? [];

    return blueprints
        .map((item) => item.slug)
        .filter((slug): slug is string => Boolean(slug))
        .map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const response = await getSingleBlueprintServerAPI({ slug });
    const data = response?.data;

    if (!data) {
        return {
            title: 'Blueprint Not Found | TaalumaWorld',
            description: '',
        };
    }

    const title = data?.meta_title || data?.title || 'TaalumaWorld';
    const description = data?.meta_description || data?.description || '';
    const ogTitle = data?.og_title || title;
    const ogDescription = data?.og_description || description;
    const ogImage = data?.og_image || data?.coverImage || undefined;
    const twitterTitle = data?.twitter_title || ogTitle;
    const twitterDescription = data?.twitter_description || ogDescription;
    const twitterImage = data?.twitter_image || ogImage;

    return {
        title,
        description,
        openGraph: {
            title: ogTitle,
            description: ogDescription,
            ...(ogImage ? { images: [{ url: ogImage }] } : {}),
        },
        twitter: {
            card: twitterImage ? 'summary_large_image' : 'summary',
            title: twitterTitle,
            description: twitterDescription,
            ...(twitterImage ? { images: [twitterImage] } : {}),
        },
    };
}

export default async function SingleBlueprintPage({ params }: PageProps) {
    const { slug } = await params;
    const response = await getSingleBlueprintServerAPI({ slug });
    const data = response?.data ?? null;

    return (
        <>
            {data?.json_ld && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: data.json_ld }}
                />
            )}

            <BlueprintPageClient slug={slug} initialData={data} />
        </>
    );
}
