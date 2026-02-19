'use client';
import { Trash2, ShoppingCart, ArrowRight, BookOpen } from 'lucide-react';
import Button from '@/components/ui/Button';
import { Badge } from '@/components/ui/badge';
import ImageComponent from '@/components/ui/ImageComponent';
import { getCartCheckoutRoutePath } from '@/routes/routes';
import { useRouter } from 'nextjs-toploader/app';

// Dummy cart data for development
const DUMMY_CART_CHAPTERS = [
    {
        id: 'ch-1-3',
        bookId: 'book-1',
        title: 'The First Jump',
        featuredImage: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=600',
        price: 2.99,
        isFree: false,
        sequence: 3,
    },
    {
        id: 'ch-2-2',
        bookId: 'book-2',
        title: 'The Challenge Begins',
        featuredImage: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600',
        price: 1.99,
        isFree: false,
        sequence: 2,
    },
    {
        id: 'ch-3-1',
        bookId: 'book-3',
        title: 'The Manor',
        featuredImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=600',
        price: 0,
        isFree: true,
        sequence: 1,
    },
];

const DUMMY_BOOKS = [
    { id: 'book-1', title: 'The Quantum Quest', authorId: 'author-1' },
    { id: 'book-2', title: 'Code Warriors Academy', authorId: 'author-4' },
    { id: 'book-3', title: 'Mysteries of Moonlight Manor', authorId: 'author-3' },
];

const DUMMY_AUTHORS = [
    { id: 'author-1', name: 'Sarah Johnson' },
    { id: 'author-3', name: 'Emily Rodriguez' },
    { id: 'author-4', name: 'David Kim' },
];

export default function CartPage() {
    const router = useRouter();
    const cartChapters = DUMMY_CART_CHAPTERS;
    const books = DUMMY_BOOKS;
    const authors = DUMMY_AUTHORS;
    const cartItems = cartChapters;

    const subtotal = cartChapters.reduce(
        (sum, ch) => sum + (ch.isFree ? 0 : (ch.price ?? 0)),
        0
    );
    const total = subtotal;

    const onRemoveFromCart = (chapterId: string) => {
        console.log('Remove from cart:', chapterId);
    };

    const onCheckout = () => {
       router.push(getCartCheckoutRoutePath());
    };

    if (cartItems.length === 0) {
        return (
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
                                size="lg"
                                className="rounded-full"
                                onPress={() => window.history.back()}
                            >
                                Browse Chapters
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Shopping Cart</h1>
                    <p className="text-muted-foreground">
                        {cartChapters.length} {cartChapters.length === 1 ? 'chapter' : 'chapters'} ready for checkout
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartChapters.map(chapter => {
                            const book = books.find(b => b.id === chapter.bookId);
                            const author = book ? authors.find(a => a.id === book.authorId) : null;

                            return (
                                <div
                                    key={chapter.id}
                                    className="bg-white rounded-3xl p-6 shadow-sm border border-border"
                                >
                                    <div className="flex gap-4">
                                        {/* Chapter Image */}
                                        <div className="shrink-0">
                                            <div className="w-24 h-32 rounded-2xl overflow-hidden">
                                                <ImageComponent
                                                    src={chapter.featuredImage}
                                                    alt={chapter.title}
                                                    object_cover={true}
                                                />
                                            </div>
                                        </div>

                                        {/* Chapter Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge variant="outline" className="text-xs rounded-full">
                                                            Chapter {chapter.sequence}
                                                        </Badge>
                                                    </div>
                                                    <h3 className="font-bold text-lg mb-1 line-clamp-2">
                                                        {chapter.title}
                                                    </h3>
                                                    {book && (
                                                        <p className="text-sm text-muted-foreground mb-1 line-clamp-1">
                                                            <BookOpen className="h-3.5 w-3.5 inline mr-1" />
                                                            {book.title}
                                                        </p>
                                                    )}
                                                    {author && (
                                                        <p className="text-sm text-muted-foreground line-clamp-1">
                                                            by {author.name}
                                                        </p>
                                                    )}
                                                </div>

                                                {/* Price */}
                                                <div className="text-right shrink-0">
                                                    {chapter.isFree ? (
                                                        <Badge className="bg-success/10 text-success border-success/20 rounded-full">
                                                            Free
                                                        </Badge>
                                                    ) : (
                                                        <p className="text-xl font-bold text-primary">
                                                            ${chapter.price?.toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <Button
                                                onPress={() => onRemoveFromCart(chapter.id)}
                                                className="global_btn rounded_full danger_outline"
                                                startContent={<Trash2 className="h-4 w-4" />}
                                            >
                                                Remove
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-border sticky top-24">
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6 pb-6 border-b">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Subtotal</span>
                                    <span className="font-medium">${subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Items</span>
                                    <span className="font-medium">{cartChapters.length}</span>
                                </div>
                            </div>

                            <div className="flex justify-between mb-6 pb-6 border-b">
                                <span className="font-bold text-lg">Total</span>
                                <span className="font-bold text-2xl text-primary">
                                    ${total.toFixed(2)}
                                </span>
                            </div>

                            <div className="space-y-3">
                                <Button
                                   className="global_btn rounded_full bg_primary w-full"
                                    onPress={onCheckout}
                                    disabled={cartChapters.length === 0}
                                    endContent={<ArrowRight className="h-5 w-5 ml-2" />}
                                >
                                    Proceed to Checkout
                                </Button>
    
                                {cartChapters.length === 0 && (
                                    <p className="text-xs text-center text-muted-foreground">
                                        All chapters in your cart are already owned
                                    </p>
                                )}
    
                                <Button
                                    onPress={() => window.history.back()}
                                    className="global_btn rounded_full outline_primary w-full"
                                >
                                    Continue Shopping
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}