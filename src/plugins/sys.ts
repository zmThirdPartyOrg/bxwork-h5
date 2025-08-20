import { useHeadersStore, useUserinfoStore } from '@/stores'
import type { Userinfo } from '@/types'
console.log('sysInfosysInfosysInfosysInfo')
const fn = (data: string) => {
  console.log('__getUserInfo', data)
  const { userInfo, sysInfo } = JSON.parse(data) as { sysInfo: any; userInfo: Userinfo }
  const { setUserinfo } = useUserinfoStore()
  const { headers, setHeaders } = useHeadersStore()
  setUserinfo(userInfo)
  setHeaders(sysInfo)
  console.log('__getUserInfo', data)
}

;(window as any).__getUserInfo = fn
;(window as any).getUserInfo = fn
