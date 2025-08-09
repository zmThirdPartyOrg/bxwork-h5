import { throttle } from '@pkstar/utils'
import { useState } from '@pkstar/vue-use'
import { defineStore } from 'pinia'

import { router } from '@/router'
import type { Userinfo } from '@/types'
import { createNamespace, isApp, isMiniProgram } from '@/utils'

import { withToRefs } from '..'
import { withOut } from '../withOut'

export const useUserinfoStore = withToRefs(
  withOut(
    defineStore(
      createNamespace('USER_INFO'),
      () => {
        const [userinfo, setUserinfo] = useState<Userinfo>()

        // 退出逻辑判断  这里加了节流
        const logout = throttle(
          () => {
            if (window.location.hash.includes('/signin')) {
              // 已经是登录页面 不用再执行下面的逻辑
              // 防止多接口一直触发退出
              return
            }
            const task = () => {
              if (window.location.hash.includes('/signin')) {
                // 同上
                return
              }
              setUserinfo(void 0)
              window.resetKeepAlive()
              router.replace('/')
              setTimeout(() => {
                router.push('/signin')
              }, 10)
            }

            const { position } = window.history.state ?? {}
            const delta = isApp ? 0 - (position ?? 0) : 1 - (position ?? 1)
            if (delta >= 0) {
              task()
              return
            }

            router.go(delta)
            setTimeout(task, 310)
          },
          2000,
          'leading',
        )

        return { userinfo, setUserinfo, logout }
      },
      {
        persist: {
          storage: isMiniProgram ? window.sessionStorage : window.localStorage,
        },
      },
    ),
  ),
)
