import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TrustedBrands from "@/components/TrustedBrands";
import ProductGrid from "@/components/ProductGrid";
import Cart from "@/components/Cart";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import useSEO from "@/hooks/useSEO";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isHot?: boolean;
  isDiscount?: boolean;
  rating?: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { toast } = useToast();

  // SEO for homepage
  useSEO({
    title: 'Panditji Auto Connect - Premium Auto Parts & Accessories Online',
    description: 'Shop genuine auto parts, car accessories, and bike parts online. Trusted by thousands with fast delivery, competitive prices, and quality guarantee.',
    keywords: 'auto parts online, car parts, bike parts, genuine auto parts, automotive accessories, brake pads, engine oil, spare parts India',
    canonical: 'https://pandijiautoconnect.com/',
    ogTitle: 'Panditji Auto Connect - India\'s Premium Auto Parts Store',
    ogDescription: 'Discover premium auto parts and accessories for all vehicle brands. Genuine quality, competitive prices, fast delivery.',
    structuredData: {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "Panditji Auto Connect",
      "description": "Premium auto parts and accessories online store",
      "url": "https://pandijiautoconnect.com",
      "logo": "https://pandijiautoconnect.com/logo.png",
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+91-XXXXXXXXXX",
        "contactType": "customer service"
      }
    }
  });

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      try {
        const parsedItems = JSON.parse(savedCartItems);
        setCartItems(parsedItems);
      } catch (error) {
        console.error('Failed to parse cart items from localStorage:', error);
        localStorage.removeItem('cartItems');
      }
    }
  }, []);

  // Save cart items to localStorage whenever cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } else {
      localStorage.removeItem('cartItems');
    }
  }, [cartItems]);

  const handleAddToCart = (product: Product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      
      if (existingItem) {
        toast({
          title: "Updated cart",
          description: `${product.name} quantity updated`,
        });
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        toast({
          title: "Added to cart",
          description: `${product.name} added to your cart`,
        });
        return [...prevItems, {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: 1
        }];
      }
    });
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity === 0) {
      handleRemoveItem(id);
      return;
    }
    
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({
      title: "Removed from cart",
      description: "Item removed from your cart",
    });
  };

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartItemCount={cartItemCount}
        onCartClick={() => setIsCartOpen(true)}
      />
      
      <main>
        <Hero />
        <TrustedBrands />
        <ProductGrid onAddToCart={handleAddToCart} />
      </main>

      <Footer />

      <Cart
        isOpen={isCartOpen}
        onOpenChange={setIsCartOpen}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      >
        <div />
      </Cart>
    </div>
  );
};

export default Index;
