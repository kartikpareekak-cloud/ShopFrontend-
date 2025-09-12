import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  structuredData?: object;
}

const useSEO = ({
  title = 'Panditji Auto Connect - Premium Auto Parts & Accessories',
  description = 'India\'s leading auto parts marketplace. Genuine parts, competitive prices, fast delivery. Brake pads, engine oils, batteries & more for all vehicle brands.',
  keywords = 'auto parts, car parts, bike parts, genuine parts, automotive accessories, brake pads, engine oil, batteries, spare parts India',
  canonical,
  ogTitle,
  ogDescription,
  ogImage = 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=630&fit=crop',
  ogType = 'website',
  structuredData
}: SEOProps = {}) => {
  useEffect(() => {
    // Set page title
    document.title = title;

    // Helper function to update meta tags
    const updateMetaTag = (name: string, content: string, property?: boolean) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (meta) {
        meta.setAttribute('content', content);
      } else {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        meta.setAttribute('content', content);
        document.head.appendChild(meta);
      }
    };

    // Set meta description
    updateMetaTag('description', description);
    
    // Set meta keywords
    updateMetaTag('keywords', keywords);

    // Set viewport
    updateMetaTag('viewport', 'width=device-width, initial-scale=1.0');

    // Set robots
    updateMetaTag('robots', 'index, follow');

    // Set author
    updateMetaTag('author', 'Panditji Auto Connect');

    // Open Graph tags
    updateMetaTag('og:title', ogTitle || title, true);
    updateMetaTag('og:description', ogDescription || description, true);
    updateMetaTag('og:image', ogImage, true);
    updateMetaTag('og:type', ogType, true);
    updateMetaTag('og:site_name', 'Panditji Auto Connect', true);

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', ogTitle || title);
    updateMetaTag('twitter:description', ogDescription || description);
    updateMetaTag('twitter:image', ogImage);

    // Canonical URL
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (link) {
        link.setAttribute('href', canonical);
      } else {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', canonical);
        document.head.appendChild(link);
      }
    }

    // Structured Data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
      if (script) {
        script.textContent = JSON.stringify(structuredData);
      } else {
        script = document.createElement('script') as HTMLScriptElement;
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
      }
    }

    // Cleanup function
    return () => {
      // Optional: Remove dynamically added meta tags on unmount
      // This prevents accumulation of duplicate tags
    };
  }, [title, description, keywords, canonical, ogTitle, ogDescription, ogImage, ogType, structuredData]);
};

export default useSEO;
