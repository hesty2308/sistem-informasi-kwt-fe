import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

const backendTarget = process.env.VITE_BACKEND_TARGET || 'http://127.0.0.1:8000'

// Backend paths served through this server, so the browser sees a single origin (cookies + CSRF work).
// xfwd adds X-Forwarded-Host/Proto/For: Laravel (with TRUSTED_PROXIES) then builds image URLs for the
// address the visitor actually used, e.g. a tunnel URL during a client demo.
const backendProxy = Object.fromEntries(
  ['/api', '/sanctum', '/bagikan', '/storage'].map((path) => [
    path,
    { target: backendTarget, changeOrigin: true, xfwd: true },
  ])
)

// Temporary public addresses from tunnel services (client demos without deploying).
const tunnelHosts = ['.trycloudflare.com', '.ngrok-free.app', '.ngrok.app']

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  // Dependencies used only by lazily loaded panel pages (user management, activity log).
  // Pre-bundling them at startup avoids "504 Outdated Optimize Dep" blank pages when
  // Vite would otherwise discover them mid-session and re-optimize.
  optimizeDeps: {
    include: ['dayjs', 'dayjs/locale/id'],
  },
  server: {
    port: 5173,
    host: true,
    allowedHosts: tunnelHosts,
    proxy: backendProxy,
  },
  // `npm run build` + `npm run preview`: the production build, fast enough to share through a tunnel.
  preview: {
    port: 4173,
    host: true,
    allowedHosts: tunnelHosts,
    proxy: backendProxy,
  },
})
