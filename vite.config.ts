import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwind from 'tailwindcss'
import autoprefixer from "autoprefixer"

// https://vite.dev/config/
export default defineConfig({
  css: {
      postcss: {
          plugins: [tailwind(), autoprefixer()]
      }
  },
  plugins: [vue()],
  resolve: {
      alias: {
          '@': path.resolve(__dirname, './src'),
      }
  }
})
