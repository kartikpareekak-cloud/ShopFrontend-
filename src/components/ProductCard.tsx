import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isHot?: boolean;
  isDiscount?: boolean;
  rating?: number;
  inStock?: boolean;
  viewMode?: 'grid' | 'list';
  onAddToCart: () => void;
}

const ProductCard = ({ 
  name, 
  price, 
  originalPrice, 
  image, 
  category, 
  isHot, 
  isDiscount, 
  rating, 
  inStock = true,
  viewMode = 'grid',
  onAddToCart 
}: ProductCardProps) => {
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : 0;

  if (viewMode === 'list') {
    return (
      <Card className="group hover:shadow-lg transition-all duration-300 bg-card">
        <div className="flex">
          {/* Product Image */}
          <div className="relative w-48 h-48 flex-shrink-0 overflow-hidden rounded-l-lg">
            {/* Badges */}
            <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
              {isHot && (
                <Badge className="bg-primary text-primary-foreground font-semibold">
                  HOT
                </Badge>
              )}
              {isDiscount && discountPercentage > 0 && (
                <Badge variant="destructive" className="font-semibold">
                  -{discountPercentage}%
                </Badge>
              )}
            </div>

            <div className="w-full h-full bg-muted/30 flex items-center justify-center overflow-hidden">
              <img 
                src={image} 
                alt={name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </div>

          {/* Product Details */}
          <CardContent className="flex-1 p-6">
            <div className="flex justify-between items-start h-full">
              <div className="flex-1">
                {/* Category */}
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                  {category}
                </p>

                {/* Product Name */}
                <h3 className="font-semibold text-automotive mb-2 text-lg">
                  {name}
                </h3>

                {/* Rating */}
                {rating && (
                  <div className="flex items-center gap-1 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(rating) 
                              ? 'text-yellow-500 fill-current' 
                              : 'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">({rating})</span>
                  </div>
                )}

                {/* Stock Status */}
                <div className="mb-3">
                  <span className={`text-sm ${inStock ? 'text-green-600' : 'text-red-600'}`}>
                    {inStock ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>

              <div className="ml-6 text-right">
                {/* Price */}
                <div className="mb-4">
                  <span className="text-xl font-bold text-automotive">
                    ₹{price.toLocaleString()}
                  </span>
                  {originalPrice && (
                    <div className="text-sm text-muted-foreground line-through">
                      ₹{originalPrice.toLocaleString()}
                    </div>
                  )}
                </div>

                {/* Add to Cart Button */}
                <Button 
                  className="group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  variant="outline"
                  onClick={onAddToCart}
                  disabled={!inStock}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {inStock ? 'Add to Cart' : 'Out of Stock'}
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    );
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card">
      <div className="relative overflow-hidden rounded-t-lg">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
          {isHot && (
            <Badge className="bg-primary text-primary-foreground font-semibold">
              HOT
            </Badge>
          )}
          {isDiscount && discountPercentage > 0 && (
            <Badge variant="destructive" className="font-semibold">
              -{discountPercentage}%
            </Badge>
          )}
        </div>

        {/* Product Image */}
        <div className="aspect-square bg-muted/30 flex items-center justify-center overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      <CardContent className="p-4">
        {/* Category */}
        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
          {category}
        </p>

        {/* Product Name */}
        <h3 className="font-semibold text-automotive mb-2 line-clamp-2 leading-tight">
          {name}
        </h3>

        {/* Rating */}
        {rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(rating) 
                      ? 'text-yellow-500 fill-current' 
                      : 'text-muted-foreground'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({rating})</span>
          </div>
        )}

        {/* Stock Status */}
        {!inStock && (
          <div className="mb-3">
            <span className="text-sm text-red-600">Out of Stock</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg font-bold text-automotive">
            ₹{price.toLocaleString()}
          </span>
          {originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              ₹{originalPrice.toLocaleString()}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <Button 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          variant="outline"
          onClick={onAddToCart}
          disabled={!inStock}
        >
          <ShoppingCart className="h-4 w-4 mr-2" />
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;