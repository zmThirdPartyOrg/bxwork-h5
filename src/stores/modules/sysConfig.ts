import { useState } from '@pkstar/vue-use'
import { defineStore } from 'pinia'

import type { SysConfig } from '@/types'
import { createNamespace } from '@/utils'
import { isMiniProgram } from '@/utils/isMiniProgram'

import { withOut } from '../withOut'
import { withToRefs } from '../withToRefs'

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
