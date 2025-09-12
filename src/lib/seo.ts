export const generateSitemap = () => {
  const baseUrl = 'https://pandijiautoconnect.com';
  const currentDate = new Date().toISOString().split('T')[0];
  
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/about', priority: '0.8', changefreq: 'monthly' },
    { url: '/contact', priority: '0.8', changefreq: 'monthly' },
    { url: '/faq', priority: '0.7', changefreq: 'monthly' },
    { url: '/privacy-policy', priority: '0.6', changefreq: 'yearly' },
    { url: '/terms-of-service', priority: '0.6', changefreq: 'yearly' },
    { url: '/login', priority: '0.5', changefreq: 'monthly' },
    { url: '/register', priority: '0.5', changefreq: 'monthly' },
    { url: '/search', priority: '0.7', changefreq: 'daily' },
    { url: '/wishlist', priority: '0.6', changefreq: 'weekly' },
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return sitemap;
};

export const generateRobotsTxt = () => {
  const baseUrl = 'https://pandijiautoconnect.com';
  
  return `User-agent: *
Allow: /

# Sitemap
Sitemap: ${baseUrl}/sitemap.xml

# Crawl-delay
Crawl-delay: 1

# Disallow admin pages
Disallow: /admin/
Disallow: /api/
Disallow: /checkout/
Disallow: /my-orders/
Disallow: /profile/

# Allow important pages
Allow: /
Allow: /about
Allow: /contact
Allow: /faq
Allow: /search
Allow: /products/`;
};
