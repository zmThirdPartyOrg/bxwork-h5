import axios from 'axios'
import { useUserinfoStore } from '@/stores'
import { log } from './log'
import { DEFAULT_CONFIG } from './config'

export const instance = axios.create(DEFAULT_CONFIG)
// 有些接口需要返回全部内容
const resAllUrls = ['oa/applyDetail.json', 'user/login.json']

// 请求拦截器 设置公共参数
instance.interceptors.request.use(
  async (config) => {
    const { data, params } = config

    log(config, `请求参数 =>`, data || params, config)

    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const { data: respData, config } = response
    log(config, '请求返回 => ', respData)

    if (!respData) {
      return Promise.reject(`网络繁忙，请稍后再试(1)`)
    }

    // eslint-disable-next-line prefer-const
    let { rtnCode, rtnMsg, content, mark } = respData
    // token 过期
    if (['2'].includes(rtnCode)) {
      const { logout } = useUserinfoStore()
      if (!config.url?.includes('loginOut')) {
        logout()
      }
      return Promise.reject(`登录已失效，请重新登录`)
    }

    if (rtnCode !== '0') {
      return Promise.reject(rtnMsg || `网络繁忙，请稍后再试(2)`)
    }

    // 登录接口返回数据特殊处理
    if (resAllUrls.find((item) => config.url?.includes(item))) {
      return respData
    } else {
      return content || mark
    }
  },
  (error) => {
    log(error.config, '请求错误 => ', error)

    if (error && error.response) {
      const { status, data: respData } = error.response
      error = status ? `网络繁忙，请稍后再试[${status}]` : `网络繁忙，请稍后再试(3)`
      if (respData && respData.message) {
        error = respData.message
      }
    } else if (error && error.message) {
      error = error.message
    } else {
      error = `网络繁忙，请稍后再试(4)`
    }
    return Promise.reject(error)
  },
)
