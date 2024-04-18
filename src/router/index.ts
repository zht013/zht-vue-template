import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  type RouteMeta,
  type RouteRecordRaw
} from 'vue-router'
import { routerProgress } from '@/helpers'
import { authorize } from '@/helpers'
import { useAppStore, useUserStore } from '@/stores'
import { userService } from '@/services/UserService'
import { ElMessage } from 'element-plus'
import { ROUTE_NAMES } from '@/constants'
import type { User } from '@/types'

/**
 * 自动导入全部静态路由，无需再手动引入！匹配 src/router/modules 目录（任何嵌套级别）中具有 .ts 扩展名的所有文件，除了 remaining.ts 文件
 * 如何匹配所有文件请看：https://github.com/mrmlnc/fast-glob#basic-syntax
 * 如何排除文件请看：https://cn.vitejs.dev/guide/features.html#negative-patterns
 */
const modules: Record<string, any> = import.meta.glob(['./modules/**/*.ts'], {
  eager: true
})

/** 原始路由（未做任何处理） */
let appRoutes: RouteRecordRaw[] = []
Object.keys(modules).forEach((key) => {
  appRoutes.push(modules[key].default)
})

// 展平并排序路由数组
appRoutes = appRoutes.flat(Infinity).sort((a: RouteRecordRaw, b: RouteRecordRaw) => {
  if (!a.meta?.rank) {
    return -1
  } else if (!b.meta?.rank) {
    return 0
  } else {
    return a.meta.rank - b.meta.rank
  }
})

/** 静态路由 */
const staticRoutes = appRoutes.filter((troute) => troute.meta?.isStatic)
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: staticRoutes,
  scrollBehavior(to, from, savedPosition) {
    // return { top: 0 }
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
    // return new Promise((resolve) => {
    //   if (savedPosition) {
    //     return savedPosition
    //   } else {
    //     if (from.meta.saveSrollTop) {
    //       const top: number = document.documentElement.scrollTop || document.body.scrollTop
    //       resolve({ left: 0, top })
    //     }
    //   }
    // })
  }
})

/** 动态路由，默认动态路由都需要授权才能访问 */
const dynamicRoutes = appRoutes.filter((troute) => !troute.meta?.isStatic)
/** 序列化动态路由列表 */
const normalizedDynamicRoutes = normalizeRoutes(dynamicRoutes)

/**
 * 注册一个全局前置守卫
 * 当一个导航触发时，全局前置守卫按照创建顺序调用。
 * 守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于等待中。
 * 每个守卫方法接收两个参数：
 *    to: 即将要进入的目标
 *    from: 当前导航正要离开的路由
 * 可以返回的值如下:
 *    false: 取消当前的导航。如果浏览器的 URL 改变了(可能是用户手动或者浏览器后退按钮)，那么 URL 地址会重置到 from 路由对应的地址。
 *    一个路由地址: 通过一个路由地址跳转到一个不同的地址，就像你调用 router.push() 一样，你可以设置诸如 replace: true 或 name: 'home' 之类的配置。当前的导航被中断，然后进行一个新的导航，就和 from 一样。
 * 如果遇到了意料之外的情况，可能会抛出一个 Error。这会取消导航并且调用 router.onError() 注册过的回调。
 * 如果什么都没有，undefined 或返回 true，则导航是有效的，并调用下一个导航守卫
 */
router.beforeEach(() => {
  // 显示 router 进度条
  routerProgress.start()
})

/**
 * 注册一个全局守卫
 * 这和 router.beforeEach 类似，因为它在每次导航时都会触发，
 * 不同的是，解析守卫刚好会在导航被确认之前、所有组件内守卫和异步路由组件被解析之后调用
 * 是获取数据或执行任何其他操作（如果用户无法进入页面时你希望避免执行的操作）的理想位置。
 */
