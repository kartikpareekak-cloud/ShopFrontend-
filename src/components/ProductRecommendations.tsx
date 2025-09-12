import React, { useState, useEffect } from 'react';
import { Star, ShoppingCart, Eye, TrendingUp, Users, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import LazyImage from '@/components/LazyImage';
import { AutoFallbackImage } from '@/components/ui/AutoFallbackImage';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import api from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: Array<{ url: string; alt: string }>;
  brand: string;
  category: { _id: string; name: string };
  averageRating: number;
  totalReviews: number;
  inStock: boolean;
  stockQuantity: number;
}

interface RecommendationProps {
  productId?: string;
  categoryId?: string;
  userId?: string;
  type: 'similar' | 'related' | 'trending' | 'personalized' | 'cross-sell' | 'recently-viewed';
  title?: string;
  maxItems?: number;
  showHeader?: boolean;
  className?: string;
}

export default function ProductRecommendations({
  productId,
  categoryId,
  userId,
  type,
  title,
  maxItems = 6,
  showHeader = true,
  className = ''
}: RecommendationProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchRecommendations();
  }, [productId, categoryId, userId, type]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      let endpoint = '/recommendations';
      const params: any = { type, limit: maxItems };

      if (productId) params.productId = productId;
      if (categoryId) params.categoryId = categoryId;
      if (userId) params.userId = userId;

      const response = await api.get(endpoint, { params });
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Fallback to popular products
      try {
        const fallbackResponse = await api.get('/products', {
          params: { limit: maxItems, sortBy: 'popularity' }
        });
        setProducts(fallbackResponse.data.products || []);
      } catch (fallbackError) {
        console.error('Error fetching fallback products:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const getRecommendationTitle = () => {
    if (title) return title;
    
    switch (type) {
      case 'similar':
        return 'Similar Products';
      case 'related':
        return 'Related Products';
      case 'trending':
        return 'Trending Now';
      case 'personalized':
        return 'Recommended For You';
      case 'cross-sell':
        return 'Frequently Bought Together';
      case 'recently-viewed':
        return 'Recently Viewed';
      default:
        return 'You Might Like';
    }
  };

  const getRecommendationIcon = () => {
    switch (type) {
      case 'similar':
      case 'related':
        return <Target className="h-5 w-5" />;
      case 'trending':
        return <TrendingUp className="h-5 w-5" />;
      case 'personalized':
        return <Users className="h-5 w-5" />;
      case 'cross-sell':
        return <ShoppingCart className="h-5 w-5" />;
      case 'recently-viewed':
        return <Eye className="h-5 w-5" />;
      default:
        return <Star className="h-5 w-5" />;
    }
  };

  const handleProductClick = (product: Product) => {
    navigate(`/product/${product._id}`);
  };

  const addToCart = (product: Product, e: React.MouseEvent) => {
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

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className={className}>
        {showHeader && (
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-4 w-64" />
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: maxItems }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <Skeleton className="aspect-square mb-3" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-3 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-3" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {showHeader && (
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            {getRecommendationIcon()}
            <h2 className="text-xl font-semibold">{getRecommendationTitle()}</h2>
          </div>
          <p className="text-gray-600 text-sm">
            Based on your browsing history and preferences
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <ProductRecommendationCard
            key={product._id}
            product={product}
            onClick={() => handleProductClick(product)}
            onAddToCart={(e) => addToCart(product, e)}
            getDiscountPercentage={getDiscountPercentage}
            renderStars={renderStars}
          />
        ))}
      </div>
    </div>
  );
}

interface ProductRecommendationCardProps {
  product: Product;
  onClick: () => void;
  onAddToCart: (e: React.MouseEvent) => void;
  getDiscountPercentage: (price: number, originalPrice?: number) => number | null;
  renderStars: (rating: number) => JSX.Element;
}

function ProductRecommendationCard({
  product,
  onClick,
  onAddToCart,
  getDiscountPercentage,
  renderStars
}: ProductRecommendationCardProps) {
  const discount = getDiscountPercentage(product.price, product.originalPrice);

  return (
    <Card 
      className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="relative mb-3">
          <div className="aspect-square overflow-hidden rounded-lg">
            <AutoFallbackImage
              src={product.images[0]?.url}
              alt={product.name}
              className="w-full h-full object-cover transition-transform group-hover:scale-105"
            />
          </div>
          
          {discount && (
            <Badge 
              variant="destructive" 
              className="absolute top-2 left-2 text-xs"
            >
              {discount}% OFF
            </Badge>
          )}
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
              <Badge variant="secondary">Out of Stock</Badge>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="min-h-[2.5rem]">
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
              {product.name}
            </h3>
          </div>
          
          <p className="text-xs text-gray-600">{product.brand}</p>
          
          <div className="flex items-center gap-1 text-xs">
            {renderStars(product.averageRating)}
            <span className="text-gray-500 ml-1">({product.totalReviews})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">₹{product.price}</span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice}
              </span>
            )}
          </div>

          {product.inStock && product.stockQuantity <= 5 && (
            <p className="text-xs text-orange-600">
              Only {product.stockQuantity} left in stock
            </p>
          )}

          <Button
            onClick={onAddToCart}
            disabled={!product.inStock}
            className="w-full text-sm h-9 mt-3"
            variant={product.inStock ? "default" : "secondary"}
          >
            <ShoppingCart className="h-3 w-3 mr-2" />
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// Specific recommendation components for different use cases
export function SimilarProducts({ productId, maxItems = 4 }: { productId: string; maxItems?: number }) {
  return (
    <ProductRecommendations
      productId={productId}
      type="similar"
      maxItems={maxItems}
      className="mt-8"
    />
  );
}

export function TrendingProducts({ maxItems = 6 }: { maxItems?: number }) {
  return (
    <ProductRecommendations
      type="trending"
      maxItems={maxItems}
      title="Trending This Week"
      className="mb-8"
    />
  );
}

export function PersonalizedRecommendations({ userId, maxItems = 6 }: { userId?: string; maxItems?: number }) {
  return (
    <ProductRecommendations
      userId={userId}
      type="personalized"
      maxItems={maxItems}
      className="mb-8"
    />
  );
}

export function CrossSellProducts({ productId, maxItems = 4 }: { productId: string; maxItems?: number }) {
  return (
    <ProductRecommendations
      productId={productId}
      type="cross-sell"
      maxItems={maxItems}
      showHeader={false}
      className="mt-6"
    />
  );
}
