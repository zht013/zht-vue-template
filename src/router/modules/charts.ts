import { ROUTE_NAMES } from '@/constants'
import type { RouteRecordRaw } from 'vue-router'
import { RouteRank } from '../RouteRank'
import IconEpPieChart from '~icons/ep/pie-chart'

export default {
  path: '/charts',
  name: ROUTE_NAMES.charts,
  meta: {
    rank: RouteRank.charts,
    title: '图表',
    isMenu: true,
    requireAuth: true,
    dynamicLayout: true,
    icon: IconEpPieChart
  },
  children: [
    {
      path: 'basis',
      name: ROUTE_NAMES.basisCharts,
      component: () => import('@/views/charts/basis.vue'),
      meta: {
        isMenu: true,
        title: '基础'
      }
    }
  ]
} as RouteRecordRaw
