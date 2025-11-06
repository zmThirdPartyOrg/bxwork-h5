import { filterEmptyValue, isArray, isFunction, isUndefined } from '@daysnap/utils'
import banana from '@pkstar/banana'
import { useQuery } from '@pkstar/vue-use'

import type { ProSchemaFormMetadata } from '@/components'
import { commonFilterTrap } from '@/utils'

export function useQueryParamsWithFilter(
  source: ProSchemaFormMetadata | (() => ProSchemaFormMetadata),
) {
  const { queryParams } = useQuery()
  const metadata = ref(isFunction(source) ? source() : source)

  if (queryParams) {
    banana.assignment(JSON.parse(queryParams), metadata.value)
  }

  const reset = () => {
    Object.keys(metadata.value).forEach((key) => {
      const filed = metadata.value[key]
      // eslint-disable-next-line prefer-const
      let { value, defaultValue, resetValue } = filed
      if (!isUndefined(resetValue)) {
        value = resetValue
      } else if (!isUndefined(defaultValue)) {
        value = defaultValue
      } else if (isArray(value)) {
        value = []
      } else {
        value = ''
      }
      filed.value = value
    })
  }

  const router = useRouter()
  const confirm = () => {
    if (!metadata.value) {
      return
    }
    const options = banana.validate(metadata.value)
    const queryParams = filterEmptyValue(options)
    commonFilterTrap.trigger(queryParams)
    router.back()
  }

  return [metadata, confirm, reset] as const
}
