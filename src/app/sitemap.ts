import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://thekshaum.com';
  const lastModified = new Date();

  const routes = [
    { url: `${baseUrl}/`, priority: 1.0, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/the-quiet-choice/philosophy`, priority: 0.9, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/the-quiet-choice/journals`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/shop`, priority: 0.9, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/women`, priority: 0.85, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/women/dresses`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/women/trousers`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/women/skirts`, priority: 0.8, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/collection`, priority: 0.85, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/collection/the-inheritance-01`, priority: 0.85, changeFrequency: 'weekly' as const },
    { url: `${baseUrl}/archives`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/contact`, priority: 0.7, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/shipping`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/returns-refunds`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/privacy-policy`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/cookie-policy`, priority: 0.5, changeFrequency: 'monthly' as const },
    { url: `${baseUrl}/terms-conditions`, priority: 0.5, changeFrequency: 'monthly' as const },
  ];

  return routes.map((route) => ({
    url: route.url,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
