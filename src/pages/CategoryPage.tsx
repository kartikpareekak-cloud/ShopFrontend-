import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ProductCard from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package } from 'lucide-react';
import api from '@/lib/api';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: Array<{ url: string }>;
  category: {
    _id: string;
    name: string;
  };
  brand: string;
  rating: {
    average: number;
    count: number;
  };
  inStock: boolean;
  stockQuantity: number;
}

const CategoryPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);

        // Convert slug back to category name
        const categoryName = slug.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => 
          txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
        );

        // For now, get all products and filter by category name
        const response = await api.get('/products');
        const allProducts = response.data?.data || response.data || [];
        
        // Filter products by category name
        const filteredProducts = allProducts.filter((product: Product) => 
          product.category?.name?.toLowerCase() === categoryName.toLowerCase()
        );

        setProducts(filteredProducts);

      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  // Convert slug back to display name
  const categoryDisplayName = slug ? 
    slug.replace(/-/g, ' ').replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    ) : '';

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
            <p>Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => navigate('/')}>
              Go Back Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoryDisplayName}</h1>
          <p className="text-sm text-gray-500 mt-2">
            {products.length} product{products.length !== 1 ? 's' : ''} found
          </p>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No products found
            </h2>
            <p className="text-gray-600 mb-6">
              There are no products available in this category yet.
            </p>
            <Button onClick={() => navigate('/')}>
              Browse All Products
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product._id} 
                product={{
                  id: product._id,
                  name: product.name,
                  price: product.price,
                  image: product.images?.[0]?.url || '/placeholder.svg',
                  category: product.category?.name || 'Unknown',
                  rating: product.rating?.average || 0,
                  isHot: product.rating?.count > 10,
                  isDiscount: false
                }}
                onAddToCart={(product) => {
                  // Add to cart logic - for now just log
                  console.log('Adding to cart:', product);
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;