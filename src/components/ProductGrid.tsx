import { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

interface Product {
  id: string;
  _id?: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  imageUrl?: string;
  category: string;
  isHot?: boolean;
  isDiscount?: boolean;
  rating?: number;
}

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ onAddToCart }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5004/api/products');
        
        if (response.data.success) {
          // Transform the API response to match our Product interface
          const apiProducts = response.data.data.map((product: any) => ({
            id: product._id,
            _id: product._id,
            name: product.name,
            price: product.price,
            originalPrice: product.originalPrice,
            image: product.imageUrl || product.image || "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400",
            category: product.category?.name || product.category || "General",
            isHot: Math.random() > 0.7, // Random hot items for demo
            isDiscount: product.originalPrice && product.originalPrice > product.price,
            rating: product.rating?.average || 4.5
          }));
          
          setProducts(apiProducts);
        } else {
          setError('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again.');
        
        // Fallback to sample data if API fails
        const fallbackProducts: Product[] = [
          {
            id: "1",
            name: "High-Performance LED Light Bar 42 Inch",
            price: 12999,
            originalPrice: 15999,
            image: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=400",
            category: "Auxiliary Lights",
            isHot: true,
            isDiscount: true,
            rating: 4.5
          },
          {
            id: "2", 
            name: "Premium Air Horn Kit with Compressor",
            price: 8500,
            image: "https://images.unsplash.com/photo-1609974936665-bb6c2f7f31e6?w=400",
            category: "Horns & Sounds",
            rating: 4.8
          },
          {
            id: "3",
            name: "Carbon Fiber Side Skirts Set",
            price: 25000,
            originalPrice: 28000,
            image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400",
            category: "Modifications",
            isDiscount: true,
            rating: 4.3
          }
        ];
        setProducts(fallbackProducts);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Dynamic category options based on loaded products
  const categoryOptions = ["All", ...Array.from(new Set(products.map(p => p.category))).sort()];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = selectedCategory === "All" 
    ? products 
    : products.filter(product => product.category === selectedCategory);

  if (loading) {
    return (
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-automotive mb-4">Shop by Category</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Loading our premium automotive accessories...
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="bg-gray-200 h-64 rounded-lg mb-4"></div>
                <div className="bg-gray-200 h-4 rounded mb-2"></div>
                <div className="bg-gray-200 h-4 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-automotive mb-4">Shop by Category</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover our extensive collection of premium automotive accessories designed to enhance your vehicle's performance and style.
          </p>
          {error && (
            <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-yellow-800">{error}</p>
            </div>
          )}
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 mb-8">
            {categoryOptions.slice(0, 7).map((category) => (
              <TabsTrigger 
                key={category} 
                value={category}
                className="text-xs lg:text-sm"
              >
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No products found in this category.</p>
            </div>
          ) : (
            filteredProducts.map((product) => (
              <ProductCard 
                key={product.id || product._id}
                id={product.id}
                name={product.name}
                price={product.price}
                originalPrice={product.originalPrice}
                image={product.image}
                category={product.category}
                isHot={product.isHot}
                isDiscount={product.isDiscount}
                rating={product.rating}
                inStock={true}
                onAddToCart={() => onAddToCart(product)}
              />
            ))
          )}
        </div>

        {/* Load More Button */}
        {filteredProducts.length > 0 && (
          <div className="text-center">
            <Button variant="outline" size="lg" className="px-8">
              Load More Products
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;