import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { AutoFallbackImage } from "@/components/ui/AutoFallbackImage";
import { 
  Heart, 
  ShoppingCart, 
  Trash2, 
  Star,
  Package,
  ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";

interface WishlistItem {
  _id: string;
  product: {
    _id: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
    category: string;
    description: string;
    stock: number;
    rating?: number;
  };
  addedAt: string;
}

const Wishlist = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingItems, setRemovingItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (user) {
      fetchWishlist();
    }
  }, [user]);

  const fetchWishlist = async () => {
    try {
      const response = await api.get('/wishlist');
      setWishlistItems(response.data.items || []);
    } catch (error) {
      console.error('Failed to fetch wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to load wishlist items.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    setRemovingItems(prev => new Set(prev).add(productId));
    try {
      await api.delete(`/wishlist/${productId}`);
      setWishlistItems(prev => prev.filter(item => item.product._id !== productId));
      toast({
        title: "Removed from Wishlist",
        description: "Item has been removed from your wishlist.",
      });
    } catch (error) {
      console.error('Failed to remove from wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to remove item from wishlist.",
        variant: "destructive",
      });
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(productId);
        return newSet;
      });
    }
  };

  const addToCart = async (product: any) => {
    try {
      // Add to cart logic (you can reuse from other components)
      const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
      const existingItem = cartItems.find((item: any) => item.id === product._id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        });
      }
      
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Failed to add to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart.",
        variant: "destructive",
      });
    }
  };

  const moveToCart = async (item: WishlistItem) => {
    await addToCart(item.product);
    await removeFromWishlist(item.product._id);
  };

  const clearWishlist = async () => {
    try {
      await api.delete('/wishlist');
      setWishlistItems([]);
      toast({
        title: "Wishlist Cleared",
        description: "All items have been removed from your wishlist.",
      });
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to clear wishlist.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading wishlist...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>My Wishlist - Panditji Auto Connect</title>
        <meta name="description" content="View and manage your saved items in your wishlist at Panditji Auto Connect." />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-600" />
              My Wishlist
            </h1>
            <p className="text-gray-600">
              {wishlistItems.length} {wishlistItems.length === 1 ? 'item' : 'items'} saved for later
            </p>
          </div>
          {wishlistItems.length > 0 && (
            <Button
              variant="outline"
              onClick={clearWishlist}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>

        {wishlistItems.length === 0 ? (
          /* Empty State */
          <Card className="text-center py-12">
            <CardContent>
              <Heart className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Your wishlist is empty</h3>
              <p className="text-gray-600 mb-6">
                Save items you love to your wishlist and get notified when they go on sale.
              </p>
              <Button onClick={() => navigate('/')} className="gap-2">
                <Package className="h-4 w-4" />
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* Wishlist Items */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((item) => (
              <Card key={item._id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <AutoFallbackImage
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-white/80 hover:bg-white text-red-600"
                        onClick={() => removeFromWishlist(item.product._id)}
                        disabled={removingItems.has(item.product._id)}
                      >
                        <Heart className="h-4 w-4 fill-current" />
                      </Button>
                    </div>
                    {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                      <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                        {Math.round(((item.product.originalPrice - item.product.price) / item.product.originalPrice) * 100)}% OFF
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {item.product.name}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">{item.product.category}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{item.product.price.toLocaleString('en-IN')}
                      </span>
                      {item.product.originalPrice && item.product.originalPrice > item.product.price && (
                        <span className="text-sm text-gray-500 line-through">
                          ₹{item.product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>

                    {item.product.rating && (
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-gray-600">{item.product.rating.toFixed(1)}</span>
                      </div>
                    )}

                    <div className="text-xs text-gray-500">
                      Added on {formatDate(item.addedAt)}
                    </div>

                    <Separator />

                    <div className="flex gap-2">
                      <Button
                        className="flex-1"
                        onClick={() => moveToCart(item)}
                        disabled={item.product.stock === 0}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {item.product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => navigate(`/product/${item.product._id}`)}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.product.stock > 0 && item.product.stock <= 5 && (
                      <p className="text-xs text-orange-600 font-medium">
                        Only {item.product.stock} left in stock!
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Suggestions */}
        {wishlistItems.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Explore more products based on your wishlist preferences
                </p>
                <Button variant="outline" onClick={() => navigate('/search')}>
                  Browse More Products
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </>
  );
};

export default Wishlist;
