import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getHomeRoutePath } from '@/routes/routes';

export default function CartNoData() {
    const router = useRouter();
    return (
        <>
            <div className="min-h-screen bg-gray-50 py-8 sm:py-12">
                <div className="container mx-auto max-w-4xl px-4 sm:px-6">
                    <div className="py-10 text-center sm:py-16">
                        <div className="rounded-2xl bg-white p-8 shadow-sm sm:rounded-3xl sm:p-12">
                            <ShoppingCart className="mx-auto mb-6 h-16 w-16 text-muted-foreground/30 sm:h-24 sm:w-24" />
                            <h2 className="mb-3 text-xl font-bold sm:text-2xl">Your cart is empty</h2>
                            <p className="mb-6 text-sm text-muted-foreground sm:text-base">
                                Start adding chapters to your cart to begin your reading journey!
                            </p>
                            <Button
                                className="global_btn rounded_full"
                                onPress={() => router.push(getHomeRoutePath())}
                            >
                                Browse Chapters
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
