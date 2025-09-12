import React, { useState, useEffect } from 'react';
import { Eye, Clock, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface RecentProduct {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: Array<{ url: string; alt: string }>;
  brand: string;
  category: { name: string };
  averageRating: number;
  totalReviews: number;
  inStock: boolean;
  viewedAt: number;
}

interface RecentlyViewedProps {
  maxItems?: number;
  showHeader?: boolean;
  className?: string;
}

export default function RecentlyViewed({ 
  maxItems = 10, 
  showHeader = true,
  className = ""
}: RecentlyViewedProps) {
  const [recentProducts, setRecentProducts] = useState<RecentProduct[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadRecentlyViewed();
  }, []);

  const loadRecentlyViewed = () => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      if (stored) {
        const products = JSON.parse(stored);
        // Sort by most recently viewed and limit
        const sorted = products
          .sort((a: RecentProduct, b: RecentProduct) => b.viewedAt - a.viewedAt)
          .slice(0, maxItems);
        setRecentProducts(sorted);
      }
    } catch (error) {
      console.error('Error loading recently viewed:', error);
    }
  };

  const addToRecentlyViewed = (product: Omit<RecentProduct, 'viewedAt'>) => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      let products: RecentProduct[] = stored ? JSON.parse(stored) : [];
      
      // Remove if already exists
      products = products.filter(p => p._id !== product._id);
      
      // Add to beginning with current timestamp
      products.unshift({
        ...product,
        viewedAt: Date.now()
      });
      
      // Keep only recent items
      products = products.slice(0, maxItems);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(products));
      setRecentProducts(products);
    } catch (error) {
      console.error('Error saving to recently viewed:', error);
    }
  };

  const removeFromRecentlyViewed = (productId: string) => {
    try {
      const updated = recentProducts.filter(p => p._id !== productId);
      localStorage.setItem('recentlyViewed', JSON.stringify(updated));
      setRecentProducts(updated);
      
      toast({
        title: 'Removed',
        description: 'Product removed from recently viewed'
      });
    } catch (error) {
      console.error('Error removing from recently viewed:', error);
    }
  };

  const clearRecentlyViewed = () => {
    try {
      localStorage.removeItem('recentlyViewed');
      setRecentProducts([]);
      
      toast({
        title: 'Cleared',
        description: 'Recently viewed products cleared'
      });
    } catch (error) {
      console.error('Error clearing recently viewed:', error);
    }
  };

  const handleProductClick = (product: RecentProduct) => {
    navigate(`/product/${product._id}`);
  };

  const addToCart = (product: RecentProduct, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const cart = localStorage.getItem('cart');
      const cartItems = cart ? JSON.parse(cart) : [];
      
      const existingItem = cartItems.find((item: any) => item.id === product._id);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cartItems.push({
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.images[0]?.url,
          quantity: 1
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      
      toast({
        title: 'Added to Cart',
        description: `${product.name} has been added to your cart`
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add product to cart',
        variant: 'destructive'
      });
    }
  };

  const getDiscountPercentage = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const formatViewedTime = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (minutes < 60) {
      return `${minutes} min ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {showHeader && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Recently Viewed
            </CardTitle>
            <Button 
              variant="outline" 
              size="sm"
              onClick={clearRecentlyViewed}
            >
              Clear All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {recentProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onClick={() => handleProductClick(product)}
                  onRemove={() => removeFromRecentlyViewed(product._id)}
                  onAddToCart={(e) => addToCart(product, e)}
                  formatViewedTime={formatViewedTime}
                  getDiscountPercentage={getDiscountPercentage}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {!showHeader && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Recently Viewed
            </h3>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearRecentlyViewed}
            >
              Clear All
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {recentProducts.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onClick={() => handleProductClick(product)}
                onRemove={() => removeFromRecentlyViewed(product._id)}
                onAddToCart={(e) => addToCart(product, e)}
                formatViewedTime={formatViewedTime}
                getDiscountPercentage={getDiscountPercentage}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

interface ProductCardProps {
  product: RecentProduct;
  onClick: () => void;
  onRemove: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
  formatViewedTime: (timestamp: number) => string;
  getDiscountPercentage: (price: number, originalPrice?: number) => number | null;
}

function ProductCard({ 
  product, 
  onClick, 
  onRemove, 
  onAddToCart, 
  formatViewedTime, 
  getDiscountPercentage 
}: ProductCardProps) {
  const discount = getDiscountPercentage(product.price, product.originalPrice);
  
  return (
    <Card 
      className="group cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-3">
        <div className="relative">
          {/* Remove Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="absolute -top-1 -right-1 h-6 w-6 p-0 rounded-full bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <X className="h-3 w-3" />
          </Button>

          {/* Product Image */}
          <div className="aspect-square mb-3 relative overflow-hidden rounded-md">
            <img
              src={product.images[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
            {discount && (
              <Badge 
                variant="destructive" 
                className="absolute top-2 left-2 text-xs"
              >
                {discount}% OFF
              </Badge>
            )}
            {!product.inStock && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <Badge variant="secondary">Out of Stock</Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <div className="min-h-[2.5rem]">
              <h4 className="font-medium text-sm line-clamp-2">{product.name}</h4>
            </div>
            
            <p className="text-xs text-gray-600">{product.brand}</p>
            
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm">₹{product.price}</span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-xs text-gray-500 line-through">
                  ₹{product.originalPrice}
                </span>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xs ${
                      star <= product.averageRating ? 'text-yellow-400' : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-gray-600">
                ({product.totalReviews})
              </span>
            </div>

            {/* Viewed Time */}
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Clock className="h-3 w-3" />
              <span>{formatViewedTime(product.viewedAt)}</span>
            </div>

            {/* Add to Cart Button */}
            <Button
              size="sm"
              onClick={onAddToCart}
              disabled={!product.inStock}
              className="w-full text-xs h-8"
            >
              <ShoppingCart className="h-3 w-3 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Hook to add products to recently viewed
export const useRecentlyViewed = () => {
  const addToRecentlyViewed = (product: Omit<RecentProduct, 'viewedAt'>) => {
    try {
      const stored = localStorage.getItem('recentlyViewed');
      let products: RecentProduct[] = stored ? JSON.parse(stored) : [];
      
      // Remove if already exists
      products = products.filter(p => p._id !== product._id);
      
      // Add to beginning with current timestamp
      products.unshift({
        ...product,
        viewedAt: Date.now()
      });
      
      // Keep only recent 20 items
      products = products.slice(0, 20);
      
      localStorage.setItem('recentlyViewed', JSON.stringify(products));
    } catch (error) {
      console.error('Error saving to recently viewed:', error);
    }
  };

  return { addToRecentlyViewed };
};
