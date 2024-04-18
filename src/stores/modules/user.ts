import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useRouter, type RouteRecordRaw, useRoute } from 'vue-router'
import { authorize } from '@/helpers'
import { userService } from '@/services/UserService'
import type { AppMenu, User, UserState } from '@/types'
import { ROUTE_NAMES } from '@/constants'
import { cloneDeep } from 'lodash-es'
import { dynamicRoutes, staticRoutes } from '@/router'

/** 用户状态信息仓库 */
export const useUserStore = defineStore('user', (): UserState => {
  const router = useRouter()

  /** 当前用户信息 */
  const user = ref<User>({
    id: '',
    account: ''
  })

  /** 当前路由信息 */
  const currentRoute = useRoute()
  /** 用户可访问的当前路由的路径列表 */
  const creadcrumbMenus = computed<RouteRecordRaw[]>((): RouteRecordRaw[] => {
    return currentRoute.matched.filter((route) => route.meta.isMenu)
  })
  /** 用户可访问的菜单列表 */
  const menus = computed((): AppMenu[] => {
    return getUserMenus([...staticRoutes, ...dynamicRoutes])
  })

  /**
   * 获取用户可访问的路由
   * @param routes
   */
  function getUserRoutes(routes: RouteRecordRaw[]): RouteRecordRaw[] {
    const userRoutes: RouteRecordRaw[] = []

    for (const route of routes) {
      if (route.children) {
        const childrenRoutes = getUserRoutes(route.children)
        // 如果 children 有用户可访问的路由
        if (childrenRoutes.length > 0) {
          route.children = childrenRoutes

          userRoutes.push(route)
        }
      } else {
        // 如果路由没有设置权限
        // 或者用户有权限访问路由
        if (!route.meta?.authCode || user.value.menus?.includes(route.meta.authCode)) {
          userRoutes.push(route)
        }
      }
    }

    return userRoutes
  }

  /**
   * 获取用户路由菜单列表
   * @param routes 路由列表
   */
  function getUserMenus(routes: RouteRecordRaw[], parentRoute?: AppMenu): AppMenu[] {
    const userMenus: AppMenu[] = []
    routes.forEach((route, index) => {
      const menu: AppMenu = {
        id: parentRoute ? `${parentRoute.id}-${index + 1}` : `menu-${index + 1}`,
        name: route.name!,
        path: parentRoute ? `${parentRoute.path}/${route.path}` : route.path,
        meta: parentRoute ? Object.assign({}, parentRoute.meta, route.meta) : route.meta
      }

      if (menu.meta) {
        menu.meta.icon = route.meta?.icon
      }

      // 如果 route 有 children，则递归查询 children
      if (route.children) {
        const childrenMenus = getUserMenus(route.children, menu)
        // 如果路由需要显示到菜单列表
        // 并且 children 里含有用户可访问的菜单
        // 则添加路由到菜单列表，并设置 children
        if (route.meta?.isMenu) {
          if (childrenMenus.length > 0) {
            menu.children = childrenMenus

            userMenus.push(menu)
          }
        } else if (childrenMenus.length > 0) {
          // 如果路由不需要添加到菜单
          // 则把有权限的 children 添加到菜单列表
          userMenus.push(...childrenMenus)
        }
      } else if (route.meta?.isMenu) {
        // 如果路由被显示为菜单
        // 如果路由没有设置权限
        // 或者用户有权限访问路由
        if (!route.meta?.authCode || user.value.menus?.includes(route.meta.authCode)) {
          userMenus.push(menu)
        }
      }
    })

    return userMenus
  }

  /**
   * 初始化用户信息和用户路由
   * @param tuser 用户信息
   */
  function initUserInfo(tuser: User) {
    user.value = tuser

    // 获取用户可访问的路由，把它们添加到路由列表
    const userRoutes = getUserRoutes(cloneDeep(dynamicRoutes))
    userRoutes.forEach((droute: RouteRecordRaw) => {
      if (droute.name && !router.hasRoute(droute.name)) {
        router.addRoute(droute)
      }
    })
  }

  /** 用户登出 */
  async function logout() {
    if (!authorize.tokenExpired) {
      await userService.logout()
    }

    $reset()

    // 导航到登录页
    router.push({ name: ROUTE_NAMES.login })
  }

  /** 重置用户信息 */
  function $reset() {
    // 重置token
    authorize.reset()
    // 重置用户信息
    user.value = { id: '', account: '' }
    // 重置用户路由
    dynamicRoutes.forEach((droute) => {
      if (droute.name && router.hasRoute(droute.name)) {
        router.removeRoute(droute.name)
      }
    })
  }

  /** 展平菜单 */
  function flatMenus(): AppMenu[] {
    return flatMenusMain(menus.value)
  }

  /** 展开菜单的实现 */
  function flatMenusMain(sourceMenus: AppMenu[]): AppMenu[] {
    const tempAllMenus = sourceMenus.reduce<AppMenu[]>((allMenus, cmenu) => {
      allMenus.push(cmenu)

      // 如果有 children，递归调用
      if (cmenu.children && cmenu.children.length > 0) {
        allMenus.push(...flatMenusMain(cmenu.children))
      }

      return allMenus
    }, [])

    return tempAllMenus
  }

  return { user, menus, creadcrumbMenus, initUserInfo, $reset, logout, flatMenus }
})
