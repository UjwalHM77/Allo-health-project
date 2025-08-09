// Enhanced dynamic rendering configuration for optimal performance
export const dynamicConfig = {
  // Force dynamic rendering for all pages
  dynamic: 'force-dynamic' as const,
  
  // Disable revalidation for always fresh content
  revalidate: 0,
  
  // Force server-side rendering for better SEO and performance
  ssr: true,
  
  // Disable static generation
  static: false,
  
  // Optimized caching strategy
  cache: 'no-store' as const,
  
  // Force revalidation on every request
  revalidatePath: '/',
  revalidateTag: 'all',
  
  // Next.js 13+ performance optimizations
  fetchCache: 'force-no-store' as const,
  runtime: 'nodejs' as const,
  preferredRegion: 'auto' as const,
  
  // Performance optimizations
  maxDuration: 30, // Maximum execution time in seconds
  
  // Streaming optimizations
  streaming: true,
  
  // Suspense boundaries for better loading
  suspense: true,
};

// Performance monitoring utilities
export const performanceConfig = {
  // Enable performance monitoring
  enableMonitoring: true,
  
  // Bundle analysis
  enableBundleAnalysis: process.env.NODE_ENV === 'production',
  
  // Memory usage monitoring
  enableMemoryMonitoring: true,
  
  // Cache hit rate monitoring
  enableCacheMonitoring: true,
};

// Default export for easy importing
export default dynamicConfig;
