import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // ⚠️ TEMPORÁRIO: Permite build mesmo com erros de tipo em node_modules
    ignoreBuildErrors: false,
  },
  transpilePackages: ['@nolyfill/is-core-module'], // Força transpilação
  experimental: {
    esmExternals: 'loose', // Permite módulos CommonJS misturados
  }
};

export default nextConfig;