/** @type {import('next').NextConfig} */
const basePath = process.env.RUTA_BASE || "";

const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  // La app es 100% cliente: se exporta como HTML estático a ./out para GitHub Pages.
  output: "export",

  // Subruta del repositorio en GitHub Pages (ej. /Estres-micromedici-n).
  // En local queda vacío ('/') y en GitHub Actions se inyecta automáticamente.
  basePath: basePath || undefined,
  assetPrefix: basePath ? `${basePath}/` : undefined,

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
