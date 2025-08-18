import { isAndroid, isIOS } from './constants'
const __w = window as any

// // 统一回调原生
// export function callNative(options: any = {}, callback?: (data: any) => void) {
//   const { handler, data = {} } = options
//   let cb = ''
//   if (callback) {
//     cb = `__callback_${Date.now()}_${new Array(6)
//       .fill('')
//       .map(() => Math.floor(Math.random() * 10))
//       .join('')}`
//   }
//   if (__w.webkit && __w.webkit.messageHandlers && __w.webkit.messageHandlers.jsBridge) {
//     __w.webkit.messageHandlers.jsBridge.postMessage({ handler, cb, data })
//   } else if (__w.app && __w.app[handler]) {
//     __w.app[handler](JSON.stringify({ data, cb }))
//   }
//   if (cb) {
//     __w[cb] = (data: any) => {
//       try {
//         data = JSON.parse(data)
//       } catch {

//       }
//       callback?(data)
//       delete (window as any)[cb]
//     }
//   }
// }

// 返回APP
export const backToApp = (val = 1) => {
  try {
    if (isIOS) {
      __w.webkit.messageHandlers.backToApp.postMessage(val)
    }
    if (isAndroid) {
      __w.app.backToApp()
    }
  } catch (err) {
    console.log('backToApp => ', err)
  }
}

// export const getUserInfo
