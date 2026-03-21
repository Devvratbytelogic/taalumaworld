import { useRouter } from 'next/navigation';
import { ShoppingCart } from 'lucide-react'
import Button from '@/components/ui/Button'
import { getHomeRoutePath } from '@/routes/routes';

export default function CartNoData() {
    const router = useRouter();
    return (
        <>
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="text-center py-16">
                        <div className="bg-white rounded-3xl p-12 shadow-sm">
                            <ShoppingCart className="h-24 w-24 mx-auto text-muted-foreground/30 mb-6" />
                            <h2 className="text-2xl font-bold mb-3">Your cart is empty</h2>
                            <p className="text-muted-foreground mb-6">
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
