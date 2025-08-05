import { formatDate, formatPathParams } from '@pkstar/utils'
import { useUserinfoStore } from '@/stores'
import { isAndroid } from '@/utils'
import type { CurlOptions } from './types'
import { instance } from './instance'
import { getAdapter, formatAdapter } from './adapter'

export * from './adapter'

export function curl<T = any>(
  url: string,
  data: Record<string, any> = {},
  options: CurlOptions = {},
): Promise<T> {
  const {
    method,
    adapter,
    headers = {},
  } = (options = Object.assign(
    {
      method: 'post',
      // 安卓走 xhr，安卓原生 http 请求有问题
      adapter: 'xhr', //isAndroid ? 'xhr' : 'native',
    },
    options,
  ))

  // 用于mock
  if (!options.mockUrl) {
    options.mockUrl = url
  }

  // 转换 url path params
  if (!(data instanceof FormData)) {
    ;({ path: url, rest: data } = formatPathParams(url, data))
  }

  data = Object.assign({}, data, {
    location: '31.256518,121.386284',
    requestDt: formatDate(new Date(), 'yyyy-MM-dd hh:mm:ss'),
    mac: '',
    imei: 'C3822999-A792-4F07-A056-F1E010F11451',
    cmdType: url,
    appVersion: '1.0.0',
    systemInfo: 'Testing,iPhone11,8,iOS15.6',
    appType: isAndroid ? 'Android' : 'iOS',
    deviceToken: '55720f765cc874df4b5c7a6715ceca3b843b7daaddd3c0e883f31951c9690596',
  })

  const { userinfo } = useUserinfoStore()
  const { token } = userinfo || {}
  if (token) {
    data.token = token
  }

  // 传值
  const adapterName = formatAdapter(adapter)
  options.adapterName = adapterName

  return instance({
    ...options,
    url,
    [method.toLocaleLowerCase() === 'get' ? 'params' : 'data']: data,
    adapter: getAdapter(adapterName),
  })
}
