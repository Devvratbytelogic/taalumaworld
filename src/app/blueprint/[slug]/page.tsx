import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import BlueprintPublicHero from '@/components/blueprint/BlueprintPublicHero';
import BlueprintPublicDetails from '@/components/blueprint/BlueprintPublicDetails';
import BlueprintReviews from '@/components/blueprint/BlueprintReviews';
import LoginRequiredGate from '@/components/auth/LoginRequiredGate';
import ChapterPurchaseGate from '@/components/pages-components/chapter/ChapterPurchaseGate';
import DirectPurchasePaymentModal from '@/components/payments/DirectPurchasePaymentModal';
import { getSingleBlueprintServerAPI } from '@/store/server-api/serverSideAPIs';
import { getDirectPurchasePaystackReference } from '@/utils/paystackReturn';


type PageProps = {
    params: Promise<{ slug: string }>;
    searchParams: Promise<{ reference?: string | string[]; trxref?: string | string[] }>;
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

export default async function SingleBlueprintPage({ params, searchParams }: PageProps) {
    const { slug } = await params;
    const query = await searchParams;
    const paystackReference = getDirectPurchasePaystackReference(query);
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

            <LoginRequiredGate
                isAuthenticated={isAuthenticated}
                action="view"
                itemType="chapter"
                skip={Boolean(paystackReference)}
            />
            <ChapterPurchaseGate
                isAuthenticated={isAuthenticated}
                chapter={data ?? null}
                skip={Boolean(paystackReference)}
            />
            {paystackReference ? (
                <DirectPurchasePaymentModal
                    reference={paystackReference}
                    kind="blueprint"
                    slug={slug}
                />
            ) : null}

            <div className="space-y-10 space_top">
                <BlueprintPublicHero data={data ?? null} />

                <BlueprintPublicDetails data={data ?? null} />

                <BlueprintReviews
                    itemId={data?.id}
                    itemTitle={data?.title}
                    isPurchased={Boolean(data?.isPurchased)}
                    isReviewed={Boolean(data?.isReviewed)}
                />
            </div>
        </>
    );
}
