import { isFunction } from '@daysnap/utils'

import type { ProSchemaFormMetadata } from './types'

export function useProSchemaForm(fields: ProSchemaFormMetadata | (() => ProSchemaFormMetadata)) {
  return reactive(isFunction(fields) ? fields() : fields)
}
