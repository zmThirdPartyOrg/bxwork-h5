import { isAndroid, isIOS } from './constants'
const __w = window as any

// 返回APP
export const backToApp = (path = '') => {
  try {
    if (isIOS) {
      __w.webkit.messageHandlers.backToApp.postMessage({
        path,
      })
    }
    if (isAndroid) {
      __w.app.backToApp({
        path,
      })
    }
  } catch (err) {
    console.log('backToApp => ', err)
  }
}

// 获取用户信息和公共参数
export const getUserInfo = () => {
  console.log('getUserInfo => ', __w)
  console.log('isIOS', isIOS)
  console.log('isAndroid', isAndroid)
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
