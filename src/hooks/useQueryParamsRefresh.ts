import { commonFilterTrap } from '@/utils'

export function useQueryParamsRefresh(
  task: (loading?: boolean) => void,
  options?: {
    initialParams?: Record<string, any>
  },
) {
  const { initialParams } = options || {}
  const queryParams = ref<Record<string, any>>({ ...initialParams })

  onBeforeMount(() => {
    let callback: any = task
    commonFilterTrap.create((value) => {
      queryParams.value = value
      callback(true)
      callback = null
    })
    callback?.(false)
  })

  onActivated(() => {
    commonFilterTrap.create((value) => {
      if (value) {
        queryParams.value = value
      }
      task(true)
    })
  })

  return queryParams
}
