import type { Metadata } from 'next';
import BlueprintPublicHero from '@/components/blueprint/BlueprintPublicHero';
import BlueprintPublicDetails from '@/components/blueprint/BlueprintPublicDetails';
import { getSingleBlueprintServerAPI } from '@/store/server-api/serverSideAPIs';


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


    return (
        <>
            <div className="space-y-10 space_top">
                <BlueprintPublicHero data={data ?? null} />

                <BlueprintPublicDetails data={data ?? null} />
            </div>
        </>
    );
}
