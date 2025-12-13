import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

export default nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // ⚠️ TEMPORÁRIO: Permite build mesmo com erros de tipo em node_modules
    ignoreBuildErrors: false,
  },
  transpilePackages: ['@nolyfill/is-core-module'], // Força transpilação
  // OU (alternativa mais agressiva):
  experimental: {
    esmExternals: 'loose', // Permite módulos CommonJS misturados
  }
}

module.exports = nextConfig