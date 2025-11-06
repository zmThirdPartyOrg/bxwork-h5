// import { setStatusBarStyle } from '@pkstar/horn-jssdk'
import { sleep } from '@pkstar/utils'
import type { Router } from 'vue-router'

import { checkVersion } from '@/api'
import { useUserinfoStore } from '@/stores'
import { __DEV__, backToApp, errorHandler, getUserInfo, isApp, isMiniProgram } from '@/utils'

export function setupGuards(router: Router) {
  router.onError((error) => {
    errorHandler(error)
  })

  // 鉴定权限
  router.beforeEach(async (to) => {
    console.log('setupGuards')
    if (!__DEV__) {
      checkVersion()
    }
    const { token } = to.query as Record<string, any>
    const { userinfo, setUserinfo } = useUserinfoStore(true)
    console.log('bxkq-webview', window.location.href, token)
    // ios app获取__getUserInfo太慢，这里先取url token使用下
    if (token && token !== userinfo.value?.token) {
      setUserinfo({ ...userinfo.value, token } as any)
    }

    // 小程序希望早点触发 title
    if (isMiniProgram) {
      window.document.title = to?.meta?.title || ''
    }

    const isLogin = !!userinfo.value?.token
    console.log('isLogin', isLogin, userinfo.value?.token)

    // 是否需要授权，1 需要授权、-1 不需要登录、0 登录、不登录都可以
    const requiresAuth = to.meta.requiresAuth ?? 0
    // 已登录进入到不需要登录的页面，直接跳转回首页
    if (isLogin && requiresAuth === -1) {
      return { path: '/', replace: true }
    }
    // 未登录进入到需要登录的页面，直接跳转去登录
    if (!isLogin && requiresAuth === 1) {
      if (__DEV__) {
        const unLoginRedirect = router.unLoginRedirect
        return { path: unLoginRedirect ?? '/signin', replace: false }
      } else {
        console.log('未登录进入到需要登录的页面，直接跳转去登录')
        backToApp('login')
      }
    }
  })

  // 设置标题
  router.afterEach((to) => {
    // 设置标题
    const { title, statusTheme = 'dark' } = to.meta
    window.document.title = title ? `${title} - 变修考勤` : `变修考勤`

    // 设置状态栏颜色
    if (isApp) {
      // setStatusBarStyle({ theme: statusTheme })
    }
  })
}
