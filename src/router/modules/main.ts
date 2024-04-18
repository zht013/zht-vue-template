import type { RouteRecordRaw } from 'vue-router'
import LoginView from '@/views/login/index.vue'
import { ROUTE_NAMES } from '@/constants'
import { RouteRank } from '../RouteRank'
import IconEpHomeFilled from '~icons/ep/home-filled'

// function removeQueryParams(to) {
//   if (Object.keys(to.query).length)
//     return { path: to.path, query: {}, hash: to.hash }
// }

// function removeHash(to) {
//   if (to.hash) return { path: to.path, query: to.query, hash: '' }
// }

export default [
  {
    path: '/login',
    name: ROUTE_NAMES.login,
    component: LoginView,
    props: (route) => ({ redirect: route.query.redirect }),
    meta: {
      title: '登录',
      isStatic: true
    }
  },
  {
    path: '/',
    name: ROUTE_NAMES.dashboard,
    component: () => import('@/views/dashboard/index.vue'),
    meta: {
      rank: RouteRank.dashboard,
      title: '首页',
      isMenu: true,
      icon: IconEpHomeFilled,
      isStatic: true,
      requireAuth: true,
      dynamicLayout: true
    }
    // beforeEnter 守卫 只在进入路由时触发，
    // 不会在 params、query 或 hash 改变时触发。
    // 例如，从 /users/2 进入到 /users/3 或者从 /users/2#info 进入到 /users/2#projects。
    // 它们只有在从一个不同的 路由导航时，才会被触发。
    // 你也可以将一个函数数组传递给 beforeEnter，这在为不同的路由重用守卫时很有用
    // beforeEnter: (to, from) => {
    //   // reject the navigation
    //   return false
    // },
    // beforeEnter: [removeQueryParams, removeHash]
  }
] as RouteRecordRaw[]
