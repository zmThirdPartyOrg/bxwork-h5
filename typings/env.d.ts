/// <reference types="vite/client" />
import 'vue-router'

// router
declare module 'vue-router' {
  // extend route meta
  interface RouteMeta {
    title?: string // 标题
    requiresAuth?: 1 | 0 | -1 | 2 // 是否需要授权，1 需要授权、-1 不需要登录、0 登录、不登陆都可以 // 2 用户需要 openId

    // tabbar icon
    iconSelected?: string
    icon?: string

    // 状态栏颜色
    statusTheme?: 'dark' | 'light'
  }

  // 兼容
  interface Router {
    unLoginRedirect?: string
  }
}

// 全局 API
declare global {
  // fix eruda
  const eruda: any

  const wx: any

  const BMapGL: any
  const BMap: any

  const webkit: any
  const app: any
  interface Window {
    resetKeepAlive(): void
  }

  type BooleanString = 'N' | 'Y'
}
