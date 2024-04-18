import { ROUTE_NAMES } from '@/constants'
import type { RouteRecordRaw } from 'vue-router'
import { RouteRank } from '../RouteRank'
import IconEpBicycle from '~icons/ep/bicycle'

export default {
  path: '/animation',
  name: ROUTE_NAMES.animation,
  meta: {
    rank: RouteRank.animation,
    title: '动画',
    isMenu: true,
    requireAuth: true,
    dynamicLayout: true,
    icon: IconEpBicycle
  },
  children: [
    {
      path: 'parallax',
      name: ROUTE_NAMES.parallaxEffect,
      component: () => import('@/views/animation/ParallaxEffectView.vue'),
      meta: {
        isMenu: true,
        title: 'Parallax Effect'
      }
    },
    {
      path: 'motion',
      name: ROUTE_NAMES.motion,
      component: () => import('@/views/animation/MotionView.vue'),
      meta: {
        isMenu: true,
        title: 'Motion'
      }
    }
  ]
} as RouteRecordRaw
