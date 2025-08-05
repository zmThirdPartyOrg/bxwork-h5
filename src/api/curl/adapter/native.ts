import jssdk from '@pkstar/horn-jssdk'
import { isString } from '@pkstar/utils'
import type { AxiosAdapter } from 'axios'

// native adapter
export const nativeAdapter: AxiosAdapter = async (config) => {
  // eslint-disable-next-line prefer-const
  let { method = 'GET', baseURL = '', url = '', params, data, headers } = config

  if (data) {
    try {
      if (isString(data)) {
        data = JSON.parse(data)
      }
    } catch {
      //
    }
  }

  if (!url.startsWith('http')) {
    url = `${baseURL}${url}`
  }

  try {
    const result = await jssdk.request({
      method: method as any,
      url,
      data: data || params,
      header: {
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    return {
      data: result,
      status: 200,
      statusText: '请求成功',
      headers,
      config,
      request: {},
    }
  } catch (error) {
    throw {
      message: error,
      status: 500,
      statusText: '请求失败',
      headers,
      config,
      request: {},
    }
  }
}
