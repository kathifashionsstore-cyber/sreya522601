import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icons/icon.svg', 'icons/maskable.svg'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/images\.unsplash\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'public-image-cache',
              expiration: { maxEntries: 24, maxAgeSeconds: 60 * 60 * 24 * 14 },
            },
          },
        ],
      },
      manifest: {
        name: 'Sreya Hospitals & IVF Centre',
        short_name: 'Sreya IVF',
        description: 'Fertility, maternity, gynaecology, and laparoscopic care in Narasaraopet.',
        theme_color: '#087f8c',
        background_color: '#fff7f2',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon.svg', sizes: '192x192 512x512', type: 'image/svg+xml' },
          { src: '/icons/maskable.svg', sizes: '512x512', type: 'image/svg+xml', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Book Appointment', url: '/appointment', description: 'Request a hospital appointment' },
          { name: 'Services', url: '/services', description: 'Browse fertility and maternity services' },
        ],
      },
    }),
  ],
  build: {
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three')) return 'three'
          if (id.includes('node_modules/@firebase') || id.includes('node_modules/firebase')) return 'firebase'
          if (id.includes('node_modules/recharts')) return 'charts'
          if (id.includes('node_modules/@react-pdf')) return 'pdf'
          return undefined
        },
      },
    },
  },
  ssr: {
    noExternal: true,
  },
})
