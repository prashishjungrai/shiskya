import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_FRONTEND_URL || 'https://www.tuitionhubnepal.com';
  
  // 1. Static Core Routes
  const routes = ['', '/about', '/contact', '/courses', '/teachers'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as any,
    priority: route === '' ? 1.0 : 0.8,
  }));

  // 2. Dynamic Course Routes via Backend API Fetch
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api'}/public/courses`, {
      method: "GET",
      // Using Next.js aggressive caching for the sitemap fetch (revalidates every hour)
      next: { revalidate: 3600 } 
    });
    
    if (res.ok) {
      const courses = await res.json();
      const courseUrls = courses
        .filter((c: any) => c.is_active)
        .map((c: any) => ({
          url: `${baseUrl}/courses/${c.slug}`,
          lastModified: new Date().toISOString(),
          changeFrequency: 'weekly' as any,
          priority: 0.9,
        }));
      
      return [...routes, ...courseUrls];
    }
  } catch (error) {
    console.error("Sitemap generation error:", error);
  }

  return routes;
}
