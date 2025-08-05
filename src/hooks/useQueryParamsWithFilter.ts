import type { ProSchemaFormMetadata } from '@/components'
import { refreshTrap } from '@/utils'
import banana from '@pkstar/banana'
import { filterEmptyValue, isArray, isFunction, isUndefined } from '@pkstar/utils'
import { useQuery } from '@pkstar/vue-use'

export function useQueryParamsWithFilter(
  source: ProSchemaFormMetadata | (() => ProSchemaFormMetadata),
) {
  const { queryParams, isMiniProgram } = useQuery()
  const metadata = ref(isFunction(source) ? source() : source)

  if (queryParams) {
    banana.assignment(JSON.parse(queryParams), metadata.value)
  }

  const reset = () => {
    Object.keys(metadata.value).forEach((key) => {
      const filed = metadata.value[key]
      // eslint-disable-next-line prefer-const
      let { value, defaultValue } = filed
      if (!isUndefined(defaultValue)) {
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
    if (isMiniProgram) {
      wx.miniProgram.postMessage({ data: queryParams })
      wx.miniProgram.navigateBack()
    } else {
      refreshTrap.trigger(queryParams)
      router.back()
    }
  }

  return [metadata, confirm, reset] as const
}
