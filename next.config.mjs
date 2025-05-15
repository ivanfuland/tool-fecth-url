/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add remark-gfm and other remark/rehype plugins if they are ESM
  transpilePackages: ['remark-gfm'], 
};

export default nextConfig; 