import { router } from '@/router'

import { __DEV__, isAndroid, isIOS } from './constants'
const __w = window as any

// 统一回调原生
export function callNative(options = {}, callback?: (data: any) => void) {
  const { handler, data = {} } = options as any
  let cb = ''
  if (callback) {
    cb = `__callback_${Date.now()}_${new Array(6)
      .fill('')
      .map(() => Math.floor(Math.random() * 10))
      .join('')}`
  }
  if (__w.webkit && __w.webkit.messageHandlers && __w.webkit.messageHandlers.jsBridge) {
    __w.webkit.messageHandlers.jsBridge.postMessage({ handler, cb, data })
  } else if (__w.app && __w.app[handler]) {
    __w.app[handler](JSON.stringify({ data, cb }))
  }
  if (cb) {
    __w[cb] = (data: any) => {
      try {
        data = JSON.parse(data)
      } catch {}
      callback?.(data)
      delete __w[cb]
    }
  }
}

// 返回APP
export const backToApp = (path: string = '') => {
  try {
    if (isIOS) {
      __w.webkit.messageHandlers.backToApp.postMessage({
        path,
      })
    }
    if (isAndroid) {
      __w.app.backToApp(path)
    }
  } catch (err) {
    console.log('backToApp => ', err)
  }
}

// 获取用户信息和公共参数
export const getUserInfo = () => {
  console.log('getUserInfo => ', __w)
  try {
    if (isIOS) {
      return __w.webkit.messageHandlers.getUserInfo.postMessage('')
    }
    if (isAndroid) {
      return __w.app.getUserInfo()
    }
  } catch (err) {
    console.log('getUserInfo => ', err)
  }
}

export const goBack = () => {
  if (__DEV__) {
    router.go(-1)
  } else {
    backToApp('')
  }
}
