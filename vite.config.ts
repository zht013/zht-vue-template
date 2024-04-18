import { fileURLToPath, URL } from 'node:url'
import { ConfigEnv, defineConfig, loadEnv, PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevTools from 'vite-plugin-vue-devtools'
import { vitePluginFakeServer, type VitePluginFakeServerOptions } from 'vite-plugin-fake-server'
import { visualizer } from 'rollup-plugin-visualizer'
import Icons from 'unplugin-icons/vite'
import { FileSystemIconLoader } from 'unplugin-icons/loaders'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import IconsResolver from 'unplugin-icons/resolver'

// https://vitejs.dev/config/
export default defineConfig(({ mode }: ConfigEnv) => {
  /** 启动`node`进程时所在工作目录的绝对路径 */
  const env = loadEnv(mode, process.cwd())

  console.log(env)

  return {
    base: env.VITE_APP_BASE_URL,
    plugins: [
      vue(),
      VueDevTools(),
      AutoImport({
        imports: ['vue', 'vue-router', 'pinia'],
        dts: 'typings/auto-imports.d.ts', // 指定自动导入函数TS类型声明文件路径
        // 按需自动导入API
        // Auto import functions from Element Plus, e.g. ElMessage, ElMessageBox... (with style)
        // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        resolvers: [ElementPlusResolver()]
      }),
      Components({
        dts: 'typings/components.d.ts', // 指定自动导入组件TS类型声明文件路径
        resolvers: [
          // ElementPlus自动导入解析器
          // 像往常一样在模板中使用组件, 它会按需导入组件, 不在需要手动导入！
          // 如果异步注册父组件(或延迟路由), 则自动导入的组件将与其父组件一起进行代码拆分
          ElementPlusResolver(),
          // 您可以根据需要使用任何图标, 而无需显式导入, 只有使用的图标才会被捆绑在一起。
          IconsResolver({
            // prefix - 前缀，默认为 i, 我们配置成了 icon, 即组件名以 icon 开头, 设置为false则表示不需要前缀
            // collection - 图标集名
            // icon - 图标名
            // {prefix}-{collection}-{icon}
            // 当然大驼峰也可以, 例如 IconEpHome, IconCustomHome // 自定义svg icon
            prefix: 'icon',
            // 表示自定义图标集, 以便自动导入
            customCollections: ['custom']
            // this is optional, default enabling all the collections supported by Iconify
            // enabledCollections: ['ep'],
            // 当图标集名字过长时，可使用集合别名
            // alias: {
            //   system: 'system-uicons'
            // }
          })
        ]
      }),
      Icons({
        // autoInstall: false, // 自动安装使用到的icons库
        compiler: 'vue3',
        customCollections: {
          // 自定义svg icon './src/assets/icons'
          custom: FileSystemIconLoader('./src/assets/icons', (svg) =>
            svg.replace(/^<svg /, '<svg fill="currentColor" ')
          ) // 自定义icon
        }
      }),
      // mock 数据服务
      vitePluginFakeServer({
        logger: false, // 是否产生日志
        // enableProd: true, // 生产环境生效
        include: 'mock', // mock 数据位置
        infixName: false,
        basename: env.VITE_APP_BASE_API
        // build: true
      } as VitePluginFakeServerOptions),
      // 构建分析报告
      visualizer({
        open: true // build 后打开分析报告
      }) as PluginOption
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: fileURLToPath(new URL('index.html', import.meta.url))
        },
        output: {
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js',
          assetFileNames: '[ext]/[name]-[hash].[ext]'
          // manualChunks: (id: string) => {
          //   // 单独打包第三方依赖
          //   if (id.includes('node_modules')) {
          //     return id.toString().split('node_modules/')[1].split('/')[0].toString()
          //   }
          // }
        }
      }
    },
    preview: {
      // 代理配置
      // http://localhost:5173/api/login -> http://localhost:3001/login
      proxy: {
        [env.VITE_APP_BASE_API]: {
          // 获取数据的服务器地址
          target: env.VITE_PREVIEW_SERVER,
          // 是否允许代理跨域
          changeOrigin: true
          // 路径重写，去掉前缀
          // rewrite: (path) => path.replace(RegExp(`^${env.VITE_APP_BASE_API}`), '')
        }
      }
    },
    server: {
      // 指定服务器应该监听哪个 IP 地址。 如果将此设置为 0.0.0.0 或者 true 将监听所有地址，包括局域网和公网地址
      host: true,
      // open: true, // 自动打开浏览器
      // port: 5173, // 服务器端口
      // 代理配置
      // http://localhost:5173/api/login -> http://localhost:3001/login
      proxy: {
        [`${env.VITE_APP_BASE_API}/local`]: {
          // 获取数据的服务器地址
          target: env.VITE_LOCAL_SERVER,
          // 是否允许代理跨域
          changeOrigin: true,
          // 路径重写，去掉前缀
          rewrite: (path) => path.replace(RegExp(`^${env.VITE_APP_BASE_API}/local`), '')
        },
        [`${env.VITE_APP_BASE_API}/github`]: {
          target: env.VITE_GITHUB_API_SERVER,
          changeOrigin: true,
          rewrite: (path) => path.replace(RegExp(`^${env.VITE_APP_BASE_API}/github`), '')
        }
      }
    }
  }
})
