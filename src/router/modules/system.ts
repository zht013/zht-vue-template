import { ROUTE_NAMES } from '@/constants'
import type { RouteRecordRaw } from 'vue-router'
import { RouteRank } from '../RouteRank'
import IconEpMonitor from '~icons/ep/monitor'

export default {
  path: '/system',
  name: ROUTE_NAMES.system,
  meta: {
    rank: RouteRank.system,
    isMenu: true,
    title: '系统管理',
    icon: IconEpMonitor,
    requireAuth: true,
    dynamicLayout: true
  },
  children: [
    {
      path: 'users',
      alias: [''],
      name: ROUTE_NAMES.sysUsers,
      component: () => import('@/views/system/UsersView.vue'),
      meta: {
        title: '页面权限',
        isMenu: true
      }
    },
    {
      path: 'roles',
      name: ROUTE_NAMES.sysRoles,
      component: () => import('@/views/system/RolesView.vue'),
      meta: {
        title: '角色管理',
        isMenu: true
      }
    },
    {
      path: 'menus',
      name: ROUTE_NAMES.sysMenus,
      component: () => import('@/views/system/MenusView.vue'),
      meta: {
        title: '菜单管理',
        isMenu: true
      }
    }
  ]
} as RouteRecordRaw
