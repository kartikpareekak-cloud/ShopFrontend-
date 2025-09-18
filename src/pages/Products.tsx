import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Cart from "@/components/Cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Loader2, Filter, Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProductUpdates } from "@/contexts/SocketContext";
import useSEO from "@/hooks/useSEO";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: Array<{ url: string; alt: string }>;
  category: {
    _id: string;
    name: string;
  };
  brand?: string;
  rating?: {
    average: number;
    count: number;
  };
  inStock: boolean;
  stockQuantity: number;
  isFeatured: boolean;
  tags?: string[];
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 12,
    total: 0,
    pages: 0
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    brand: searchParams.get('brand') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: searchParams.get('inStock') === 'true' || false,
    sortBy: searchParams.get('sortBy') || 'createdAt:desc'
  });
  const [priceRange, setPriceRange] = useState([0, 10000]);

  const { toast } = useToast();

  // SEO
  useSEO({
    title: 'Products - Panditji Auto Connect | Premium Auto Parts Online',
    description: 'Browse our extensive collection of premium auto parts and accessories. Find genuine parts for all vehicle brands with competitive prices and fast delivery.',
    keywords: 'auto parts, car parts, bike parts, automotive accessories, brake pads, engine oil, spare parts',
    canonical: `${window.location.origin}/products`,
  });

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  // Real-time product updates
  useProductUpdates(() => {
    // Refetch products when there are updates
    fetchProducts();
  });

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      const page = searchParams.get('page') || '1';
      
      // Validate page number
      const pageNum = parseInt(page);
      if (isNaN(pageNum) || pageNum < 1) {
        setSearchParams({ page: '1' });
        return;
      }
      
      params.append('page', page);
      params.append('limit', '12');

      // Add filters to params
      if (filters.category) params.append('category', filters.category);
      if (filters.brand) params.append('brand', filters.brand);
      if (filters.minPrice && !isNaN(parseFloat(filters.minPrice))) {
        params.append('minPrice', filters.minPrice);
      }
      if (filters.maxPrice && !isNaN(parseFloat(filters.maxPrice))) {
        params.append('maxPrice', filters.maxPrice);
      }
      if (filters.inStock) params.append('inStock', 'true');
      if (filters.sortBy) params.append('sortBy', filters.sortBy);

      const response = await axios.get(`http://localhost:5004/api/products?${params.toString()}`);
      
      if (response.data.success) {
        setProducts(response.data.data || []);
        setPagination(response.data.pagination || { page: 1, limit: 12, total: 0, pages: 0 });
      } else {
        throw new Error(response.data.message || 'Failed to fetch products');
      }
    } catch (err: any) {
      console.error('Error fetching products:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to load products. Please try again.';
      setError(errorMessage);
      setProducts([]);
      setPagination({ page: 1, limit: 12, total: 0, pages: 0 });
      
      toast({
        title: "Error Loading Products",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value.toString());
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // Reset to first page when filtering
    setSearchParams(newParams);
  };

  const handlePriceRangeChange = (values: number[]) => {
    setPriceRange(values);
    handleFilterChange('minPrice', values[0]);
    handleFilterChange('maxPrice', values[1]);
  };

  const handlePageChange = (page: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', page.toString());
    setSearchParams(newParams);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (product: Product) => {
    try {
      if (!product.inStock) {
        toast({
          title: "Out of Stock",
          description: `${product.name} is currently out of stock.`,
          variant: "destructive",
        });
        return;
      }

      const existingItem = cartItems.find(item => item.id === product._id);
      
      if (existingItem) {
        // Check if adding one more would exceed stock
        if (existingItem.quantity >= product.stockQuantity) {
          toast({
            title: "Stock Limit Reached",
            description: `Cannot add more ${product.name}. Maximum available: ${product.stockQuantity}`,
            variant: "destructive",
          });
          return;
        }

        const updatedItems = cartItems.map(item =>
          item.id === product._id 
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      } else {
        const newItem: CartItem = {
          id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        };
        const updatedItems = [...cartItems, newItem];
        setCartItems(updatedItems);
        localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      }

      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive",
      });
    }
  };

  const removeFromCart = (productId: string) => {
    const updatedItems = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const updatedItems = cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    );
    setCartItems(updatedItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: 'createdAt:desc'
    });
    setPriceRange([0, 10000]);
    setSearchParams({});
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading products...</span>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header 
          cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
          onCartClick={() => setIsCartOpen(true)}
        />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={fetchProducts}>Try Again</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onCartClick={() => setIsCartOpen(true)}
      />

      <div className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Products</h1>
          <p className="text-gray-600">
            Discover our complete range of premium auto parts and accessories
          </p>
        </div>

        {/* Filters and Controls */}
        <div className="mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Filter Toggle & Sort */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              
              <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt:desc">Newest First</SelectItem>
                  <SelectItem value="createdAt:asc">Oldest First</SelectItem>
                  <SelectItem value="price:asc">Price: Low to High</SelectItem>
                  <SelectItem value="price:desc">Price: High to Low</SelectItem>
                  <SelectItem value="name:asc">Name: A to Z</SelectItem>
                  <SelectItem value="name:desc">Name: Z to A</SelectItem>
                  <SelectItem value="rating.average:desc">Highest Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* View Mode & Results Count */}
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} products
              </span>
              
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className={`lg:block lg:w-64 ${showFilters ? 'block' : 'hidden'} bg-white p-6 rounded-lg shadow-sm h-fit`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            </div>

            {/* Price Range */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
              </label>
              <Slider
                value={priceRange}
                onValueChange={handlePriceRangeChange}
                max={10000}
                min={0}
                step={100}
                className="mb-3"
              />
            </div>

            {/* Brand Filter */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand
              </label>
              <Input
                placeholder="Enter brand name"
                value={filters.brand}
                onChange={(e) => handleFilterChange('brand', e.target.value)}
              />
            </div>

            {/* Stock Filter */}
            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={filters.inStock}
                  onChange={(e) => handleFilterChange('inStock', e.target.checked)}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">In Stock Only</span>
              </label>
            </div>

            {/* Active Filters */}
            {(filters.brand || filters.minPrice || filters.maxPrice || filters.inStock) && (
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h4>
                <div className="flex flex-wrap gap-2">
                  {filters.brand && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('brand', '')}>
                      Brand: {filters.brand} ✕
                    </Badge>
                  )}
                  {(filters.minPrice || filters.maxPrice) && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => {
                      handleFilterChange('minPrice', '');
                      handleFilterChange('maxPrice', '');
                      setPriceRange([0, 10000]);
                    }}>
                      Price: ₹{filters.minPrice}-₹{filters.maxPrice} ✕
                    </Badge>
                  )}
                  {filters.inStock && (
                    <Badge variant="secondary" className="cursor-pointer" onClick={() => handleFilterChange('inStock', false)}>
                      In Stock ✕
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}>
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={product.image}
                      category={product.category.name}
                      rating={product.rating?.average}
                      isHot={product.isFeatured}
                      isDiscount={!!product.originalPrice}
                      inStock={product.inStock}
                      onAddToCart={() => addToCart(product)}
                      viewMode={viewMode}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                      let pageNum;
                      if (pagination.pages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={pagination.page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === pagination.pages}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      {/* Cart Sidebar */}
      <Cart
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
      >
        <div></div>
      </Cart>

      <Footer />
    </div>
  );
};

export default Products;