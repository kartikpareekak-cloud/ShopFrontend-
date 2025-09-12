// Image optimization utilities for Cloudinary integration

export interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  crop?: 'fill' | 'fit' | 'scale' | 'crop';
  gravity?: 'center' | 'face' | 'auto';
}

export const getOptimizedImageUrl = (
  imageUrl: string,
  options: ImageOptimizationOptions = {}
): string => {
  // If not a Cloudinary URL, return original
  if (!imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }

  const {
    width = 800,
    height,
    quality = 80,
    format = 'auto',
    crop = 'fill',
    gravity = 'center'
  } = options;

  // Extract the public ID from Cloudinary URL
  const urlParts = imageUrl.split('/');
  const uploadIndex = urlParts.findIndex(part => part === 'upload');
  
  if (uploadIndex === -1) return imageUrl;

  // Build transformation string
  const transformations = [];
  
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (quality) transformations.push(`q_${quality}`);
  if (format) transformations.push(`f_${format}`);
  if (crop) transformations.push(`c_${crop}`);
  if (gravity && crop !== 'scale') transformations.push(`g_${gravity}`);

  // Insert transformations after 'upload'
  const transformationString = transformations.join(',');
  urlParts.splice(uploadIndex + 1, 0, transformationString);

  return urlParts.join('/');
};

export const getResponsiveImageSrcSet = (
  imageUrl: string,
  sizes: number[] = [320, 480, 768, 1024, 1280]
): string => {
  return sizes
    .map(size => `${getOptimizedImageUrl(imageUrl, { width: size })} ${size}w`)
    .join(', ');
};

export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

export const getPlaceholderImage = (width: number = 400, height: number = 300): string => {
  return `data:image/svg+xml,${encodeURIComponent(`
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#9ca3af" 
            text-anchor="middle" dy=".3em">Loading...</text>
    </svg>
  `)}`;
};

// Performance monitoring for images
export const measureImageLoadTime = (imageUrl: string): Promise<number> => {
  return new Promise((resolve) => {
    const startTime = performance.now();
    const img = new Image();
    
    img.onload = () => {
      const loadTime = performance.now() - startTime;
      resolve(loadTime);
    };
    
    img.onerror = () => {
      resolve(-1); // Error indicator
    };
    
    img.src = imageUrl;
  });
};
