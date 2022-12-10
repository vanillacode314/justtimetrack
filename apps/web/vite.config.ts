import solid from "solid-start/vite";
import { defineConfig } from "vite";
import path from "path";
import Unocss from "unocss/vite";
import {
  transformerDirectives,
  presetUno,
  presetIcons,
  presetWebFonts,
} from "unocss";
import packageJson from "./package.json" assert { type: "json" };
import presetDaisy from "unocss-preset-daisy";
import vercel from "solid-start-vercel";

export default defineConfig({
  define: {
    __version__: JSON.stringify(packageJson.version),
  },
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "src"),
      "@ui": path.resolve(__dirname, "../../packages/ui"),
      "@api": path.resolve(__dirname, "../../apps/api/src"),
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
            display: "inline-block",
            "vertical-align": "middle",
          },
        }),
        presetWebFonts({}),
      ],
    }),
  ],
});
