import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Star, Check, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';
import { Helmet } from 'react-helmet-async';
import api from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  images: Array<{ url: string; alt: string }>;
  brand: string;
  category: { name: string };
  specifications: Record<string, string>;
  features: string[];
  averageRating: number;
  totalReviews: number;
  inStock: boolean;
  stockQuantity: number;
}

interface ProductComparisonProps {
  initialProducts?: Product[];
  maxProducts?: number;
}

export default function ProductComparison({ 
  initialProducts = [], 
  maxProducts = 4 
}: ProductComparisonProps) {
  const [compareProducts, setCompareProducts] = useState<Product[]>(initialProducts);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Load comparison from localStorage
    const saved = localStorage.getItem('productComparison');
    if (saved && !initialProducts.length) {
      try {
        const products = JSON.parse(saved);
        setCompareProducts(products);
      } catch (error) {
        console.error('Error loading comparison:', error);
      }
    }
  }, [initialProducts]);

  useEffect(() => {
    // Save comparison to localStorage
    localStorage.setItem('productComparison', JSON.stringify(compareProducts));
  }, [compareProducts]);

  const searchProducts = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get('/search', {
        params: { q: query, limit: 10 }
      });
      setSearchResults(response.data.products || []);
    } catch (error) {
      console.error('Error searching products:', error);
      toast({
        title: 'Error',
        description: 'Failed to search products',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const addToComparison = (product: Product) => {
    if (compareProducts.length >= maxProducts) {
      toast({
        title: 'Comparison Limit',
        description: `You can only compare up to ${maxProducts} products at once`,
        variant: 'destructive'
      });
      return;
    }

    if (compareProducts.some(p => p._id === product._id)) {
      toast({
        title: 'Already Added',
        description: 'This product is already in comparison',
        variant: 'destructive'
      });
      return;
    }

    setCompareProducts(prev => [...prev, product]);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    
    toast({
      title: 'Added to Comparison',
      description: `${product.name} has been added to comparison`
    });
  };

  const removeFromComparison = (productId: string) => {
    setCompareProducts(prev => prev.filter(p => p._id !== productId));
    toast({
      title: 'Removed from Comparison',
      description: 'Product has been removed from comparison'
    });
  };

  const clearComparison = () => {
    setCompareProducts([]);
    toast({
      title: 'Comparison Cleared',
      description: 'All products have been removed from comparison'
    });
  };

  const getAllSpecificationKeys = () => {
    const allKeys = new Set<string>();
    compareProducts.forEach(product => {
      Object.keys(product.specifications || {}).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys).sort();
  };

  const getSpecificationValue = (product: Product, key: string) => {
    return product.specifications?.[key] || '-';
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
            }`}
          />
        ))}
        <span className="text-xs text-gray-600 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const getDiscountPercentage = (price: number, originalPrice?: number) => {
    if (!originalPrice || originalPrice <= price) return null;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  if (compareProducts.length === 0) {
    return (
      <div className="text-center py-12">
        <Helmet>
          <title>Product Comparison - Panditji Auto Connect</title>
          <meta name="description" content="Compare auto parts and accessories side by side to make informed purchase decisions." />
        </Helmet>
        
        <div className="max-w-md mx-auto">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Products to Compare
          </h3>
          <p className="text-gray-600 mb-6">
            Add products to comparison to see detailed side-by-side comparisons.
          </p>
          
          <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Products to Compare
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Add Product to Comparison</DialogTitle>
                <DialogDescription>
                  Search for products to add to your comparison
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    searchProducts(e.target.value);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {loading ? (
                    <div className="text-center py-4">
                      <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                    </div>
                  ) : searchResults.length > 0 ? (
                    searchResults.map(product => (
                      <div
                        key={product._id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => addToComparison(product)}
                      >
                        <img
                          src={product.images[0]?.url}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600">{product.brand}</p>
                          <p className="text-sm font-medium">₹{product.price}</p>
                        </div>
                        <Button size="sm" variant="outline">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    ))
                  ) : searchQuery.length > 0 ? (
                    <div className="text-center py-4 text-gray-600">
                      No products found for "{searchQuery}"
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-600">
                      Start typing to search for products
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Helmet>
        <title>Product Comparison - Panditji Auto Connect</title>
        <meta name="description" content="Compare auto parts and accessories side by side to make informed purchase decisions." />
      </Helmet>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Comparison</h1>
          <p className="text-gray-600">
            Compare {compareProducts.length} of {maxProducts} products
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          {compareProducts.length < maxProducts && (
            <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Product to Comparison</DialogTitle>
                  <DialogDescription>
                    Search for products to add to your comparison
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      searchProducts(e.target.value);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  
                  <div className="max-h-80 overflow-y-auto space-y-2">
                    {loading ? (
                      <div className="text-center py-4">
                        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map(product => (
                        <div
                          key={product._id}
                          className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => addToComparison(product)}
                        >
                          <img
                            src={product.images[0]?.url}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium">{product.name}</h4>
                            <p className="text-sm text-gray-600">{product.brand}</p>
                            <p className="text-sm font-medium">₹{product.price}</p>
                          </div>
                          <Button size="sm" variant="outline">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ))
                    ) : searchQuery.length > 0 ? (
                      <div className="text-center py-4 text-gray-600">
                        No products found for "{searchQuery}"
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-600">
                        Start typing to search for products
                      </div>
                    )}
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          )}
          
          <Button variant="outline" onClick={clearComparison}>
            Clear All
          </Button>
        </div>
      </div>

      {/* Comparison Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Products</td>
                  {compareProducts.map(product => (
                    <td key={product._id} className="p-4 min-w-[250px]">
                      <div className="relative">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromComparison(product._id)}
                          className="absolute -top-2 -right-2 h-6 w-6 p-0 rounded-full bg-red-100 hover:bg-red-200"
                        >
                          <X className="h-3 w-3 text-red-600" />
                        </Button>
                        
                        <div className="space-y-3">
                          <img
                            src={product.images[0]?.url}
                            alt={product.name}
                            className="w-full h-32 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-medium text-sm">{product.name}</h3>
                            <p className="text-xs text-gray-600">{product.brand}</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  ))}
                </tr>
              </thead>
              
              <tbody>
                {/* Price */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Price</td>
                  {compareProducts.map(product => (
                    <td key={product._id} className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold">₹{product.price}</span>
                          {product.originalPrice && product.originalPrice > product.price && (
                            <Badge variant="destructive" className="text-xs">
                              {getDiscountPercentage(product.price, product.originalPrice)}% OFF
                            </Badge>
                          )}
                        </div>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <span className="text-sm text-gray-500 line-through">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Rating */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Rating</td>
                  {compareProducts.map(product => (
                    <td key={product._id} className="p-4">
                      <div className="space-y-1">
                        {renderStars(product.averageRating)}
                        <p className="text-xs text-gray-600">
                          {product.totalReviews} reviews
                        </p>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Stock Status */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Availability</td>
                  {compareProducts.map(product => (
                    <td key={product._id} className="p-4">
                      <div className="flex items-center gap-2">
                        {product.inStock ? (
                          <>
                            <Check className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600">In Stock</span>
                          </>
                        ) : (
                          <>
                            <X className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-600">Out of Stock</span>
                          </>
                        )}
                      </div>
                      {product.inStock && product.stockQuantity <= 5 && (
                        <p className="text-xs text-orange-600 mt-1">
                          Only {product.stockQuantity} left
                        </p>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Category */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Category</td>
                  {compareProducts.map(product => (
                    <td key={product._id} className="p-4">
                      <Badge variant="secondary">{product.category.name}</Badge>
                    </td>
                  ))}
                </tr>

                {/* Features */}
                <tr className="border-b">
                  <td className="p-4 font-medium text-gray-900 bg-gray-50">Key Features</td>
                  {compareProducts.map(product => (
                    <td key={product._id} className="p-4">
                      <ul className="space-y-1">
                        {product.features.slice(0, 5).map((feature, index) => (
                          <li key={index} className="text-sm flex items-start gap-1">
                            <Check className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                        {product.features.length > 5 && (
                          <li className="text-xs text-gray-500">
                            +{product.features.length - 5} more features
                          </li>
                        )}
                      </ul>
                    </td>
                  ))}
                </tr>

                {/* Specifications */}
                {getAllSpecificationKeys().map(specKey => (
                  <tr key={specKey} className="border-b">
                    <td className="p-4 font-medium text-gray-900 bg-gray-50">
                      {specKey}
                    </td>
                    {compareProducts.map(product => (
                      <td key={product._id} className="p-4">
                        <span className="text-sm">
                          {getSpecificationValue(product, specKey)}
                        </span>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2">
        {compareProducts.map(product => (
          <Button key={product._id} className="flex-1 min-w-[200px]">
            Add {product.name} to Cart
          </Button>
        ))}
      </div>
    </div>
  );
}
