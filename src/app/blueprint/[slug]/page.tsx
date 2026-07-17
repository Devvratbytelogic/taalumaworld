import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import BlueprintPublicHero from '@/components/blueprint/BlueprintPublicHero';
import BlueprintPublicDetails from '@/components/blueprint/BlueprintPublicDetails';
import LoginRequiredGate from '@/components/auth/LoginRequiredGate';
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

    const title = data?.metaTitle || data?.title || 'TaalumaWorld';
    const description = data?.metaDescription || data?.description || '';

    return {
        title,
        description,
        openGraph: {
            title: data?.ogTitle || title,
            description: data?.ogDescription || description,
            ...(data?.ogImage || data?.coverImage
                ? { images: [{ url: data?.ogImage || data?.coverImage }] }
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
            {data?.jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: data.jsonLd }}
                />
            )}

            <LoginRequiredGate isAuthenticated={isAuthenticated} action="view" itemType="chapter" />

            <div className="space-y-10 space_top">
                <BlueprintPublicHero data={data ?? null} />

                <BlueprintPublicDetails data={data ?? null} />
            </div>
        </>
    );
}
