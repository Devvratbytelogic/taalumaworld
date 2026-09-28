import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'TaalumaWorld',
    short_name: 'Taaluma',
    description: 'TaalumaWorld',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#f7941d',
    icons: [
      {
        src: '/images/logo.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
    ],
  }
}
