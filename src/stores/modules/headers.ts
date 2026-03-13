import { useState } from '@pkstar/vue-use'
import { defineStore } from 'pinia'

import type { Headers } from '@/types'
import { createNamespace } from '@/utils'
import { isMiniProgram } from '@/utils/isMiniProgram'

import { withOut } from '../withOut'
import { withToRefs } from '../withToRefs'

export const useHeadersStore = withToRefs(
  withOut(
    defineStore(
      createNamespace('SYS_HEADERS'),
      () => {
        const [headers, setHeaders] = useState<Headers>()

        return { headers, setHeaders }
      },
      {
        persist: {
          storage: isMiniProgram ? window.sessionStorage : window.localStorage,
        },
      },
    ),
  ),
)
