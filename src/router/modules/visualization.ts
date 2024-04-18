import { ROUTE_NAMES } from '@/constants'
import type { RouteRecordRaw } from 'vue-router'
import { RouteRank } from '../RouteRank'
import IconEpDataBoard from '~icons/ep/data-board'

export default {
  path: '/visualization',
  name: ROUTE_NAMES.visualization,
  meta: {
    rank: RouteRank.visualization,
    title: '可视化',
    isMenu: true,
    requireAuth: true,
    dynamicLayout: true,
    icon: IconEpDataBoard
  },
  children: [
    {
      path: 'map',
      name: ROUTE_NAMES.map,
      component: () => import('@/views/features/MapView.vue'),
      meta: {
        title: '地图',
        isMenu: true
      }
    }
  ]
} as RouteRecordRaw
