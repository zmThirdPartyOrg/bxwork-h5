import { doUserRoleReset } from '@/api'
import { useUserinfoStore } from '@/stores'
import type { ApplyLeaveUser, UserRole } from '@/types'
import type { HorActionSheetInstance } from '@daysnap/horn-ui'

export function useReceiveActionSheet() {
  const instance = ref() as Ref<HorActionSheetInstance>

  const handler = async (options: ApplyLeaveUser[]) => {
    const actions = options.map((item) => {
      return {
        name: item.username,
        value: item.userId,
        ...item,
      }
    })
    return instance.value.show({
      actions,
    })
  }
  return [instance, handler] as const
}
