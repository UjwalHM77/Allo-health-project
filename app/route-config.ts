// Route configuration to ensure dynamic rendering
export const routeConfig = {
  // Force dynamic rendering for all routes
  dynamic: 'force-dynamic',
  revalidate: 0,
  
  // Disable static generation
  static: false,
  
  // Force server-side rendering
  ssr: true,
  
  // Disable caching
  cache: 'no-store',
  
  // Force revalidation on every request
  revalidatePath: '/',
  revalidateTag: 'all',
};

// Export configuration for use in pages
export default routeConfig;
