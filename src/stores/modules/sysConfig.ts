import { useState } from '@pkstar/vue-use'
import { defineStore } from 'pinia'

import { reqConfig } from '@/api'
import type { SysConfig } from '@/types'
import { createNamespace } from '@/utils'

import { withOut } from '../withOut'
import { withToRefs } from '../withToRefs'

export const useSysConfigStore = withToRefs(
  withOut(
    defineStore(
      createNamespace('SYS_CONFIG'),
      () => {
        const [sysConfig, setSysConfig] = useState<SysConfig>()

        if (!sysConfig.value) {
          reqConfig().then((res) => {
            setSysConfig({ ...res })
          })
        }
        return { sysConfig, setSysConfig }
      },
      {
        persist: {
          storage: window.localStorage,
        },
      },
    ),
  ),
)
