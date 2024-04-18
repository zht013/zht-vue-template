import type { RouteRecordRaw } from 'vue-router'
import { RouteRank } from '../RouteRank'
import { ROUTE_NAMES } from '@/constants'
import IconEpKey from '~icons/ep/key'

export default {
  path: '/permission',
  name: ROUTE_NAMES.permission,
  meta: {
    rank: RouteRank.permission,
    isMenu: true,
    title: '权限管理',
    icon: IconEpKey,
    requireAuth: true,
    dynamicLayout: true
  },
  children: [
    {
      path: 'page',
      alias: [''],
      name: ROUTE_NAMES.permissionPage,
      component: () => import('@/views/permission/PageView.vue'),
      meta: {
        title: '页面权限',
        isMenu: true
      }
    },
    {
      path: 'button',
      name: ROUTE_NAMES.permissionButton,
      component: () => import('@/views/permission/ButtonView.vue'),
      meta: {
        title: '按钮权限',
        isMenu: true
      }
    }
  ]
} as RouteRecordRaw
