import path from 'node:path'
import { fileURLToPath } from 'node:url'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// In ESM there is no __dirname; this rebuilds it from the current file URL.
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Must match tsconfig.app.json "paths" so imports work in both TS and Vite
      '@': path.resolve(__dirname, './src'),
    },
  },
  // User site is https://dsh410.github.io (the domain root), so assets
  // must be /assets/... A /expense-tracker/ prefix would 404 here.
  base: '/',
})
