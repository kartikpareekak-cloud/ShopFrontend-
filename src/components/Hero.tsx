import { Button } from "@/components/ui/button";
import { ArrowRight, Zap, Shield, Truck } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-automotive to-automotive/90 text-automotive-foreground py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Unleashing Your Performance
          </h1>
          <p className="text-xl md:text-2xl mb-4 text-automotive-foreground/90">
            Maha Laxmi AutoMobile
          </p>
          <p className="text-lg mb-8 text-automotive-foreground/80 max-w-2xl mx-auto">
            Premium vehicle accessories and parts for enthusiasts who demand excellence. Transform your ride with our curated collection of high-performance upgrades.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 hover:scale-105 transition-transform"
            >
              Shop Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="text-lg px-8 py-6 bg-white text-slate-900 border-2 border-white hover:bg-slate-100 hover:scale-105 transition-all"
            >
              View Categories
            </Button>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/20 p-4 rounded-full mb-4">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">High Performance</h3>
              <p className="text-automotive-foreground/70">Premium quality parts for maximum performance</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/20 p-4 rounded-full mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Trusted Brands</h3>
              <p className="text-automotive-foreground/70">Only authentic products from verified manufacturers</p>
            </div>
            
            <div className="flex flex-col items-center text-center">
              <div className="bg-primary/20 p-4 rounded-full mb-4">
                <Truck className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-automotive-foreground/70">Quick shipping across India with order tracking</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;