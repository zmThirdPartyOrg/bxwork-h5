import { isBoolean } from '@pkstar/utils'

import type { ProSchemaFormField } from '@/components'
import type { AssignOvertimeUser } from '@/types'
import { selectUserTrap } from '@/utils'

import { onBeforeMountOrActivated } from './onBeforeMountOrActivated'

export function useUserField(options: boolean | Partial<ProSchemaFormField> = false) {
  if (isBoolean(options)) {
    options = options ? { rules: [{ required: true, message: '请选择人员' }] } : {}
  }
  const { props = {}, ...rest } = options
  const router = useRouter()
  const filed = reactive<ProSchemaFormField>({
    label: '人员',
    value: [],
    defaultValue: [],
    is: 'HorCellPicker',
    fn(item) {
      router.push({
        path: '/user/lift',
        query: {
          selected: JSON.stringify(item.value),
        },
      })
    },
    props: {
      placeholder: '请选择',
      alignItemCenter: true,
      clearable: true,
      style: 'text-align: center',
      formatter: (v) => {
        return v.map((item: AssignOvertimeUser) => item.realName).join(',')
      },
      ...props,
    },
    rules: [
      { required: true, message: '请选择人员' },
      { validator: (v) => v.length > 0, message: '请选择人员' },
    ],
    get(v: AssignOvertimeUser[], f) {
      console.log('v', v, f)
      return f.hidden
        ? {}
        : {
            userId: v.map((item) => item.userId).join(','),
            userName: v.map((item) => item.realName).join(','),
          }
    },
    ...rest,
  })

  onBeforeMountOrActivated(() => {
    selectUserTrap.create((data: AssignOvertimeUser[]) => {
      filed.value = data
    })
  })

  console.log(filed)
  return filed
}
