import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import BlueprintPublicHero from '@/components/blueprint/BlueprintPublicHero';
import BlueprintPublicDetails from '@/components/blueprint/BlueprintPublicDetails';
import BlueprintReviews from '@/components/blueprint/BlueprintReviews';
import LoginRequiredGate from '@/components/auth/LoginRequiredGate';
import ChapterPurchaseGate from '@/components/pages-components/chapter/ChapterPurchaseGate';
import { getSingleBlueprintServerAPI } from '@/store/server-api/serverSideAPIs';


type PageProps = {
    params: Promise<{ slug: string }>;
};

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

    return {
        title,
        description,
        openGraph: {
            title: data?.og_title || title,
            description: data?.og_description || description,
            ...(data?.og_image || data?.coverImage
                ? { images: [{ url: data?.og_image || data?.coverImage }] }
                : {}),
        },
    };
}

export default async function SingleBlueprintPage({ params }: PageProps) {
    const { slug } = await params;
    const response = await getSingleBlueprintServerAPI({ slug });
    const data = response?.data;
    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth_token')?.value;
    const isAuthenticated = !!authToken;

    return (
        <>
            {data?.json_ld && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: data.json_ld }}
                />
            )}

            <LoginRequiredGate isAuthenticated={isAuthenticated} action="view" itemType="chapter" />
            <ChapterPurchaseGate isAuthenticated={isAuthenticated} chapter={data ?? null} />

            <div className="space-y-10 space_top">
                <BlueprintPublicHero data={data ?? null} />

                <BlueprintPublicDetails data={data ?? null} />

                <BlueprintReviews
                    itemId={data?.id}
                    itemTitle={data?.title}
                    type="Chapter"
                    isPurchased={Boolean(data?.isPurchased)}
                    isReviewed={Boolean(data?.isReviewed)}
                />
            </div>
        </>
    );
}
