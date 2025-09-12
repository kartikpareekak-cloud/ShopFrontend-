import React from 'react';
import ProductComparison from '@/components/ProductComparison';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ComparisonPage() {
  const handleCartClick = () => {
    // Handle cart click
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemCount={0} 
        onCartClick={handleCartClick}
      />
      
      <main className="container mx-auto px-4 py-8">
        <ProductComparison />
      </main>
      
      <Footer />
    </div>
  );
}
