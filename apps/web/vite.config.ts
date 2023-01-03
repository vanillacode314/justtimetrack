import { defineConfig } from 'vite'

import solid from 'solid-start/vite'

import Unocss from 'unocss/vite'
import {
  transformerDirectives,
  presetUno,
  presetIcons,
  presetWebFonts,
} from 'unocss'
import presetDaisy from 'unocss-preset-daisy'

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
    solid({ ssr: false, adapter: vercel() }),
    Unocss({
      transformers: [transformerDirectives()],
      presets: [
        presetUno(),
        presetDaisy(),
        presetIcons({
          extraProperties: {
            display: 'inline-block',
            'vertical-align': 'middle',
          },
        }),
        presetWebFonts({
          extendTheme: true,
          fonts: {
            sans: ['Barlow:400,500,600,700'],
          },
        }),
      ],
    }),
  ],
})
