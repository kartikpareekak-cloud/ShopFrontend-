import React from 'react';

interface AutoFallbackImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
  alt: string;
}

export const AutoFallbackImage: React.FC<AutoFallbackImageProps> = ({
  src,
  fallbackSrc = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
  alt,
  className,
  ...props
}) => {
  const [imageSrc, setImageSrc] = React.useState(src || fallbackSrc);
  const [hasError, setHasError] = React.useState(false);

  React.useEffect(() => {
    setImageSrc(src || fallbackSrc);
    setHasError(false);
  }, [src, fallbackSrc]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImageSrc(fallbackSrc);
    }
  };

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      {...props}
    />
  );
};

// For automotive parts with category-specific fallbacks
export const AutomotivePartImage: React.FC<AutoFallbackImageProps & { category?: string }> = ({
  src,
  category,
  alt,
  className,
  ...props
}) => {
  const getCategoryFallback = (categoryName?: string) => {
    const categoryFallbacks = {
      'Engine Parts': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      'Electrical': 'https://images.unsplash.com/photo-1544829099-b9a0c5303bea?w=400&h=400&fit=crop',
      'Suspension': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      'Accessories': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      'Tires & Wheels': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop',
      'Brake System': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop'
    };
    
    return categoryFallbacks[categoryName as keyof typeof categoryFallbacks] || 
           'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop';
  };

  return (
    <AutoFallbackImage
      src={src}
      fallbackSrc={getCategoryFallback(category)}
      alt={alt}
      className={className}
      {...props}
    />
  );
};

export default AutoFallbackImage;
