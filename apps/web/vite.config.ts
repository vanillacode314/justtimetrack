import { defineConfig } from 'vite'
import AutoImport from 'unplugin-auto-import/vite'

import solid from 'solid-start/vite'

import Unocss from 'unocss/vite'
import { transformerDirectives, presetIcons, presetWebFonts } from 'unocss'

import vercel from 'solid-start-vercel'
import node from 'solid-start-node'

import path from 'path'
import packageJson from './package.json' assert { type: 'json' }

export default defineConfig({
  define: {
    __version__: JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, 'src'),
      '@ui': path.resolve(__dirname, '../../packages/ui'),
      '@api': path.resolve(__dirname, '../../apps/api/src'),
    },
  },
  plugins: [
    AutoImport({
      imports: [
        'solid-js',
        '@solidjs/router',
        {
          'solid-start': ['A'],
          'solid-js': ['createComputed'],
        },
      ],
      dirs: ['./src/components/', './src/stores/', './src/utils/'],
    }),
    solid({
      ssr: false,
      adapter: vercel({
        edge: false,
      }),
    }),
    Unocss({
      transformers: [transformerDirectives()],
      presets: [
        presetIcons({
          extraProperties: {
            display: 'inline-block',
            'vertical-align': 'middle',
          },
        }),
        presetWebFonts({
          extendTheme: true,
          fonts: {
            sans: ['Inter:400,500,600,700,800,900'],
          },
        }),
      ],
    }),
  ],
})
