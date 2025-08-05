import { useUserinfoStore } from '@/stores'
import { isApp, isMiniProgram } from '@/utils'
import { setStatusBarStyle } from '@pkstar/horn-jssdk'
import type { Router } from 'vue-router'

export function setupGuards(router: Router) {
  // 鉴定权限
  router.beforeEach((to) => {
    const { userinfo } = useUserinfoStore()

    // 小程序希望早点触发 title
    if (isMiniProgram) {
      window.document.title = to?.meta?.title || ''
    }

    const isLogin = !!userinfo?.token
    console.log('isLogin', userinfo, userinfo?.token)

    // 是否需要授权，1 需要授权、-1 不需要登录、0 登录、不登录都可以
    const requiresAuth = to.meta.requiresAuth ?? 0
    // 已登录进入到不需要登录的页面，直接跳转回首页
    if (isLogin && requiresAuth === -1) {
      return { path: '/', replace: true }
    }
    // 未登录进入到需要登录的页面，直接跳转去登录
    if (!isLogin && requiresAuth === 1) {
      const unLoginRedirect = router.unLoginRedirect
      return { path: unLoginRedirect ?? '/signin', replace: false }
    }
  })

  // 设置标题
  router.afterEach((to) => {
    // 设置标题
    const { title, statusTheme = 'dark' } = to.meta
    window.document.title = title || ''

    // 设置状态栏颜色
    if (isApp) {
      // setStatusBarStyle({ theme: statusTheme })
    }
  })
}
