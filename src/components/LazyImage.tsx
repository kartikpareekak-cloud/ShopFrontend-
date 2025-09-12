import React, { useState, useRef, useEffect } from 'react';
import { ImageIcon, AlertTriangle } from 'lucide-react';

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallbackSrc?: string;
  placeholder?: React.ReactNode;
  errorFallback?: React.ReactNode;
  className?: string;
  onLoad?: () => void;
  onError?: () => void;
  threshold?: number;
  rootMargin?: string;
}

export default function LazyImage({
  src,
  alt,
  fallbackSrc,
  placeholder,
  errorFallback,
  className = '',
  onLoad,
  onError,
  threshold = 0.1,
  rootMargin = '50px',
  ...props
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    // Create intersection observer
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          setCurrentSrc(src);
          observerRef.current?.unobserve(img);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observerRef.current.observe(img);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, threshold, rootMargin]);

  const handleLoad = () => {
    setIsLoaded(true);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      onError?.();
    }
  };

  const defaultPlaceholder = (
    <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
      <ImageIcon className="h-8 w-8 text-gray-400" />
    </div>
  );

  const defaultErrorFallback = (
    <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
      <AlertTriangle className="h-8 w-8 text-gray-400" />
    </div>
  );

  if (hasError && !fallbackSrc) {
    return errorFallback || defaultErrorFallback;
  }

  return (
    <div className={`relative ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (placeholder || defaultPlaceholder)}
      
      {/* Actual Image */}
      <img
        ref={imgRef}
        src={currentSrc || undefined}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={`transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        } ${isLoaded ? className : 'absolute inset-0'}`}
        {...props}
      />
      
      {/* Loading overlay */}
      {isInView && currentSrc && !isLoaded && !hasError && (
        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
      )}
    </div>
  );
}

// Progressive Image Component with multiple sources
interface ProgressiveImageProps {
  src: string;
  lowQualitySrc?: string;
  alt: string;
  className?: string;
  onLoad?: () => void;
}

export function ProgressiveImage({
  src,
  lowQualitySrc,
  alt,
  className = '',
  onLoad
}: ProgressiveImageProps) {
  const [currentSrc, setCurrentSrc] = useState(lowQualitySrc || src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [highQualityLoaded, setHighQualityLoaded] = useState(false);

  useEffect(() => {
    if (lowQualitySrc && src !== lowQualitySrc) {
      // Start loading high quality image
      const img = new Image();
      img.onload = () => {
        setCurrentSrc(src);
        setHighQualityLoaded(true);
        onLoad?.();
      };
      img.src = src;
    }
  }, [src, lowQualitySrc, onLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
    if (!lowQualitySrc || src === lowQualitySrc) {
      onLoad?.();
    }
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={currentSrc}
        alt={alt}
        onLoad={handleLoad}
        className={`w-full h-full object-cover transition-all duration-300 ${
          lowQualitySrc && !highQualityLoaded 
            ? 'filter blur-sm scale-110' 
            : 'filter-none scale-100'
        }`}
      />
      
      {isLoaded && lowQualitySrc && !highQualityLoaded && (
        <div className="absolute inset-0 bg-gradient-to-t from-transparent to-transparent">
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      )}
    </div>
  );
}

// Image Gallery with lazy loading
interface ImageGalleryProps {
  images: Array<{ url: string; alt: string; lowQuality?: string }>;
  className?: string;
  maxImages?: number;
  onImageClick?: (index: number) => void;
}

export function ImageGallery({
  images,
  className = '',
  maxImages = 6,
  onImageClick
}: ImageGalleryProps) {
  const displayImages = images.slice(0, maxImages);
  const remainingCount = Math.max(0, images.length - maxImages);

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-2 ${className}`}>
      {displayImages.map((image, index) => (
        <div
          key={index}
          className="aspect-square cursor-pointer group relative overflow-hidden rounded-lg"
          onClick={() => onImageClick?.(index)}
        >
          <ProgressiveImage
            src={image.url}
            lowQualitySrc={image.lowQuality}
            alt={image.alt}
            className="w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
          
          {index === maxImages - 1 && remainingCount > 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-medium text-lg">
                +{remainingCount}
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Hook for preloading images
export const useImagePreloader = () => {
  const preloadImages = (urls: string[]) => {
    urls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  };

  return { preloadImages };
};

// Image optimization utilities
export const imageUtils = {
  // Generate responsive image URLs (if using a CDN that supports it)
  getResponsiveUrl: (
    baseUrl: string, 
    width: number, 
    quality: number = 80
  ): string => {
    // This would depend on your CDN/image service
    // Example for Cloudinary: return baseUrl.replace('/upload/', `/upload/w_${width},q_${quality}/`);
    return baseUrl;
  },

  // Generate WebP URL if supported
  getWebPUrl: (baseUrl: string): string => {
    // Check if browser supports WebP
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    
    if (supportsWebP) {
      // Convert to WebP URL if your service supports it
      return baseUrl.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
    
    return baseUrl;
  },

  // Generate blur placeholder data URL
  generateBlurPlaceholder: (width: number = 40, height: number = 40): string => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      // Create a simple gradient placeholder
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      gradient.addColorStop(0, '#f3f4f6');
      gradient.addColorStop(1, '#e5e7eb');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
    
    return canvas.toDataURL();
  }
};
