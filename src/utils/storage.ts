import { getLocal } from '@pkstar/utils'
import { createNamespace } from './createNamespace'

export const historyStorage = getLocal().generate<string[]>(createNamespace(`SEARCH_HISTORY`))
