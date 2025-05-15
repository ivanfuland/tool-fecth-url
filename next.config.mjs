/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Added for static HTML export
  // Add remark-gfm and other remark/rehype plugins if they are ESM
  transpilePackages: ['remark-gfm'], 
};

export default nextConfig; 