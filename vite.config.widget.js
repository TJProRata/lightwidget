import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget/index.js'),
      name: 'LightWidget',
      fileName: 'widget',
      formats: ['iife'] // Immediately Invoked Function Expression for direct browser loading
    },
    rollupOptions: {
      // Don't externalize anything - bundle everything
      external: [],
      output: {
        // Single file output
        inlineDynamicImports: true,
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === 'style.css') {
            return 'widget.css';
          }
          return 'assets/[name].[ext]';
        },
        entryFileNames: 'widget.js',
        // Global variables for externalized deps (none in this case)
        globals: {}
      }
    },
    // Output directory
    outDir: 'dist/widget',
    // Clear output directory before build
    emptyOutDir: true,
    // Generate sourcemaps for debugging
    sourcemap: true,
    // Minify for production
    minify: 'esbuild',
    // Target modern browsers but maintain compatibility
    target: 'es2015',
    // Chunk size warning limit
    chunkSizeWarningLimit: 1000
  },
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  }
});