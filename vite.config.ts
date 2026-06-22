import { fileURLToPath, URL } from 'node:url'

import { kebabCase } from '@pkstar/utils'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import postCssPxToRem from 'postcss-pxtorem'
import AutoImport from 'unplugin-auto-import/vite'
import { VantResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import versionFile from 'vite-plugin-version-file'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.BASE || '/',

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    proxy: {
      '/top': {
        // target: 'http://bdbf8222.natappfree.cc/ctms-pc',
        target: 'https://bianxiukaoqing.top',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/top/, ''),
      },
    },
  },

  build: {
    // // 提高 chunk 大小警告阈值
    // chunkSizeWarningLimit: 1000,
    // // 使用 esbuild 压缩（更快，且 Vite 内置）
    // minify: 'esbuild',
    // rollupOptions: {
    //   output: {
    //     // 手动分包策略
    //     manualChunks: {
    //       'vue-vendor': ['vue', 'vue-router', 'pinia'],
    //       'vant-vendor': ['vant'],
    //       'utils-vendor': ['axios', 'md5', 'json5', 'copy-to-clipboard'],
    //     },
    //     // 分割策略
    //     chunkFileNames: 'assets/js/[name]-[hash].js',
    //     entryFileNames: 'assets/js/[name]-[hash].js',
    //     assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
    //   },
    // },
  },

  plugins: [
    vue(),
    vueJsx(),

    versionFile({
      source: JSON.stringify({ rtnCode: '0', content: { version: Date.now() } }),
    }),

    // https://github.com/antfu/unplugin-auto-import
    AutoImport({
      imports: ['vue', 'vue-router'],
      dts: 'typings/auto-imports.d.ts',
      resolvers: [VantResolver()],
    }),

    // https://github.com/antfu/unplugin-vue-components
    Components({
      dts: 'typings/components.d.ts',
      extensions: ['ts', 'jsx', 'tsx', 'js', 'vue'],
      resolvers: [
        (name) => {
          // 处理 @daysnap/horn-ui
          if (name.startsWith('Hor')) {
            return {
              name,
              from: '@daysnap/horn-ui',
              sideEffects: `@daysnap/horn-ui/src/${kebabCase(name)}/style/index`,
            }
          }

          // 因为 vite dev 下会重复引入 样式，所以 dev 环境下，vant 样式全局导入
          // https://vant-ui.github.io/vant/#/zh-CN/quickstart
          // 所以这里就不直接使用 VantResolver 了
          // https://github.com/vitejs/vite/issues/4448
          if (name.startsWith('Van')) {
            const partialName = name.slice(3)
            return {
              name: partialName,
              from: `vant/es`,
            }
          }
        },
      ],
      // include: [/\.vue$/, /\.vue\?vue/, /[/\\]node_modules[/\\][@\\]daysnap[/\\]/],
      exclude: [],
    }),
  ],

  css: {
    devSourcemap: true,
    postcss: {
      plugins: [
        // https://www.npmjs.com/package/postcss-pxtorem
        postCssPxToRem({
          rootValue: 37.5, // 1rem的大小
          propList: ['*'], // 需要转换的属性，这里选择全部都进行转换
        }),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('tailwindcss'),
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('autoprefixer'),
      ],
    },
  },
})
