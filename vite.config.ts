import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Set the base path to your repository name for GitHub Pages
  base: '/Mr_Amr_platform/',
  build: {
    // Increase the chunk size limit to suppress the warning
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Optional: Split vendor chunks to improve caching
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
})
