
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    // Ensure proper MIME types for static files
    middlewareMode: false,
    proxy: {
      // Proxy file requests to our Supabase edge function
      '/api/files': {
        target: 'https://akgmvwevnljjhcjgnzly.supabase.co/functions/v1/serve-file',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/files/, ''),
      }
    }
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Ensure static assets are properly handled
  publicDir: 'public',
  assetsInclude: ['**/*.pdf'],
  build: {
    // Ensure PDFs are copied to build directory
    copyPublicDir: true,
    rollupOptions: {
      output: {
        // Ensure PDFs maintain their file extension and MIME type
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.pdf')) {
            return 'assets/[name].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        }
      }
    }
  }
}));
