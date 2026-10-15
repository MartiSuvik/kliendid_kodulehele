import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { allUrls } from './src/routes'
import { prerender } from './vite-plugins/prerender'
import { sitemap } from './vite-plugins/sitemap'

// src/routes.ts is deliberately import-free so esbuild can inline it into this
// config without following a .tsx graph full of CSS and SVG imports.
const urls = allUrls()

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/paraglide',
    }),
    // Snapshot every route to static HTML so AI crawlers — which do not execute
    // JavaScript — get real content and real JSON-LD. '/404' becomes dist/404.html.
    prerender({ urls: [...urls.map((u) => u.url), '/404'] }),
    sitemap({
      entries: urls
        .filter((u) => u.index)
        .map((u) => ({
          url: u.url,
          page: u.route.page,
          priority: u.route.priority ?? 0.7,
          changefreq: u.route.changefreq ?? 'monthly',
        })),
    }),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // 'hidden' still emits maps for error-tracker upload but drops the
    // sourceMappingURL comment, so the full TypeScript source (including the
    // Meta Pixel ID and audit API wiring) is no longer publicly downloadable.
    sourcemap: 'hidden',
    // Modern baseline: avoids ES5 legacy transforms/polyfills.
    target: 'es2020',
    rollupOptions: {
      output: {
        // Split large, stable vendor code into long-cache chunks so app updates
        // don't invalidate the framework bundle.
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          if (id.includes('react-dom') || id.includes('/react/') || id.includes('react/jsx-runtime') || id.includes('scheduler')) return 'react-vendor';
          if (id.includes('/motion/') || id.includes('framer-motion')) return 'motion';
          if (id.includes('@radix-ui')) return 'radix';
          if (id.includes('lucide-react')) return 'icons';
          // No 'mui' branch: @mui/* and @emotion/* are declared dependencies with
          // zero imports in src/, so the branch never matched.
        },
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
