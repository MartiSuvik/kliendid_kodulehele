import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { paraglideVitePlugin } from '@inlang/paraglide-js'

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
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  build: {
    // Ship source maps for production debugging (not requested by the browser
    // unless devtools are open) — Lighthouse flagged their absence.
    sourcemap: true,
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
          if (id.includes('@mui') || id.includes('@emotion')) return 'mui';
          if (id.includes('lucide-react')) return 'icons';
        },
      },
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
