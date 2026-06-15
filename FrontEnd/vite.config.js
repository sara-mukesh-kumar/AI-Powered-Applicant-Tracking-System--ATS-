import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react' // Yahan sahi naam kar diya hai
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000', // Tumhara backend server port
        changeOrigin: true,
        secure: false,
      }
    }
  }
})