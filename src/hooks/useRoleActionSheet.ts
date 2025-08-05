import { doUserRoleReset } from '@/api'
import { useUserinfoStore } from '@/stores'
import type { UserRole } from '@/types'
import type { HorActionSheetInstance } from '@daysnap/horn-ui'
import { showSuccessToast } from 'vant'

export function useRoleActionSheet() {
  const instance = ref() as Ref<HorActionSheetInstance>
  const { userinfo } = useUserinfoStore(true)
  const { content, userRoles = [] } = userinfo.value || {}

  const handler = async () => {
    if (userRoles && userRoles?.length <= 1) {
      return
    }
    const selected = await instance.value.show({
      actions: userRoles.map((item: UserRole) => ({
        name: item.roleName,
        icon: item.roleId === content?.roleId ? 'success' : '',
        ...item,
      })),
    })
    console.log('selected', selected)
    const { roleId, roleName } = selected
    await doUserRoleReset({ roleId })
    showSuccessToast('修改成功')
    userinfo.value!.content.roleId = roleId
    userinfo.value!.content.roleName = roleName
  }
  return [instance, handler, userinfo] as const
}
