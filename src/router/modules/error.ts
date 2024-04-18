import type { RouteRecordRaw } from 'vue-router'
import { RouteRank } from '../RouteRank'
import { ROUTE_NAMES } from '@/constants'

export default [
  {
    path: '/error',
    redirect: { name: ROUTE_NAMES.page403 },
    name: ROUTE_NAMES.error,
    meta: {
      title: '异常页面',
      rank: RouteRank.error,
      isStatic: true
    },
    children: [
      {
        path: '/403',
        name: ROUTE_NAMES.page403,
        component: () => import('@/views/error/403View.vue'),
        meta: {
          title: '没有权限'
        }
      },
      {
        path: '/404',
        name: ROUTE_NAMES.page404,
        component: () => import('@/views/error/404View.vue'),
        meta: {
          title: '页面未找到'
        }
      },
      {
        path: '/500',
        name: ROUTE_NAMES.page500,
        component: () => import('@/views/error/500View.vue'),
        meta: {
          title: '服务器错误'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)',
    name: ROUTE_NAMES.notFound,
    component: () => import('@/views/error/404View.vue'),
    meta: {
      isStatic: true,
      rank: RouteRank.notFound
    }
  }
] as RouteRecordRaw[]
