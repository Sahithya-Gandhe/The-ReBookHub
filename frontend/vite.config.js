import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    base: isProduction ? '/' : '/',
    build: {
      outDir: 'dist',
      sourcemap: false
    },
    server: {
      host: true,
      port: 3000,
    },
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    }
  }
})