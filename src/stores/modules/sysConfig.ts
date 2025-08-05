import { useState } from '@pkstar/vue-use'
import { defineStore } from 'pinia'
import type { SysConfig } from '@/types'
import { createNamespace, isMiniProgram } from '@/utils'
import { withOut } from '../withOut'
import { withToRefs } from '..'

export const useSysConfigStore = withToRefs(
  withOut(
    defineStore(
      createNamespace('SYS_CONFIG'),
      () => {
        const [sysConfig, setSysConfig] = useState<SysConfig>()

        return { sysConfig, setSysConfig }
      },
      {
        persist: {
          storage: isMiniProgram ? window.sessionStorage : window.localStorage,
        },
      },
    ),
  ),
)
