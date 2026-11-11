import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { mockApiPlugin } from './server/mockApiPlugin.js'

export default defineConfig({
  plugins: [vue(), tailwindcss(), mockApiPlugin()],
  server: {
    port: 5174,
    host: '127.0.0.1',
    strictPort: true,
  },
})
