import { createPinia } from 'pinia'

/**
 * 初始化pinia
 */
const pinia = createPinia()

export default pinia

export * from './modules/user'
export * from './modules/app'
