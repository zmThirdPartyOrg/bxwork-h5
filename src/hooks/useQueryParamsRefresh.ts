import { refreshTrap } from '@/utils'

export function useQueryParamsRefresh(task: (loading?: boolean) => void) {
  const queryParams = ref<Record<string, any>>({})

  onBeforeMount(() => {
    let callback: any = task
    refreshTrap.create((value) => {
      queryParams.value = value
      callback(true)
      callback = null
    })
    callback?.(false)
  })

  onActivated(() => {
    refreshTrap.create((value) => {
      if (value) {
        queryParams.value = value
      }
      task(true)
    })
  })

  return queryParams
}
