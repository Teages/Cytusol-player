import { createVuePlugin } from "vite-plugin-vue2";
import { defineConfig } from "vite";
import viteComponents, {
  VuetifyResolver,
} from 'vite-plugin-components';
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: `${path.resolve(__dirname, './src')}/`,
      },
      {
        find: 'src/',
        replacement: `${path.resolve(__dirname, './src')}/`,
      }
    ],
  },
  base: "/",
  plugins: [
    // vue()
    VitePWA({}),
    createVuePlugin(),
    viteComponents({
      customComponentResolvers: [
        VuetifyResolver(),
      ],
    }),
  ],
  build: {
    rollupOptions: {
      input: {
        index: path.resolve(__dirname, 'index.html')
      },
    },
  }
});