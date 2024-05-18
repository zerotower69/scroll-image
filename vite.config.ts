import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import UnoCSS from "unocss/vite"
import { createHtmlPlugin } from 'vite-plugin-html'
import { loadEnv } from 'vite'
import { fileURLToPath, URL } from 'node:url'

const CWD = process.cwd()

// https://vitejs.dev/config/
export default defineConfig((config)=>{
  const {command,mode} = config
  // 环境变量
  const { VITE_BASE_URL, VITE_TITLE } = loadEnv(mode, CWD)
  return {
    base: VITE_BASE_URL,
    plugins: [
      vue(),
      vueJsx(),
      UnoCSS(),
      createHtmlPlugin({
        minify: true,
        inject: {
          data: {
            title: VITE_TITLE
          }
        }
      })
    ],
    server:{
      port:9000,
      hmr:true
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    //优化
    optimizeDeps: {
      include: []
    },
    esbuild: {
      // pure: VITE_DROP_CONSOLE ? ['console.log', 'debugger'] : []
    },
    //构建目标
    build: {
      target: 'es2017',
      minify: 'esbuild',
      cssTarget: 'chrome79',
      chunkSizeWarningLimit: 2000,
      outDir: 'dist'
    }
  }
})