router.beforeResolve(async (to: RouteLocationNormalized) => {
  if (to.name !== ROUTE_NAMES.login) {
    // 如果目标页面不是登录页

    /** 目标地址的动态路由简写对象 */
    const toDynamicRoute = normalizedDynamicRoutes.find((nroute) => nroute.path === to.path)

    if (authorize.isLoggedIn) {
      // 如果用户登录了

      const userStore = useUserStore()
      if (!userStore.user.id) {
        // 如果没有用户信息

        try {
          const user: User = await userService.getUserInfo()
          if (user?.id) {
            userStore.initUserInfo(user)

            // 由于动态加载的路由，在路由初始化时被视为 404
            // 所以需要判断目标页面是否在动态路由列表中
            if (to.name === ROUTE_NAMES.notFound) {
              const toRoute = router.getRoutes().find((route) => route.path === to.path)
              if (toRoute) {
                // 如果目标页面在应用的路由列表里面，则重新导航到目标页面
                // 如果不在，则继续走 404 错误页面
                return to.fullPath
              }
            }
          } else {
            ElMessage.error({
              message: '用户数据错误，请重新登录'
            })

            throw new Error()
          }
        } catch (error: any) {
          // 如果获取用户信息失败

          // 重置用户信息
          useUserStore().$reset()

          // 跳转到登录页
          return redirectTo(to, ROUTE_NAMES.login)
        }
      }
    } else if (to.meta.requireAuth || toDynamicRoute?.meta?.requireAuth) {
      // 如果用户没有登录, 并且目标页面需要授权

      return redirectTo(to, ROUTE_NAMES.login)
    }
  }
})

/**
 * 注册全局后置钩子
 * 然而和守卫不同的是，这些钩子不会接受 next 函数也不会改变导航本身
 * 它们对于分析、更改页面标题、声明页面等辅助功能以及许多其他事情都很有用
 * 它们也反映了 navigation failures 作为第三个参数：
 * router.afterEach((to, from, failure) => {
      if (!failure) sendToAnalytics(to.fullPath)
    })
 *
 */
router.afterEach((to: RouteLocationNormalized) => {
  // // 设置路由 layout 信息
  // useAppStore().layoutType = appLayout.getRouteLayout(to.meta)

  // 关闭 router 进度条
  routerProgress.done()

  // 获取 app 的配置信息
  const { config } = useAppStore()

  // 设置页面标题
  document.title = `${to.meta.title} - ${config.title || import.meta.env.VITE_APP_TITLE}`
})

type appNormaizedRoute = { path: string; meta?: RouteMeta }

/**
 * 序列化 routes
 * @param sroutes 源数据
 * @returns 目标数据
 */
function normalizeRoutes(
  sroutes: RouteRecordRaw[],
  parent?: appNormaizedRoute
): appNormaizedRoute[] {
  const tempRoutes = sroutes.reduce<appNormaizedRoute[]>((allRoutes, croute) => {
    // 把别名添加进来
    const aliases = [croute.path]
    if (croute.alias) {
      if (Array.isArray(croute.alias)) {
        aliases.push(...croute.alias)
      } else {
        aliases.push(croute.alias)
      }
    }

    aliases.forEach((alias) => {
      // 组织 path 和 meta 信息，继承 parent
      const normaizedRoute = {
        path: parent ? parent.path + '/' + alias : alias,
        meta: parent
          ? Object.assign({} as RouteMeta, parent.meta, croute.meta)
          : Object.assign({} as RouteMeta, croute.meta || {})
      }
      allRoutes.push(normaizedRoute)

      // 如果有 children，递归调用
      if (croute.children && croute.children.length > 0) {
        allRoutes.push(...normalizeRoutes(croute.children, normaizedRoute))
      }
    })

    return allRoutes
  }, [])

  return tempRoutes
}

/**
 * 导航到其它页面
 * @param sourceTo 要导航到的目标路由
 */
function redirectTo(sourceTo: RouteLocationNormalized, routeName: string) {
  return {
    name: routeName,
    // 携带目标页面path，以便登陆后重定向到该页面
    query: { redirect: sourceTo.fullPath }
  }
}

export { dynamicRoutes, staticRoutes }

export default router
