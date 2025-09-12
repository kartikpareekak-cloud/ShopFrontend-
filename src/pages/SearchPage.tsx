import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import AdvancedSearch from '@/components/AdvancedSearch';
import ProductComparison from '@/components/ProductComparison';
import LazyImage from '@/components/LazyImage';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { 
  Grid3X3,
  List,
  Filter,
  Star,
  ShoppingCart,
  Eye,
  Heart
} from 'lucide-react';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: {
    _id: string;
    name: string;
  };
  brand: string;
  averageRating: number;
  totalReviews: number;
  inStock: boolean;
  isFeatured: boolean;
}

const SearchPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('relevance');
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    minPrice: '',
    maxPrice: '',
    rating: '',
    inStock: false
  });

  // Get initial search query from URL
  const initialQuery = searchParams.get('q') || '';
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  useEffect(() => {
    if (searchQuery || Object.values(filters).some(Boolean)) {
      performSearch();
    }
  }, [searchQuery, filters, sortBy]);

  const performSearch = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams();
      if (searchQuery) params.append('q', searchQuery);
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice) params.append('minPrice', filters.minPrice);
      if (filters.maxPrice) params.append('maxPrice', filters.maxPrice);
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.inStock) params.append('inStock', 'true');
      params.append('sortBy', sortBy);

      const response = await fetch(`http://localhost:5004/api/search/products?${params}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      }
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        title: 'Search Error',
        description: 'Failed to search products. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (query: string, searchFilters: any) => {
    setSearchQuery(query);
    setFilters(prev => ({ ...prev, ...searchFilters }));
    
    // Update URL
    const params = new URLSearchParams();
    if (query) params.append('q', query);
    setSearchParams(params);
  };

  const handleAddToCart = (product: Product) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    const existingItem = cartItems.find((item: any) => item._id === product._id);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cartItems.push({
        ...product,
        quantity: 1
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been added to your cart`
    });
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
      />
    ));
  };

  const ProductCard: React.FC<{ product: Product }> = ({ product }) => (
    <Card className="group hover:shadow-lg transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
          <LazyImage
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              {product.category.name}
            </Badge>
            {product.isFeatured && (
              <Badge variant="default" className="text-xs">Featured</Badge>
            )}
          </div>
          
          <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center gap-1">
            {renderStars(Math.floor(product.averageRating))}
            <span className="text-sm text-gray-600">({product.totalReviews})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-sm text-gray-500 line-through">
                ₹{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <Button
              onClick={() => navigate(`/product/${product._id}`)}
              variant="outline"
              size="sm"
              className="flex-1"
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            <Button
              onClick={() => handleAddToCart(product)}
              size="sm"
              className="flex-1"
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const ProductListItem: React.FC<{ product: Product }> = ({ product }) => (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-32 h-32 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
            <LazyImage
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {product.category.name}
              </Badge>
              {product.isFeatured && (
                <Badge variant="default" className="text-xs">Featured</Badge>
              )}
            </div>
            
            <h3 className="font-semibold text-lg hover:text-blue-600 transition-colors cursor-pointer"
                onClick={() => navigate(`/product/${product._id}`)}>
              {product.name}
            </h3>
            
            <p className="text-gray-600 text-sm line-clamp-2">{product.description}</p>
            
            <div className="flex items-center gap-1">
              {renderStars(Math.floor(product.averageRating))}
              <span className="text-sm text-gray-600">({product.totalReviews})</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹{product.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={() => navigate(`/product/${product._id}`)}
                  variant="outline"
                  size="sm"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
                <Button
                  onClick={() => handleAddToCart(product)}
                  size="sm"
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="w-4 h-4 mr-1" />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Advanced Search Component */}
        <div className="mb-8">
          <AdvancedSearch
            onSearch={handleSearchSubmit}
          />
        </div>

        {/* Search Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Products'}
            </h1>
            <p className="text-gray-600">
              {loading ? 'Searching...' : `${products.length} products found`}
            </p>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Sort Options */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low-high">Price: Low to High</SelectItem>
                <SelectItem value="price-high-low">Price: High to Low</SelectItem>
                <SelectItem value="rating">Customer Rating</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="popular">Most Popular</SelectItem>
              </SelectContent>
            </Select>
            
            {/* View Mode Toggle */}
            <div className="flex border rounded-lg">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                className="rounded-r-none"
              >
                <Grid3X3 className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                className="rounded-l-none"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Products Grid/List */}
        {!loading && products.length > 0 && (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
              : 'space-y-4'
          }>
            {products.map((product) => (
              viewMode === 'grid' 
                ? <ProductCard key={product._id} product={product} />
                : <ProductListItem key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* No Results */}
        {!loading && products.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600 mb-4">
                We couldn't find any products matching your search. Try adjusting your search terms or filters.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setFilters({
                  category: '',
                  brand: '',
                  minPrice: '',
                  maxPrice: '',
                  rating: '',
                  inStock: false
                });
                setSearchParams({});
              }}>
                Clear Search
              </Button>
            </div>
          </div>
        )}

        {/* Product Comparison */}
        <div className="mt-12">
          <ProductComparison />
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
